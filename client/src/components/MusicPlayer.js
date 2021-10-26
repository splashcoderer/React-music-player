import React, { Component } from 'react';
import { connect } from 'react-redux';

import '../css/MusicPlayer.css';
import AudioPlayer from 'react-h5-audio-player';

import {
    playbackActions,
    dataActions,
    queueActions
  } from '../actions/actions.js';
  import { getRandomArbitrary } from '../utils';

const mapStateToProps = (state, props) => ({
    nowPlaying: state.nowPlaying,
    loop: state.settings.loop,
    shuffle: state.settings.shuffle,
    volume: state.settings.volume,
    data: state.data,
    queue: state.queue
});

const mapDispatchToProps = {
    updateData: dataActions.updateData,
    setDuration: playbackActions.setDuration,
    updateTime: playbackActions.updateTime,
    setPlaying: playbackActions.setPlaying,
    endPlayback: playbackActions.endPlayback,
    seekTo: playbackActions.seekTo,
    setQueue: queueActions.setQueue
  }

class MusicPlayerBind extends Component {

    previousSong = () => {
        if(this.props.nowPlaying.item === undefined) return;
        if((this.props.nowPlaying.currentTime / 1000) > 2 || !this.props.nowPlaying.activeSong) {
            this.props.seekTo(0);
        } else {
            let activeSong = this.props.nowPlaying.activeSong - 1;
            this.props.setPlaying(this.props.queue[activeSong], activeSong);
        }
    }

    nextSong = () => {
        if(this.props.nowPlaying.item === undefined) return;
        let index = this.props.nowPlaying.activeSong;
        let nextSongIndex = 0;
        if (!this.props.shuffle) {
            nextSongIndex = index + 1;
        } else {
            nextSongIndex = getRandomArbitrary(0, this.props.queue.length);
            if (nextSongIndex === index) nextSongIndex = 0;
        }
        if(index === this.props.queue.length - 1) {
            this.props.endPlayback();
            this.props.setQueue([]);
        } else {
            let item = this.props.queue[nextSongIndex];
            this.props.setPlaying(item, nextSongIndex);
        }
    }

    render() {
        let musicItem = this.props.data.all[this.props.nowPlaying.item];
        let musicPath = musicItem && musicItem.path;
        musicPath = encodeURI(musicPath);
        return(
          <div className="audio_player">
            {/* <MainContent /> */}
            <AudioPlayer
                autoPlay
                src={window.location.origin + "/music" + musicPath}
                onPlaying={e => this.props.setDuration(e.timeStamp)}
                onListen={e => this.props.updateTime(e.timeStamp)}
                onClickNext={this.nextSong}
                onClickPrevious={this.previousSong}
                onEnded={this.nextSong}
                // style={{position: 'absolute', zIndex: 11}}
                showSkipControls={true}
                customVolumeControls={[]}
                customAdditionalControls={[]}
                onEnded={this.nextSong}
            />
            {/* { this.renderSound() } */}
          </div>
        )
    }
}

const MusicPlayer = connect(
    mapStateToProps,
    mapDispatchToProps
)(MusicPlayerBind);

export { MusicPlayer as default }