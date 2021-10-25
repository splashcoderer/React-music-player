import React, { Component } from 'react';
import { connect } from 'react-redux';

import { 
    viewActions,
    dataActions
} from '../actions/actions.js';
import { GrUpdate } from 'react-icons/gr';
import { MdOutlineLibraryMusic, MdAlbum, MdPlaylistPlay } from 'react-icons/md';
import { ImUsers } from 'react-icons/im';
import { GiMusicalNotes } from 'react-icons/gi';
import { config } from '../config';

const mapStateToPropsCat = (state, props) => ({
    visibleCategory: state.view.visibleCategory
})

const mapDispatchToPropsCat = {
    changeVisibleCategory: viewActions.changeVisibleCategory
}

export class NavBarIconBind extends Component {
    render() {
        let classActive = this.props.visibleCategory === this.props.name ? " navbar-icon-active" : "";
        return (
            <div 
                className={"navbar-icon" + classActive}
                title={this.props.title}
                onClick={() => this.props.changeVisibleCategory(this.props.name)}>
                {this.props.icon}
            </div>
        )
    }
}

export const NavBarIcon = connect(
    mapStateToPropsCat,
    mapDispatchToPropsCat
)(NavBarIconBind);

const mapDispatchToPropsRefresh = {
    updateData: dataActions.updateData,
    resetView: viewActions.resetView
}

export class RefreshButtonBind extends Component {
    refreshLibrary = () => {
        fetch(config.baseUrl + '/refreshData')   
        .then(res => {
            console.log('refreshData', res);
            return res.json();
        })
        .catch(error => console.error('Error:', error))
        .then(response => {
            this.props.resetView();
            //this.props.updateData(response);
        });
    }
    render(){
        return(
            <div className="refresh-outer" onClick={this.refreshLibrary}>
                <GrUpdate size="2em" title="Refresh Music Library"/>
            </div>
        )
    }
}

export const RefreshButton = connect(
    null,
    mapDispatchToPropsRefresh
)(RefreshButtonBind)

export default class NavBar extends Component {
    render() {
        return (
            <div className="navbar">
                <NavBarIcon
                    title="Folders"
                    name="songs"
                    icon={<MdOutlineLibraryMusic size="3em" />} />
                <NavBarIcon
                    title="Albums"
                    name="albums"
                    icon={<MdAlbum size="3em" />} />
                <NavBarIcon
                    title="Artists"
                    name="artists"
                    icon={<ImUsers size="3em" />} />
                <NavBarIcon
                    title="Genres"
                    name="genres"
                    icon={<GiMusicalNotes size="3em" />} />
                <NavBarIcon
                    title="Playlists"
                    name="playlists"
                    icon={<MdPlaylistPlay size="3em" />} />
                {/* <RefreshButton /> */}
            </div>
        )
    }
}
