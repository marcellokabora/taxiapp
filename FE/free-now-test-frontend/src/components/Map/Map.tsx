import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Vehicle } from '../../types/vehicles';
import './Map.css';

const mapContainerStyle = {
    width: '100%',
    height: '100%'  // Changed to 100% to fill container
};

// Center of Hamburg
const center = {
    lat: 53.5511,
    lng: 9.9937
};

const mapOptions = {
    disableDefaultUI: true,
    zoomControl: true,
    zoomControlOptions: {
        position: google.maps.ControlPosition.TOP_RIGHT
    },
    fullscreenControl: true,
    fullscreenControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM
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

interface MapProps {
    vehicles: Vehicle[];
}

const Map = ({ vehicles }: MapProps) => {
    return (
        <div className="map-container">
            <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={center}
                    zoom={12}
                    options={mapOptions}
                >
                    {vehicles.map((vehicle) => (
                        <Marker
                            key={vehicle.id}
                            position={{
                                lat: vehicle.coordinates[1],
                                lng: vehicle.coordinates[0]
                            }}
                            title={`${vehicle.licencePlate} - ${vehicle.state}`}
                            icon={{
                                path: google.maps.SymbolPath.CIRCLE,
                                fillColor: vehicle.state === 'ACTIVE' ? '#00ff00' : '#ff0000',
                                fillOpacity: 1,
                                strokeWeight: 1,
                                scale: 8
                            }}
                        />
                    ))}
                </GoogleMap>
            </LoadScript>
        </div>
    );
};

export default Map; 