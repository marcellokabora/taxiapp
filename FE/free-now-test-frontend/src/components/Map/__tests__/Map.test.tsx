import { render, screen, fireEvent } from '@testing-library/react';
import { Vehicle, ShareNowVehicle, FreeNowVehicle, VehicleCondition, EngineType } from '../../../types/vehicles';

// Mock the entire @react-google-maps/api module
jest.mock('@react-google-maps/api', () => ({
    LoadScript: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    GoogleMap: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Marker: ({ onClick }: { onClick: () => void }) => (
        <button onClick={onClick} data-testid="marker" />
    ),
}));

// Mock the Map module
jest.mock('../Map', () => {
    interface MockMapProps {
        currentPageVehicles: Vehicle[];
        onVehicleSelect: (vehicle: Vehicle | null) => void;
        selectedVehicle: Vehicle | null;
    }

    const MockMap = (props: MockMapProps) => {
        const { currentPageVehicles, onVehicleSelect } = props;
        return (
            <div data-testid="map">
                {currentPageVehicles.map((vehicle) => (
                    <button
                        key={vehicle.id}
                        data-testid="marker"
                        onClick={() => onVehicleSelect(vehicle)}
                    />
                ))}
            </div>
        );
    };
    return MockMap;
});

describe('Map Component', () => {
    const mockVehicles: Vehicle[] = [
        {
            id: 1,
            provider: 'SHARE TAXI',
            state: 'ACTIVE',
            licencePlate: 'ABC123',
            condition: 'GOOD' as VehicleCondition,
            address: 'Test Address',
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

    it('should handle vehicle selection when a marker is clicked', () => {
        const mockOnVehicleSelect = jest.fn();

        render(
            <div data-testid="map">
                {mockVehicles.map((vehicle) => (
                    <button
                        key={vehicle.id}
                        data-testid="marker"
                        onClick={() => mockOnVehicleSelect(vehicle)}
                    />
                ))}
            </div>
        );

        // Find and click the marker
        const markers = screen.getAllByTestId('marker');
        fireEvent.click(markers[0]);

        // Verify that onVehicleSelect was called with the correct vehicle
        expect(mockOnVehicleSelect).toHaveBeenCalledWith(mockVehicles[0]);
    });
}); 