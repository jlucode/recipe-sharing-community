import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import Container from "react-bootstrap/Container";
import "./editStyles.css"; // Import the shared styling
import wallpaperImage from "./recipebackground_edit.png";
 
export default function Edit() {
  const params = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    image: "",
    name: "",
    serving: "",
    preptime: "",
    calories: "",
    level:"",
    steps: [""],
    authornotes:"",
    author:"",
    records: [],
  });
 
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const id = params.id.toString();
      const response = await fetch(`http://localhost:5000/record/`);

      if (!response.ok) {
        const message = `An error has occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }
      const data = await response.json();
      const record = data.find((item) => item._id === params.id);

      if (!record) {
        window.alert(`Record with id ${params.id} not found`);
        navigate("/");
        return;
      }

      setForm((prevForm) => ({
      ...prevForm,
      image: record.image,
      name: record.name, 
      serving: record.serving,
      preptime: record.preptime,
      calories: record.calories,
      level: record.level,
      steps: record.steps || [""],
      authornotes:record.authornotes,
      author:record.author, 
    }));
    }

    fetchData();
  }, [params.id, navigate]);

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
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
    const formData = new FormData();
    
    if (selectedImage) {
      formData.append("image", selectedImage);
    } else if (form.image == null && form.image == undefined) {
      formData.append("image", form.image);
    }
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


    // Get the token for correct authorization
    const token = localStorage.getItem("token");  

    // This will send a post request to update the data in the database.
    await fetch(`http://localhost:5000/update/${params.id}`, {
      method: "POST",
      headers: {
          Authorization: `${token}`,
        },
      body: formData,
      })
      .then((response) => response.json())
      .then(() => {
        navigate(`/recipe/${params.id}`);
      })
      .catch((error) => {
        window.alert(error);
      });
  }
  
 return (
  <Container fluid className="edit-container">
    <Card className="edit-card">
      <div className="edit-form">
        <h2 className="edit-title">Update Your Recipe</h2>
        <br />
        
      <div className="form-group ">
        <Card.Text htmlFor="name"> Recipe Name</Card.Text>
        <input
          type="text"
          className="form-control text-center"
          id="name"
          value={form.name}
          onChange={(e) => updateForm({ name: e.target.value })}
        />
      </div>
      <br></br>
      <br></br>
      <div className="centered-inputs">
      {/* Serving(s) */}
      <div className="form-group">
        <Card.Text htmlFor="serving">Serving(s)</Card.Text>
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

      {/* Prep Time */}
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

      {/* Calories */}
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
      <div className="form-group text-center">
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
            {index === form.steps.length == 1 && (
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
        <Card.Text htmlFor="authornotes">Chef's Notes (limit 100 characters):</Card.Text>
        <input
          maxLength={100}
          type="text"
          className="form-control text-center"
          id="authornotes"
          value={form.authornotes}
          onChange={(e) => updateForm({ authornotes: e.target.value })}
        />
      </div>
      <br></br>
      <br></br>

      <div className="overlay">
            <span style={{color: '#FF7F7F'}}>Click to Change Image</span>
          </div>
        <form onSubmit={onSubmit} encType="multipart/form-data">
        <div className="form-group">
        <label htmlFor="image" className="image-upload-label">
          <img
            src={selectedThumbnail || (form.image ? `http://localhost:5000/uploads/${form.image}` : '')}
            alt="Recipe"
            className="image-preview"
          />
        </label>
        <br></br>
        <br></br>
        <input
          type="file"
          className="form-control-file"
          id="image"
          name="image"
          onChange={(e) => {
            const selectedFile = e.target.files[0];
            setSelectedThumbnail(URL.createObjectURL(selectedFile));
            setSelectedImage(selectedFile); // Create object URL for the selected image
            updateForm({ image: selectedFile }); // Update form with the selected image file
          }}
            style={{ display: 'none' }} 
          />
        </div>
        <br></br>
        <div className="form-group">
        <Card.Text htmlFor="author">Courtesy of Chef:</Card.Text>
        <input
          type="text"
          className="form-control text-center"
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
          value="Update"
          className="edit-update-btn"
        />
      </div>
    </form>
  </div>
  </Card>
  </Container>
 );
}