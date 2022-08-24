import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.vote.ai-studio-work.net/v1',
  headers: {
    'content-type': 'application/json',
  },
});

export default api;
