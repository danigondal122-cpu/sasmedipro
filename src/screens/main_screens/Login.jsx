import React from "react";
import { useState } from "react";
import { useLogin } from "../../contexts/login_context"; // import your LoginProvider hook
import ErrorBox from "../../components/ErrorAlertBox";

export default function Login() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    login,
    isPasswordVisible,
    togglePassword,
    loading,
  } = useLogin(); // get context values

  const [error, setError] = useState("");

    const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // clear previous errors

    try {
      // We modify login to throw an error message instead of alert
      await login(); 
      setError(""); // clear error on success
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="background"></div>

      <div className="login-container">
        <h1 className="welcome-text">Welcome back!</h1>

        {/* Display error box */}
        {error && <ErrorBox message={error} onClose={() => setError("")} />}

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type={isPasswordVisible ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="button" onClick={togglePassword}>
            {isPasswordVisible ? "Hide" : "Show"} Password
          </button>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
