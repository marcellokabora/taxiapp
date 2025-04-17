import { useState, useEffect } from 'react';
import { Vehicle, ShareNowVehicle, FreeNowVehicle, ShareNowResponse, FreeNowResponse } from '../types/vehicles';

export const useVehicles = () => {
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                setIsLoading(true);
                const [shareNowData, freeNowData] = await Promise.all([
                    fetch('http://localhost:5001/share-now/vehicles').then(response => response.json() as Promise<ShareNowResponse>),
                    fetch('http://localhost:5001/free-now/vehicles').then(response => response.json() as Promise<FreeNowResponse>)
                ]);

                // Transform SHARE TAXI vehicles
                const shareNowVehicles: ShareNowVehicle[] = shareNowData.placemarks.map(vehicle => ({
                    ...vehicle,
                    provider: 'SHARE TAXI' as const
                }));

                // Transform TAXI NOW vehicles
                const freeNowVehicles: FreeNowVehicle[] = freeNowData.poiList.map(vehicle => ({
                    id: vehicle.id,
                    coordinate: vehicle.coordinate,
                    state: vehicle.state,
                    licencePlate: vehicle.licencePlate,
                    condition: vehicle.condition,
                    provider: 'TAXI NOW' as const
                }));

                // Combine both sets of vehicles
                const allVehicles = [...shareNowVehicles, ...freeNowVehicles];

                // Add a delay of 2 seconds to simulate loading
                await new Promise(resolve => setTimeout(resolve, 2000));

                setVehicles(allVehicles);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch vehicles'));
                console.error('Error fetching vehicles:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVehicles();
    }, []);

    return { vehicles, isLoading, error };
}; 