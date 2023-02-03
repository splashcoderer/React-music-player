import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";

import { decode } from '../tools.js';
import {
    viewActions,
    settingsActions,
    dataActions
} from '../actions/actions.js';
import { config } from '../config';
import { HiPlus, HiMinus } from 'react-icons/hi';

const mapStateToProps = (state, props) => ({
    visibleCategory: state.view.visibleCategory,
    data: state.data,
    location: state.view.location,
    isPassiveMode: state.settings.isPassiveMode
});

const mapDispatchToProps = {
    changeActiveCategory: viewActions.changeActiveCategory,
    changeActiveIndex: viewActions.changeActiveIndex,
    changeLocation: viewActions.changeLocation,
    toggleQueue: settingsActions.toggleQueue,
    updateData: dataActions.updateData,
    togglePassiveMode: settingsActions.togglePassiveMode
}

export class SidebarContentItem extends Component {

    constructor(props) {
        super(props)
        this.state = {
            newPlaylistName: "",
            playlistFormVisible: false
        }
    }

    changeActiveIndex = (e) => {
        this.props.onActiveIndexChange(typeof e === 'string' ? e : e.target.innerHTML);
    }

    listItems = (category) => {
        if (!category) return;
        let keys = Object.keys(category);
        if (!keys.length) return;
        keys.sort();
        const url = this.props.location.split('/');
        // console.log(url);
        return (
            keys.map(item =>
                <Link key={item} to={`/${url[0]}/${encodeURI(item)}`}>
                    <li key={item} onClick={this.changeActiveIndex} className={url[1] === encodeURI(item) ? 'active' : ''}>{item}</li>
                </Link>
            )
        )
    }

    toggleFormVisble = () => {
        let playlistFormVisible = !this.state.playlistFormVisible;
        this.setState({playlistFormVisible});
    }

    togglePassiveMode = (e) => {
        this.props.onTogglePassiveMode();
    }

    updateName = (e) => {
        this.setState({newPlaylistName: e.target.value});
    }

    submitName = () => {
        if(!this.state.newPlaylistName) return;
        this.props.submitName(this.state.newPlaylistName);
        this.form.value = "";
        this.toggleFormVisble();
    }

    renderForm = () => {
        if(this.state.playlistFormVisible){
            return(
                <div className="new-playlist-form">
                    <input 
                        type="text" 
                        className="new-playlist-name" 
                        placeholder="Playlist Name" 
                        maxLength="50" 
                        onChange={this.updateName}
                        ref={form => this.form = form}/>
                    <div className="new-playlist-submit" onClick={this.submitName}>ADD</div>
                </div>   
            )
        }
    }

    render() {
        let classNames = "sidebar-content";
        if(this.props.name === this.props.visible) {
            classNames += " sidebar-content-active";
        }
        return (
            <div id={"sidebar-" + this.props.name} className={classNames}>

                <div className="title"><a href="/">Private Player { config.version }</a></div>

                <div className="sidebar-header">
                    <span>{this.props.content}</span>
                    {this.props.name === "playlists" && 
                        <div 
                            className="new-playlist-toggle"
                            onClick={this.toggleFormVisble}>
                            { this.state.playlistFormVisible ? <HiMinus /> : <HiPlus /> }
                        </div>
                    }
                </div>

                {this.renderForm()}

                <div className="sidebar-list">
                    <ul id={this.props.name + "-list"}>
                        {this.listItems(this.props.data)}
                    </ul>
                </div>

                {/* <label className="switch">
                    <input type="checkbox" onChange={this.togglePassiveMode} />
                    <span className="slider">Passive</span>
                </label> - */}

            </div>
        )
    }
}

export class SidebarContentBind extends Component {

    onActiveIndexChange = (index) => {
        this.props.changeActiveIndex(decode(index));
        this.props.changeActiveCategory(this.props.visibleCategory);
        this.props.toggleQueue(true);

        this.props.changeLocation(`${this.props.location.split('/')[0]}/${encodeURI(index)}`);
    }

    onTogglePassiveMode = (enabled) => {
        // console.log('enabled', enabled, MusicPlayerBind);
        this.props.togglePassiveMode(!this.props.isPassiveMode);
        // MusicPlayerBind.readCurrentSong();
    }

    submitName = (name) => {
        let playlists = Object.keys(this.props.data.playlists);
        if(playlists.indexOf(name) !== -1) return;
        fetch(config.baseUrl + '/addPlaylist', {
            method: 'POST',
            body: JSON.stringify({
                playlistName: name
            }),
            headers:{
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            this.props.updateData(response)
        });
    }

    render() {
        return (
            <div className="sidebar-content-outer">
                <div className="sidebar-background"></div>
                {/* <Routes>
                    <Route path='/' element={
                        <SidebarContentItem
                            name="songs"
                            content="Folders"
                            visible={this.props.visibleCategory}
                            data={this.props.data.songs}
                            onActiveIndexChange={this.onActiveIndexChange}/>}>
                    </Route> 
                    <Route path='/albums' element={
                        <SidebarContentItem
                            name="albums"
                            content="Albums"
                            visible={this.props.visibleCategory}
                            data={this.props.data.albums}
                            onActiveIndexChange={this.onActiveIndexChange}/>}>
                    </Route>
                </Routes> */}
                <SidebarContentItem
                    name="songs"
                    content="Folders"
                    visible={this.props.visibleCategory}
                    data={this.props.data.songs}
                    location={this.props.location}
                    onActiveIndexChange={this.onActiveIndexChange}
                    onTogglePassiveMode={this.onTogglePassiveMode}
                    isPassiveMode={this.props.isPassiveMode}
                />
                <SidebarContentItem
                    name="albums"
                    content="Albums"
                    visible={this.props.visibleCategory}
                    data={this.props.data.albums}
                    location={this.props.location}
                    onActiveIndexChange={this.onActiveIndexChange}/>
                <SidebarContentItem
                    name="artists"
                    content="Artists"
                    visible={this.props.visibleCategory}
                    data={this.props.data.artists}
                    location={this.props.location}
                    onActiveIndexChange={this.onActiveIndexChange}/>
                <SidebarContentItem
                    name="genres"
                    content="Genres"
                    visible={this.props.visibleCategory}
                    data={this.props.data.genres}
                    location={this.props.location}
                    onActiveIndexChange={this.onActiveIndexChange}/>
                <SidebarContentItem
                    name="playlists"
                    content="Playlists"
                    visible={this.props.visibleCategory}
                    data={this.props.data.playlists}
                    location={this.props.location}
                    onActiveIndexChange={this.onActiveIndexChange}
                    submitName={this.submitName}/>
                
            </div>
        )
    }
}

const SidebarContent = connect(
    mapStateToProps,
    mapDispatchToProps
)(SidebarContentBind);

export { SidebarContent as default }
