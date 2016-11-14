'use strict';

var gulpUtil = require('gulp-util');
var through = require('through2');

/**
 * 在微信小程序中使用scss的时候
 * 当引用样式写的是 @import url("a.wxss");时
 * 会编译成 @import "a.wxss";
 */
module.exports = function (options) {
    return through.obj(function (file, enc, cb) {

        // 如果文件为空，不做任何操作，转入下一个操作，即下一个 .pipe()
        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        // 插件不支持对 Stream 对直接操作，跑出异常
        if (file.isStream()) {
            this.emit('error', new gulpUtil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
            return cb();
        }

        // 将文件内容转成字符串
        var content = file.contents.toString().replace(/@import url\("(.+)"\);/g, function () { 
            return '@import "'+ arguments[1] +'";'
        })

        // 然后将处理后的字符串，再转成Buffer形式
        file.contents = new Buffer(content);

        // 下面这两句基本是标配啦，可以参考下 through2 的API
        this.push(file);

        cb();
    });
};