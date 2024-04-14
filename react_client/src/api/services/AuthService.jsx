import { api } from '../axios';

const LOGIN_URL = "/auth/login";
const USER_URL = "/user";
const REGISTER_URL = "/auth/register";

const AuthService = () => {
  const getUserDetails = ({ userId }) => {
    return api.private
      .get(`${USER_URL}/${userId}`)
      .then((response) => response.data)
      .catch((error) => {
        throw error;
      });
  }

  const login = ({ formData }) => {
    return api.private
      .post(`${LOGIN_URL}`, {
        email: formData.email,
        password: formData.password,
      })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        throw error;
      });
  }

  const register = ({ formData }) => {
    return api.private
      .post(`${REGISTER_URL}`, formData)
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        throw error;
      });
  }

  const saveToken = ({ token, userDetails, roles }) => {
    if (token) {
      localStorage.setItem("authToken", token);
      localStorage.setItem("userDetails", userDetails);
      localStorage.setItem("roles", roles);
    } else {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userDetails");
      localStorage.removeItem("roles");
    }
  }

  const isAuthenticated = () => {
    const token = localStorage.getItem("authToken");
    return !!token;
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userDetails");
    localStorage.removeItem("roles");
  };

  const getCurrentUser = () => {
    const userDetails = localStorage.getItem("userDetails");
    return userDetails ? JSON.parse(userDetails) : null;
  };

  const isAdmin = () => {
    const userDetails = AuthService.getCurrentUser();
    return userDetails ? userDetails.admin === true : false;
  };

  const updateProfile = ({ userId, formData }) => {
    return api.private
      .patch(`${USER_URL}/${userId}`, formData)
      .then((response) => response.data)
      .catch((error) => {
        throw error;
      });
  }

  return {
    getUserDetails,
    login,
    register,
    saveToken,
    isAuthenticated,
    logout,
    getCurrentUser,
    isAdmin,
    updateProfile,
  };
};

export default AuthService();
