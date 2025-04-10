import { Vehicle, ShareNowVehicle, FreeNowVehicle } from '../../types/vehicles';
import './Table.css';
import { useRef } from 'react';

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

const getVehicleCoordinates = (vehicle: Vehicle): string => {
    if (vehicle.provider === 'SHARE NOW') {
        const shareVehicle = vehicle as ShareNowVehicle;
        return `${shareVehicle.coordinates[0]}, ${shareVehicle.coordinates[1]}`;
    } else {
        const freeVehicle = vehicle as FreeNowVehicle;
        return `${freeVehicle.coordinate.longitude}, ${freeVehicle.coordinate.latitude}`;
    }
};

const getVehicleAddress = (vehicle: Vehicle): string => {
    if (vehicle.provider === 'SHARE NOW') {
        const shareVehicle = vehicle as ShareNowVehicle;
        return shareVehicle.address;
    }
    return '-';
};

const getVehicleFuel = (vehicle: Vehicle): number | undefined => {
    if (vehicle.provider === 'SHARE NOW') {
        const shareVehicle = vehicle as ShareNowVehicle;
        return shareVehicle.fuel;
    }
    return undefined;
};

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
    const tableRef = useRef<HTMLDivElement>(null);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentVehicles = vehicles.slice(startIndex, endIndex);

    const scrollToTop = () => {
        // Scroll the table to top
        if (tableRef.current) {
            tableRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
        // Scroll the main page to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
            scrollToTop();
        }
    };

    return (
        <div className="table-container card">
            <div className="table-scroll-container" ref={tableRef}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Provider</th>
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
                                <td>
                                    <span className={`provider-badge ${vehicle.provider.toLowerCase().replace(' ', '-')}`}>
                                        {vehicle.provider}
                                    </span>
                                </td>
                                <td>{vehicle.licencePlate}</td>
                                <td>{getVehicleCoordinates(vehicle)}</td>
                                <td>{getVehicleAddress(vehicle)}</td>
                                <td>
                                    <span className={`status-badge ${vehicle.state.toLowerCase()}`}>
                                        {vehicle.state.toLocaleLowerCase()}
                                    </span>
                                </td>
                                <td>
                                    <span className={`condition-badge ${vehicle.condition.toLowerCase()}`}>
                                        {getVehicleFuel(vehicle) !== undefined && (
                                            <img
                                                src={getVehicleFuel(vehicle)! > 50 ? '/battery_full.svg' : '/battery_low.svg'}
                                                alt={`Fuel: ${getVehicleFuel(vehicle)}%`}
                                                width="24"
                                                height="24"
                                                style={{ marginRight: '8px' }}
                                            />
                                        )}
                                        <img
                                            src={vehicle.condition.toLowerCase() === 'bad' ? '/condition_bad.svg' : '/condition_good.svg'}
                                            alt={vehicle.condition}
                                            width="24"
                                            height="24"
                                        />
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