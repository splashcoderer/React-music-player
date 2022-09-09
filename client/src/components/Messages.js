import React, { Component } from 'react';
import { connect } from 'react-redux';

import '../css/Messages.css';
import { MdCheck, MdErrorOutline } from 'react-icons/md';
import { viewActions } from '../actions/actions';

const mapStateToProps = (state, props) => ({
    modalVisible: state.view.modalVisible,
    messageConfig: state.view.messageConfig
});

const mapDispatchToProps = {
    toggleModalMessage: viewActions.toggleModalMessage,
    closeModalMessage: viewActions.closeModalMessage
}

export class MessagesBind extends Component {
    componentDidUpdate() {
        if (this.props.messageConfig && this.props.messageConfig.text > '') {
            const timeToShow = this.props.messageConfig.time ? this.props.messageConfig.time * 1000 : 3000;
            setTimeout(() => {
                this.props.closeModalMessage();
            }, timeToShow);
        }
    }

    render() {
        // if(!this.props.modalVisible) return null;
        if (!this.props.messageConfig || !this.props.messageConfig.text) return null;
        return(
            <div className="message">
                <div className="message-inner">
                    {!this.props.messageConfig.error ? <MdCheck className="message-check" size="4em" /> : <MdErrorOutline size="4em" />}
                    <span id="message-text">{this.props.messageConfig.text}</span>
                </div>
            </div>
        )
    }
}

const Messages = connect(
    mapStateToProps,
    mapDispatchToProps
)(MessagesBind);

export { Messages as default }
