import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const AutoRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get("token");
        const role = localStorage.getItem("role") || Cookies.get("role");

        if (token && role === 'admin') {
            navigate("/dashboard");
        } else if (token && role === 'karyawan') {
            navigate("/home");
        } else {
            navigate("/login");
        }
    }, []);

    return null;
};

export default AutoRedirect;
