//import cookie
import Cookies from "js-cookie";

import { Navigate } from "react-router-dom";

function privateRoutes({ children, allowedRoles }) {

    const token = Cookies.get('token');
    const userRole = localStorage.getItem('role');

 
    if (!token) {
        return <Navigate to="/" />
    }

    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" />; 
    }

    return children;
    

}

export default privateRoutes;