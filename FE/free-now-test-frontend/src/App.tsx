import { useState } from 'react'
import Map from './components/Map/Map'
import Table from './components/Table/Table'
import { Vehicle } from './types/vehicles'
import { useVehicles } from './hooks/useVehicles'
import './styles/common.css'

function App() {
  const { vehicles, isLoading, error } = useVehicles();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const itemsPerPage = 20;

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

  if (error) {
    return <div className="app-container">Error: {error.message}</div>;
  }

  return (
    <div className="app-container">
      <div className="dashboard-layout">
        <div className="map-wrapper">
          <Map
            currentPageVehicles={currentPageVehicles}
            selectedVehicle={selectedVehicle}
            onVehicleSelect={setSelectedVehicle}
            isLoading={isLoading}
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
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}

export default App
