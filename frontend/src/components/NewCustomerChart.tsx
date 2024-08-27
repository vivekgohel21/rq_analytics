'use client';
import React, { useEffect, useState } from 'react';
import Highcharts, { SeriesAreaOptions } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';

interface ChartData {
    date: string;
    cumulativeTotal: number;
}

const NewCustomersChart: React.FC = () => {
    const [data, setData] = useState<[number, number][]>([]);
    const [subtitleText, setSubtitleText] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/new-customers');
                const result: ChartData[] = response.data;

                // Process the data to fit Highcharts format
                const chartData: [number, number][] = result.map(item => [
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

    useEffect(() => {
        if (typeof document !== 'undefined') {
            setSubtitleText(document.ontouchstart === undefined
                ? 'Click and drag in the plot area to zoom in'
                : 'Pinch the chart to zoom in');
        }
    }, []);

    // Format date as "Jan '22"
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { year: '2-digit', month: 'short' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    const options: Highcharts.Options = {
        chart: {
            zooming: {
                type: 'x',
            },
            type: 'area',
            backgroundColor: 'transparent',
        },
        title: {
            text: 'Cumulative New Customers Over Time',
            align: 'left',
            style: { color: '#ffffff' },
        },
        subtitle: {
            text: subtitleText, // Use state for subtitle
            align: 'left',
            style: { color: '#ffffff' },
        },
        xAxis: {
            type: 'datetime',
            title: {
                text: 'Date',
                style: { color: '#ffffff' },
            },
            labels: {
                style: { color: '#ffffff' },
                formatter: function () {
                    return formatDate(new Date(this.value as number).toISOString());
                }
            }
        },
        yAxis: {
            title: {
                text: 'Cumulative Total',
                style: { color: '#ffffff' },
            },
            labels: {
                style: { color: '#ffffff' },
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
            type: 'area',
            name: 'Cumulative New Customers',
            data: data
        } as SeriesAreaOptions]
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
