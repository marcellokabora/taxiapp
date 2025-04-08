import { useState, useEffect } from 'react'
import Map from './components/Map/Map'
import Table from './components/Table/Table'
import { Vehicle, VehiclesData } from './types/vehicles'
import './styles/common.css'

function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    // In a real application, this would be an API call
    fetch('http://localhost:5001/share-now/vehicles')
      .then(response => response.json())
      .then((data: VehiclesData) => {
        setVehicles(data.placemarks);
      })
      .catch(error => {
        console.error('Error fetching vehicles:', error);
      });
  }, []);

  return (
    <div className="app-container">
      <div className="header">
        <img src="/Logo.png" alt="FREE NOW" className="logo" />
      </div>
      <div className="dashboard-layout">
        <Map vehicles={vehicles} />
        <Table vehicles={vehicles} />
      </div>
    </div>
  )
}

export default App
