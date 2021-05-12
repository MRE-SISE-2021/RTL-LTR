import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

class ComboChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      xAxis: props.xAxis,
      yAxis: props.yAxis,
      title: props.title,
      label: props.label,
    };
  }
  componentWillReceiveProps(propsIncoming) {
    this.setState({
      xAxis: propsIncoming.xAxis,
      yAxis: propsIncoming.yAxis,
    });
  }
  render() {
    const options = {
      title: {
        text: this.state.title,
      },
      xAxis: {
        categories: this.state.xAxis,
      },
      colors: ["blue"],
      //   labels: {
      //     items: [
      //       {
      //         html: "Total fruit consumption",
      //         style: {
      //           left: "50px",
      //           top: "18px",
      //           color: (Highcharts.theme && Highcharts.theme.textColor) || "black",
      //         },
      //       },
      //     ],
      //   },
      series: [
        {
          type: "column",
          name: this.state.label,
          data: this.state.yAxis,
        },
        // {
        //   type: "column",
        //   name: "John",
        //   data: [2, 3, 5, 7, 6],
        // },
        // {
        //   type: "column",
        //   name: "Joe",
        //   data: [4, 3, 3, 9, 0],
        // },
        {
          type: "spline",
          name: "Average",
          data: this.state.yAxis,
          color: "#f44236",
          lineColor: "#f44236",
          marker: {
            lineWidth: 2,
            lineColor: "#f44236",
            fillColor: "#fff",
          },
        },
        // {
        //   type: "pie",
        //   name: "Total consumption",
        //   data: [
        //     {
        //       name: "Jane",
        //       y: 13,
        //       color: "#1de9b6",
        //     },
        //     {
        //       name: "John",
        //       y: 23,
        //       color: "#1dc4e9",
        //     },
        //     {
        //       name: "Joe",
        //       y: 19,
        //       color: "#A389D4",
        //     },
        //   ],
        //   center: [100, 80],
        //   size: 100,
        //   showInLegend: false,
        //   dataLabels: {
        //     enabled: false,
        //   },
        // },
      ],
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
  }
}

export default ComboChart;
