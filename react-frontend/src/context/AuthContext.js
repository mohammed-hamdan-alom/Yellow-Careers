import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { Router, useNavigate } from 'react-router-dom';
import swal from 'sweetalert2'

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [authTokens, setAuthTokens] = useState(() => {
        const token = localStorage.getItem("authTokens");
        return token ? JSON.parse(token) : null;
    });
    
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem("authTokens");
        return token ? jwtDecode(JSON.parse(token).access) : null;
    });

    const [loading, setLoading] = useState(true);

    const userId = authTokens ? jwtDecode(authTokens.access).user_id : null;


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

    const registerUser = async (email, password, password2) => {
        const response = await fetch("http://127.0.0.1:8000/api/register/", {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                email, password, password2
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
                title: "An Error Occured " + response.status,
                icon: "error",
                toast: true,
                timer: 6000,
                position: 'top-right',
                timerProgressBar: true,
                showConfirmButton: false,
            });
        }
    };

    const updateUserProfile = async (formData) => {
        const updatedFormData = {
            ...formData,
            user_id: userId,
        };
    
        const response = await fetch(`http://127.0.0.1:8000/api/job_seeker_update/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                // If you need to send a token for authentication, include it here
                // 'Authorization': `Bearer ${authTokens.access}`,
            },
            body: JSON.stringify(updatedFormData),
        });
    
        if (response.ok) {
            const updatedUser = await response.json();
            // Update user state with updated information
            // setUser(updatedUser); // Assuming you have a setUser method to update the user state
            swal.fire("Profile Updated", "Your profile has been updated successfully.", "success");
        } else {
            swal.fire("Update Failed", "There was an error updating your profile.", "error");
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
        registerUser,
        loginUser,
        logoutUser,
        updateUserProfile,
    };

    useEffect(() => {
        const tokens = localStorage.getItem("authTokens");
        if (tokens) {
            const parsedTokens = JSON.parse(tokens);
            setUser(jwtDecode(parsedTokens.access));
        }
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};
