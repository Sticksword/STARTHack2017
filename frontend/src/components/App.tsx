import * as React from 'react';
import { Link } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import '../styles/base.styl'


interface Props {
}

interface State {
}

export default class Table extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);
  }
  render(){
    return (
      <MuiThemeProvider>
        <div>
          <header className="header">
            <div className="header__title">Smart Columbus</div>
          </header>
          <main>
            {this.props.children}
          </main>
        </div>
      </MuiThemeProvider>
    );
  }
}
