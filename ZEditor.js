(function() {
    var utils = {
        range() {
            return window.getSelection().getRangeAt(0);
        },
        resetRange(startContainer, startOffset, endContainer, endOffset) {
            let selection = window.getSelection();
            selection.removeAllRanges();
            let range = document.createRange();
            range.setStart(startContainer, startOffset);
            range.setEnd(endContainer || startContainer, endOffset || startOffset);
            selection.addRange(range);
        },
        focusDom() {
            const dom = utils.range().endContainer;
            return dom.nodeType === 3 ? dom.parentNode : dom;
        },
        createNode(name, attrs) {
            var node = document.createElement(name), attr;
            for (attr in attrs) {
                if (attrs.hasOwnProperty(attr)) {
                    node.setAttribute(attr, attrs[attr]);
                }
            }
            return node;
        }
    };

    const $ = dom => {
        const $dom = typeof dom === "string" ? document.querySelector(dom) : dom;

        return {
            dom: $dom,
            html(html) {
                if (!html) return $dom.innerHTML;

                $dom.innerHTML = html;
                return this;
            },
            parseHTML(str) {
                const range = document.createRange();
                const parse = range.createContextualFragment.bind(range);
                return parse(str);
            },
            parent() {
                return $($dom.parentNode);
            },
            prepend(html) {
                if (typeof html === 'string') {
                    $dom.insertAdjacentHTML("afterbegin", html);
                } else {
                    $dom.insertBefore(html, $dom.firstChild);
                }
                return this;
            },
            append(html) {
                if (typeof html === 'string') {
                    $dom.insertAdjacentHTML("beforeend", html);
                } else {
                    $dom.appendChild(html);
                }
                return this;
            },
            before(html) {
                if (typeof html === 'string') {
                    $dom.insertAdjacentHTML("beforebegin", html);
                } else {
                    if ($dom.parentNode) {
                        $dom.parentNode.insertBefore(html, $dom);
                    }
                }
                return this;
            },
            after(html) {
                if (typeof html === 'string') {
                    $dom.insertAdjacentHTML("afterend", html);
                } else {
                    if ($dom.parentNode) {
                        $dom.parentNode.insertBefore(html, $dom.nextSibling);
                    }
                }
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
                if (typeof css === 'string') {
                    const win = el.ownerDocument.defaultView;
                    return win.getComputedStyle($dom, null);
                }

                for (const k in css) {
                    let v = css[k];
                    ['left', 'right', 'top', 'bottom', 'width', 'height'].forEach((str) => {
                        if (~k.indexOf(str) && typeof v === 'number') v += 'px';
                    });
                    $dom.style[k] = v;
                }
                return this;
            },
            hide() {
                return this.css({display: 'none'});
            },
            on(type, cb) {
                $dom.addEventListener(type, cb);
                return this;
            },
            isEmpty() {
                return $dom.innerHTML === '' || $dom.innerHTML === void 0;
            },
            wrap(html) {
                $(this.parent()).prepend(html);
                this.parent().firstChild.appendChild(this.dom);
                return this;
            },
            closest(selector) {
                let el = this.dom;
                const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
                while (el) {
                  if (matchesSelector.call(el, selector)) {
                        return el;
                  } else {
                        el = el.parentElement;
                  }
                }
                return null;
            }
        };
    };

    const ZEditor = (dom, props) => {
        const defaultContent = '<p><br></p>';
        const params = {
            content: defaultContent
        };

        for (const k in props) {
            params[k] = props[k];
        }

        let lastNode;
        const {
            content,
        } = params;

        $wrap = $(dom);
        if (!$wrap || !$wrap.dom) {
            console.error('节点配置不正确。');
            return;
        }
        $wrap.addClass('zeditor-contaimer').css({position: 'relative'}).html(`
            <div class="zeditor-content" contenteditable="true" style="position:relative;width:100%;height:100%;overflow:auto;" ></div>
            <div class="zeditor-btn-main" style="display:none;position:absolute;left:0;top:0;text-align:center;">
                <button class="zeditor-btn-li" data-type="left">居左</button>
                <button class="zeditor-btn-li" data-type="center">居中</button>
                <button class="zeditor-btn-li" data-type="right">居右</button>
                <button class="zeditor-btn-li" data-type="image">图片</button>
            </div>
        `);
        const $editor = $('.zeditor-content');
        const $editorBtn = $('.zeditor-btn-main');

        const editorBtnHide = () => {
            $editorBtn.hide();
        };

        const editorBtnClick = (e) => {
            const p = utils.focusDom();
            const type = e.target.dataset.type;

            if (type === 'left' || type === 'center' || type === 'right' ) {
                $(p).css({'text-align': type});
            }

            if (type === 'image') {
                console.log(p);
                $(p).after('<p><image src=""/></p>')
            }
        }

        const pasteText = (txt) => {
            let rangeContainer, rangeStart = 0;

            const txtArr = txt.split(/\n/);
            if (txtArr.length === 0) return;
            const { startOffset, endOffset } = utils.range();
            const p = utils.focusDom(), pHtml = $(p).html().replace(/&nbsp;/g, ' ');
            const newHtml = pHtml.substring(0, startOffset) + txtArr[0] + pHtml.substring(endOffset);
            $(p).html(newHtml.replace(/\s/g, '&nbsp;'));

            rangeContainer = p.firstChild;
            rangeStart = startOffset + txtArr[0].length;

            if (txtArr.length > 1) {
                const ps = p.nextSibling;
                $(p).after(`<p>${txtArr.slice(1).join('</p><p>').replace(/\s/g, '&nbsp;')}</p>`)

                if (ps) {
                    rangeContainer = ps.previousSibling.firstChild;
                } else {
                    rangeContainer = p.parentNode.lastChild.firstChild;
                }
                rangeStart = txtArr[txtArr.length - 1].length;
            }

            utils.resetRange(rangeContainer, rangeStart);
        }

        const paste = (e) => {
            if (!(e.clipboardData && e.clipboardData.items)) {
                return;
            }

            // e.clipboardData.getData('text/plain')
            for (const item of e.clipboardData.items) {
                if (item.type === "text/plain") {
                    item.getAsString(pasteText);
                }
                // TODO 图片粘贴待实现
            }

            e.preventDefault();
        }

        const mouseup = (e) => {
            const p = utils.focusDom();
            const bcr1 = $editor.dom.getBoundingClientRect();
            const bcr2 = p.getBoundingClientRect();
            $editorBtn.css({
                display: 'block',
                left: bcr2.x - bcr1.x,
                top: bcr2.y - bcr1.y - 30
            });
        };

        const keyup = (e) => {
            if (e.keyCode === 8 && $editor.isEmpty()) {
                $editor.html(defaultContent);
            }

            editorBtnHide();
        };

        const blur = (e) => {
            e.stopPropagation();
            lastNode = utils.focusDom().parentNode;
        };

        const bindEvent = () => {
            $editor.html(content)
                .on('paste', paste)
                .on('mouseup', mouseup)
                .on('keyup', keyup)
                .on('blur', blur);

            $editorBtn.on('click', editorBtnClick);

            document.addEventListener('click', e => {
                if(!$(e.target).closest('.zeditor-contaimer')){
                    editorBtnHide();
                }
            });
        };

        bindEvent();

        return {
            getHtml() {
                return $editor.html();
            }
        }
    };

    window.ZEditor = ZEditor;
})();
