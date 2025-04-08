import { Vehicle } from '../../types/vehicles';
import './Table.css';

interface TableProps {
    vehicles: Vehicle[];
    currentPage: number;
    onPageChange: (page: number) => void;
    sortOrder: 'asc' | 'desc';
    onSort: () => void;
    selectedVehicle: Vehicle | null;
    onVehicleSelect: (vehicle: Vehicle | null) => void;
    itemsPerPage: number;
}

const Table = ({
    vehicles,
    currentPage,
    onPageChange,
    sortOrder,
    onSort,
    selectedVehicle,
    onVehicleSelect,
    itemsPerPage
}: TableProps) => {
    const totalPages = Math.ceil(vehicles.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentVehicles = vehicles.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
        }
    };

    return (
        <div className="table-container">
            <div className="table-scroll-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th className="sortable" onClick={onSort}>
                                License Plate {sortOrder === 'asc' ? '↑' : '↓'}
                            </th>
                            <th>Coordinates</th>
                            <th>Address</th>
                            <th>State</th>
                            <th>Condition</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentVehicles.map((vehicle) => (
                            <tr
                                key={vehicle.id}
                                className={selectedVehicle?.id === vehicle.id ? 'selected' : ''}
                                onClick={() => onVehicleSelect(vehicle)}
                            >
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