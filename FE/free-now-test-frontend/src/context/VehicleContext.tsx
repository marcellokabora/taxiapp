import { createContext, useContext, ReactNode } from 'react';
import { Vehicle } from '../types/vehicles';

interface VehicleContextType {
    vehicles: Vehicle[];
    isLoading: boolean;
    error: Error | null;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    sortOrder: 'asc' | 'desc';
    setSortOrder: (order: 'asc' | 'desc') => void;
    selectedVehicle: Vehicle | null;
    setSelectedVehicle: (vehicle: Vehicle | null) => void;
    itemsPerPage: number;
    currentPageVehicles: Vehicle[];
    sortedVehicles: Vehicle[];
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const useVehicleContext = () => {
    const context = useContext(VehicleContext);
    if (context === undefined) {
        throw new Error('useVehicleContext must be used within a VehicleProvider');
    }
    return context;
};

interface VehicleProviderProps {
    children: ReactNode;
    value: VehicleContextType;
}

export const VehicleProvider = ({ children, value }: VehicleProviderProps) => {
    return (
        <VehicleContext.Provider value={value}>
            {children}
        </VehicleContext.Provider>
    );
}; 