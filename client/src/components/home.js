import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import StarRating from './StarRating';
import { Container } from "react-bootstrap";
import "./home.css"
import RecipeSearchBar from './RecipeSearchBar';

const Record = ({ record, records, setRecords }) => {
  const calculateAverageRating = (ratings) => {
    if (ratings.length === 0) {
      return 'No ratings yet';
    }

    const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = totalRating / ratings.length;
    return averageRating.toFixed(1) + ' stars'; // Display average with one decimal place
  };

  const [averageRating, setAverageRating] = useState(calculateAverageRating(record.ratings));

  const updateAverageRating = (newRating) => {
    const updatedRecords = records.map(rec => {
      if (rec._id === record._id) {
        const newRatings = [...rec.ratings, { rating: newRating }];
        return { ...rec, ratings: newRatings };
      }
      return rec;
    });
    setRecords(updatedRecords);
    setAverageRating(calculateAverageRating(updatedRecords.find(rec => rec._id === record._id).ratings)); 
  };

  return (
    <Col md={4} style={{ marginBottom: '20px' }}>
      <Card className="record-card">
        <Link to={`/recipe/${record._id}`}>
          <div className="card-img-container">
            <Card.Img src={`https://recipe-sharing-community-api.up.railway.app/uploads/${record.image}`} alt="Recipe" />
          </div>
        </Link>
        <Card.Body>
        <Row>
          <Card.Title style={{ fontFamily: 'Palatino', color: '#ffffff', fontSize: '28px' }} className="text-center">
            {record.name}
          </Card.Title>
          <Col>
          <Card.Text style={{ fontFamily: 'Arial', color: '#ffffff', fontSize: '16px', marginBottom: '10px' }}>
            Chef: <br></br> {record.author}
          </Card.Text>
          </Col>
          <Col style={{ textAlign: 'right' }}>
              <StarRating recordId={record._id} updateAverageRating={updateAverageRating} />
              <Card.Text style={{ fontFamily: 'Arial', color: '#FF5A5F', fontSize: '16px' }}>
                {averageRating}
              </Card.Text>
          </Col>
          </Row>
          </Card.Body>
      </Card>
    </Col>
  );
};

export default function RecordList() {
  const [records, setRecords] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [filteredRecords, setFilteredRecords] = useState([]);


  // Callback function to handle search
  const handleSearch = (keyword) => {
    if (keyword.trim() === "") {
      // If the search bar is empty, show all recipes
      setFilteredRecords(records);
    } else {
      // Filter recipes based on the keyword
      const filtered = records.filter((record) =>
        record.name.toLowerCase().includes(keyword.toLowerCase())
      );
      setFilteredRecords(filtered);
    }
  };

  useEffect(() => {
    async function getRecords() {
      try {
        const response = await fetch(`https://recipe-sharing-community-api.up.railway.app/record/`);

        if (!response.ok) {
          const message = `An error occurred: ${response.statusText}`;
          throw new Error(message);
        }

        const records = await response.json();
        setRecords(records);
        setFilteredRecords(records); // Set filteredRecords to all records initially
      } catch (error) {
        setErrorMessage(error.message);
        setShowErrorPopup(true);
      }
    }

    getRecords();
  }, []);

  return (
    <div>
      <Container>
        <br></br>
        <br></br>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontWeight: 'bold', color: '#FF5A5F', fontSize: '36px', marginBottom: '20px', textAlign: 'center' }}>
          Cultivate&nbsp;&nbsp;&nbsp;&nbsp;Capture&nbsp;&nbsp;&nbsp;&nbsp;Community
        </h1>
        <br></br>
        <RecipeSearchBar onSearch={handleSearch} />
        <Row>
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record) => (
              <Record
                record={record}
                records={records}
                setRecords={setRecords}
                key={record._id}
              />
            ))
          ) : (
            <p>No recipes found</p>
          )}
        </Row>
      </Container>

      {showErrorPopup && (
        <div className="error-popup">
          <p>{errorMessage}</p>
          <button onClick={() => setShowErrorPopup(false)}>Close</button>
        </div>
      )}
    </div>
  );
}