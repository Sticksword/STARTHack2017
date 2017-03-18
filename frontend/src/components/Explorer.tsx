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
  destination?: Destination
}

export default class Explorer extends React.Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {
      finished: false,
      stepIndex: 0,
      persona: 'student', // TODO: From Auth
      duration: 5,
      month: 0
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
  handleProfileSelection = (persona: string, duration: number, month: number) => {
    this.setState({ persona, duration, month, stepIndex: 1 })
  }
  handleDestinationSelection = (destination: Destination) => {
    this.setState({ destination, stepIndex: 2 });
  }
  render() {
    const { finished, stepIndex } = this.state;
    return (
      <div className="explorer">
        <Stepper activeStep={stepIndex} orientation="vertical">
          <Step>
            <StepButton onClick={() => this.setState({ stepIndex: 0 }) }>
              Specify your profile
            </StepButton>
            <StepContent>
              <ProfileForm
                persona={this.state.persona}
                duration={this.state.duration}
                month={this.state.month}
                onSelect={this.handleProfileSelection} />
            </StepContent>
          </Step>
          <Step>
            <StepButton onClick={() => this.setState({ stepIndex: 1 }) }>
              Pick a destination
            </StepButton>
            <StepContent>
              <DestinationPicker
                persona={this.state.persona}
                duration={this.state.duration}
                month={this.state.month}
                onSelectDestination={this.handleDestinationSelection} />
            </StepContent>
          </Step>
          <Step>
            <StepButton>Learn more about the journey</StepButton>
            <StepContent>
              <Info
                persona={this.state.persona}
                duration={this.state.duration}
                month={this.state.month}
                destination={this.state.destination}  />
            </StepContent>
          </Step>
        </Stepper>
      </div>
    );
  }
}
