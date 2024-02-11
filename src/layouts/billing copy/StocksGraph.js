import React, { createRef } from 'react';
import { Line } from 'react-chartjs-2';
import * as zoom from 'chartjs-plugin-zoom';
import { chartJsConfig, chartColors, chartDataset } from '../../chartConfig';
// With this one
// With this one
import { Chart } from 'chart.js';
import 'chartjs-plugin-zoom';
import borders from "assets/theme/base/borders";
import Card from "@mui/material/Card";

import ChartDataLabels from 'chartjs-plugin-datalabels';

import 'chartjs-adapter-date-fns'; // No need for { AdapterDateFns }
import SoftBox from 'components/SoftBox';
const { borderWidth, borderColor } = borders;


class StocksGraph extends React.Component {
    constructor(props) {
        super(props);
        this.chartRef = createRef();
    }


    updateChart = () => {
        try {

            console.log('chartRef:', this.chartRef);


            let chart = this.chartRef.current && this.chartRef.current.chartInstance;

            console.log('chartInstance:', chart);



            console.log('inside stockGraph:');

            if (!this.props.prices || this.props.prices.length === 0) {
                chart.data.labels = []; // Clear labels
                chart.data.datasets = []; // Clear datasets
                return chart.update();
            }

            const dates = this.props.prices.map((price) => price.prcdate);
            const values = this.props.prices.map((price) => price.price);
            console.log('Prices insode StockGraph:', this.props.prices);

            let chartDatasets = chart.data.datasets;

            this.props.prices.forEach((priceData, index) => {
                let stockName = priceData.tkr; // Assuming 'tkr' is the key for the stock name
                let isSelected = this.props.selectedStock === stockName;

                let chartDataset = chartDatasets.find((dataset) => dataset.label === stockName.toUpperCase());

                if (isSelected) {
                    if (chartDataset) {
                        // Only update the data, don't create a new dataset for the graph
                        chartDataset.data = this.getStockValues(priceData);
                    } else {
                        // Create a new dataset for the graph
                        chartDatasets.push(this.createChartDataset(stockName, chartColors[index], this.getStockValues(priceData)));
                    }
                } else {
                    // Remove the dataset from the graph if not selected
                    if (chartDataset) {
                        chartDatasets.splice(chartDatasets.indexOf(chartDataset), 1);
                    }
                }


                chart.update();
            });
        } catch (error) {
            console.error('Error updating chart:', error);
        }
    };

    getStockValuesOLD = (priceData) => {
        // Implement the logic to extract stock values from priceData
        // For example, assuming priceData has a property 'value', you might do:
        return priceData.price;
    };

    getStockValues = (priceData) => {
        console.log('priceData taken in getStockValues', priceData);

        if (!priceData.prcdate) {
            console.error('Error: prcdate is empty or undefined');
        }

        const formatDate = (date) => {
            if (date instanceof Date) {
              const options = { month: '2-digit', day: '2-digit', year: 'numeric' };
              return date.toLocaleDateString(undefined, options);
            } else {
              return ''; // Return an empty string or handle it in a way that makes sense for your application
            }
          };
          
        // Parse prcdate string into a Date object
        const prcDateObj = new Date(priceData.prcdate);

        const result = [{
            prcdate: formatDate(prcDateObj),
            price: parseFloat(priceData.price),
        }];

        console.log('Result from getStockValues', result);

        return result;
    };



    createChartDatasetOLD = (label, color, data) => {
        return {
            label: label,
            borderColor: color,
            data: data,
            // Additional dataset configurations if needed
        };
    };

    createChartDataset = (label, color, data) => {
        if (!Array.isArray(data)) {
          console.error('Invalid data format:', data);
          return null;
        }
      
        const formatDate = (date) => {
          if (date instanceof Date) {
            return date.toISOString(); // You may customize this format based on your needs
          } else {
            return ''; // Return an empty string or handle it in a way that makes sense for your application
          }
        };
      
        return {
          label: label,
          borderColor: color,
          data: data.map((priceData) => ({
            x: formatDate(priceData.prcdate),
            y: parseFloat(priceData.price),
          })),
          // Additional dataset configurations if needed
        };
      };
      



    createChartDataset_Correct = (label, color, data) => {
        if (!Array.isArray(data)) {
            console.error('Invalid data format:', data);
            return null; // or handle it in a way that makes sense for your application
        }
        const formatDate = (date) => {
            if (date instanceof Date) {
                const options = { month: '2-digit', day: '2-digit', year: 'numeric' };
                return date.toLocaleDateString(undefined, options);
            } else {
                return ''; // Return an empty string or handle it in a way that makes sense for your application
            }
        };
        console.log('priceData.prcdate insode createChartDatase', data);

        return {
            label: label,
            borderColor: color,
            data: data.map((priceData) => ({
                x: formatDate(priceData.prcdate), // Format the Date object to "mm/dd/yyyy"
                y: parseFloat(priceData.price),  // Convert price to a floating-point number
            })),
            // Additional dataset configurations if needed
        };
    };

    componentDidUpdate = () => {
        const chart = this.chartRef.current && this.chartRef.current.chartInstance;

        if (chart) {
            this.updateChart();
            console.log('Component updated');
        }
    };

    resetZoom = () => {
        this.chartRef.current && this.chartRef.current.chartInstance && this.chartRef.current.chartInstance.resetZoom();
    };

    render() {
        return (
          <div className={'card column'}>
            <div className='card-header'>
              <div className='card-header-title'>Graph</div>
            </div>
            <div className='card-content'>
              <Card border={`${borderWidth[12]} solid ${borderColor}`} borderRadius="lg">
                <div>
                  <Line
                    data={{
                      labels: this.props.prices.map((priceData) => new Date(priceData.prcdate).toLocaleDateString('en-US')),
                      datasets: [
                        {
                          label: this.props.prices.length > 0 ? this.props.prices[0].tkr : '',
                          data: this.props.prices.map((priceData) => priceData.price),
                          borderColor: 'rgba(75,192,192,1)',
                          borderWidth: 2,
                          fill: false,
                        },
                      ],
                    }}
                  />
                </div>
              </Card>
            </div>
          </div>
        );
      }
    }
    
    export default StocksGraph;
    