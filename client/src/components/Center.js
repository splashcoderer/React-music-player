import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
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
  changeLocation: viewActions.changeLocation,
}

export class CenterBind extends Component {

  render() {
    let list = [];
    if (this.props.activeIndex) {
      list = this.props.queueVisible ?
        this.props.queue :
        this.props.data[this.props.activeCategory] && this.props.data[this.props.activeCategory][this.props.activeIndex];
    }
    if (!this.props.queueVisible) list.sort();

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
