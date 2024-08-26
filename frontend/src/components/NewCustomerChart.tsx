'use client';
import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';

interface ChartData {
    date: string;
    cumulativeTotal: number;
}

const NewCustomersChart: React.FC = () => {
    const [data, setData] = useState<[number, number][]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/new-customers');
                const result: ChartData[] = response.data;

                // Process the data to fit Highcharts format
                const chartData = result.map(item => [
                    new Date(item.date).getTime(), // Convert date to timestamp
                    item.cumulativeTotal // Cumulative total
                ]);

                setData(chartData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const options: Highcharts.Options = {
        chart: {
            zoomType: 'x',
            type: 'area',
            backgroundColor: 'transparent', // No background color
        },
        title: {
            text: 'Cumulative New Customers Over Time',
            align: 'left',
            style: { color: '#ffffff' }, // White text
        },
        subtitle: {
            text: document.ontouchstart === undefined ?
                'Click and drag in the plot area to zoom in' :
                'Pinch the chart to zoom in',
            align: 'left',
            style: { color: '#ffffff' }, // White text
        },
        xAxis: {
            type: 'datetime',
            title: {
                text: 'Date',
                style: { color: '#ffffff' }, // White text
            },
            labels: {
                style: { color: '#ffffff' }, // White text
            }
        },
        yAxis: {
            title: {
                text: 'Cumulative Total',
                style: { color: '#ffffff' }, // White text
            },
            labels: {
                style: { color: '#ffffff' }, // White text
            }
        },
        legend: {
            enabled: false
        },
        plotOptions: {
            area: {
                marker: {
                    radius: 2
                },
                lineWidth: 1,
                color: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, 'rgb(199, 113, 243)'],
                        [0.7, 'rgb(76, 175, 254)']
                    ]
                },
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                threshold: null
            }
        },
        series: [{
            name: 'Cumulative New Customers',
            data: data
        }]
    };

    return (
        <div className="p-4 rounded-lg border border-gray-700 h-full">
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </div>
    );
};

export default NewCustomersChart;
