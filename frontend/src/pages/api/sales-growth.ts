import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const API = 'https://rq-analytics-aoyv.onrender.com';
    try {
        // Fetch the data from your backend
        const response = await axios.get(API + '/sales-growth');
        const data = response.data;

        // Transform data if necessary
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data' });
    }
}
