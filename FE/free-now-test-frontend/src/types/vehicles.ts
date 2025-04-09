export type VehicleProvider = 'FREE NOW' | 'SHARE NOW';

export interface Vehicle {
    address: string;
    coordinates: [number, number, number];
    engineType: 'PETROL' | 'ELECTRIC' | 'DIESEL';
    condition: 'BAD' | 'GOOD' | 'EXCELLENT';
    fuel: number | undefined;
    state: 'ACTIVE' | 'INACTIVE';
    licencePlate: string;
    id: number;
    provider: VehicleProvider;
}

export interface VehiclesData {
    placemarks: Vehicle[];
} 