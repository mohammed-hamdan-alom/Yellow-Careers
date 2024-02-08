import axios from "axios";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import { useContext } from 'react';
import AuthContext from "../context/AuthContext"

const baseURL = "http://localhost:8000/api"

const useAxios = () => {
  const { authTokens, setUser, setAuthTokens } = useContext(AuthContext)
  const axiosInstance = axios.create({
    baseURL,
    headers: {Authorization: `Bearer ${authTokens?.access}`}
  })

  axiosInstance.interceptors.request.use(async req => {
    const user = jwtDecode(authTokens.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1
    
    if (isExpired()) return req

    const response = await axios.post(`${baseURL}/token/refresh/`, {
      refresh: authTokens.refresh
    }) 
    localStorage.setItem("authToken", JSON.stringify(response.data))

    setAuthTokens(response.data)
    setUser(jwtDecode(response.data.access))

    req.headers.Authorization = `Bearer ${response.data.access}`
    return req
  })

  return axiosInstance
}

export default useAxios;