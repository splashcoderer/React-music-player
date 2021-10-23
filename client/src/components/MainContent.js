import React, { Component } from 'react';
import Sidebar from './Sidebar';
import Center from './Center';
import MediaBar from './MediaBar';
import PlaylistSelect from './PlaylistSelect';
import SuccessMessage from './SuccessMessage';

class MainContent extends Component {
    render() {
        return (
            <div>
                <Sidebar />
                <Center />
                <MediaBar />
                <PlaylistSelect />
                <SuccessMessage />
            </div>
        );
    }
}

export default MainContent;
