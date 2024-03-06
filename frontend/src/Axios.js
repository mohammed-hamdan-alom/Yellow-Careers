import axios from 'axios';

const AxiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000',
    timeout:10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

export default AxiosInstance;