(function() {
    var utils = {};

    const $ = dom => {
        const $dom = typeof dom === "string" ? document.querySelector(dom) : dom;

        return {
            selector() {
                return $dom;
            },
            html(html) {
                $dom.innerHTML = html;
                return this;
            },
            append(html) {
                $dom.insertAdjacentHTML("beforeend", html);
                return this;
            },
            prepend(html) {
                $dom.insertAdjacentHTML("afterbegin", html);
                return this;
            },
            classes() {
                return $dom.classList;
            },
            hasClass(className) {
                if ($dom.classes) {
                    return $dom.classes.contains(className);
                }
                return false;
            },
            addClass(className) {
                if ($dom.classes) {
                    $dom.classes.add(className);
                } else {
                    $dom.className = className;
                }
                return this;
            },
            removeClass(className) {
                if ($dom.classes) {
                    $dom.classes.remove(className);
                }
                return this;
            },
            css(css) {
                for (const k in css) {
                    $dom.style[k] = css[k];
                }
                return this;
            },
            on(type, cb) {
                $dom.addEventListener(type, cb);
                return this;
            },
        };
    };

    const ZEditor = (dom, props) => {
        const params = {
            content: "<p><br></p>"
        };

        for (const k in props) {
            params[k] = props[k];
        }

        let lastNode;
        const {
            content,
        } = params;

        const $dom = $(dom);
        if (!dom || !$dom.selector) {
            console.error('节点配置不正确。');
            return;
        }

        const pasteText = (txt) => {
            $dom.append(`<p>${txt.split(/\n/).join('</p><p>').replace(/\s/g, '&nbsp;')}</p>`);
        }

        const paste = (e) => {
            if (!(e.clipboardData && e.clipboardData.items)) {
                return;
            }

            for (const item of e.clipboardData.items) {
                if (item.type === "text/plain") {
                    item.getAsString((txt) => {
                        pasteText(txt);
                    });
                }
                // TODO 图片粘贴待实现
            }

            e.preventDefault();
        }

        const init = () => {
            $dom.html(content)
            .on('paste', paste)
            .on('keyup', (e) => {
                if (e.keyCode === 8 && !$dom.innerHTML) {
                    $dom.html('<p><br></p>');
                }
            })
            .on('blur', (e) => {
                lastNode = window.getSelection().getRangeAt(0).endContainer.parentNode;
                $(lastNode).addClass('center');
            });
        };

        init();
    };

    window.ZEditor = ZEditor;
})();
