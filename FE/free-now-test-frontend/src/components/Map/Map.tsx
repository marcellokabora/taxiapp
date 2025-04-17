import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { Vehicle, ShareNowVehicle, FreeNowVehicle } from '../../types/vehicles';
import './Map.css';
import { useCallback, useRef, useEffect, useState } from 'react';

interface MapProps {
    currentPageVehicles: Vehicle[];
    selectedVehicle: Vehicle | null;
    onVehicleSelect: (vehicle: Vehicle | null) => void;
}

const mapContainerStyle = {
    width: '100%',
    height: '100%'
};

const calculateCenter = (vehicles: Vehicle[]): { lat: number; lng: number } => {
    if (vehicles.length === 0) {
        // Default to Hamburg center if no vehicles
        return {
            lat: 53.5511,
            lng: 9.9937
        };
    }

    const sum = vehicles.reduce((acc, vehicle) => {
        const coords = getVehicleCoordinates(vehicle);
        return {
            lat: acc.lat + coords.lat,
            lng: acc.lng + coords.lng
        };
    }, { lat: 0, lng: 0 });

    return {
        lat: sum.lat / vehicles.length,
        lng: sum.lng / vehicles.length
    };
};

const getVehicleCoordinates = (vehicle: Vehicle): { lat: number; lng: number } => {
    if (vehicle.provider === 'SHARE TAXI') {
        const shareVehicle = vehicle as ShareNowVehicle;
        return {
            lat: shareVehicle.coordinates[1],
            lng: shareVehicle.coordinates[0]
        };
    } else {
        const freeVehicle = vehicle as FreeNowVehicle;
        return {
            lat: freeVehicle.coordinate.latitude,
            lng: freeVehicle.coordinate.longitude
        };
    }
};

const Map = ({ currentPageVehicles, selectedVehicle, onVehicleSelect }: MapProps) => {
    const mapRef = useRef<google.maps.Map | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const { isLoaded: isApiLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    });

    const fitBounds = useCallback(() => {
        if (!mapRef.current || currentPageVehicles.length === 0) return;

        const bounds = new google.maps.LatLngBounds();
        currentPageVehicles.forEach(vehicle => {
            const coords = getVehicleCoordinates(vehicle);
            bounds.extend(coords);
        });

        mapRef.current.fitBounds(bounds, {
            top: 50,
            right: 50,
            bottom: 50,
            left: 50
        });
    }, [currentPageVehicles]);

    const onMapLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
        setIsLoaded(true);
        fitBounds();
    }, [fitBounds]);

    useEffect(() => {
        if (mapRef.current && isLoaded) {
            fitBounds();
        }
    }, [currentPageVehicles, fitBounds, isLoaded]);

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

    const getMarkerIcon = (vehicle: Vehicle): google.maps.Icon | undefined => {
        if (!window.google?.maps?.Size || !window.google?.maps?.Point) {
            console.error('Google Maps API not fully loaded');
            return undefined;
        }

        const isActive = vehicle.state === 'ACTIVE';
        const isSelected = selectedVehicle?.id === vehicle.id;
        const iconUrl = isActive ? '/marker_blue.svg' : '/marker_black.svg';

        return {
            url: iconUrl,
            scaledSize: new window.google.maps.Size(isSelected ? 50 : 30, isSelected ? 50 : 30),
            anchor: new window.google.maps.Point(isSelected ? 30 : 15, isSelected ? 50 : 30),
        };
    };

    if (loadError) {
        console.error('Error loading Google Maps API:', loadError);
        return <div>Error loading map</div>;
    }

    if (!isApiLoaded) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading map...</p>
            </div>
        );
    }

    return (
        <div className="map-container card">
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={calculateCenter(currentPageVehicles)}
                zoom={12}
                options={mapOptions}
                onLoad={onMapLoad}
            >
                {currentPageVehicles.map((vehicle) => {
                    const icon = getMarkerIcon(vehicle);
                    if (!icon) return null;
                    const coords = getVehicleCoordinates(vehicle);

                    return (
                        <Marker
                            key={vehicle.id}
                            position={coords}
                            title={`${vehicle.licencePlate} - ${vehicle.state}`}
                            icon={icon}
                            onClick={() => onVehicleSelect(vehicle)}
                        />
                    );
                })}
            </GoogleMap>
        </div>
    );
};

export default Map; 