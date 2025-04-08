import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Vehicle } from '../../types/vehicles';
import './Map.css';

const mapContainerStyle = {
    width: '100%',
    height: '100%'
};

// Center of Hamburg
const center = {
    lat: 53.5511,
    lng: 9.9937
};

interface MapProps {
    currentPageVehicles: Vehicle[];
    selectedVehicle: Vehicle | null;
    onVehicleSelect: (vehicle: Vehicle | null) => void;
}

const Map = ({ currentPageVehicles, selectedVehicle, onVehicleSelect }: MapProps) => {
    const mapOptions = {
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: {
            position: window.google?.maps?.ControlPosition?.TOP_RIGHT
        },
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: window.google?.maps?.ControlPosition?.RIGHT_BOTTOM
        },
        mapTypeControl: false,
        streetViewControl: false,
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ]
    };

    const getMarkerIcon = (vehicle: Vehicle) => {
        const isActive = vehicle.state === 'ACTIVE';
        const isSelected = selectedVehicle?.id === vehicle.id;
        return {
            path: window.google?.maps?.SymbolPath?.CIRCLE,
            fillColor: isSelected ? '#FFD700' : (isActive ? '#4CAF50' : '#F44336'), // Gold for selected, Green for active, Red for inactive
            fillOpacity: isSelected ? 1 : 0.8,
            strokeWeight: isSelected ? 2 : 1,
            strokeColor: isSelected ? '#000000' : '#FFFFFF',
            scale: isSelected ? 12 : (isActive ? 10 : 8), // Larger for selected, then active
            label: {
                text: isActive ? '✓' : '✕', // Checkmark for active, X for inactive
                color: isSelected ? '#000000' : '#FFFFFF',
                fontSize: '12px',
                fontWeight: 'bold'
            }
        };
    };

    return (
        <div className="map-container">
            <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={12}
                    options={mapOptions}
                >
                    {currentPageVehicles.map((vehicle) => (
                        <Marker
                            key={vehicle.id}
                            position={{
                                lat: vehicle.coordinates[1],
                                lng: vehicle.coordinates[0]
                            }}
                            title={`${vehicle.licencePlate} - ${vehicle.state}`}
                            icon={getMarkerIcon(vehicle)}
                            onClick={() => onVehicleSelect(vehicle)}
                        />
                    ))}
                </GoogleMap>
            </LoadScript>
        </div>
    );
};

export default Map; 