import * as React from 'react';
import Chart from './Chart';
import { Destination, DestinationDetails, getDestaintionDetails } from '../data/api';


interface Props {
  persona: string,
  month: number,
  duration: number,
  destination: Destination
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
    if (!destination || !persona || !duration){
      this.setState({ details: null });
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
    return (
      <div>
        <div>{this.props.destination.name}: {this.props.destination.total_expense}€</div>
        <Chart expenses={this.state.details.expenses} />
        TODO: Expansions
      </div>
    );
  }
}
