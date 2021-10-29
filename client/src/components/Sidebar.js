import React, {Component} from 'react';
import '../css/Sidebar.scss';
import SidebarContent from './SidebarContent.js';

export default class Sidebar extends Component {
    render() {
        return (
            <div className="sidebar">
                <SidebarContent />
            </div>
        );
    }
}