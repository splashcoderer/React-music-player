import React, { Component } from 'react';
import { connect } from 'react-redux';
import AudioPlayer from 'react-h5-audio-player';
import { AiOutlineCloseCircle } from 'react-icons/ai';

import '../css/MusicPlayer.css';
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
    queue: state.queue,
    queueVisible: state.settings.queue,
    activeCategory: state.view.activeCategory,
    activeIndex: state.view.activeIndex,
    location: state.view.location
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
    constructor(props) {
        super(props);
        this.player = React.createRef();
        this.ref = React.createRef();
        this.state = {
            isBigPlayVisible: false
        }
    }

    componentDidMount() {
        // setTimeout(() => {this.ref.current.click();}, 500);
        setTimeout(() => {
          const list = this.props.queueVisible ? this.props.queue : this.props.data[this.props.activeCategory][this.props.activeIndex];
        //   console.log('list', list, this.props.data);
    
          const url = this.props.location.split('/');
          if (list && url[2]) {
            let item2play = '';
            for (const key in this.props.data.all) {
                if (this.props.data.all[key].title === decodeURI(url[2])) item2play = key;
            }
    
            const item2playIndex = list.findIndex(e => e === item2play);

            this.props.setQueue(list);
            this.props.setPlaying(item2play, item2playIndex);
    
            setTimeout(() => {
                // this.props.seekTo(100);
                //   this.ref.current.className += ' with_big_play_button';
                this.setState({ isBigPlayVisible: true });
            }, 10);
          }
        }, 1000);

        // setTimeout(() => {
        //     // this.player.current.click();
        //     this.player.current.handlePlay(new Event('click'));
        //     console.log('player', this.player.current);
        // }, 3000);
    }

    onPreviewCloseClick = () => { this.setState({ isBigPlayVisible: false }) };

    onPlayerPlay = () => { this.setState({ isBigPlayVisible: false }) };

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
        let musicItem = this.props.data.all[this.props.nowPlaying.item];
        let musicPath = musicItem && musicItem.path;
        musicPath = encodeURI(musicPath);
        return(
          <div ref={this.ref} 
            className={ ("audio_player" + (this.props.nowPlaying.item > '' ? ' playing' : '') + (this.state.isBigPlayVisible ? ' with_big_play_button' : ''))}>
            {this.state.isBigPlayVisible && <div className='big_play_button_bg'>
                <div className='close' onClick={ this.onPreviewCloseClick }><AiOutlineCloseCircle></AiOutlineCloseCircle></div>
                { musicItem.path.split('/')[2] }
            </div>}
            {/* <MainContent /> */}
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
