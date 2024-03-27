import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { showError, showSuccess } from "@/components/Alert/alert";
import AxiosInstance from "@/utils/AxiosInstance";

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

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const loginUser = async (user) => {
    try {
      const response = await AxiosInstance.post("/api/token/", {
        email: user.email,
        password: user.password,
      });

      const data = response.data;

      if (response.status === 200) {
        setAuthTokens(data);
        const decodedToken = jwtDecode(data.access);
        const userObj = { ...decodedToken, userType: decodedToken.user_type };
        setUser(userObj);
        localStorage.setItem("authTokens", JSON.stringify(data));
        navigate(
          userObj.userType === "job_seeker"
            ? "/job-seeker/dashboard"
            : "/employer/dashboard"
        );
      } else {
        throw new Error("Username or password does not exist");
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const registerJobSeeker = async (user) => {
    try {
      const response = await AxiosInstance.post("/api/jobseeker-register/", {
        email: user.email,
        password: user.password,
        password2: user.password2,
        first_name: user.firstName,
        last_name: user.lastName,
        other_names: user.otherNames,
        dob: user.dob,
        phone_number: user.phoneNumber,
        nationality: user.nationality,
        sex: user.sex,
      });

      if (response.status === 201) {
        navigate("/auth/login");
        showSuccess("Registration Successful, Login Now");
      } 
    } catch (error) {
      console.error(error);
      throw error
    }
  };

  const registerEmployer = async (
    email,
    password,
    password2,
    firstName,
    lastName,
    otherNames,
    phoneNumber,
    company,
    isAdmin
  ) => {
    try {
      const response = await AxiosInstance.post("/api/employer-register/", {
        email: email,
        password: password,
        password2: password2,
        first_name: firstName,
        last_name: lastName,
        other_names: otherNames,
        phone_number: phoneNumber,
        company: company,
        is_company_admin: isAdmin,
      });
      if (response.status === 201) {
        navigate("/auth/login");
        showSuccess("Registration Successful, Login Now");
      } else {
        throw new Error("Error registering employer");
      }
    } catch (error) {
      throw error
    }
  };

  let updateToken = async () => {
    try {
      let response = await AxiosInstance.post("/api/token/refresh/", {
        refresh: authTokens?.refresh,
      });

      let data = response.data;

      if (response.status === 200) {
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
      } else {
        logoutUser();
      }

      if (loading) {
        setLoading(false);
      }
    } catch (error) {
      logoutUser();
    }
  };

  const logoutUser = () => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    localStorage.removeItem("hasRefreshedDashboardLayout");
    navigate("/");
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

  // Refresh token every 59 minutes
  useEffect(() => {
    const tokens = localStorage.getItem("authTokens");
    if (loading && tokens) {
      updateToken();
    }
    if (tokens) {
      const intervalId = setInterval(() => {
        updateToken();
      }, 59 * 60 * 1000);
      return () => clearInterval(intervalId);
    } else {
      logoutUser();
    }
    setLoading(false);
  }, [authTokens]);

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};