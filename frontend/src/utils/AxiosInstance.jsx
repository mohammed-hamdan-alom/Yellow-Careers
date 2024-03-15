import axios from 'axios';

const authTokens = JSON.parse(localStorage.getItem('authTokens'));
const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};

if (authTokens && authTokens.access) {
    headers['Authorization'] = `Bearer ${authTokens.access}`;
}

const AxiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    timeout:10000,
    headers: headers
})

export default AxiosInstance;