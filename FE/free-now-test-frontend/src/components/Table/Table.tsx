import { Vehicle } from '../../types/vehicles';
import { useState } from 'react';
import './Table.css';

interface TableProps {
    vehicles: Vehicle[];
}

const Table = ({ vehicles }: TableProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    const totalPages = Math.ceil(vehicles.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentVehicles = vehicles.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="table-container">
            <div className="table-scroll-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>License Plate</th>
                            <th>Coordinates</th>
                            <th>Address</th>
                            <th>State</th>
                            <th>Condition</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentVehicles.map((vehicle) => (
                            <tr key={vehicle.id}>
                                <td>{vehicle.engineType}</td>
                                <td>{vehicle.licencePlate}</td>
                                <td>{`${vehicle.coordinates[0]}, ${vehicle.coordinates[1]}`}</td>
                                <td>{vehicle.address}</td>
                                <td>
                                    <span className={`status-badge ${vehicle.state.toLowerCase()}`}>
                                        {vehicle.state}
                                    </span>
                                </td>
                                <td>
                                    <span className={`condition-badge ${vehicle.condition.toLowerCase()}`}>
                                        {vehicle.condition}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="pagination-container">
                <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="pagination-button"
                    title="First page"
                >
                    ««
                </button>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-button"
                    title="Previous page"
                >
                    «
                </button>
                <div className="pagination-info">
                    Page {currentPage} of {totalPages}
                </div>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                    title="Next page"
                >
                    »
                </button>
                <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                    title="Last page"
                >
                    »»
                </button>
            </div>
        </div>
    );
};

export default Table; 