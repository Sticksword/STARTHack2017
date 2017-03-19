import * as React from 'react';
import { Link } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { getBankAccountInfo } from '../data/api'

import '../styles/base.styl'


interface Props {
}

interface State {
  balance: number
}

export default class Table extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {
      balance: 0
    }
  }
  componentWillMount(){
    getBankAccountInfo().then(balance => this.setState({ balance }) );
  }
  render(){
    return (
      <MuiThemeProvider>
        <div>
          <header className="header">
            <div className="header__title">Smart Columbus</div>
            <div className="header__subtitle">Only real data shows you the whole picture</div>
            {this.state.balance > 0 ? (
              <div className="balance">Balance: {this.state.balance}€</div>
            ):null}
          </header>
          <main>
            {this.props.children}
          </main>
        </div>
      </MuiThemeProvider>
    );
  }
}
