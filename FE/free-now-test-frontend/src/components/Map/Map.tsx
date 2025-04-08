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
}

const Map = ({ currentPageVehicles }: MapProps) => {
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

    const getMarkerIcon = (state: string) => {
        const isActive = state === 'ACTIVE';
        return {
            path: window.google?.maps?.SymbolPath?.CIRCLE,
            fillColor: isActive ? '#4CAF50' : '#F44336', // Green for active, Red for inactive
            fillOpacity: 0.8,
            strokeWeight: 1,
            strokeColor: '#FFFFFF',
            scale: isActive ? 10 : 8, // Slightly larger for active vehicles
            label: {
                text: isActive ? '✓' : '✕', // Checkmark for active, X for inactive
                color: '#FFFFFF',
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
                            icon={getMarkerIcon(vehicle.state)}
                        />
                    ))}
                </GoogleMap>
            </LoadScript>
        </div>
    );
};

export default Map; 