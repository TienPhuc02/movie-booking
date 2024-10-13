import React, { useCallback, useState } from 'react';
import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';

const defaultCenter = {
  lat: 21.028511, // Vĩ độ mặc định
  lng: 105.804817, // Kinh độ mặc định
};

const MapPicker = ({ onLocationSelect, initialLocation }) => {
  const [selectedLocation, setSelectedLocation] = useState(initialLocation || defaultCenter);

  const handleMapClick = useCallback(
    (event) => {
      const location = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setSelectedLocation(location);
      onLocationSelect(location);
    },
    [onLocationSelect]
  );

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <div className="w-full h-96"> {/* Tailwind classes: full width and 400px height */}
        <GoogleMap
          mapContainerClassName="w-full h-full" // Full width and height using Tailwind
          center={selectedLocation}
          zoom={10}
          onClick={handleMapClick}
        >
          <Marker position={selectedLocation} />
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default MapPicker;
