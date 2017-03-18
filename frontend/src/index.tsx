import * as React from 'react';
import { render } from 'react-dom';
import { Router, Route, Link, IndexRedirect, hashHistory } from 'react-router';
import * as injectTapEventPlugin from 'react-tap-event-plugin';
import App from './components/App';
import Explorer from './components/Explorer';
import Login from './components/Login';

injectTapEventPlugin();


const NoMatch = () => (
    <div>No match</div>
)

render((
  <Router history={hashHistory}>
    <Route path="/" component={App}>
      <IndexRedirect to="/explorer" />
      <Route path="login" component={Login} />
      <Route path="explorer" component={Explorer} />
      <Route path="*" component={NoMatch}/>
    </Route>
  </Router>
), document.getElementById('root'))
