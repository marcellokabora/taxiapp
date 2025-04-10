import { useState, useEffect } from 'react'
import Map from './components/Map/Map'
import Table from './components/Table/Table'
import { Vehicle, ShareNowVehicle, FreeNowVehicle, ShareNowResponse, FreeNowResponse } from './types/vehicles'
import './styles/common.css'

function App() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    // Load both Share Now and Free Now vehicles
    Promise.all([
      fetch('http://localhost:5001/share-now/vehicles').then(response => response.json() as Promise<ShareNowResponse>),
      fetch('http://localhost:5001/free-now/vehicles').then(response => response.json() as Promise<FreeNowResponse>)
    ])
      .then(([shareNowData, freeNowData]) => {
        // Transform Share Now vehicles
        const shareNowVehicles: ShareNowVehicle[] = shareNowData.placemarks.map(vehicle => ({
          ...vehicle,
          provider: 'SHARE NOW' as const
        }));

        // Transform Free Now vehicles
        const freeNowVehicles: FreeNowVehicle[] = freeNowData.poiList.map(vehicle => ({
          id: vehicle.id,
          coordinate: vehicle.coordinate,
          state: vehicle.state,
          licencePlate: vehicle.licencePlate,
          condition: vehicle.condition,
          provider: 'FREE NOW' as const
        }));

        // Combine both sets of vehicles
        setVehicles([...shareNowVehicles, ...freeNowVehicles]);
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
        <div className="map-wrapper">
          <Map
            currentPageVehicles={currentPageVehicles}
            selectedVehicle={selectedVehicle}
            onVehicleSelect={setSelectedVehicle}
          />
        </div>
        <div className="table-wrapper">
          <Table
            vehicles={sortedVehicles}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            sortOrder={sortOrder}
            onSort={handleSort}
            selectedVehicle={selectedVehicle}
            onVehicleSelect={setSelectedVehicle}
            itemsPerPage={itemsPerPage}
          />
        </div>
      </div>
    </div>
  )
}

export default App
