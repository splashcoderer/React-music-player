import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom';

import musicStore from './store.js'
import MainContainer from './components/MainContainer.js'
import registerServiceWorker from './registerServiceWorker.js';
import './css/index.css';

render(
    <Provider store={musicStore}>
      <BrowserRouter>
        <MainContainer />
      </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);

registerServiceWorker();
