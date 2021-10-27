import React, { Component } from 'react';
import { connect } from 'react-redux';
import MainContent from './MainContent.js';
import {
  playbackActions,
  dataActions,
  queueActions
} from '../actions/actions.js';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { config } from '../config';

const mapStateToProps = (state, props) => ({
  nowPlaying: state.nowPlaying,
  loop: state.settings.loop,
  volume: state.settings.volume,
  data: state.data,
  queue: state.queue
})

const mapDispatchToProps = {
  updateData: dataActions.updateData,
  setDuration: playbackActions.setDuration,
  updateTime: playbackActions.updateTime,
  setPlaying: playbackActions.setPlaying,
  endPlayback: playbackActions.endPlayback,
  seekTo: playbackActions.seekTo,
  setQueue: queueActions.setQueue
}

export class MainContainerBind extends Component {
  
  componentDidMount() {
    this.getMusicLibrary()
      .then(res => {
        let data = {};
        for(let key in res) {
            data[key] = res[key]
        }
        this.props.updateData(data);
      })
      .catch(err =>  {
          console.log(err)
      });
  }

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
    // let musicItem = this.props.data.all[this.props.nowPlaying.item];
    // let musicPath = musicItem && musicItem.path;
    // musicPath = encodeURI(musicPath);
    return(
      <div className="audio_player">
        <MainContent />
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
