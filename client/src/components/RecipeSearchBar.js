import React, { useState } from "react";
import "./RecipeSearchBar.css"; // Import the CSS file

const RecipeSearchBar = ({ onSearch, noResults }) => {
  const [keyword, setKeyword] = useState('');
  
  const handleClear = () => {
    setKeyword('');
    onSearch('');
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search recipe by keyword"
        className="search-input"
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
          onSearch(e.target.value);
        }}
      />
      <button onClick={handleClear} className="clear-button">
        Clear
      </button>
      {noResults && <p>No recipes found</p>}
    </div>
  );
};

export default RecipeSearchBar;