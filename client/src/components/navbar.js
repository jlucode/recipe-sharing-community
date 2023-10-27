import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { NavLink, useNavigate } from "react-router-dom";
import './navbarbuttonStyles.css';

export default function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const [recipeButtonClicked, setRecipeButtonClicked] = useState(false);
  const [loginButtonClicked, setLoginButtonClicked] = useState(false);
  const [logoutButtonClicked, setLogoutButtonClicked] = useState(false);
  const navigate = useNavigate();

  // Check token and set isAuthenticated on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, [setIsAuthenticated]);

  const handleRecipeButtonClick = () => {
    navigate("/create");
    setRecipeButtonClicked(true);
  };

  const handleLoginButtonClick = () => {
    setLoginButtonClicked(true);
  };

  const handleLogoutButtonClick = () => {
    setLogoutButtonClicked(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <NavLink className="navbar-brand" to="/"></NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink
                className={`nav-link btn btn-link navbar-oval-button recipe ${
                  recipeButtonClicked ? "clicked" : ""
                }`}
                to="/create"
                onClick={handleRecipeButtonClick}
              >
                + Recipe
              </NavLink>
            </li>
          </ul>
          <ul className="navbar-nav">
            {isAuthenticated ? (
              <li className="nav-item">
                <button
                  className={`nav-link btn btn-link navbar-oval-button logout ${
                    logoutButtonClicked ? "clicked" : ""
                  }`}
                  onClick={() => {
                    handleLogoutButtonClick();
                    handleLogout();
                  }}
                >
                  Logout
                </button>
              </li>
            ) : (
              <li className="navbar-nav">
                <NavLink
                  className={`nav-link btn btn-link navbar-oval-button login ${
                    loginButtonClicked ? "clicked" : ""
                  }`}
                  to="/login"
                  onClick={handleLoginButtonClick}
                >
                  Login
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
}