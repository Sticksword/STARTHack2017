import * as React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import { Destination, getDestinations } from '../data/api';

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


interface Props {
  persona: string,
  month: number,
  duration: number,
  onSelect: (destination: Destination, duration: number, month: number) => void
}

interface State {
  dataSource: object[],
  persona: string,
  month: number,
  duration: number,
  destination?: Destination
}

export default class Form extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {
      dataSource: [],
      persona: props.persona,
      month: props.month,
      duration: props.duration
    };
  }
  updateDestinations(){
    let { persona, duration, month } = this.props;
    if (!persona || !duration){
      return;
    }
    getDestinations(this.props.persona, this.props.duration, this.props.month).then((destinations) => {
      console.log('Update destinations:', destinations);
      this.setState({
        dataSource: buildDataSource(destinations, (destination) => {
          this.setState({ destination })
        })
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
  handlePersonaChange = (event: any, index: number, persona: string) => {
    this.setState({ persona })
  }
  handleMonthChange = (event: any, index: number, month: number) => {
    this.setState({ month })
  }
  handleDurationChange = (event: any, index: number, duration: number) => {
    this.setState({ duration })
  }
  handleNext = () => {
    this.props.onSelect(this.state.destination, this.state.duration, this.state.month)
  }
  render(){
    return (
      <div style={{position: 'relative', height: 200 }}>
        <div style={{position: 'absolute', left: 20, top: 50 }}>
          I want to go for
        </div>
        <SelectField
          value={this.state.duration}
          style={{position: 'absolute', width:110, left: 142, top: 36 }}
          onChange={this.handleDurationChange}>
          <MenuItem value={1} primaryText="1 day" />
          <MenuItem value={2} primaryText="2 days" />
          <MenuItem value={3} primaryText="3 days" />
          <MenuItem value={5} primaryText="5 days" />
          <MenuItem value={7} primaryText="1 week" />
          <MenuItem value={14} primaryText="2 weeks" />
        </SelectField>
        <div style={{position: 'absolute', width: 20, height: 5, left: 232, top: 72, background: '#FCFBFB' }} />
        <div style={{position: 'absolute', left: 250, top: 50 }}>
          to
        </div>
        <AutoComplete
          style={{position: 'absolute', width:220, left: 279, top: 36 }}
          hintText="a suggested city"
          dataSource={this.state.dataSource}
          filter={AutoComplete.fuzzyFilter} />
        <div style={{position: 'absolute', width: 60, height: 5, left: 448, top: 72, background: '#F9F9FA' }} />
        <div style={{position: 'absolute', left: 460, top: 50 }}>
          in
        </div>
        <SelectField
          style={{position: 'absolute', width:140, left: 490, top: 36 }}
          value={this.state.month}
          onChange={this.handleMonthChange}>
          <MenuItem value={0} primaryText="any month" />
          <MenuItem value={1} primaryText="January" />
          <MenuItem value={2} primaryText="February" />
          <MenuItem value={3} primaryText="March" />
          <MenuItem value={4} primaryText="April" />
          <MenuItem value={5} primaryText="May" />
          <MenuItem value={6} primaryText="June" />
          <MenuItem value={7} primaryText="July" />
          <MenuItem value={8} primaryText="August" />
          <MenuItem value={9} primaryText="September" />
          <MenuItem value={10} primaryText="October" />
          <MenuItem value={11} primaryText="November" />
          <MenuItem value={12} primaryText="December" />
        </SelectField>
        <div style={{position: 'absolute', width: 30, height: 5, left: 612, top: 72, background: '#F7F7F8' }} />
        <br />
        <RaisedButton
            style={{position: 'absolute', left: '50%', top: 120, marginLeft: -80 }}
            label="Next"
            disableTouchRipple={true}
            disableFocusRipple={true}
            primary={true}
            onTouchTap={this.handleNext} />
      </div>
    );
  }
}
