// src/contexts/LoginContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

import { ApiServices } from "../services/api_service"; // previously created ApiServices
import { ApiMethods } from "../services/api_methods";
import { useNavigate } from "react-router-dom";
import { UserModel } from "../models/UserModel";

// Create context
const LoginContext = createContext();

// Provider component
export const LoginProvider = ({ children }) => {
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Storage for token
 const [token, setToken] = useState(null);

   const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? UserModel.fromJson(JSON.parse(storedUser)) : null;
  });
  // Toggle password visibility
  const togglePassword = () => setIsPasswordVisible((prev) => !prev);

  // Demo credentials
 

  // Login with email/password
const login = async () => {
  setLoading(true);
  try {
    const response = await ApiServices.postApi(
      ApiMethods.login,
      { email, password },
      { isToken: false }
    );

    if (response.isSuccess) {
      const token = response.access_token;
      const loggedInUser = UserModel.fromJson({ ...response.data, access_token: token });
      
    //  localStorage.setItem("accessToken", token);
      localStorage.setItem("user", JSON.stringify(loggedInUser.toJson()));
      
       setUser(loggedInUser);


      setToken(token);
      navigate("/dashboard");
    } else {
      throw new Error(response.message || "Login failed");
    }
  } catch (err) {
    console.error(err);
    setError(err.message || "Login failed");
  } finally {
    setLoading(false);
  }
};




const logout = () => {
 
  setToken(null);
    setUser(null);

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

  
  navigate("/login");
};
  

  // Continue as guest
 
  return (
    <LoginContext.Provider
      value={{
        email,
        setEmail,
        password,
        setPassword,
        isPasswordVisible,
        togglePassword,
        login,
        loading,
        logout,
        user,
        token
       
       
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

// Custom hook to use login context
export const useLogin = () => useContext(LoginContext);

// Example usage in a component
/*
import React from "react";
import { useLogin } from "../contexts/LoginContext";

function LoginForm() {
  const { email, setEmail, password, setPassword, login, isPasswordVisible, togglePassword, signInWithGoogle } = useLogin();

  return (
    <form onSubmit={(e) => { e.preventDefault(); login(); }}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type={isPasswordVisible ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button type="button" onClick={togglePassword}>{isPasswordVisible ? "Hide" : "Show"} Password</button>
      <button type="submit">Login</button>
      <button type="button" onClick={signInWithGoogle}>Login with Google</button>
    </form>
  );
}
*/
