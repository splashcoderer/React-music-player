import React, { Component } from 'react';
import { connect } from 'react-redux';
import AudioPlayer from 'react-h5-audio-player';

import '../css/MusicPlayer.css';
import {
    playbackActions,
    queueActions,
    viewActions
  } from '../actions/actions.js';
  import { getRandomArbitrary } from '../utils';
  import { config } from '../config';
  import { GiMusicSpell } from 'react-icons/gi';
import { getDateRange } from '../utils/date';

const mapStateToProps = (state, props) => ({
    nowPlaying: state.nowPlaying,
    loop: state.settings.loop,
    shuffle: state.settings.shuffle,
    volume: state.settings.volume,
    data: state.data,
    queue: state.queue,
    queueVisible: state.settings.queue,
    activeCategory: state.view.activeCategory,
    activeIndex: state.view.activeIndex,
    location: state.view.location
});

const mapDispatchToProps = {
    setDuration: playbackActions.setDuration,
    updateTime: playbackActions.updateTime,
    setPlaying: playbackActions.setPlaying,
    endPlayback: playbackActions.endPlayback,
    seekTo: playbackActions.seekTo,
    setQueue: queueActions.setQueue,
    songPreview: viewActions.songPreview,
  }

  const secondsToSetSongActive = 300;

class MusicPlayerBind extends Component {
    constructor(props) {
        super(props);
        this.player = React.createRef();
        this.ref = React.createRef();
        this.state = {
            currentSong: ''
        }
    }

    componentDidMount() {
        this.readCurrentSong();
        setInterval(() => this.readCurrentSong(), 10000);
    }

    readCurrentSong = () => {
        fetch(config.baseUrl + '/readCurrentSong', {
            method: 'GET'
        })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            response.song.range = getDateRange(response.song.time);
            // console.log('readCurrentSong', response);
            response && this.setState({ currentSong: response.song });
        });
    }

    onPlayerPlay = () => {
        this.props.songPreview(false);

        let musicItem = this.props.data.all[this.props.nowPlaying.item];
        if (musicItem) musicItem = musicItem.path.split('/')[2].replace('.mp3', '');

        document.title = musicItem + ' | pplayer.ru';

        fetch(config.baseUrl + '/writeCurrentSong', {
            method: 'POST',
            headers:{ 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: musicItem })
        })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            this.setState({ currentSong: { name: musicItem } });
        });
        // .then(response => { console.log('response', response); });
    };

    onEnded = () => {
        this.nextSong();
    }

    onClickNext = () => {
        this.nextSong(true);
    }

    previousSong = () => {
        if(this.props.nowPlaying.item === undefined) return;
        if((this.props.nowPlaying.currentTime / 1000) > 2 || !this.props.nowPlaying.activeSong) {
            this.props.seekTo(0);
        } else {
            let activeSong = this.props.nowPlaying.activeSong - 1;
            this.props.setPlaying(this.props.queue[activeSong], activeSong);
        }
    }

    nextSong = (isClick) => {
        if(this.props.nowPlaying.item === undefined) return;
        let index = this.props.nowPlaying.activeSong;
        let nextSongIndex = 0;
        if (!this.props.shuffle) {
            nextSongIndex = index + 1;
        } else {
            nextSongIndex = getRandomArbitrary(0, this.props.queue.length);
            if (nextSongIndex === index) nextSongIndex = 0;
        }
        if (this.props.loop && !isClick) {
            nextSongIndex = index;
            this.props.endPlayback();
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
        const musicItem = this.props.data.all[this.props.nowPlaying.item];
        let musicPath = musicItem && musicItem.path;
        musicPath = encodeURI(musicPath);
        return(
          <div ref={this.ref} 
            className={ ("audio_player" + (this.props.nowPlaying.item > '' ? ' playing' : ''))}>
            {/* <MainContent /> */}
            <div className='current_song'>
                <GiMusicSpell className={ this.state.currentSong.range > secondsToSetSongActive ? '' : 'spinner'} /> { this.state.currentSong.name }
            </div>
            <AudioPlayer
                ref={this.player}
                autoPlay
                src={window.location.origin + "/music" + musicPath}
                onPlay={this.onPlayerPlay}
                onPlaying={e => this.props.setDuration(e.timeStamp)}
                onListen={e => this.props.updateTime(e.timeStamp)}
                onClickNext={this.onClickNext}
                onClickPrevious={this.previousSong}
                onEnded={this.onEnded}
                autoPlayAfterSrcChange={true}
                // style={{position: 'absolute', zIndex: 11}}
                showSkipControls={true}
                customVolumeControls={[]}
                customAdditionalControls={[]}
                showJumpControls={true}
                // showFilledVolume={true}
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
