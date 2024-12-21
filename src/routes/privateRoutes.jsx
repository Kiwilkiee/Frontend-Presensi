//import cookie
import Cookies from "js-cookie";

import { Navigate } from "react-router-dom";

function privateRoutes({ children, allowedRoles }) {

    const token = Cookies.get('token');
    const userRole = localStorage.getItem('role');

    console.log("Token:", token);
    console.log("User Role:", userRole);
    console.log("Allowed Roles:", allowedRoles);
    

    if (!token) {
        return <Navigate to="/" />
    }

    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" />; // Arahkan ke halaman unauthorized jika role tidak sesuai
    }

    return children;
    

}

export default privateRoutes;