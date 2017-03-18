import * as React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import MenuItem from 'material-ui/MenuItem';
import Chip from 'material-ui/Chip';
import { Destination, getDestinations } from '../data/api';

import '../styles/recommendations.styl'

function buildDataSource(destinations: Destination[], onSelect: (destination: Destination) => void){
  return destinations.map(destination => ({
    id: destination.id,
    text: destination.name,
    value: (
      <MenuItem
        primaryText={destination.name}
        secondaryText={`~ ${destination.total_expense}€`}
        onClick={() => onSelect(destination) } />
    )
  }));
}

function buildRecommendations(destinations: Destination[], persona: string) {
  return [
    { title: 'Under 300€', destinations: destinations },
    { title: 'Under 500€', destinations: destinations },
    { title: 'Under 1000€', destinations: destinations }
  ]
}


interface Props {
  persona: string,
  duration: number,
  month: number,
  onSelectDestination: (destination: Destination) => void
}

interface State {
  dataSource?: object[],
  recommendations?: {
    title: string,
    destinations: Destination[]
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
      this.setState({ dataSource: null, recommendations: null });
      return;
    }
    getDestinations(this.props.persona, this.props.duration, this.props.month).then((destinations) => {
      console.log('Update destinations:', destinations);
      this.setState({
        dataSource: buildDataSource(destinations, this.props.onSelectDestination),
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
    if (!this.state.dataSource || !this.state.recommendations){
      return (
        <div>Loading...</div>
      )
    }
    return (
      <div>
        <div>
          <AutoComplete
            floatingLabelText="Enter your destination"
            hintText="Somewhere over the rainbow..."
            dataSource={this.state.dataSource}
            filter={AutoComplete.fuzzyFilter} />
          <br />
        </div>
        <br />
        Recommended for you:
        <div className="recommendations">
          {this.state.recommendations.map((recommendation, idx) => (
            <div key={idx} className="recommendations__recommendation">
              <span>{recommendation.title}</span>
              <span className="recommendations__chips">
                {recommendation.destinations.map(destination => (
                  <Chip key={destination.id} className="recommendations__chip"
                    onTouchTap={() => this.props.onSelectDestination(destination) }>
                    {destination.name}
                  </Chip>
                ))}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
