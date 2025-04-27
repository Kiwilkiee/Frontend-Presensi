import axios from 'axios'

//import js cookie
import Cookies from 'js-cookie';

import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

const Api = axios.create({
    
    //set endpoint API
    baseURL: 'https://backendi.karyaone.my.id/api',

    //set header axios
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
    }
});

Api.interceptors.response.use(function (response) {
    return response;
}, (error) => {
    if (error.response.status === 401) {
        Cookies.remove('token');
        Cookies.remove('user');
        window.location = '/';
    } else if (error.response.status === 403) {
        const previousPath = window.location.pathname;
        window.location.href = `/unauthorized?from=${encodeURIComponent(previousPath)}`;
    } else {
        return Promise.reject(error);
    }
});

Api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token') || Cookies.get('token');
    
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

Api.interceptors.response.use(function (response) {

    return response;
}, ((error) => {

    if (401 === error.response.status) {

        //remove token
        Cookies.remove('token');

        //remove user
        Cookies.remove('user');

        //remove permissions
        // Cookies.remove('permissions');

        //redirect "/"
        window.location = '/';
        
    } else if (403 === error.response.status) {

        window.location.href = '/unauthorized';
    
    }else {

        //reject promise error
        return Promise.reject(error);
    }
}));


export default Api