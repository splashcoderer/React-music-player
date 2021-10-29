import React, { Component } from 'react';

import '../css/MediaBar.scss';
import SongInfo from './SongInfo.js';
import MediaOptions from './MediaOptions.js';
import MusicPlayer from './MusicPlayer';

export default class MediaBar extends Component {
    render(){
        return(
            <div className="now-playing">
                <div className="now-playing-inner">
                    <SongInfo />
                    <MusicPlayer />
                    <MediaOptions />
                </div>
            </div>
        )
    }
}