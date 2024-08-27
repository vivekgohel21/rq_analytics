'use client';
import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';

interface ChartData {
    date: string;
    totalSales: number;
}

const TotalSalesChart: React.FC = () => {
    const [data, setData] = useState<[number, number][]>([]);
    const [interval, setInterval] = useState<string>('daily'); // Default interval
    const [subtitleText, setSubtitleText] = useState<string>('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/total-sales?interval=${interval}`);
                const result: ChartData[] = response.data;

                // Process the data to fit Highcharts format
                const chartData: [number, number][] = result.map(item => [
                    new Date(item.date).getTime(), // Convert date to timestamp
                    item.totalSales // Total sales
                ]);

                setData(chartData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [interval]);

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
            text: `Total Sales Over Time (${interval.charAt(0).toUpperCase() + interval.slice(1)})`,
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
                text: 'Total Sales',
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
            name: 'Total Sales',
            data: data
        }]
    };

    return (
        <div className="p-4 rounded-lg border border-gray-700 h-full">
            <div className="flex justify-between mb-4">
                <button
                    className={`px-3 py-1 rounded-lg border ${interval === 'daily' ? 'bg-purple-600 text-white' : 'text-white'}`}
                    onClick={() => setInterval('daily')}
                >
                    Daily
                </button>
                <button
                    className={`px-3 py-1 rounded-lg border ${interval === 'monthly' ? 'bg-purple-600 text-white' : 'text-white'}`}
                    onClick={() => setInterval('monthly')}
                >
                    Monthly
                </button>
                <button
                    className={`px-3 py-1 rounded-lg border ${interval === 'quarterly' ? 'bg-purple-600 text-white' : 'text-white'}`}
                    onClick={() => setInterval('quarterly')}
                >
                    Quarterly
                </button>
                <button
                    className={`px-3 py-1 rounded-lg border ${interval === 'yearly' ? 'bg-purple-600 text-white' : 'text-white'}`}
                    onClick={() => setInterval('yearly')}
                >
                    Yearly
                </button>
            </div>
            <HighchartsReact
                highcharts={Highcharts}
                options={options}
            />
        </div>
    );
};

export default TotalSalesChart;
