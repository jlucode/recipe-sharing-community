import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import styled from "styled-components";

const StyledContainer = styled(Container)`
  background-image: url('your-login-background-image.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledCard = styled(Card)`
  width: 40%;
`;

const StyledButton = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  position: absolute;
  top: 20px;
  left: 20px;

  &:hover {
    background-color: #0056b3;
  }
`;

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const StyledSubmitButton = styled.input`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const StyledAlert = styled.div`
  margin-top: 10px;
  background-color: #17a2b8;
  color: white;
  padding: 10px;
  border-radius: 4px;
`;

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false); // New state for error message
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("https://recipe-sharing-community-api.up.railway.app/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setIsAuthenticated(true);
        navigate("/");
      } else if (response.status === 401) {
        setShowErrorMessage(true); // Show the error message pop-up
      } else {
        console.error("Login failed:", data.error);
      }
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <StyledContainer>
      <StyledCard className="shadow p-4 mx-auto">
        <br />
        {showErrorMessage && ( // Conditionally render the error message pop-up
          <StyledAlert>
            Your username or password is incorrect. Please try again!
          </StyledAlert>
        )}
        <StyledForm>
          <StyledInput
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <StyledInput
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <StyledSubmitButton
            type="button"
            value="Login"
            onClick={handleLogin}
          />
        </StyledForm>
        <p className="text-center">
          Not yet a user? Click{" "}
          <span
            onClick={handleRegisterClick}
            style={{
              color: "#FF5A5F",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            here
          </span>{" "}
          to Register
        </p>
      </StyledCard>
    </StyledContainer>
  );
};
  
export default Login;