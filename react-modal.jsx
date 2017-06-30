import React from 'react';

import './Modal.scss';

export default class Modal extends React.Component {
    constructor(props){
        super();
    }

    state = {
        open: false
    }

    componentDidMount(){
        const self = this;

        Object.defineProperties(modal, {
            open: {
                value(title, content){
                    self.setState({
                        open: true,
                        title,
                        content
                    });
                }
            },
            close: {
                value(){
                    self.setState({
                        open: false
                    });
                }
            }
        })
    }

    render() {
        const {open, title, content} = this.state;

        return (
            <div className="modal-window" style={{display: this.state.open ? 'block' : 'none'}}>
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

export const dialog = (title, content) => {
    modal.open(title, content);
}

export const close = () => {
    modal.close();
}
