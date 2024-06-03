import axios from 'axios';
import { HOST_API } from '../config';

// Create an instance of Axios
const axiosInstance = axios.create({
  baseURL: HOST_API,
});


export default axiosInstance;
