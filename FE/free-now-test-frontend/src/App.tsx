import { useState, useEffect } from 'react'
import Map from './components/Map/Map'
import Table from './components/Table/Table'
import { Vehicle, VehiclesData } from './types/vehicles'
import './styles/common.css'

function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const itemsPerPage = 20;

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

  const sortedVehicles = [...vehicles].sort((a, b) => {
    const plateA = a.licencePlate.toLowerCase();
    const plateB = b.licencePlate.toLowerCase();
    return sortOrder === 'asc'
      ? plateA.localeCompare(plateB)
      : plateB.localeCompare(plateA);
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageVehicles = sortedVehicles.slice(startIndex, endIndex);

  const handleSort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  return (
    <div className="app-container">
      <div className="header">
        <img src="/Logo.png" alt="FREE NOW" className="logo" />
      </div>
      <div className="dashboard-layout">
        <Map vehicles={sortedVehicles} currentPageVehicles={currentPageVehicles} />
        <Table
          vehicles={sortedVehicles}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      </div>
    </div>
  )
}

export default App
