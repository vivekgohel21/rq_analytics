import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Replace with the correct endpoint for fetching cohort lifetime value
    const URL = 'https://rq-analytics-aoyv.onrender.com';
    const response = await axios.get(URL + '/cohort-lifetime-value');
    const data = response.data;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cohort lifetime value data' });
  }
}
