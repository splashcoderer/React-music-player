import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    playbackActions,
    queueActions,
    dataActions,
    viewActions
} from '../actions/actions.js';
import { shuffle } from '../tools.js';
import { MdCheck, MdPlayArrow, MdDriveFileRenameOutline } from 'react-icons/md';
import { IoMdTrash } from 'react-icons/io';
import { config } from '../config.js';

const mapStateToProps = (state, props) => ({
    activeIndex: state.view.activeIndex,
    activeCategory: state.view.activeCategory,
    queueVisible: state.settings.queue,
    activeSong: state.nowPlaying.activeSong,
    data: state.data,
    queue: state.queue,
    shuffle: state.settings.shuffle
})

const mapDispatchToProps = {
    setPlaying: playbackActions.setPlaying,
    addToQueue: queueActions.addToQueue,
    setQueue: queueActions.setQueue,
    addToUpnext: queueActions.addToUpnext,
    updateData: dataActions.updateData,
    setHold: dataActions.setHold,
    resetView: viewActions.resetView,
    changeActiveCategory: viewActions.changeActiveCategory,
    changeActiveIndex: viewActions.changeActiveIndex,
    togglePlaylistSelectVisible: viewActions.togglePlaylistSelectVisible
}

export class IndexPanelBind extends Component {

    constructor(props) {
      super(props);
      this.state = {
          renameTextVisible: false
      }
    }

    getSongList = () => {
        let list = this.props.data[this.props.activeCategory][this.props.activeIndex];
        if(this.props.shuffle) {
            list  = shuffle(list);
        }
        return list;
    }

    play = () => {
        if(this.props.activeIndex === undefined) return;
        let list = this.getSongList();
        this.props.setPlaying(list[0], 0);
        this.props.setQueue(list);
    }

    addToPlaylist = () => {
        if(this.props.activeIndex === undefined) return;
        this.props.setHold(this.getSongList());
        this.props.togglePlaylistSelectVisible();
    }

    addToQueue = () => {
        if(this.props.activeIndex === undefined) return;
        const list = this.getSongList();
        if(this.props.queue.length === 0) this.props.setPlaying(list[0], 0);
        this.props.addToQueue(list);
    }

    playNext = () => {
        if(this.props.activeIndex === undefined) return;
        const list = this.getSongList();
        if(this.props.queue.length === 0) this.props.setPlaying(list[0], 0);
        this.props.addToUpnext(list, this.props.activeSong);
    }

    deletePlaylist = () => {
        if (!this.props.activeIndex) return;
        fetch(config.baseUrl + '/deletePlaylist', {
            method: 'POST',
            body: JSON.stringify({
                playlist: this.props.activeIndex
            }),
            headers:{
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            // let index = Object.keys(this.props.data.songs)[0];
            this.props.resetView();
            this.props.updateData(response);
        });
    }

    handleRename = () => {
        let state = this.state.renameTextVisible;
        if(this.state.renameTextVisible) {
            let name = document.getElementById("index-rename-input").value;
            if(name) {
                fetch('/editPlaylistName', {
                    method: 'POST',
                    body: JSON.stringify({
                        oldName: this.props.activeIndex,
                        newName: name
                    }),
                    headers:{
                        'Content-Type': 'application/json'
                    }
                }).then(res => res.json())
                .catch(error => console.error('Error:', error))
                .then(response => {
                    this.props.resetView();
                    this.props.updateData(response);
                    this.props.changeActiveCategory('playlists');
                    this.props.changeActiveIndex(name);
                    this.input.value = "";
                    this.setState({renameTextVisible: !state});
                });
            }
        } else {
            this.setState({renameTextVisible: !state});
        }
    }


    renderControls = () => {
        if(!this.props.queueVisible && this.props.activeIndex){
            return(
                <div className="panel-controls">
                    {
                        // TODO add param to allow delete/rename for you only
                        (false && this.props.activeCategory === "playlists") &&
                            <div className="playlist-controls">
                                <div 
                                    id="panel-delete" 
                                    className="panel-control panel-option playlist-option"
                                    onClick={this.deletePlaylist}>
                                    <IoMdTrash size={25} />
                                </div>
                                <div 
                                    id="panel-rename" 
                                    className="panel-control panel-option playlist-option"
                                    onClick={this.handleRename}>
                                    {this.state.renameTextVisible ? "SUBMIT" : <MdDriveFileRenameOutline size={25} /> }
                                </div>
                            </div>
                    }
                    <div 
                        id="panel-addtoplaylist" 
                        className="panel-control panel-option"
                        onClick={this.addToPlaylist} >
                        TO PLAYLIST
                    </div>
                    <div 
                        id="panel-addtoqueue" 
                        className="panel-control panel-option"
                        onClick={this.addToQueue} >
                        TO QUEUE
                    </div>
                    <div 
                        id="panel-playnext" 
                        className="panel-control panel-option"
                        onClick={this.playNext}>
                        PLAY NEXT
                    </div>
                    <div 
                        className="panel-control"
                        onClick={this.play}>
                        <span className="panel-play">
                            {/* PLAY */}
                            <MdPlayArrow></MdPlayArrow>
                        </span>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }
  
    render() {
        return (
            <div className="panel">
                <div className={"panel-title " + (this.state.renameTextVisible && this.props.activeCategory === "playlists" 
                    ? "panel-title-hidden" : "")}>
                    { this.props.queueVisible ? "Play Queue" : this.props.activeIndex }
                </div>
                <div className={"panel-title " + (this.state.renameTextVisible && this.props.activeCategory === "playlists" 
                    ? "" : "panel-title-hidden")}>
                    <div className="panel-title-inner">
                        <input 
                            id="index-rename-input"
                            type="text"
                            placeholder="Enter name"
                            maxLength="50"
                            ref={ref => this.input = ref}/>
                        <div className="index-rename-submit">
                            <MdCheck size="2em" />
                        </div>
                    </div>
                </div>
                {this.renderControls()}
            </div>  
        )
    }
}

const IndexPanel = connect(
    mapStateToProps,
    mapDispatchToProps
)(IndexPanelBind);

export { IndexPanel as default }