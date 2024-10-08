import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const API = 'https://rq-analytics-aoyv.onrender.com';
  try {
    // Replace with the correct endpoint for fetching cohort lifetime value
    const response = await axios.get(API + '/cohort-lifetime-value');
    const data = response.data;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cohort lifetime value data' });
  }
}
