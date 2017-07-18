import React from 'react';

import './Modal.scss';

export default class Modal extends React.Component {
    constructor(props){
        super();
    }

    state = {
        show: false,
        title: null,
        content: null,
        options: null
    }

    componentDidMount(){
        const self = this;

        Object.defineProperties(modal, {
            open: {
                value(title, content, options){
                    self.setState({
                        show: true,
                        title,
                        content,
                        options
                    });
                }
            },
            close: {
                value(){
                    self.setState({
                        show: false
                    });
                }
            }
        })
    }

    render() {
        const {show, title, content, options} = this.state;

        return (
            <div className="modal-window" style={{display: show ? 'block' : 'none'}}>
                <div className="modal-bg" onClick={close}></div>
                <div className="modal-container">
                    {title ? <h1>{title}</h1> : null}
                    <div>{content}</div>
                    {options ? 
                        <div className="modal-container-btn">
                            <button onClick={this.confirm}>确定</button>
                            { options.cancelFn ? <button onClick={close}>取消</button> : null }
                        </div>
                    : null}
                </div>
            </div>
        )
    }

    confirm = (e) => {
        this.state.options && this.state.options.confirm && this.state.options.confirm(e) !== false && close();
        (!this.state.options || !this.state.options.confirm) && close();
    }
}

const modal = {
    open(){
        console.error('please import modal at the root node.');
    }
};

export const alert = (content) => {
    modal.open(content);
}

export const dialog = (title, content, options) => {
    modal.open(title, content, options || {});
}

export const close = () => {
    modal.close();
}
