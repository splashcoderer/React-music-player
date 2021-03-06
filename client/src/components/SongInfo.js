import React, { Component } from 'react';
import { connect } from 'react-redux';

import { 
    viewActions,
    dataActions
} from '../actions/actions.js';
import { GrUpdate } from 'react-icons/gr';
import { config } from '../config';

const mapDispatchToPropsRefresh = {
    updateData: dataActions.updateData,
    resetView: viewActions.resetView
}

export class RefreshButtonBind extends Component {
    refreshLibrary = () => {
        fetch(config.baseUrl + '/refreshData')
        .then(res => {
            console.log('refreshData', res);
            // return res.json();
        })
        .catch(error => console.error('Error:', error))
        .then(response => {
            // this.props.resetView();
            //this.props.updateData(response);
        });
    }
    render(){
        return(
            <div className="refresh-lib-button" onClick={this.refreshLibrary}>
                <GrUpdate size="4em" title="Refresh Music Library"/>
            </div>
        )
    }
}

export const RefreshButton = connect(
    null,
    mapDispatchToPropsRefresh
)(RefreshButtonBind)

const mapStateToProps = (state, props) => ({
    queue: state.queue,
    activeSong: state.nowPlaying.activeSong,
    data: state.data.all
});

class SongInfoBind extends Component {
    render() {
        let coverPath = window.location.origin;
        let id = this.props.queue[this.props.activeSong];
        let item = id ? this.props.data[id] : {};
        if(this.props.activeSong !== undefined && item.cover) {
            coverPath += "/covers" + item.cover;
        } else {
            coverPath += "/album.jpg";
        }
        return(
            <div className="song-info">
                <div className="song-album-cover">
                    <img src={coverPath} alt="" />
                </div>
                <div className="song-text">
                    <div className="song-title">
                        {item.title}
                    </div>
                    <div className="song-artist">
                        {item.artist}
                    </div>
                    {this.props.activeSong === undefined && <RefreshButton />}
                </div>
            </div>
        )
    }
}

const SongInfo = connect(
    mapStateToProps
)(SongInfoBind);

export { SongInfo as default }
