import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import swal from 'sweetalert2'

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens"))
            : null
    );
    
    const [user, setUser] = useState(() => 
        localStorage.getItem("authTokens")
            ? jwtDecode(localStorage.getItem("authTokens").access)
            : null
    );

    const [loading, setLoading] = useState(true);

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
            setUser(jwtDecode(data.access));
            localStorage.setItem("authTokens", JSON.stringify(data));
            navigate("/job-seeker/dashboard");
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

    // const registerUser = async (email, password, password2, userType, additionalFields) => {
    //     let url = '';
    //     let successMessage = '';
    //     let requestBody = { email, password, password2, ...additionalFields };
    
    // if (userType === 'employer') {
    //     url = "http://127.0.0.1:8000/api/employer-register/";
    //     successMessage = "Employer registration successful. Proceed to login.";
    // } else if (userType === 'jobseeker') {
    //     url = "http://127.0.0.1:8000/api/jobseeker-register/";
    //     successMessage = "Job Seeker registration successful. Proceed to login.";
    // }
        
    //     const response = await fetch(url, {
    //         method: "POST",
    //         headers: {
    //             "Content-Type":"application/json"
    //         },
    //         body: JSON.stringify(requestBody)
    //     });
    //     console.log(response.body)
    //     if(response.status === 201){
    //         navigate("/login");
    //         swal.fire({
    //             title: successMessage,
    //             icon: "success",
    //             toast: true,
    //             timer: 6000,
    //             position: 'top-right',
    //             timerProgressBar: true,
    //             showConfirmButton: false,
    //         });
    //     } else {
    //         swal.fire({
    //             title: "An Error Occurred " + response.status,
    //             icon: "error",
    //             toast: true,
    //             timer: 6000,
    //             position: 'top-right',
    //             timerProgressBar: true,
    //             showConfirmButton: false,
    //         });
    //     }
    // };

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
        registerJobSeeker,
        loginUser,
        logoutUser,
    };

    useEffect(() => {
        if (authTokens) {
            setUser(jwtDecode(authTokens.access));
        }
        setLoading(false);
    }, [authTokens, loading]);

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};
