import { useRef, useMemo } from 'react';
import { Vehicle, ShareNowVehicle, FreeNowVehicle } from '../../types/vehicles';
import { useVehicleContext } from '../../context/VehicleContext';
import TableSkeleton from './TableSkeleton';
import './Table.css';

interface TableProps {
    onSort: () => void;
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

const Table = ({ onSort }: TableProps) => {
    const {
        sortedVehicles,
        currentPage,
        setCurrentPage,
        sortOrder,
        selectedVehicle,
        setSelectedVehicle,
        itemsPerPage,
        isLoading
    } = useVehicleContext();

    const totalPages = Math.ceil(sortedVehicles.length / itemsPerPage);
    const tableRef = useRef<HTMLDivElement>(null);

    const currentVehicles = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return sortedVehicles.slice(startIndex, endIndex);
    }, [sortedVehicles, currentPage, itemsPerPage]);

    const scrollToTop = () => {
        if (tableRef.current) {
            tableRef.current.scrollTop = 0;
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            scrollToTop();
        }
    };

    if (isLoading) {
        return <TableSkeleton />;
    }

    if (sortedVehicles.length === 0) {
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
                                onClick={() => setSelectedVehicle(vehicle)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        setSelectedVehicle(vehicle);
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
                <div className="pagination-info">
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