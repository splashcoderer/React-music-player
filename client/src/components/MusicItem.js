import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  playbackActions,
  queueActions,
  dataActions,
  playlistActions,
  viewActions
} from '../actions/actions.js';
import { shuffle } from '../tools.js';
import { MdCancel, MdMoreHoriz } from 'react-icons/md';

const mapStateToProps = (state, props) => ({
  queueVisible: state.settings.queue,
  data: state.data,
  queue: state.queue,
  activeCategory: state.view.activeCategory,
  activeIndex: state.view.activeIndex,
  activeSong: state.nowPlaying.activeSong,
  shuffle: state.settings.shuffle
})

const mapDispatchToProps = {
  setPlaying: playbackActions.setPlaying,
  setActive: playbackActions.setActive,
  endPlayback: playbackActions.endPlayback,
  addToQueue: queueActions.addToQueue,
  setQueue: queueActions.setQueue,
  removeFromQueue: queueActions.removeFromQueue,
  addToUpnext: queueActions.addToUpnext,
  setHold: dataActions.setHold,
  removeFromPlaylist: playlistActions.removeFromPlaylist,
  togglePlaylistSelectVisible: viewActions.togglePlaylistSelectVisible
}

export class MusicItemBind extends Component {

  constructor(props) {
    super(props);
    this.state = {
      optionsVisible: false,
      removeItemVisible: false,
      optionsPositionClass: "options-container-top"
    }
  }

  getSongList = () => {
    let list = this.props.data[this.props.activeCategory][this.props.activeIndex];
    if(this.props.shuffle) {
      list  = shuffle(list);
      list.splice(0,0,this.props.id);
    }
    return list;
  }

  playItem = () => {
    let index = this.props.index;
    if(!this.props.queueVisible){
      let list = this.getSongList();
      this.props.setQueue(list);   // add playing song with all from this folder to queue (that's weird)
      if(this.props.shuffle) index = 0;
    }
    this.props.setPlaying(this.props.id, index);
  }

  addToPlaylist = e => {
    this.props.togglePlaylistSelectVisible(false);
    this.props.setHold([this.props.id]);
    this.toggleOptionView(e);
    e.stopPropagation();
  }

  addToQueue = e => {
    if(this.props.queue.length === 0) this.props.setPlaying(this.props.id, 0);
    this.props.addToQueue([this.props.id]);
    this.toggleOptionView(e);
    e.stopPropagation();
  }

  playNext = e => {
    if(this.props.queue.length === 0) this.props.setPlaying(this.props.id, 0);
    this.props.addToUpnext([this.props.id], this.props.activeSong);
    this.toggleOptionView(e);
    e.stopPropagation();
  }

  toggleOptionView = e => {
    e.stopPropagation();
    const optionsVisible = !this.state.optionsVisible;
    this.setState({optionsVisible});
    const top = this.item.getBoundingClientRect().top;
    if(top < 440) {
      this.setState({optionsPositionClass:"options-container-bottom"});
    } else {
      this.setState({optionsPositionClass:"options-container-top"})
    }
  }

  removeItem = (e) => {
    if(this.props.queueVisible){
      if(this.props.index < this.props.activeSong) {
        this.props.setActive(this.props.activeSong - 1);
      }
      if(this.props.index === this.props.activeSong) {
        const index = this.props.index;
        if(index === this.props.queue.length - 1) {
          this.props.endPlayback();
          this.props.setQueue([]);
        } else {
          this.props.setPlaying(this.props.queue[index + 1], index);
        }
      }
      this.props.removeFromQueue(this.props.index);
    } else {
      this.props.removeFromPlaylist(this.props.activeIndex, this.props.index);
    }
    e.stopPropagation();
  }

  renderRemoveButton = () => {
    if(this.props.activeCategory === "playlists" || this.props.queueVisible) {
      return (
        <div 
          className="music-item-delete"
          onClick={this.removeItem}>
            <MdCancel size="2em" />
        </div>
      )
    }
  }

  render() {
    let musicItemClass = "music-item";
    if(this.props.index === this.props.activeSong/* && this.props.queueVisible*/) {
      musicItemClass += " music-item-active"
    }
    let optionsContainerClass = "options-container " + this.state.optionsPositionClass;
    if(this.state.optionsVisible) optionsContainerClass += " options-container-visible";
    const item = this.props.data.all[this.props.id];
    // const title = item.title.match(/[а-яё][А-ЯЁ]+|[a-z][A-Z]+/i) ? item.title : item.path;

    return (
      <div 
        className={musicItemClass} 
        index={this.props.index} 
        onClick={this.playItem}
        ref={item => this.item = item}
      >

        { this.renderRemoveButton() }

        {/* <div className="music-item-info info-padding"></div> */}
        <div className="music-item-info">
          {/* <div className="music-item-title">{title.substr(item.title.indexOf('-') + 1)}</div> */}
          <div className="music-item-title">{item.title.match(/[а-яё][А-ЯЁ]+|[a-z][A-Z]+/i) ? item.title.substr(item.title.indexOf('-') + 1) : item.path.substr(item.path.indexOf('-') + 1)}</div>
          <div className="music-item-more">{item.artist} - {item.album}</div>
        </div>
      
        <div 
          className="music-item-options"
          onClick={this.toggleOptionView}
        >
          <div 
            className={optionsContainerClass}>
            <div className="options-container-inner">

              <div className="options-list options-list-index">
                <div 
                  className="add-to-playlist"
                  onClick={this.addToPlaylist}>
                    Add to Playlist
                </div>
                <div 
                  className="add-to-queue"
                  onClick={this.addToQueue}>
                    Add to Queue
                </div>
                <div 
                  className="play-next"
                  onClick={this.playNext}>
                    Play Next
                </div>
                <div 
                  className="download"
                  onClick={e => { this.toggleOptionView(e); e.stopPropagation(); }}>
                    <a 
                      href={window.location.origin + "/music" + item.path} 
                      download>
                      Download
                    </a>
                </div>
                {
                  (this.props.queueVisible || this.props.activeCategory === "playlists") &&
                    <div 
                    className="remove-item"
                    onClick={this.removeItem}>
                      Remove Item
                    </div>
                }
              </div>
            </div>
          </div>
          <MdMoreHoriz size="2em" />
        </div>
      </div>
    )
  }
}

const MusicItem = connect(
  mapStateToProps,
  mapDispatchToProps
)(MusicItemBind);

export { MusicItem as default }