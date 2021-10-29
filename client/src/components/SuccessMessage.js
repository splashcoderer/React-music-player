import React, { Component } from 'react';
import { connect } from 'react-redux';

import '../css/SuccessMessage.scss';
import { MdCheck } from 'react-icons/md';

const mapStateToProps = (state, props) => ({
    modalVisible: state.view.successModal
});

export class SuccessMessageBind extends Component {
    render() {
        if(!this.props.modalVisible) return null;
        return(
            <div className="success-message">
                <div className="success-message-inner">
                    <MdCheck className="success-check" size="4em" />
                    <span id="success-message-text">Added</span>
                </div>
            </div>
        )
    }
}

const SuccessMessage = connect(
    mapStateToProps
)(SuccessMessageBind);

export { SuccessMessage as default }
