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

export interface ShareNowResponse {
    placemarks: Vehicle[];
}

export interface FreeNowVehicle {
    id: number;
    coordinate: {
        latitude: number;
        longitude: number;
    };
    state: 'ACTIVE' | 'INACTIVE';
    licencePlate: string;
    condition: 'BAD' | 'GOOD' | 'EXCELLENT';
}

export interface FreeNowResponse {
    poiList: FreeNowVehicle[];
} 