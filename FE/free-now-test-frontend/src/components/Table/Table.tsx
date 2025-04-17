import { Vehicle, ShareNowVehicle, FreeNowVehicle } from '../../types/vehicles';
import './Table.css';
import { useRef, useMemo } from 'react';

interface TableProps {
    vehicles: Vehicle[];
    currentPage: number;
    onPageChange: (page: number) => void;
    sortOrder: 'asc' | 'desc';
    onSort: () => void;
    selectedVehicle: Vehicle | null;
    onVehicleSelect: (vehicle: Vehicle | null) => void;
    itemsPerPage: number;
    isLoading?: boolean;
}

const getVehicleCoordinates = (vehicle: Vehicle): string => {
    if (vehicle.provider === 'SHARE TAXI') {
        const shareVehicle = vehicle as ShareNowVehicle;
        return `${shareVehicle.coordinates[0]}, ${shareVehicle.coordinates[1]}`;
    } else {
        const freeVehicle = vehicle as FreeNowVehicle;
        return `${freeVehicle.coordinate.longitude}, ${freeVehicle.coordinate.latitude}`;
    }
};

const getVehicleAddress = (vehicle: Vehicle): string => {
    if (vehicle.provider === 'SHARE TAXI') {
        const shareVehicle = vehicle as ShareNowVehicle;
        return shareVehicle.address;
    }
    return '-';
};

const getVehicleFuel = (vehicle: Vehicle): number | undefined => {
    if (vehicle.provider === 'SHARE TAXI') {
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
    itemsPerPage,
    isLoading = false
}: TableProps) => {
    const totalPages = Math.ceil(vehicles.length / itemsPerPage);
    const tableRef = useRef<HTMLDivElement>(null);

    const currentVehicles = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return vehicles.slice(startIndex, endIndex);
    }, [vehicles, currentPage, itemsPerPage]);

    const scrollToTop = () => {
        // Scroll the table to top
        if (tableRef.current) {
            tableRef.current.scrollTop = 0;
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

    if (isLoading) {
        return (
            <div className="table-container card" role="status" aria-label="Loading vehicles">
                <div className="loading-spinner">Loading vehicles...</div>
            </div>
        );
    }

    if (vehicles.length === 0) {
        return (
            <div className="table-container card" role="status" aria-label="No vehicles available">
                <div className="empty-state">No vehicles available</div>
            </div>
        );
    }

    return (
        <div className="table-container card" role="region" aria-label="Vehicles table">
            <div className="table-scroll-container" ref={tableRef}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th scope="col">Provider</th>
                            <th scope="col" className="sortable" onClick={onSort} tabIndex={0} role="button" aria-sort={sortOrder === 'asc' ? 'ascending' : 'descending'}>
                                License Plate {sortOrder === 'asc' ? '↑' : '↓'}
                            </th>
                            <th scope="col">Coordinates</th>
                            <th scope="col">Address</th>
                            <th scope="col">State</th>
                            <th scope="col">Condition</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentVehicles.map((vehicle) => (
                            <tr
                                key={vehicle.id}
                                className={selectedVehicle?.id === vehicle.id ? 'selected' : ''}
                                onClick={() => onVehicleSelect(vehicle)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        onVehicleSelect(vehicle);
                                    }
                                }}
                                aria-selected={selectedVehicle?.id === vehicle.id}
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
                                    {getVehicleFuel(vehicle) !== undefined && (
                                        <img
                                            src={getVehicleFuel(vehicle)! > 50 ? '/battery_full.svg' : '/battery_low.svg'}
                                            alt={`Fuel: ${getVehicleFuel(vehicle)}%`}
                                            width="20"
                                            height="20"
                                            style={{ marginRight: '8px' }}
                                        />
                                    )}
                                    <img
                                        src={vehicle.condition.toLowerCase() === 'bad' ? '/condition_bad.svg' : '/condition_good.svg'}
                                        alt={vehicle.condition}
                                        width="20"
                                        height="20"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="pagination-container" role="navigation" aria-label="Pagination">
                <button
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    className="pagination-button"
                    title="First page"
                    aria-label="Go to first page"
                >
                    ««
                </button>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-button"
                    title="Previous page"
                    aria-label="Go to previous page"
                >
                    «
                </button>
                <div className="pagination-info" aria-live="polite">
                    Page {currentPage} of {totalPages}
                </div>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                    title="Next page"
                    aria-label="Go to next page"
                >
                    »
                </button>
                <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                    title="Last page"
                    aria-label="Go to last page"
                >
                    »»
                </button>
                <div className="pagination-info-mobile" aria-live="polite">
                    Page {currentPage} of {totalPages}
                </div>
            </div>
        </div>
    );
};

export default Table; 