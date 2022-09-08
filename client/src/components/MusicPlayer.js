import React, { Component } from 'react';
import { connect } from 'react-redux';
import AudioPlayer from 'react-h5-audio-player';
import { createBrowserHistory } from 'history';

import '../css/MusicPlayer.css';
import {
    playbackActions,
    queueActions,
    viewActions
  } from '../actions/actions.js';
import { getRandomArbitrary } from '../utils';
import { config } from '../config';
import { GiMusicSpell } from 'react-icons/gi';
import { MdPlayCircleOutline } from 'react-icons/md';
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
    changeLocation: viewActions.changeLocation
  }

const secondsToSetSongActive = 300;

const history = createBrowserHistory();

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
        this.setMediaHandlersForLockedScreen();

        this.readCurrentSong();
        setInterval(() => this.readCurrentSong(), 20000);
    }

    setMediaHandlersForLockedScreen() {
        navigator.mediaSession.setActionHandler('previoustrack', () => {
            this.previousSong();
        });
        navigator.mediaSession.setActionHandler('nexttrack', () => {
            this.nextSong();
        });
        navigator.mediaSession.setActionHandler('play', async () => {
            await this.player.current.audio.current.play();
        });
        navigator.mediaSession.setActionHandler('pause', () => {
            this.player.current.audio.current.pause();
        });
    }

    setMediaInfoForLockedScreen() {
        let coverPath = window.location.origin;

        let item = {};
        if (this.props.data.all && this.props.nowPlaying.item) {
            item = this.props.data.all[this.props.nowPlaying.item];
        }
        if (this.props.activeSong && item.cover) coverPath += "/covers" + item.cover; else coverPath += "/album.jpg";

        navigator.mediaSession.metadata = new window.MediaMetadata({
            title: item.artist + ' - ' + item.title,
            // artist: item.artist,
            // album: '',
            artwork: [
              { src: coverPath, sizes: '512x512', type: 'image/png' },
            ]
        });
    }

    readCurrentSong = () => {
        fetch(config.baseUrl + '/readCurrentSong', {
            method: 'GET'
        })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            if (response) {
                response.song.range = getDateRange(response.song.time);
                // console.log('readCurrentSong', response);
                this.setState({ currentSong: response.song });
                if (navigator.mediaSession.metadata) navigator.mediaSession.metadata.album = response.song.name;
            }
        });
    }

    onPlayerPlay = () => {
        this.props.songPreview(false);

        let musicItem = this.props.data.all && this.props.data.all[this.props.nowPlaying.item];
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
        // console.log('musicItem', musicItem, this.props.nowPlaying, this.props.data);

        // this.props.changeLocation(`/${this.props.location.split('/')[0]}/${this.props.location.split('/')[1]}/${encodeURI(this.props.data.all[this.props.nowPlaying.item].url)}`);
        if (this.props.nowPlaying.item) {
            history.replace({ pathname: `/${this.props.location.split('/')[0]}/${(this.props.location.split('/')[1])}/${(this.props.data.all[this.props.nowPlaying.item].url)}` })
        }

        this.setMediaHandlersForLockedScreen();
        this.setMediaInfoForLockedScreen();
    };

    onEnded = () => {
        this.nextSong();
    }

    onClickNext = () => {
        this.nextSong(true);
    }

    previousSong = (isClick) => {
        if (this.props.nowPlaying.item === undefined) return;
        const playingArray = this.props.queueVisible ? this.props.queue : this.props.data[this.props.activeCategory][this.props.activeIndex];
        // console.log(playingArray, this.props.nowPlaying.currentTime / 1000, this.props.nowPlaying.activeSong);
        let prevSongIndex = 0;

        // TODO: figure out why seekTo doesn't work
        // if ((this.props.nowPlaying.currentTime / 1000) > 5 || !this.props.nowPlaying.activeSong) {
        //     this.props.seekTo(0);
        //     console.log('seek');
        // } else 
        // {
            if (!this.props.shuffle) {
                // prevSongIndex = this.props.nowPlaying.activeSong > 0 ? this.props.nowPlaying.activeSong - 1 : 0;
                prevSongIndex = playingArray.findIndex(e => e === this.props.nowPlaying.item);
                if (isClick && this.props.loop) prevSongIndex = playingArray.length - 1;
            } else {
                prevSongIndex = getRandomArbitrary(0, playingArray.length);
            }
            this.props.setPlaying(playingArray[prevSongIndex], prevSongIndex);
        // }
    }

    nextSong = (isClick) => {
        if (this.props.nowPlaying.item === undefined) return;
        let index = 0; // this.props.nowPlaying.activeSong;
        let nextSongIndex = 0;
        const playingArray = this.props.queueVisible ? this.props.queue : this.props.data[this.props.activeCategory][this.props.activeIndex];
        index = playingArray.findIndex(e => e === this.props.nowPlaying.item);

        if (!this.props.shuffle) {
            nextSongIndex = index + 1;
        } else {
            nextSongIndex = getRandomArbitrary(0, playingArray.length);
            if (nextSongIndex === index) nextSongIndex = 0;
        }
        
        if (this.props.loop && !isClick) {
            nextSongIndex = index;
            this.props.endPlayback();
        }
        if (isClick && this.props.loop && index === playingArray.length - 1) nextSongIndex = 0;
        // console.log(nextSongIndex, index, playingArray.length);

        if (!this.props.shuffle && !this.props.loop && index === playingArray.length - 1) {
            this.props.endPlayback();
            if (!this.props.queueVisible) this.props.setQueue([]);
        } else {
            this.props.setPlaying(playingArray[nextSongIndex], nextSongIndex);
        }
    }

    onPreviewPlayButtonClick = () => {
        // console.log(this.player.current.audio.current);
        this.player.current.audio.current.play();
    }

    render() {
        // if (this.props.nowPlaying.playing === null && !this.props.nowPlaying.item) return;
        let musicPath = 'Reload player';
        if (this.props.data.all) {
            // console.log('render', this.props.nowPlaying, this.props.data);
            const musicItem = this.props.data.all[this.props.nowPlaying.item];  // TODO: figure out why item sometimes undefined
            musicPath = musicItem && musicItem.path;
            musicPath = encodeURI(musicPath);
        }
        return(
          <div ref={this.ref} 
            className={ ("audio_player" + (this.props.nowPlaying.item > '' ? ' playing' : ''))}>
            {/* <MainContent /> */}
            <div className='preview_play_button'>
                <MdPlayCircleOutline size={160} onClick={ this.onPreviewPlayButtonClick } />
            </div>
            <div className='current_song'>
                <GiMusicSpell className={ this.state.currentSong.range > secondsToSetSongActive ? '' : 'spinner'} /> { this.state.currentSong.name }
            </div>
            <AudioPlayer
                ref={this.player}
                autoPlay
                src={window.location.origin + "/music" + musicPath}
                preload='metadata'
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
