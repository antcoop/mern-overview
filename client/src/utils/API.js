import axios from 'axios';

export const login = (data) => {
  return axios.post('/login', data);
};

export const getUser = () => {
  return axios.get('/api/user');
}