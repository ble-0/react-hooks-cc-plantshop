import React, { useState, useEffect } from "react";
import PlantCard from "./PlantCard";
import NewPlantForm from "./NewPlantForm";
import Search from "./Search";
function PlantList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [plants, setPlants] = useState([]);
  // GET request
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await fetch('http://localhost:6001/plants');
        const data = await response.json();
        setPlants(data);
      } catch (error) {
        console.error('Error fetching plant data:', error);
      }
    };
    fetchPlants();
  }, []);
  // POST request
  const handleAddPlant = async (newPlant) => {
    try {
      const response = await fetch('http://localhost:6001/plants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPlant),
      });
      if (response.ok) {
        const addedPlant = await response.json();
        setPlants((prevPlants) => [...prevPlants, addedPlant]);
      } else {
        console.error('Failed to add new plant');
      }
    } catch (error) {
      console.error('Error adding plant:', error);
    }
  };
  // PATCH request
  const updatePlantPrice = async (id, newPrice) => {
    try {
      const response = await fetch(`http://localhost:6001/plants/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price: newPrice }),
      });
      if (response.ok) {
        const updatedPlant = await response.json();
        setPlants((prevPlants) =>
          prevPlants.map((plant) =>
            plant.id === id ? { ...plant, price: updatedPlant.price } : plant
          )
        );
      } else {
        console.error('Failed to update plant price');
      }
    } catch (error) {
      console.error('Error updating plant price:', error);
    }
  };
  // sold out
  const markPlantSoldOut = async (id) => {
    try {
      const response = await fetch(`http://localhost:6001/plants/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ soldOut: true }),
      });
      if (response.ok) {
        const updatedPlant = await response.json();
        setPlants((prevPlants) =>
          prevPlants.map((plant) =>
            plant.id === id ? { ...plant, soldOut: updatedPlant.soldOut } : plant
          )
        );
      } else {
        console.error('Failed to mark plant as sold out');
      }
    } catch (error) {
      console.error('Error marking plant as sold out:', error);
    }
  };
  // DELETE request
  const handleDeletePlant = async (id) => {
    try {
      const response = await fetch(`http://localhost:6001/plants/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setPlants((prevPlants) => prevPlants.filter((plant) => plant.id !== id));
      } else {
        console.error('Failed to delete plant');
      }
    } catch (error) {
      console.error('Error deleting plant:', error);
    }
  };
  // Update the search query based on user input
  const handleSearchChange = (query) => {
    setSearchQuery(query); 
  };
  return (
    <div>
      <Search onSearchChange={handleSearchChange} />
      <NewPlantForm handleAddPlant={handleAddPlant} />
      <ul className="cards">
        {plants
          .filter((plant) =>
            plant.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((plant) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              handleUpdatePrice={updatePlantPrice}
              handleMarkSoldOut={markPlantSoldOut}
              handleDelete={handleDeletePlant}
            />
          ))}
      </ul>
    </div>
  );
}

export default PlantList;


