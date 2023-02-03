import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  playbackActions,
  queueActions,
  dataActions,
  playlistActions,
  viewActions
} from '../actions/actions.js';
// import { shuffle } from '../tools.js';
import { MdCancel, MdMoreHoriz, MdContentCopy } from 'react-icons/md';
import { FiShare } from 'react-icons/fi';
import { Link } from 'react-router-dom';
// import { Share } from '@capacitor/share';

const mapStateToProps = (state, props) => ({
  queueVisible: state.settings.queue,
  data: state.data,
  queue: state.queue,
  activeCategory: state.view.activeCategory,
  activeIndex: state.view.activeIndex,
  activeSong: state.nowPlaying.activeSong,
  shuffle: state.settings.shuffle,
  location: state.view.location,
  nowPlaying: state.nowPlaying,
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
  removeFromPlaylistApi: playlistActions.removeFromPlaylistApi,
  togglePlaylistSelectVisible: viewActions.togglePlaylistSelectVisible,
  seekTo: playbackActions.seekTo,
  changeLocation: viewActions.changeLocation,
  toggleModalMessage: viewActions.toggleModalMessage,
  showMessage: viewActions.showMessage
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
    // const list = this.props.data[this.props.activeCategory][this.props.activeIndex];
    const list = this.props.queue;
    list.unshift(this.props.id);
    // if (this.props.shuffle) { list = shuffle(list); list.unshift(this.props.id); }
    return list;
  }

  playItem = () => {
    let index = this.props.index;
    if (!this.props.queueVisible) {
      let list = this.getSongList();
      this.props.setQueue(list);
      // if (this.props.shuffle) index = 0;
    }
    // console.log('playItem', this.props.id, index, this.props.data.all[this.props.id], this.props.location);
    this.props.changeLocation(`${this.props.location.split('/')[0]}/${this.props.location.split('/')[1]}/${encodeURI(this.props.data.all[this.props.id].url)}`);
    this.props.setPlaying(this.props.id, index);
  }

  shareSong = e => {
    // Share.share({
    //   title: 'See cool stuff',
    //   text: 'Really awesome thing you need to see right meow',
    //   url: 'http://ionicframework.com/',
    //   dialogTitle: 'Share with buddies',
    // });
    if (navigator.share) {
      navigator.share({
        url: decodeURI(document.location.href.split('/').slice(0, -1).join('/')) + '/' + this.props.data.all[this.props.id].title,
        text: this.props.data.all[this.props.id].title,
        title: this.props.data.all[this.props.id].title
      });
      this.props.showMessage({ text: 'Shared' });
    } else {
      this.props.showMessage({
        time: 5,
        text: 'Share isn\'t supported by Browser, use Browser share button' 
      });
    }
    this.toggleOptionView(e);
    e.stopPropagation();
  }

  copyLink = e => {
    // console.log(this.props.id, decodeURI(document.location.href.split('/').slice(0, -1).join('/')), this.props.data.all[this.props.id].title);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(decodeURI(document.location.href.split('/').slice(0, -1).join('/')) + '/' + this.props.data.all[this.props.id].url);
      this.props.showMessage({ text: 'Copied' });
    } else {
      this.props.showMessage({
        time: 3,
        text: 'Copy not supported by Browser' 
      });
    }
    this.toggleOptionView(e);
    e.stopPropagation();
  }

  addToPlaylist = e => {
    this.props.togglePlaylistSelectVisible(false);
    this.props.setHold([this.props.id]);
    this.toggleOptionView(e);
    e.stopPropagation();
  }

  addToQueue = e => {
    if (!this.props.queue.length) this.props.setPlaying(this.props.id, 0);
    this.props.addToQueue([this.props.id]);
    this.props.showMessage({ text: 'Added to Queue end' });
    this.toggleOptionView(e);
    e.stopPropagation();
  }

  addToQueuePlayNext = e => {
    if (!this.props.queue.length) this.props.setPlaying(this.props.id, 0);
    const indexInQueue = this.props.queue.findIndex(e => e === this.props.nowPlaying.item);
    this.props.addToUpnext([this.props.id], indexInQueue);
    this.props.showMessage({ text: 'Added to Queue next' });
    this.toggleOptionView(e);
    e.stopPropagation();
  }

  toggleOptionView = e => {
    e.stopPropagation();
    const optionsVisible = !this.state.optionsVisible;
    this.setState({optionsVisible});
    const top = this.item.getBoundingClientRect().top;
    if (top < 440) {
      this.setState({optionsPositionClass:"options-container-bottom"});
    } else {
      this.setState({optionsPositionClass:"options-container-top"})
    }
  }

  removeItem = (e) => {
    this.toggleOptionView(e);
    if (this.props.queueVisible){
      if (this.props.index < this.props.activeSong) {
        this.props.setActive(this.props.activeSong - 1);
      }
      if (this.props.index === this.props.activeSong) {
        const index = this.props.index;
        if (index === this.props.queue.length - 1) {
          this.props.endPlayback();
          this.props.setQueue([]);
        } else {
          this.props.setPlaying(this.props.queue[index + 1], index);
        }
      }
      this.props.removeFromQueue(this.props.index);
    } else {
      this.props.removeFromPlaylist(this.props.activeIndex, this.props.index, this.props);
      this.props.showMessage({ text: 'Deleted', time: 2 });
    }
    e.stopPropagation();
  }

  renderRemoveButton = () => {
    if (this.props.activeCategory === "playlists" || this.props.queueVisible) {
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
    const url = this.props.location.split('/');
    const item = this.props.data.all[this.props.id];

    let musicItemClass = "music-item";

    if (item.url === this.props.nowPlaying.item/*this.props.index === this.props.activeSong*//* || decodeURI(url[2]) === item.url *//* && this.props.queueVisible*/) {
      musicItemClass += " music-item-active"
    }
    let optionsContainerClass = "options-container " + this.state.optionsPositionClass;
    if(this.state.optionsVisible) optionsContainerClass += " options-container-visible";
    
    // console.log(this.props.location, item.title, this.props);
    // const title = item.title.match(/[а-яё][А-ЯЁ]+|[a-z][A-Z]+/i) ? item.title : item.path;

    return (
      <div className='music-i'>
        <Link to={`/${url[0]}/${url[1]}/${item.url}`}>
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
                <div className="music-item-title">{item.title.match(/[а-яё][А-ЯЁ]+|[a-z][A-Z]+/i) ? item.title : item.path.substr(item.path.indexOf('-') + 1)}</div>
                <div className="music-item-more">{item.artist} {item.album ? '- ' + item.album : ''} {item.year ? '- ' + item.year : ''}</div>
              </div>
          </div>
        </Link>
        <div 
          className="music-item-options"
          onClick={this.toggleOptionView}
        >
          <div 
            className={optionsContainerClass}>
            <div className="options-container-inner">

              <div className="options-list options-list-index">
                {!this.props.queueVisible && <div 
                  className="add-to-queue"
                  onClick={this.addToQueue}>
                    Add to Queue
                </div>}
                {!this.props.queueVisible && <div 
                  className="play-next"
                  onClick={this.addToQueuePlayNext}>
                    Play Next in Queue
                </div>}
                <div 
                  className="add-to-playlist"
                  onClick={this.addToPlaylist}>
                    Add to Playlist
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
                { navigator && <div 
                  className="share-song"
                  onClick={this.shareSong}
                >
                  <FiShare></FiShare> Share Song
                </div>}
                { navigator && <div 
                  className="copy-link"
                  onClick={this.copyLink}
                >
                  <MdContentCopy></MdContentCopy> Copy Link
                </div>}
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