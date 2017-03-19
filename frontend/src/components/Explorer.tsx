import * as React from 'react';
import {
  Step,
  Stepper,
  StepButton,
  StepContent,
} from 'material-ui/Stepper';
import { Destination } from '../data/api';
import DestinationPicker from './DestinationPicker';
import ProfileForm from './ProfileForm';
import Info from './Info';

import '../styles/explorer.styl'


interface Props {
}

interface State {
  finished: boolean,
  stepIndex: number,
  persona?: string,
  duration: number,
  month: number,
  destination?: Destination,
  suggestDestination: boolean
}

export default class Explorer extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {
      finished: false,
      stepIndex: 0,
      persona: 'student', // TODO: From Auth
      duration: 5,
      month: 0,
      suggestDestination: false
    }
  }
  handleNext = () => {
    const { stepIndex } = this.state;
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 2,
    });
  }
  handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({ stepIndex: stepIndex - 1 });
    }
  }
  handleProfileSelection = (destination: Destination, duration: number, month: number) => {
    this.setState({ destination, duration, month, stepIndex: 1, suggestDestination: !destination })
  }
  handleDestinationSelection = (destination: Destination) => {
    this.setState({ destination, stepIndex: 2 });
  }
  render() {
    const { stepIndex } = this.state;
    return (
      <div className="explorer">
        <Stepper activeStep={stepIndex} orientation="horizontal">
          {this.renderSteps()}
        </Stepper>
        {this.state.stepIndex == 0 ? (
          <ProfileForm
            persona={this.state.persona}
            duration={this.state.duration}
            month={this.state.month}
            onSelect={this.handleProfileSelection} />
        ) : null}
        {(this.state.suggestDestination && this.state.stepIndex == 1) ? (
          <DestinationPicker
            persona={this.state.persona}
            duration={this.state.duration}
            month={this.state.month}
            onSelectDestination={this.handleDestinationSelection} />
        ) : null}
        {(this.state.suggestDestination && this.state.stepIndex == 2) || (!this.state.suggestDestination && this.state.stepIndex == 1) ? (
          <Info
            persona={this.state.persona}
            duration={this.state.duration}
            month={this.state.month}
            destination={this.state.destination}
            onIncreaseDays={ () => this.setState({ duration: this.state.duration+1 }) }
            onDecreaseDays={ () => this.setState({ duration: this.state.duration-1 }) } />
        ) : null}
      </div>
    );
  }
  renderSteps = () => {
    return [
      this.renderProfileStep(),
      this.state.suggestDestination ? this.renderSuggestionsStep() : null,
      this.renderInfoStep()
    ].filter(_ => !!_)
  }
  renderProfileStep = () => {
    let daysText = (this.state.stepIndex > 0) ? `${this.state.duration} day ` : ''
    return (
      <Step key="a">
        <StepButton onClick={() => this.setState({ stepIndex: 0 }) }>
          {(this.state.destination && !this.state.suggestDestination)
            ? `Your ${daysText}journey to ${this.state.destination.name}`
            : `Your ${daysText}journey`}
        </StepButton>
      </Step>
    );
  }
  renderSuggestionsStep = () => {
    return (
      <Step key="b">
        <StepButton onClick={() => this.setState({ stepIndex: 1 }) }>
          {(this.state.destination)
            ? `to ${this.state.destination.name}`
            : 'to the perfect destination'}
        </StepButton>
      </Step>
    );
  }
  renderInfoStep = () => {
    return (
      <Step key="c">
        <StepButton>
          with the actual math for it
        </StepButton>
      </Step>
    );
  }
}
