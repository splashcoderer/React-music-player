import React, { Component } from 'react';
import { connect } from 'react-redux';

import { MdQueueMusic, MdShuffle, MdLoop } from 'react-icons/md';
import { settingsActions } from '../actions/actions.js';

const mapStateToProps = (state, props) => ({
    loop: state.settings.loop,
    queue: state.settings.queue,
    shuffle: state.settings.shuffle,
    volume: state.settings.volume,
    muted: state.settings.muted,
    volumeStore: state.settings.volumeStore
})

const mapDispatchToProps = {
    toggleMute: settingsActions.toggleMute,
    toggleQueue: settingsActions.toggleQueue,
    toggleLoop: settingsActions.toggleLoop,
    toggleShuffle: settingsActions.toggleShuffle,
    changeVolume: settingsActions.changeVolume
}

export class MediaOptionsBind extends Component {

    changeVolume = (e) => {
        let rect = e.currentTarget.getBoundingClientRect();
        let x = e.pageX - rect.left;
        let width = e.currentTarget.offsetWidth;
        let volume = 100 * (x / width);
        this.props.changeVolume(volume);
    }

    toggleMute = () => { this.props.toggleMute(this.props.muted, this.props.volumeStore) }
    toggleShuffle = () => { 
        this.props.toggleShuffle(this.props.shuffle);
    }
    toggleLoop = () => { this.props.toggleLoop(this.props.loop) }
    toggleQueue = () => { this.props.toggleQueue(this.props.queue) }

    render() {
        return(

            <div className="media-options">
                <div 
                    className="queue"
                    onClick={this.toggleQueue}>
                        <MdQueueMusic size="2em" title="Music Queue" className={this.props.queue ? "" : "disabled"} />
                </div>
                <div 
                    className="shuffle"
                    onClick={this.toggleShuffle}>
                    <MdShuffle 
                        className={this.props.shuffle ? "" : "disabled"}
                        size="2em"
                        title="Shuffle" />
                </div>
                <div 
                    className="loop"
                    onClick={this.toggleLoop}>
                    <MdLoop 
                        className={this.props.loop ? "" : "disabled"}
                        size="2em"
                        title="Loop" />
                </div>
                {/* <div className="volume">
                    X
                    <div 
                        className="volume-bar"
                        onClick={this.changeVolume}>
                        <div 
                            className="volume-bar-inner"
                            style={{
                                width: this.props.volume + "%"
                            }}></div>
                    </div>
                </div> */}
            </div>
        )
    }
}

const MediaOptions = connect(
    mapStateToProps,
    mapDispatchToProps
)(MediaOptionsBind);

export { MediaOptions as default }