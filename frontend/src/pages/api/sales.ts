import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const URL = 'https://rq-analytics-aoyv.onrender.com';
        const interval = req.query.interval || 'daily'; // Default to 'daily'
        const response = await axios.get(URL + `/total-sales?interval=${interval}`);
        const data = response.data;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data' });
    }
}
