import { render, screen, fireEvent } from '@testing-library/react';
import Table from '../Table';
import { Vehicle, ShareNowVehicle, FreeNowVehicle, VehicleCondition, EngineType } from '../../../types/vehicles';

// Mock window.scrollTo
beforeAll(() => {
    window.scrollTo = jest.fn();
});

describe('Table Component', () => {
    const mockVehicles: Vehicle[] = [
        {
            id: 1,
            provider: 'SHARE TAXI',
            state: 'ACTIVE',
            licencePlate: 'ABC123',
            condition: 'GOOD' as VehicleCondition,
            address: 'Test Address 1',
            coordinates: [9.9937, 53.5511, 0],
            engineType: 'PETROL' as EngineType,
            fuel: 50,
        } as ShareNowVehicle,
        {
            id: 2,
            provider: 'TAXI NOW',
            state: 'ACTIVE',
            licencePlate: 'XYZ789',
            condition: 'GOOD' as VehicleCondition,
            coordinate: {
                latitude: 53.5511,
                longitude: 9.9937,
            },
        } as FreeNowVehicle,
    ];

    const defaultProps = {
        vehicles: mockVehicles,
        onVehicleSelect: () => { },
        currentPage: 1,
        onPageChange: () => { },
        sortOrder: 'asc' as const,
        onSort: () => { },
        totalPages: 1,
        itemsPerPage: 10,
        selectedVehicle: null,
    };

    it('should display correct vehicle information', () => {
        render(<Table {...defaultProps} />);

        // Check if provider badges are displayed
        expect(screen.getByText('SHARE TAXI')).toBeInTheDocument();
        expect(screen.getByText('TAXI NOW')).toBeInTheDocument();

        // Check if license plates are displayed
        expect(screen.getByText('ABC123')).toBeInTheDocument();
        expect(screen.getByText('XYZ789')).toBeInTheDocument();

        // Check if coordinates are displayed (using getAllByText since there are multiple elements)
        const coordinateElements = screen.getAllByText('9.9937, 53.5511');
        expect(coordinateElements).toHaveLength(2);

        // Check if addresses are displayed
        expect(screen.getByText('Test Address 1')).toBeInTheDocument();
        expect(screen.getByText('-')).toBeInTheDocument();

        // Check if states are displayed
        expect(screen.getAllByText('active')).toHaveLength(2);

        // Check if conditions are displayed
        expect(screen.getAllByAltText('GOOD')).toHaveLength(2);
    });

    it('should handle vehicle selection', () => {
        const mockOnVehicleSelect = jest.fn();
        render(<Table {...defaultProps} onVehicleSelect={mockOnVehicleSelect} />);

        // Find and click the first row
        const rows = screen.getAllByRole('row');
        fireEvent.click(rows[1]); // rows[0] is the header row

        // Verify that onVehicleSelect was called with the correct vehicle
        expect(mockOnVehicleSelect).toHaveBeenCalledWith(mockVehicles[0]);
    });
}); 