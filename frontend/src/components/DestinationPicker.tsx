import * as React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import Chip from 'material-ui/Chip';
import { Destination, getDestinations } from '../data/api';

import '../styles/recommendations.styl'

function buildRecommendations(destinations: Destination[], persona: string) {
  return [
    {
      title: 'Explore something new',
      needs_credit: false,
      destinations: destinations.filter(_ => _.id == 'paris' || _.id == 'bercelona')
    },
    {
      title: 'It\'s been a couple of years…',
      needs_credit: false,
      destinations: destinations.filter(_ => _.id == 'london' || _.id == 'zurich')
    },
    {
      title: 'Or with a small credit:',
      needs_credit: true,
      destinations: destinations.filter(_ => _.id == 'nyc')
    }
  ]
}


interface Props {
  persona: string,
  duration: number,
  month: number,
  onSelectDestination: (destination: Destination) => void
}

interface State {
  recommendations?: {
    title: string,
    destinations: Destination[]
    needs_credit: boolean
  }[]
}

export default class DestinationPicker extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {
    };
  }
  updateDestinations(){
    let { persona, duration, month } = this.props;
    console.log(persona, duration, month);
    if (!persona || !duration){
      this.setState({ recommendations: null });
      return;
    }
    getDestinations(this.props.persona, this.props.duration, this.props.month).then((destinations) => {
      console.log('Update destinations:', destinations);
      this.setState({
        recommendations: buildRecommendations(destinations, this.props.persona)
      })
    }, console.error);
  }
  componentWillMount(){
    this.updateDestinations();
  }
  componentDidUpdate(prevProps: any){
    if (JSON.stringify(prevProps) != JSON.stringify(this.props)){
      this.updateDestinations();
    }
  }
  render(){
    if (!this.state.recommendations){
      return (
        <div>Loading...</div>
      )
    }
    return (
      <div>
        <br />
        <div className="recommendations">
          {this.state.recommendations.map((recommendation, idx) => (
            <div key={idx} className="recommendations__recommendation">
              <div className="recommendations__title">{recommendation.title}</div>
              <span className="recommendations__chips">
                {recommendation.destinations.map(destination => (
                  <Chip key={destination.id} className="recommendations__chip"
                    onTouchTap={() => this.props.onSelectDestination(destination) }>
                    <span>{destination.name}</span>
                    <span className="recommendations__expense">~{destination.total_expense}€</span>
                  </Chip>
                ))}
              </span>
              {recommendation.needs_credit ? (
                <div className="recommendations__credit">
                  Don't overdraw your credit card,<br /><u>get a 200€ credit</u> instead
                </div>
              ):null}
            </div>
          ))}
        </div>
      </div>
    );
  }
}
