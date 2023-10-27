import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUpload } from "@fortawesome/free-solid-svg-icons";
import "./buttonStyles.css";
import wallpaperImage from "./recipebackground_create.png";
import "./createStyles.css";

export default function Create() {
  const navigate = useNavigate();
  const [isPosted, setIsPosted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); 

  // Get the JWT token from local storage
  const token = localStorage.getItem("token");  
  const decodedToken = jwt_decode(token); 
  const username = decodedToken.username;
  
  const [form, setForm] = useState({
    image: "",
    name: "",
    serving: "",
    preptime: "",
    calories: "",
    level: "",
    steps: [""],
    authornotes: "",
    author: username,
  });

  const [showGoHomeButton, setShowGoHomeButton] = useState(false);

  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  function handleImageChange(e) {
    const imageFile = e.target.files[0];
    setSelectedImage(URL.createObjectURL(imageFile)); // Store the image URL in state
    updateForm({ image: imageFile });
  }

  function handleAddStep() {
    setForm((prev) => ({ ...prev, steps: [...prev.steps, ""] }));
  }

  function handleStepChange(index, value) {
    setForm((prev) => {
      const updatedSteps = [...prev.steps];
      updatedSteps[index] = value;
      return { ...prev, steps: updatedSteps };
    });
  }
 
  function handleDeleteStep(index) {
    setForm((prev) => {
      const updatedSteps = [...prev.steps];
      updatedSteps.splice(index, 1); // Remove the step at the given index
      return { ...prev, steps: updatedSteps };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    setIsPosted(true);
    setShowGoHomeButton(true);

    const formData = new FormData();
    formData.append("image", form.image);
    formData.append("name", form.name);
    formData.append("serving", form.serving);
    formData.append("preptime", form.preptime);
    formData.append("calories", form.calories);
    formData.append("level", form.level);
    form.steps.forEach((step, index) => {
      formData.append(`steps[${index}]`, step);
    });
    formData.append("authornotes", form.authornotes);
    formData.append("author", form.author);

    try {
      const response = await fetch("http://localhost:5000/record/add", {
        method: "POST",
        headers: {
          Authorization: `${token}`,
        },
        body: formData,
      });

      console.log(response)
  
      if (response.ok) {
        const data = await response.json();
        console.log("Recipe added:", data);
        navigate("/");
      } else {
        const errorData = await response.json();
        if (response.status === 401 && errorData.error === "Invalid token.") {
          console.error("Authentication failed:", errorData.error);
          window.alert("Authentication failed. Please log in again.");
        } else {
          console.error("Failed to add recipe:", errorData.error);
          window.alert("An error occurred while adding the recipe.");
        }
      }
    } catch (error) {
      console.error("Error:", error.message);
      window.alert("An error occurred while adding the recipe.");
    }
  }

  const containerStyle = {
    backgroundImage: `url(${wallpaperImage})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundAttachment: "fixed",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <Container fluid className="create-container">
      {showGoHomeButton && (
        <button
          className="custom-button rounded-circle"
          onClick={() => navigate("/")}
        >
          <FontAwesomeIcon icon={faHome} />
        </button>
      )}
      <Card className="create-card">
        <div className="create-form">
          <h2 className="create-title">Create Your Culinary Masterpiece</h2>
          <br></br>
          <form onSubmit={onSubmit} encType="multipart/form-data">
          <div className="form-group">
              <label htmlFor="image" className="custom-file-upload">
                <FontAwesomeIcon icon={faUpload} className="upload-icon" />
                Choose Recipe Image
                <input
                  type="file"
                  className="form-control-file"
                  id="image"
                  name="image"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            {selectedImage && (
              <div className="image-thumbnail">
                <img src={selectedImage} alt="Selected Recipe" />
              </div>
            )}
            <br></br>
              <div className="form-group">
              <Card.Text htmlFor="name"> Recipe Name</Card.Text>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={form.name}
                  onChange={(e) => updateForm({ name: e.target.value })}
                />
              </div>
              <br></br>
              <div className="centered-inputs">
              <div className="form-group">
              <Card.Text htmlFor="serving"> Serving(s)</Card.Text>
              <div className="input-with-buttons d-flex">
              <button
                type="button"
                className="btn btn-add input-btn"
                onClick={() =>
                  updateForm({ serving: parseInt(form.serving) + 1 })
                }
              >
                +
              </button>
                <input
                  type="number"
                  className="form-control text-center no-spin"
                  value={form.serving}
                  onChange={(e) => updateForm({ serving: e.target.value })}
                />
                <button
                  type="button"
                  className="btn btn-delete input-btn"
                  onClick={() =>
                    updateForm({ serving: Math.max(0, parseInt(form.serving) - 1) })
                  }
                >
                  -
                </button>
              </div>
              </div>
              <br></br>
                <div className="form-group">
                <Card.Text htmlFor="preptime">Prep Time (min)</Card.Text>
                <div className="input-with-buttons d-flex">
                <button
                  type="button"
                  className="btn btn-add input-btn"
                  onClick={() =>
                    updateForm({ preptime: parseInt(form.preptime) + 1 })
                  }
                >
                  +
                </button>
                <input
                  type="number"
                  className="form-control text-center no-spin"
                  value={form.preptime}
                  onChange={(e) => updateForm({ preptime: e.target.value })}
                />
                <button
                  type="button"
                  className="btn btn-delete input-btn"
                  onClick={() =>
                    updateForm({ preptime: Math.max(0, parseInt(form.preptime) - 1) })
                  }
                >
                  -
                </button>
              </div>
              </div>
              <br></br>
              <div className="form-group">
              <Card.Text htmlFor="calories">Calories</Card.Text>
              <div className="input-with-buttons d-flex">
              <button
                type="button"
                className="btn btn-add input-btn"
                onClick={() =>
                  updateForm({ calories: parseInt(form.calories) + 1 })
                }
              >
                +
              </button>
              <input
                type="number"
                className="form-control text-center no-spin"
                value={form.calories}
                onChange={(e) => updateForm({ calories: e.target.value })}
              />
              <button
                type="button"
                className="btn btn-delete input-btn"
                onClick={() =>
                  updateForm({ calories: Math.max(0, parseInt(form.calories) - 1) })
                }
              >
                -
              </button>
            </div>
          </div>
        
        </div>
              <br></br>
              <br></br>
              <Card.Text className="text-center" htmlFor="difficulty">Difficulty Level</Card.Text>
              <div className={"form-group text-center"}>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="difficultyOptions"
                    id="difficultyEasy"
                    value="Easy"
                    checked={form.level === "Easy"}
                    onChange={(e) => updateForm({ level: e.target.value })}
                  />
                  <label htmlFor="difficultyEasy" className="form-check-label">Easy</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="difficultyOptions"
                    id="difficultyMedium"
                    value="Intermediate"
                    checked={form.level === "Intermediate"}
                    onChange={(e) => updateForm({ level: e.target.value })}
                  />
                  <label htmlFor="difficultyMedium" className="form-check-label">Intermediate</label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="difficultyOptions"
                    id="difficultyAdvanced"
                    value="Advanced"
                    checked={form.level === "Advanced"}
                    onChange={(e) => updateForm({ level: e.target.value })}
                  />
                  <label htmlFor="difficultyAdvanced" className="form-check-label">Advanced</label>
                </div>
                </div>
                <br></br>
                <br></br>
                <div className="form-group">
          <Card.Text htmlFor="steps">Recipe Steps</Card.Text>
          {form.steps.map((step, index) => (
            <div key={index} className="d-flex align-items-center">
            {index === form.steps.length - 1 && (
              <button
                type="button"
                className="btn btn-add mr-2"
                onClick={handleAddStep}
              >
                +
              </button>
            )}
            <input
              type="text"
              className="form-control text-center"
              value={step}
              onChange={(e) => handleStepChange(index, e.target.value)}
            />
            {index === form.steps.length - 1 ? (
              <button
                type="button"
                className="btn btn-delete ml-2"
                onClick={() => handleDeleteStep(index)}
              >
                x
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-delete-secondary ml-2"
                onClick={() => handleDeleteStep(index)}
              >
                x
              </button>
            )}
          </div>
          ))}
        </div>
                <br></br>
                <br></br>
                <div className="form-group">
                <Card.Text  htmlFor="authornotes">Author Notes (limit 100 characters)</Card.Text>
                <input
                  maxLength={100}
                  type="text"
                  className="form-control"
                  id="authornotes"
                  value={form.authornotes}
                  onChange={(e) => updateForm({ authornotes: e.target.value })}
                />
              </div>
              <br></br>
                <div className="form-group">
                <Card.Text htmlFor="author">Author</Card.Text>
                <input
                  type="text"
                  className="form-control"
                  id="author"
                  value={form.author}
                  readOnly
                  onChange={(e) => updateForm({ author: e.target.value })}
                />
              </div>
              <br></br>
              <div className="form-group update-btn">
         <input
           type="submit"
           value="Create"
           className="edit-update-btn"
         />
       </div>
          </form>
          {isPosted && (
            <p className="create-success mt-3">Your recipe has been added!</p>
          )}
        </div>
      </Card>
    </Container>
  );
}