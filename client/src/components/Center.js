import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  playbackActions,
  queueActions,
  viewActions
} from '../actions/actions.js';

import NavBar from './NavBar.js';
import MusicItem from './MusicItem.js';
import IndexPanel from './IndexPanel.js';
import '../css/Center.css';
import { MdQueueMusic } from 'react-icons/md';

const mapStateToProps = (state, props) => ({
  queueVisible: state.settings.queue,
  queue: state.queue,
  data: state.data,
  activeIndex: state.view.activeIndex,
  activeCategory: state.view.activeCategory,
  location: state.view.location
})

const mapDispatchToProps = {
  setPlaying: playbackActions.setPlaying,
  setActive: playbackActions.setActive,
  setQueue: queueActions.setQueue,
  seekTo: playbackActions.seekTo,
  changeLocation: viewActions.changeLocation,
}

export class CenterBind extends Component {
  
  componentDidMount() {
    setTimeout(() => {
      const list = this.props.queueVisible ? this.props.queue : this.props.data[this.props.activeCategory][this.props.activeIndex];
      // console.log('list', list, this.props.data);
      // this.props.setPlaying('Z2q6R6E', 7);

      const url = this.props.location.split('/');
      if (list && url[2]) {
        let item2play = '';
        for (const key in this.props.data.all) {
          if (this.props.data.all[key].title === decodeURI(url[2])) item2play = key;
        }

        const item2playIndex = list.findIndex(e => e === item2play);
        
        setTimeout(() => {
          this.props.setQueue(list);
          this.props.setPlaying(item2play, item2playIndex);
          // this.props.seekTo(100);
          // this.props.setActive();
        }, 10);
      }
    }, 3000);
  }

  render() {
    let list = [];
    if (this.props.activeIndex) {
      list = this.props.queueVisible ?
      this.props.queue :
      this.props.data[this.props.activeCategory][this.props.activeIndex];
    }
    return (
      <div className="view-outer">
        <div 
            className="sidebar-toggler"
            onClick={this.toggleQueue}>
              <MdQueueMusic size="2em" />
        </div>
        <NavBar />
        <div className="view-background"></div>
        <div className="view-inner">
          <div className="index-outer">
            <div className="index-inner">
              <IndexPanel />
              <div className="music-list" ref={scroll => this.scroll = scroll}>
                {
                  list && list.map((item, index) =>
                    <MusicItem
                      key={index}
                      id={item}
                      index={index}/>
                  )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const Center = connect(
  mapStateToProps,
  mapDispatchToProps
)(CenterBind);

export { Center as default }
