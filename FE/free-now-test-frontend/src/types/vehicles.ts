export interface Vehicle {
    address: string;
    coordinates: [number, number, number];
    engineType: 'PETROL' | 'ELECTRIC' | 'DIESEL';
    condition: 'BAD' | 'GOOD' | 'EXCELLENT';
    fuel: number;
    state: 'ACTIVE' | 'INACTIVE';
    licencePlate: string;
    id: number;
}

export interface VehiclesData {
    placemarks: Vehicle[];
} 