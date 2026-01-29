/**
 * Google Maps Wrapper Component
 * 
 * Evita problemas de conflito de chaves do Google Maps API
 * Inicializa o loader apenas uma vez de forma segura
 * 
 * Uso:
 * <GoogleMapsWrapper>
 *   <seu-componente-que-usa-mapa />
 * </GoogleMapsWrapper>
 */

import React, { useEffect, useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import GoogleMapApiConfig from './GoogleMapApiConfig';

const GOOGLE_MAPS_LIBRARIES = ['places', 'geometry', 'drawing', 'visualization'];

/**
 * Hook customizado para carregar Google Maps
 * Garante que o loader é inicializado apenas uma vez
 * 
 * ⚠️ NÃO especifique versão para evitar erros de versão retirada
 * Google Maps carrega automaticamente a versão mais recente
 */
export const useGoogleMapsLoader = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script', // ID único para evitar múltiplas instâncias
    googleMapsApiKey: GoogleMapApiConfig || process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
    // NÃO use 'version' - deixa o Google Maps usar a versão padrão mais recente
    language: 'pt-BR', // Português Brasil
    region: 'BR', // Brasil
  });

  return { isLoaded, loadError };
};

/**
 * Componente Provider que envolve a aplicação
 * Garante que Google Maps é carregado apenas uma vez
 */
export const GoogleMapsProvider = ({ children }) => {
  const { isLoaded, loadError } = useGoogleMapsLoader();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loadError) {
      console.error('Erro ao carregar Google Maps:', loadError);
      setError(loadError);
    }
  }, [loadError]);

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        ⚠️ Erro ao carregar Google Maps. Verifique sua API Key.
        <details>
          <summary>Detalhes do erro</summary>
          <pre>{error.message}</pre>
        </details>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        ⏳ Carregando Google Maps...
      </div>
    );
  }

  return children;
};

/**
 * Componente wrapper para mapas individuais
 * Use quando quiser envolver apenas uma parte da aplicação
 */
export const GoogleMapsWrapper = ({ children }) => {
  return <GoogleMapsProvider>{children}</GoogleMapsProvider>;
};

export default GoogleMapsWrapper;