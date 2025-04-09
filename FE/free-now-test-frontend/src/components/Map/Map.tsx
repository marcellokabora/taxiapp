import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Vehicle } from '../../types/vehicles';
import './Map.css';
import { useCallback, useRef, useEffect, useState } from 'react';

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
    const mapRef = useRef<google.maps.Map | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isApiLoaded, setIsApiLoaded] = useState(false);

    const onMapLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
        setIsLoaded(true);
        fitBounds();
    }, [currentPageVehicles]);

    const fitBounds = useCallback(() => {
        if (!mapRef.current || currentPageVehicles.length === 0) return;

        const bounds = new google.maps.LatLngBounds();
        currentPageVehicles.forEach(vehicle => {
            bounds.extend({
                lat: vehicle.coordinates[1],
                lng: vehicle.coordinates[0]
            });
        });

        mapRef.current.fitBounds(bounds, {
            top: 50,
            right: 50,
            bottom: 50,
            left: 50
        });
    }, [currentPageVehicles]);

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
        const iconUrl = isActive ? '/marker_blue.png' : '/marker_black.png';

        return {
            url: iconUrl,
            scaledSize: new window.google.maps.Size(isSelected ? 50 : 30, isSelected ? 50 : 30),
            anchor: new window.google.maps.Point(isSelected ? 30 : 15, isSelected ? 50 : 30),
        };
    };

    return (
        <div className="map-container card">
            <LoadScript
                googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
                onLoad={() => {
                    console.log('Google Maps API loaded');
                    setIsApiLoaded(true);
                }}
                onError={(error) => console.error('Error loading Google Maps API:', error)}
            >
                {isApiLoaded && (
                    <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={center}
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
                                    position={{
                                        lat: vehicle.coordinates[1],
                                        lng: vehicle.coordinates[0]
                                    }}
                                    title={`${vehicle.licencePlate} - ${vehicle.state}`}
                                    icon={icon}
                                    onClick={() => onVehicleSelect(vehicle)}
                                />
                            );
                        })}
                    </GoogleMap>
                )}
            </LoadScript>
        </div>
    );
};

export default Map; 