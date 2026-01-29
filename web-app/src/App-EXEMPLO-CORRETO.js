/**
 * Exemplo de como usar o GoogleMapsWrapper em App.js
 * 
 * Este é o padrão CORRETO para evitar conflitos de chaves
 */

import React from 'react';
import { GoogleMapsProvider } from './config/GoogleMapsWrapper';
import { FirebaseProvider } from './context/FirebaseContext'; // Seu provider Firebase
import { Provider } from 'react-redux';
import store from '../common/src/store/store';
import MainApp from './MainApp'; // Seu app principal

/**
 * App.js - Punto de entrada
 * 
 * Estrutura de providers:
 * App
 *   └─ Redux Provider
 *       └─ Firebase Provider
 *           └─ Google Maps Provider
 *               └─ MainApp (seu código aqui)
 */
function App() {
  return (
    <Provider store={store}>
      <FirebaseProvider>
        {/* Google Maps é carregado APENAS UMA VEZ aqui */}
        <GoogleMapsProvider>
          <MainApp />
        </GoogleMapsProvider>
      </FirebaseProvider>
    </Provider>
  );
}

export default App;