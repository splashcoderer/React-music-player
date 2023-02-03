import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../css/Preloader.css';
import { FaSpinner } from 'react-icons/fa';
import { viewActions } from '../actions/actions';

const mapStateToProps = (state, props) => ({
    isPreloaderVisible: state.view.isPreloaderVisible
})

const mapDispatchToProps = {
    showPreloader: viewActions.showPreloader
}

class PreloaderBind extends Component {
    componentDidMount() {
        this.props.showPreloader(true);
        // setTimeout(() => this.props.showPreloader(false), 1100);
    }

    render() {
        return (
            <div>{ this.props.isPreloaderVisible && <div className='preloader'><FaSpinner className="spinner" size={50} /></div> }</div>
        );
    }
}

const Preloader = connect(
    mapStateToProps,
    mapDispatchToProps
)(PreloaderBind);

export default Preloader;
