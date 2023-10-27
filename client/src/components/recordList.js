import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams, useNavigate } from "react-router";
import Card from "react-bootstrap/Card";
import { Container } from "react-bootstrap";
import wallpaperImage from "./recipebackground_viewrecord.png";
import jwt_decode from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUpload } from "@fortawesome/free-solid-svg-icons";
import './recordList.css'; 

const Record = (props) => (
  <div className="container py-4">
    <Card className="shadow p-4 mx-auto michelin-card">
    <div className="background-overlay"></div>
      <div className="text-center mb-3">
        <Card.Img src={`https://recipe-sharing-community-api.up.railway.app/uploads/${props.record.image}`} alt="Recipe" className="recipe-image" />
      </div>
      <div className="text-left mb-3">
        <Card.Title className="michelin-title">
          {props.record.name}
        </Card.Title>
        <hr />
        <Card.Text style={{ fontFamily: 'Arial', color: '#ffffff' }}>
          <strong style={{ color: '#FF5A5F' }}>Servings:</strong> {props.record.serving}
        </Card.Text>
        <Card.Text style={{ fontFamily: 'Arial', color: '#ffffff' }}>
          <strong style={{ color: '#FF5A5F' }}>Prep Time:</strong> {props.record.preptime} minutes
        </Card.Text>
        <Card.Text style={{ fontFamily: 'Arial', color: '#ffffff' }}>
          <strong style={{ color: '#FF5A5F' }}>Calories:</strong> {props.record.calories}
        </Card.Text>
        <Card.Text style={{ fontFamily: 'Arial', color: '#ffffff' }}>
          <strong style={{ color: '#FF5A5F' }}>Difficulty Level:</strong> {props.record.level}
        </Card.Text>
        <Card.Text style={{ fontFamily: 'Arial', color: '#ffffff', textAlign: 'left' }}>
          <strong style={{ color: '#FF5A5F', fontSize: '1.1em', marginBottom: '0.5em', display: 'block' }}>Steps:</strong>
          {props.record.steps && props.record.steps.length > 0 ? (
            <ul style={{ listStyle: 'decimal', marginLeft: '1.5em', marginBottom: '1em' }}>
              {props.record.steps.map((step, index) => (
                <li key={index} style={{ fontSize: '0.9em', marginBottom: '0.5em' }}>{step}</li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: '0.9em', color: '#999' }}>No steps available</p>
          )}
        </Card.Text>
        <Card.Text style={{ fontFamily: 'Arial', color: '#ffffff' }}>
          <strong style={{ color: '#FF5A5F' }}>Author's Notes:</strong> <br /> {props.record.authornotes}
        </Card.Text>
        <br />
        </div>
      <div className="text-center">
        {props.isCurrentUserAuthor ? (
          <>
            <Link className="btn btn-primary me-2 michelin-btn michelin-btn-secondary" to={`/edit/${props.record._id}`}>Edit</Link>
            <button className="btn btn-danger michelin-btn" onClick={() => { props.deleteRecord(props.record._id); }}>
              Delete
            </button>
          </>
        ) : (
          <>
            <button className=" me-2 michelin-button-disabled" disabled>Edit</button>
            <button className="michelin-button-disabled" disabled>Delete</button>
          </>
        )}
      </div>
    </Card>
  </div>
);

export default function RecordList() {
  const params = useParams();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const token = localStorage.getItem("token");  // Get the JWT token from local storage

  // This method fetches the records from the database.
  useEffect(() => {
    async function getRecords() {
      const id = params.id.toString();
      const response = await fetch(`https://recipe-sharing-community-api.up.railway.app/record/`);

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
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

      if (token) {
        const decodedToken = jwt_decode(token);
        setCurrentUser(decodedToken);
      }

      setRecords([record]);
    }

    getRecords();

    return;
  }, [params.id, navigate, token]);

  // This method will delete a record
  async function deleteRecord(id) {
    try {
      await fetch(`https://recipe-sharing-community-api.up.railway.app/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `${token}`,
        },
      });

      const updatedRecords = records.filter((el) => el._id !== id);
      setRecords(updatedRecords);
    } catch (error) {
      console.error(error);
      window.alert("Failed to delete the record");
    }
  }

  // This method will map out the records on the table
  function renderRecords() {
    return records.map((record) => {
      const isCurrentUserAuthor = currentUser && currentUser.username === record.author;
      
      return (
        <Record
          record={record}
          deleteRecord={() => deleteRecord(record._id)}
          isCurrentUserAuthor={isCurrentUserAuthor}
          key={record._id}
        />
      );
    });
  }

  // This will display the table with the records of individuals.
  return (
    <Container fluid className="container-style">
      <button
          className="custom-button-recordList rounded-circle"
          onClick={() => navigate("/")}
        >
          <FontAwesomeIcon icon={faHome} />
        </button>
      <div className="record-list">
        {records.length > 0 ? (
          renderRecords()
        ) : (
          <div className="no-recipes">
            <p>Recipe Deleted</p>
          </div>
        )}
      </div>
    </Container>
  );
}