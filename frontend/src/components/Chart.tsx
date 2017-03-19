import * as React from 'react';
import * as ChartJS from 'chart.js'



function createData(expenses: {[key: string]: number}){
  var labels: string[] = [];
  var data: number[] = [];
  for (var expenseName in expenses) {
    labels.push(expenseName);
    data.push(expenses[expenseName]);
  }
  return {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [{
            label: 'Expenses',
            data: data
        }]
    },
    options: {
        legend: {
            display: false,
        },
        gridLines: {
          display: false
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
  };
}


interface Props {
  expenses: {
    [key: string]: number
  }
}

interface State {
}

export default class Chart extends React.Component<Props, State> {
  _element?: HTMLCanvasElement
  _chart?: ChartJS
  componentDidMount() {
    this._chart = new ChartJS(this._element, createData(this.props.expenses));
  }
  render() {
    return (
      <canvas style={{margin: 10}} height={100} ref={ref => this._element = ref }></canvas>
    )
  }
}
