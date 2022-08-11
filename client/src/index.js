import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import musicStore from './store.js'
import MainContainer from './components/MainContainer.js'
import registerServiceWorker from './registerServiceWorker.js';
import './css/index.css';

const history = createBrowserHistory();

render(
    <Provider store={musicStore}>
      <BrowserRouter>
        <Routes><Route path='*' element={<MainContainer history={history}/>}></Route></Routes>
        {/* <MainContainer /> */}
      </BrowserRouter>
    </Provider>,
    document.getElementById('root')
);

registerServiceWorker();
