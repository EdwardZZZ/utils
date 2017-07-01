import React from 'react';

import './Modal.scss';

export default class Modal extends React.Component {
    constructor(props){
        super();
    }

    state = {
        show: false
    }

    componentDidMount(){
        const self = this;

        Object.defineProperties(modal, {
            open: {
                value(title, content){
                    self.setState({
                        show: true,
                        title,
                        content
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
        const {show, title, content} = this.state;

        return (
            <div className="modal-window" style={{display: show ? 'block' : 'none'}}>
                <div className="modal-bg" onClick={modal.close}></div>
                <div className="modal-content">
                    <h1>{title}</h1>
                    <div>{content}</div>
                </div>
            </div>
        )
    }
}

const modal = {
};

export const alert = (content) => {
    modal.open(content);
}

export const dialog = (title, content, options) => {
    modal.open(title, content, options);
}

export const close = () => {
    modal.close();
}
