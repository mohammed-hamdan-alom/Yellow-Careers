import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert2'

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => {
        const token = localStorage.getItem("authTokens");
        return token ? JSON.parse(token) : null;
    });
    
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem("authTokens");
        return token ? jwtDecode(JSON.parse(token).access) : null;
    });

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const loginUser = async (email, password) => {
        const response = await fetch("http://127.0.0.1:8000/api/token/", {
            method: "POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email, password
            })
        });
        const data = await response.json();
        
        if(response.status === 200){
            setAuthTokens(data);

            const decodedToken = jwtDecode(data.access);
            const userObj = { ...decodedToken, userType: decodedToken.user_type };
            setUser(userObj);

            localStorage.setItem("authTokens", JSON.stringify(data));
            navigate(userObj.userType === 'job_seeker' ? "/job-seeker/dashboard" : "/employer/dashboard");
            swal.fire({
                title: "Login Successful",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });

        } else {    
            swal.fire({
                title: "Username or password does not exist",
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }
    };

    const registerJobSeeker = async (email, password, password2, first_name, last_name, other_names, dob, phone_number, nationality, sex) => {
        const response = await fetch("http://127.0.0.1:8000/api/jobseeker-register/", {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email, password, password2, first_name, last_name, other_names, dob, phone_number, nationality, sex
            })
        });
        if(response.status === 201){
            navigate("/auth/login");
            swal.fire({
                title: "Registration Successful, Login Now",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        } else {
            swal.fire({
                title: "An Error Occurred " + response.status,
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }
    };

    const registerEmployer = async (email, password, password2, company) => {
        const response = await fetch("http://127.0.0.1:8000/api/employer-register/", {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email, password, password2, company
            })
        });
        if (response.status === 201) {
            navigate("/login");
            swal.fire({
                title: "Registration Successful, Login Now",
                icon: "success",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        } else {
            swal.fire({
                title: "An Error Occurred " + response.status,
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }
    };


    let updateToken = async () => {
        let response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'refresh':authTokens?.refresh})
        })

        let data = await response.json()
        
        if (response.status === 200) {
            setAuthTokens(data)
            setUser(jwtDecode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
        } else {
            logoutUser()
        }

        if (loading) {
            setLoading(false)
        }
    }
    

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
        navigate("/");
        swal.fire({
            title: "You have been logged out...",
            icon: "success",
            toast: true,
            timer: 6000,
            position: 'top-right',
            timerProgressBar: true,
            showConfirmButton: false,
        });
    };



    const contextData = {
        user, 
        setUser,
        authTokens,
        setAuthTokens,
        updateToken,
        registerJobSeeker,
        registerEmployer,
        loginUser,
        logoutUser,
    };

    // Every 30 minutes, the token will be updated
    useEffect(() => {
        const minutes = 30;
        const tokenUpdateTimeout = setTimeout(updateToken, minutes * 60 * 1000);    
        return () => clearTimeout(tokenUpdateTimeout);
    }, [updateToken]);

    useEffect(() => {
        const tokens = localStorage.getItem("authTokens");
        if (tokens) {
            const parsedTokens = JSON.parse(tokens);
            setUser(jwtDecode(parsedTokens.access));
        } else {
            logoutUser();
        }
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};

