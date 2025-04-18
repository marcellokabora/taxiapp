import { useState, useMemo } from 'react'
import Map from './components/Map/Map'
import Table from './components/Table/Table'
import { Vehicle } from './types/vehicles'
import { useVehicles } from './hooks/useVehicles'
import { VehicleProvider } from './context/VehicleContext'
import './styles/common.css'

function App() {
  const { vehicles, isLoading, error } = useVehicles();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const itemsPerPage = 30;

  const sortedVehicles = useMemo(() => [...vehicles].sort((a, b) => {
    const plateA = a.licencePlate.toLowerCase();
    const plateB = b.licencePlate.toLowerCase();
    return sortOrder === 'asc'
      ? plateA.localeCompare(plateB)
      : plateB.localeCompare(plateA);
  }), [vehicles, sortOrder]);

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

  const contextValue = {
    vehicles,
    isLoading,
    error,
    currentPage,
    setCurrentPage,
    sortOrder,
    setSortOrder,
    selectedVehicle,
    setSelectedVehicle,
    itemsPerPage,
    currentPageVehicles,
    sortedVehicles
  };

  return (
    <VehicleProvider value={contextValue}>
      <div className="app-container">
        <div className="dashboard-layout">
          <div className="map-wrapper">
            <Map />
          </div>
          <div className="table-wrapper">
            <Table onSort={handleSort} />
          </div>
        </div>
      </div>
    </VehicleProvider>
  )
}

export default App
