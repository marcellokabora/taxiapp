import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { Vehicle } from '../../types/vehicles';
import './Map.css';
import { useCallback, useRef, useEffect, useState } from 'react';
import { useVehicleContext } from '../../context/VehicleContext';

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
        return {
            lat: acc.lat + vehicle.normalizedCoordinates.lat,
            lng: acc.lng + vehicle.normalizedCoordinates.lng
        };
    }, { lat: 0, lng: 0 });

    return {
        lat: sum.lat / vehicles.length,
        lng: sum.lng / vehicles.length
    };
};

const Map = () => {
    const mapRef = useRef<google.maps.Map | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const { currentPageVehicles, selectedVehicle, setSelectedVehicle, isLoading } = useVehicleContext();

    const { isLoaded: isApiLoaded, loadError } = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    });

    const fitBounds = useCallback(() => {
        if (!mapRef.current || currentPageVehicles.length === 0) return;

        const bounds = new google.maps.LatLngBounds();
        currentPageVehicles.forEach(vehicle => {
            bounds.extend(vehicle.normalizedCoordinates);
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

    if (isLoading || !isApiLoaded) {
        return (
            <div className="map-container card">
                <div className="map-loading">
                    <div className="map-spinner"></div>
                    <p>Loading map...</p>
                </div>
            </div>
        );
    }

    if (loadError) {
        console.error('Error loading Google Maps API:', loadError);
        return <div>Error loading map</div>;
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

                    return (
                        <Marker
                            key={vehicle.id}
                            position={vehicle.normalizedCoordinates}
                            title={`${vehicle.licencePlate} - ${vehicle.state}`}
                            icon={icon}
                            onClick={() => setSelectedVehicle(vehicle)}
                        />
                    );
                })}
            </GoogleMap>
        </div>
    );
};

export default Map; 