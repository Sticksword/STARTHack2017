import * as React from 'react';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import { Tabs, Tab } from 'material-ui/Tabs';
import {List, ListItem} from 'material-ui/List';
import Chart from './Chart';
import { Destination, DestinationDetails, getDestaintionDetails } from '../data/api';

import '../styles/numbers.styl'


interface Props {
  persona: string,
  month: number,
  duration: number,
  destination: Destination,
  onIncreaseDays: () => void,
  onDecreaseDays: () => void
}

interface State {
  details?: DestinationDetails
}

export default class Info extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {
    };
  }
  updateDetails(){
    let { destination, persona, duration, month } = this.props;
    this.setState({ details: null });
    if (!destination || !persona || !duration){
      return;
    }
    getDestaintionDetails(destination, persona, duration, month).then((details) => {
      console.log('Update details:', details);
      this.setState({ details })
    }, console.error);
  }
  componentWillMount(){
    this.updateDetails();
  }
  componentDidUpdate(prevProps: any){
    if (JSON.stringify(prevProps) != JSON.stringify(this.props)){
      this.updateDetails();
    }
  }
  /*handlePersonaChange = (event: any, index: number, persona: string) => {
    this.setState({ persona })
  }*/
  render(){
    if (this.state.details == null) {
      return (
        <div>Loading...</div>
      )
    }
    let flightCost = parseInt(this.state.details.flights[0].total_price);
    let otherCost = (() => {
      var cost = 0;
      for (var p in this.state.details.expenses){
        cost += this.state.details.expenses[p]
      }
      return cost;
    })();
    let totalCost = flightCost + otherCost;
    return (
      <div style={{marginTop: 10, marginBottom: 10, position: 'relative'}}>
        <div className="numbers">
          <div style={{marginLeft: 110, marginRight:25, marginTop: 8, opacity: 0.5}}>
            Estimated cost:
          </div>
          <div className="numbers__number">
            <div className="numbers__number-text">{Math.round(flightCost)}€</div>
            <div className="numbers__number-title">getting there</div>
          </div>
          <div className="numbers__sign">+</div>
          <div className="numbers__number">
            <div className="numbers__number-text">{Math.round(otherCost)}€</div>
            <div className="numbers__number-title">being there</div>
          </div>
          <div className="numbers__sign">=</div>
          <div className="numbers__number">
            <div className="numbers__number-text">{Math.round(totalCost)}€</div>
          </div>
        </div>
        <div style={{position: 'absolute', right: 70, top: 10, fontSize: 0.9 }} onClick={this.props.onIncreaseDays}>+1 day</div>
        <div style={{position: 'absolute', right: 20, top: 10, fontSize: 0.9 }} onClick={this.props.onDecreaseDays}>-1 day</div>
        <br />
        <Tabs>
          <Tab label="Detailed expenses" >
            <Chart expenses={this.state.details.expenses} />
          </Tab>
          <Tab label="Recommendations" >
            <p>Spend your money like the locals do!</p>
            <List>
              {
                this.state.details.top_rated_local_busineses.map(business => (
                  <ListItem
                    key={business.business_name}
                    primaryText={business.business_name}
                    secondaryText={`${business.category}, usually for ${business.price}€`}
                    leftAvatar={<Avatar src={business.image_url} />} />
                ))
              }
            </List>
          </Tab>
          <Tab label="Money Hacks" >
            <div>
              {[1,2,3].map(i => (
                <img key={i} src={`./images/moneyhack${i}.png`} className="moneyhack-icon" />
              ))}
            </div>
          </Tab>
          <Tab label="Treat Yourself">
            <div>
              {[1,2,3].map(i => (
                <img key={i} src={`./images/treatyourself${i}.png`} className="moneyhack-icon" />
              ))}
            </div>
          </Tab>
        </Tabs>
      </div>
    );
  }
}
