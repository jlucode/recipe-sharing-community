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

const StyledLink = styled.span`
  color: #FF5A5F;
  cursor: pointer;
  text-decoration: underline;
`;

const Register = ({ setIsAuthenticated }) => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await fetch("https://recipe-sharing-community-api.up.railway.app/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstname, lastname, username, password, email }),
      });
  
      if (response.ok) {
        // Registration successful, you can auto-login the user or redirect to login page
        console.log("Registration successful");
        navigate("/login");
      } else {
        console.error("Registration failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <StyledContainer>
      <StyledCard className="shadow p-4 mx-auto">
        <Card.Title className="text-center">Register</Card.Title>
          <StyledForm>
            <StyledInput
              type="text"
              placeholder="First Name"
              onChange={(e) => setFirstname(e.target.value)}
            />
            <StyledInput
              type="text"
              placeholder="Last Name"
              onChange={(e) => setLastname(e.target.value)}
            />
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
            <StyledInput
              type="text"
              placeholder="E-Mail"
              onChange={(e) => setEmail(e.target.value)}
            />
            <StyledSubmitButton
              type="button"
              value="Register"
              onClick={handleRegister}
            />
          </StyledForm>
          <p className="text-center">
          Already have an account? Click{" "}
          <StyledLink
            onClick={() => navigate("/login")}
            >
            here
          </StyledLink>{" "}
          to Log In
          </p>
      </StyledCard>
    </StyledContainer>
  );
};

export default Register;