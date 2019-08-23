import axios from 'axios'
const baseURL = 'http://localhost:3000/';

const globalAxios = axios.create({
    baseURL
});

export default globalAxios;
