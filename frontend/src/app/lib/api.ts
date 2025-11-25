import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

export const apiSiswa = {
  get: async (endpoint: string) => {
    const res = await fetch(`http://localhost:5000/api${endpoint}`, {
      cache: 'no-cache',
    });
    return res.json();
  },

  post: async (endpoint: string, body: any) => {
    const res = await fetch(`http://localhost:5000/api${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return res.json();
  },
};
