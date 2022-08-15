import React, { Component } from 'react';
import { connect } from 'react-redux';
import MainContent from './MainContent.js';
import {
  playbackActions,
  dataActions,
  queueActions,
  viewActions,
  settingsActions
} from '../actions/actions.js';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { config } from '../config';

const mapStateToProps = (state, props) => ({
    nowPlaying: state.nowPlaying,
    loop: state.settings.loop,
    volume: state.settings.volume,
    data: state.data,
    queue: state.queue,
    queueVisible: state.settings.queue,
    activeCategory: state.view.activeCategory,
    visibleCategory: state.view.visibleCategory,
    activeIndex: state.view.activeIndex,
    location: state.view.location,
    isPreviewVisible: state.view.isPreviewVisible
})

const mapDispatchToProps = {
    updateData: dataActions.updateData,
    setDuration: playbackActions.setDuration,
    updateTime: playbackActions.updateTime,
    setPlaying: playbackActions.setPlaying,
    endPlayback: playbackActions.endPlayback,
    seekTo: playbackActions.seekTo,
    setQueue: queueActions.setQueue,
    changeLocation: viewActions.changeLocation,
    showPreloader: viewActions.showPreloader,
    changeActiveCategory: viewActions.changeActiveCategory,
    changeActiveIndex: viewActions.changeActiveIndex,
    songPreview: viewActions.songPreview,
    toggleQueue: settingsActions.toggleQueue
}

export class MainContainerBind extends Component {

    componentDidMount() {
        // console.log('pathname', this.props.history.location.pathname.slice(1));
        this.props.changeLocation(this.props.history.location.pathname.slice(1) || 'songs');

        this.getMusicLibrary()
        .then(res => {
            let data = {};
            for(let key in res) {
                data[key] = res[key]
            }
            this.props.updateData(data);
            // console.log('data', this.props.data);

            this.props.showPreloader(false);
            this.initAfterDataLoaded();
        })
        .catch(err =>  {
            console.log(err)
        });
    }

    initAfterDataLoaded = () => {
        // setTimeout(() => {
            const url = this.props.location.split('/');

            // select folder depends on URL[1]
            if (url[1]) {
                // console.log('url[1]', url[1]);
                this.props.changeActiveIndex(decodeURI(url[1]));
                this.props.changeActiveCategory(this.props.visibleCategory);
                this.props.toggleQueue(true);
            }

            const list = this.props.queueVisible ? this.props.queue : this.props.data[this.props.activeCategory][this.props.activeIndex];
            // console.log('list', list, this.props.activeCategory, this.props.activeIndex, url, this.props.data);

            // show song preview depends on URL[2]
            if (list && url[2]) {
                let item2play = '';
                for (const key in this.props.data.all) {
                    if (this.props.data.all[key].title === decodeURI(url[2])) item2play = key;
                }
        
                const item2playIndex = list.findIndex(e => e === item2play);

                this.props.setQueue(list);
                this.props.setPlaying(item2play, item2playIndex);
        
                // setTimeout(() => {
                    // this.props.seekTo(100);
                    this.props.songPreview(true);
                // }, 10);
            }
        // }, 10);
    }

    onPreviewCloseClick = () => { this.props.songPreview(false) };

    getMusicLibrary = async () => {
        const response = await fetch(config.baseUrl + '/getSongs');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);
        return body;
    };

    nextSong = () => {
        if(this.props.loop) {
        this.props.seekTo(0);
        return;
        }
        let index = this.props.nowPlaying.activeSong;
        if(index === this.props.queue.length - 1){
        this.props.endPlayback();
        this.props.setQueue([]);
        }else{
        let item = this.props.queue[index + 1];
        this.props.setPlaying(item, index + 1);
        }
    }

    // can be used to play music withour rendering player in web tree
    renderSound = () => {
        if(this.props.nowPlaying.playing === null) return;
        if(this.props.nowPlaying.playing) {
            let musicItem = this.props.data.all[this.props.nowPlaying.item];
            let musicPath = musicItem.path;
            musicPath = encodeURI(musicPath);
            return (
                <AudioPlayer
                    autoPlay
                    src={window.location.origin + "/music" + musicPath}
                    onPlaying={ e => this.props.setDuration(e.target.duration * 1000) }
                    onListen={ e => this.props.updateTime(e.target.currentTime * 1000) }
                    onError={ e => console.log('AudioPlayer error', e) }
                    onEnded={this.nextSong}
                />
            )
        }
    }

    render() {
        const musicItem = this.props.data.all[this.props.nowPlaying.item];
        let musicPath = musicItem && musicItem.path.split('/')[2].replace('.mp3', '') || 'Song not found';
        // musicPath = encodeURI(musicPath);
        return(
        <div className={ "private_player" + (this.props.isPreviewVisible ? ' with_big_play_button' : '')}>
            <MainContent />
            {this.props.isPreviewVisible && <div className='big_play_button_bg'>
                <div className='big_play_button_bg-close' onClick={ this.onPreviewCloseClick }><AiOutlineCloseCircle></AiOutlineCloseCircle></div>
                <div className='big_play_button_bg-title'>{ musicPath }</div>
            </div>}
            {/* <AudioPlayer
            autoPlay
            src={window.location.origin + "/music" + musicPath}
            onPlaying={(e) => {console.log('onPlaying', e); this.props.setDuration(e.timeStamp)}}
            onListen={e => { console.log('onListen', e); this.props.updateTime(e.timeStamp)}}
            style={{
                position: 'absolute',
                zIndex: 11
            }}
            />
            { this.renderSound() } */}
        </div>
        )
    }
}

const MainContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainContainerBind);

export { MainContainer as default }
