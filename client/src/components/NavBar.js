import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";

import { 
    viewActions
} from '../actions/actions.js';
import { MdOutlineLibraryMusic, MdAlbum, MdPlaylistPlay } from 'react-icons/md';
import { ImUsers } from 'react-icons/im';
import { GiMusicalNotes } from 'react-icons/gi';

const mapStateToPropsCat = (state, props) => ({
    visibleCategory: state.view.visibleCategory,
    location: state.view.location
})

const mapDispatchToPropsCat = {
    changeVisibleCategory: viewActions.changeVisibleCategory,
    changeLocation: viewActions.changeLocation
}

export class NavBarIconBind extends Component {

    componentDidUpdate() {
        const folder = this.props.location.split('/')[0];
        this.props.changeVisibleCategory(folder);
    }

    onNavbarClick(name) {
        this.props.changeLocation(name);
        this.props.changeVisibleCategory(name);
    }

    render() {
        let classActive = this.props.visibleCategory === this.props.name ? " navbar-icon-active" : "";
        return (
            <div 
                className={"navbar-icon" + classActive}
                title={this.props.title}
                onClick={() => this.onNavbarClick(this.props.name)}
            >
                {this.props.icon}
            </div>
        )
    }
}

export const NavBarIcon = connect(
    mapStateToPropsCat,
    mapDispatchToPropsCat
)(NavBarIconBind);

export default class NavBar extends Component {
    render() {
        return (
            <div className="navbar">
                <Link to="/">
                    <NavBarIcon
                        title="Folders"
                        name="songs"
                        icon={<MdOutlineLibraryMusic size="3em" />} />
                </Link>
                <Link to="/albums">
                    <NavBarIcon
                        title="Albums"
                        name="albums"
                        icon={<MdAlbum size="3em" />} />
                </Link>
                <Link to="/artists">
                    <NavBarIcon
                        title="Artists"
                        name="artists"
                        icon={<ImUsers size="3em" />} />
                </Link>
                <Link to="/genres">
                    <NavBarIcon
                        title="Genres"
                        name="genres"
                        icon={<GiMusicalNotes size="3em" />} />
                </Link>
                <Link to="/playlists">
                    <NavBarIcon
                        title="Playlists"
                        name="playlists"
                        icon={<MdPlaylistPlay size="3em" />} />
                </Link>
                {/* <RefreshButton /> */}
            </div>
        )
    }
}
