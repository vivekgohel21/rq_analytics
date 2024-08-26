'use client';
import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import axios from 'axios';

interface CohortData {
    firstPurchaseMonth: string;
    averageCustomerLifetimeValue: number;
}

const CohortLifetimeValueChart: React.FC = () => {
    const [categories, setCategories] = useState<string[]>([]);
    const [data, setData] = useState<number[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/cohort-lifetime-value');
                const result: CohortData[] = response.data;

                // Format date as "Jan '22"
                const formatDate = (dateString: string): string => {
                    const date = new Date(dateString);
                    const options: Intl.DateTimeFormatOptions = { year: '2-digit', month: 'short' };
                    return new Intl.DateTimeFormat('en-US', options).format(date);
                };

                // Extract categories and data for the chart
                const categories = result.map(item => formatDate(item.firstPurchaseMonth));
                const data = result.map(item => item.averageCustomerLifetimeValue);

                setCategories(categories);
                setData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const options: Highcharts.Options = {
        chart: {
            type: 'column',
            backgroundColor: 'transparent', // No background color
        },
        title: {
            text: 'Customer Lifetime Value by Cohort',
            align: 'left',
            style: { color: '#ffffff' }, // White text
        },
        xAxis: {
            categories: categories,
            title: {
                text: 'Cohort (First Purchase Month)',
                style: { color: '#ffffff' }, // White text
            },
            labels: {
                style: { color: '#ffffff' }, // White text
            }
        },
        yAxis: {
            title: {
                text: 'Average Customer Lifetime Value',
                style: { color: '#ffffff' }, // White text
            },
            labels: {
                style: { color: '#ffffff' }, // White text
            }
        },
        series: [{
            name: 'Lifetime Value',
            data: data,
            type: 'column',
            colorByPoint: true, // Allows different colors per bar
            colors: [
                '#d32f2f', // Red
                '#7b1fa2', // Purple
                '#303f9f', // Indigo
                '#0288d1', // Light Blue
                '#00796b', // Teal
                '#388e3c', // Green
                '#fbc02d', // Yellow
                '#ffa000', // Amber
                '#f57c00', // Orange
                '#e64a19', // Deep Orange
            ],
        }],
        plotOptions: {
            column: {
                borderRadius: '10px',
                dataLabels: {
                    enabled: true,
                    format: '{y:.2f}' // Remove USD and dollar symbol
                }
            }
        },
        tooltip: {
            pointFormat: 'Lifetime Value: <b>{point.y:.2f}</b>'
        }
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

export default CohortLifetimeValueChart;
