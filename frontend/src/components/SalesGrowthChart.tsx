'use client';
import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';

interface ChartData {
    date: string;
    totalSales: number;
    growthRate: number | null;
}

const MonthlyGrowthChart: React.FC = () => {
    const [data, setData] = useState<ChartData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/sales-growth');
                const result: ChartData[] = response.data;

                // Remove the first entry
                const filteredData = result.slice(1);

                setData(filteredData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    // Format date as "Jan '22"
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { year: '2-digit', month: 'short' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    const options: Highcharts.Options = {
        chart: {
            type: 'column',
            backgroundColor: 'transparent', // No background color
        },
        title: {
            text: 'Sales Growth Rate (Monthly)',
            align: 'left',
            style: { color: '#ffffff' }, // White text
        },
        xAxis: {
            categories: data.map(item => formatDate(item.date)),
            title: {
                text: 'Date',
                style: { color: '#ffffff' }, // White text
            },
            labels: {
                style: { color: '#ffffff' }, // White text
            }
        },
        yAxis: [{
            title: {
                text: 'Growth Rate (%)',
                style: { color: '#ffffff' }, // White text
            },
            labels: {
                style: { color: '#ffffff' }, // White text
            },
            min: -100
        }],
        legend: {
            enabled: true,
            itemStyle: { color: '#ffffff' } // White text
        },
        plotOptions: {
            column: {
                borderRadius: '10px',
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
            }
        },
        series: [{
            type: 'column',
            name: 'Growth Rate (%)',
            data: data.map(item => item.growthRate ?? 0),
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

export default MonthlyGrowthChart;
