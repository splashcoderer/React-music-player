import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import musicStore from './store.js'
import MainContainer from './components/MainContainer.js'
import registerServiceWorker from './registerServiceWorker.js';
import './css/index.css';

render(
    <Provider store={musicStore}>
      <MainContainer />
    </Provider>,
    document.getElementById('root')
);

registerServiceWorker();
