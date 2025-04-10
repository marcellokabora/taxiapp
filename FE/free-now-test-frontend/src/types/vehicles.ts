export type VehicleProvider = 'FREE NOW' | 'SHARE NOW';
export type VehicleCondition = 'BAD' | 'GOOD' | 'EXCELLENT';
export type VehicleState = 'ACTIVE' | 'INACTIVE';
export type EngineType = 'PETROL' | 'ELECTRIC' | 'DIESEL';

export interface BaseVehicle {
    id: number;
    state: VehicleState;
    licencePlate: string;
    condition: VehicleCondition;
    provider: VehicleProvider;
}

export interface ShareNowCoordinates {
    coordinates: [number, number, number];
}

export interface FreeNowCoordinates {
    coordinate: {
        latitude: number;
        longitude: number;
    };
}

export interface ShareNowVehicle extends BaseVehicle {
    address: string;
    coordinates: [number, number, number];
    engineType: EngineType;
    fuel: number | undefined;
    provider: 'SHARE NOW';
}

export interface FreeNowVehicle extends BaseVehicle {
    coordinate: {
        latitude: number;
        longitude: number;
    };
    provider: 'FREE NOW';
}

export type Vehicle = ShareNowVehicle | FreeNowVehicle;

export interface VehiclesData {
    placemarks: ShareNowVehicle[];
}

export interface ShareNowResponse {
    placemarks: ShareNowVehicle[];
}

export interface FreeNowResponse {
    poiList: FreeNowVehicle[];
} 