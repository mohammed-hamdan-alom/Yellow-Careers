import axios from 'axios';

const authTokens = JSON.parse(localStorage.getItem('authTokens'));
const PROD_BASE_URL = 'https://mhalom.pythonanywhere.com/';
const DEV_BASE_URL = 'http://127.0.0.1:8000'

const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
};

if (authTokens && authTokens.access) {
    headers['Authorization'] = `Bearer ${authTokens.access}`;
}

const AxiosInstance = axios.create({
    baseURL: PROD_BASE_URL,
    timeout: 10000,
    headers: headers
})

export default AxiosInstance;
