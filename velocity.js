'use strict'

var fs = require('fs');
var Velocityjs = require('velocityjs');

function Velocity(tplPath, context) {
    if (!tplPath) throw new Error('template path cannot be null')
    this.tplPath = tplPath
    this.context = context
}

Velocity.prototype = {
    parse: function(context) {
        var _context = context || this.context
        if (!_context) throw new Error('context cannot be null')
        var _content = this._getTplContent(this.tplPath)
        if (!_content) return _content
        return this.render(_content, _context)
    },
    render: function(content, context) {
        var self = this
        return Velocityjs.render(content, context, {
            include: function(path) {
                return self._include(path)
            },
            parse: function(path) {
                return self._parse(path)
            }
        })
    },
    _getTplContent: function(tplPath) {
        return fs.readFileSync(tplPath, {
            encoding: 'UTF-8'
        }).toString()
    },
    _include: function(path) {
        var _path = path.split('../')
        var _tplPath = this.tplPath
        var _n = _path.length
        while (_n > 0) {
            _tplPath = _tplPath.substring(0, _tplPath.lastIndexOf('/'))
            _n--
        }
        return this._getTplContent(_tplPath + '/' + _path[_path.length - 1])
    },
    _parse: function(path) {
        return this.render(this._include(path), this.context)
    }
}

module.exports = Velocity