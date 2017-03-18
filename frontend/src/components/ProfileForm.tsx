import * as React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';


interface Props {
  persona: string,
  month: number,
  duration: number,
  onSelect: (persona: string, duration: number, month: number) => void
}

interface State {
  persona: string,
  month: number,
  duration: number
}

export default class Form extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {
      persona: props.persona,
      month: props.month,
      duration: props.duration
    };
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
    this.props.onSelect(this.state.persona, this.state.duration, this.state.month)
  }
  render(){
    return (
      <div>
        <SelectField
          floatingLabelText="Lifestyle (TODO: via account)"
          value={this.state.persona}
          onChange={this.handlePersonaChange}>
          <MenuItem value="student" primaryText="Student" />
          <MenuItem value="young_professional" primaryText="Young Professional?" />
          <MenuItem value="young_couple" primaryText="Young Couple" />
          <MenuItem value="family" primaryText="Family" />
          <MenuItem value="high_performer" primaryText="High Performer" />
        </SelectField>
        <br />
        <SelectField
          floatingLabelText="Duration"
          value={this.state.duration}
          onChange={this.handleDurationChange}>
          <MenuItem value={1} primaryText="1 Day" />
          <MenuItem value={2} primaryText="2 Days" />
          <MenuItem value={3} primaryText="3 Days" />
          <MenuItem value={5} primaryText="5 Days" />
          <MenuItem value={7} primaryText="1 Week" />
          <MenuItem value={14} primaryText="2 Weeks" />
        </SelectField>
        <br />
        <SelectField
          floatingLabelText="Month (optional)"
          value={this.state.month}
          onChange={this.handleMonthChange}>
          <MenuItem value={0} primaryText="-" />
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
        <br />
        <RaisedButton
            label="Next"
            disableTouchRipple={true}
            disableFocusRipple={true}
            primary={true}
            onTouchTap={this.handleNext}
            style={{marginRight: 12}} />
      </div>
    );
  }
}
