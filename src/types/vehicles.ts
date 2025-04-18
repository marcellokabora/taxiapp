export type VehicleProvider = 'TAXI NOW' | 'SHARE TAXI';
export type VehicleCondition = 'GOOD' | 'BAD';
export type VehicleState = 'ACTIVE' | 'INACTIVE';
export type EngineType = 'PETROL' | 'ELECTRIC';

export interface BaseVehicle {
    id: number;
    state: VehicleState;
    licencePlate: string;
    condition: VehicleCondition;
    provider: VehicleProvider;
    normalizedCoordinates: {
        lat: number;
        lng: number;
    };
    displayCoordinates: string;
    displayAddress: string;
    displayFuel: number | undefined;
}

export interface ShareNowVehicle extends BaseVehicle {
    address: string;
    coordinates: [number, number, number];
    engineType: EngineType;
    fuel: number | undefined;
    provider: 'SHARE TAXI';
}

export interface FreeNowVehicle extends BaseVehicle {
    coordinate: {
        latitude: number;
        longitude: number;
    };
    provider: 'TAXI NOW';
}

export type Vehicle = ShareNowVehicle | FreeNowVehicle;