import React, { Component } from 'react';
import { connect } from 'react-redux';

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
  activeCategory: state.view.activeCategory
})

export class CenterBind extends Component {
  
  componentDidUpdate(){
  }

  render() {
    let list = [];
    if(this.props.activeIndex) {
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
                  list.map((item, index) =>
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
  mapStateToProps
)(CenterBind);

export { Center as default }