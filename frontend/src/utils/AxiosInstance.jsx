import axios from 'axios';

const PROD_BASE_URL = 'https://mhalom.pythonanywhere.com/';

const AxiosInstance = axios.create({
    // baseURL: 'http://127.0.0.1:8000',
    baseURL: PROD_BASE_URL,
    timeout:10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
})

export default AxiosInstance;
