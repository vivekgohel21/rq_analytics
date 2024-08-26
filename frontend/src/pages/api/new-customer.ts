import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const API = 'https://rq-analytics-aoyv.onrender.com';
  try {
    const response = await axios.get(API + '/new-customers');
    const data = response.data;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data' });
  }
}
