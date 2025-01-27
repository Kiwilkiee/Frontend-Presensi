import axios from 'axios'

//import js cookie
import Cookies from 'js-cookie';

const Api = axios.create({
    

    //set endpoint API
    baseURL: 'http://127.0.0.1:8000/api',

    //set header axios
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
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
        
    } else if(403 === error.response.status) {
    
        //redirect "/forbidden"
        window.location = '/forbidden';

    }else {

        //reject promise error
        return Promise.reject(error);
    }
}));


export default Api