/**
 * Author Zhangzhihua
 */
;
(function() {
    var Util = {
        format: function(str) {
            var args = arguments,
                pattern = new RegExp("%([s|d|1-9])", "g"),
                _index = 1,
                _str = String(str).replace(pattern, function(match1, match2) {
                    var _str = args[_index++],
                        __index = parseInt(match2);
                    if (match2 == __index) {
                        return parseInt(args[__index]);
                    }
                    return match1 === "%d" ? parseInt(_str) : _str;
                });

            return _str + (_index < args.length ? " " + Util.argsToArr(args).slice(_index).join(" ") : "");
        },
        argsToArr: function(args) {
            return Array.prototype.slice.call(args);
        },
        type: function(obj){
           return Object.prototype.toString.call(obj).toLowerCase();
        },
        isJSON: function(obj) {
            return typeof(obj) === "object" && Util.type(obj) === "[object object]" && !obj.length;
        },
        isArray: function(obj) {
            return Array.isArray ? Array.isArray(obj) : Util.type(obj) === '[object Array]';
        },
        $: function(dom) {
            return typeof dom === "string" ? document.querySelector(dom) : dom;
        },
        append: function(dom, html) {
            Util.$(dom).insertAdjacentHTML("beforeend", html);
        },
        prepend: function(dom, html) {
            Util.$(dom).insertAdjacentHTML("afterbegin", html);
        },
        classes: function() {
            return Util.$(dom).classList;
        },
        hasClass: function(dom, className) {
            return Util.classes(dom).contains(className);
        },
        addClass: function(dom, className) {
            Util.classes(dom).add(className);
        },
        removeClass: function(dom, className) {
            Util.classes(dom).remove(className);
        },
        css: function(dom, css) {
            for (var k in css) {
                Util.$(dom).style[k] = css[k];
            }
        },
        getTime: function() {
            return +new Date();
        }
    }

    var logObj = function() {
        var logWindow, logContainer, logTrigger, isOpen = false,
            count = 1;

        function init() {
            appendLogWindow();
            logWindow = Util.$("#log-window");
            logContainer = Util.$("#log-container");
            logTrigger = Util.$("#log-trigger");
            bindEvt();
        }

        function appendLogWindow() {
            Util.append("body",
                '<div id="log-window" style="position:fixed;z-index:99999999;left:0px;right:0px;top:50%;bottom:0px;overflow:auto;background-color:rgba(0,0,0,.6);transform:translate3d(0,100%,0);transition:transform .1s linear;">\
                    <div id="log-container" style="width:100%;"></div>\
                </div>\
                <div id="log-trigger" style="position:fixed;z-index:100000000;left:20px;bottom:20px;width:32px;height:32px;border-radius:100%;background: rgba(255,255,255,.6);">\
                    <div style="width:26px;height:26px;border-radius:100%;background-color:rgba(0,0,0,.8);margin:3px;"></div>\
                </div>'
            );
        }

        function bindEvt() {
            var st, sx, sy;
            logTrigger.addEventListener("touchstart", function(e) {
                st = Util.getTime();
                var touch = e.touches[0];
                sx = touch.clientX;
                sy = touch.clientY;
            });
            logTrigger.addEventListener("touchmove", function(e) {
                if (Util.getTime() - st > 100) {
                    e.preventDefault();
                    e.stopPropagation();
                    var touch = e.touches[0], mx = touch.clientX - sx, my = touch.clientY - sy;
                    Util.css(logTrigger, {transform: "translate3d("+mx+"px, "+my+"px, 0)"});
                }
            });
            logTrigger.addEventListener("touchend", function(e) {
                if (Util.getTime() - st < 100) {
                    if (!isOpen) {
                        showWindow();
                    } else {
                        hideWindow();
                    }
                }else{
                    var rect = logTrigger.getBoundingClientRect();
                    Util.css(logTrigger, {
                        transform: "translate3d(0,0,0)",
                        left: rect.left + "px",
                        top: rect.top + "px"
                    });
                }
            });
        }

        function showWindow() {
            Util.css(logWindow, {
                transform: 'translate3d(0, 0, 0)'
            });
            isOpen = true;
        }

        function hideWindow() {
            Util.css(logWindow, {
                transform: 'translate3d(0, 100%, 0)'
            });
            isOpen = false;
        }

        function prePendLog(str) {
            Util.prepend(logContainer,
                '<p style="font-size:13px;color:#fff;margin:6px;border-bottom:solid 1px #fff;">\
                    <i style="float:left;color:red;font-size:15px;">' + (count++) + '</i>' + str + '\
                </p>'
            );
        }

        init();
        return {
            log: function(str) {
                prePendLog(str);
            }
        }
    }

    var _logObj = logObj();
    var _con = window.console;
    //window._con = {};
    _con.log = function() {
        var _arr = Util.argsToArr(arguments).map(function(val, index, arr) {
            return JSON.stringify(val);
        });

        var _str = Util.format.apply(null, _arr);
        _logObj.log(_str);
    }
})(window);