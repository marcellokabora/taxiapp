import React from 'react';

const TableSkeleton = () => {
    return (
        <div className="table-container card" role="status" aria-label="Loading vehicles">
            <div className="table-scroll-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th scope="col">Provider</th>
                            <th scope="col">License Plate</th>
                            <th scope="col">Coordinates</th>
                            <th scope="col">Address</th>
                            <th scope="col">State</th>
                            <th scope="col">Condition</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(5)].map((_, index) => (
                            <tr key={index} className="skeleton-row">
                                <td><div className="skeleton-cell"></div></td>
                                <td><div className="skeleton-cell"></div></td>
                                <td><div className="skeleton-cell"></div></td>
                                <td><div className="skeleton-cell"></div></td>
                                <td><div className="skeleton-cell"></div></td>
                                <td><div className="skeleton-cell"></div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableSkeleton; 