/**
 * Exemplo de Componente com Google Maps
 * 
 * Como usar o Google Maps em seus componentes após envolver com GoogleMapsProvider
 */

import React, { useState } from 'react';
import { GoogleMap, Marker, Polyline } from '@react-google-maps/api';

// Exemplo 1: Mapa simples
export const SimpleMap = () => {
  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  const center = {
    lat: -23.5505,
    lng: -46.6333,
  };

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={13}
    >
      <Marker position={center} />
    </GoogleMap>
  );
};

// Exemplo 2: Mapa com múltiplos marcadores
export const MapWithMarkers = ({ markers = [] }) => {
  const mapContainerStyle = {
    width: '100%',
    height: '500px',
    borderRadius: '8px',
  };

  const defaultCenter = {
    lat: -23.5505,
    lng: -46.6333,
  };

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={defaultCenter}
      zoom={12}
      options={{
        disableDefaultUI: false,
        zoomControl: true,
      }}
    >
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={marker.position}
          title={marker.title}
          icon={marker.icon}
        />
      ))}
    </GoogleMap>
  );
};

// Exemplo 3: Mapa com rota (polyline)
export const MapWithRoute = ({ waypoints = [] }) => {
  const mapContainerStyle = {
    width: '100%',
    height: '600px',
  };

  const center = waypoints[0] || { lat: -23.5505, lng: -46.6333 };

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={13}
    >
      {/* Rota */}
      {waypoints.length > 1 && (
        <Polyline
          path={waypoints}
          options={{
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 3,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
          }}
        />
      )}

      {/* Marcadores nos waypoints */}
      {waypoints.map((waypoint, index) => (
        <Marker
          key={index}
          position={waypoint}
          label={String.fromCharCode(65 + index)} // A, B, C, ...
        />
      ))}
    </GoogleMap>
  );
};

export default SimpleMap;