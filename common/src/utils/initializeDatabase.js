/**
 * Firebase Database Initialization Script
 * 
 * Importa dados do arquivo taxi-sample-db.json para o Firebase Realtime Database
 * Executa automaticamente na primeira vez que o app carrega
 * 
 * Uso: Execute este script uma única vez para popular o banco de dados
 */

import sampleData from './taxi-sample-db.json';
import { firebase } from '../config/configureFirebase';
import { set, ref, get } from 'firebase/database';

/**
 * Inicializa o banco de dados com dados de exemplo
 * Só executa se o banco estiver vazio
 */
export const initializeDatabase = async () => {
  try {
    console.log("🔧 Iniciando verificação do banco de dados...");
    
    const { database } = firebase;
    
    // Verifica se o banco já tem dados
    const dbRef = ref(database, '/');
    const snapshot = await get(dbRef);
    
    if (snapshot.exists() && snapshot.val()) {
      console.log("✅ Banco de dados já populado. Pulando inicialização.");
      return;
    }
    
    console.log("📦 Banco de dados vazio. Carregando dados de exemplo...");
    
    // Importa todos os dados do arquivo sample
    const dataToImport = sampleData;
    
    console.log("📊 Dados a importar:", Object.keys(dataToImport));
    
    // Escreve cada coleção no Firebase
    for (const [key, value] of Object.entries(dataToImport)) {
      try {
        console.log(`⏳ Importando ${key}...`);
        const collectionRef = ref(database, `/${key}`);
        await set(collectionRef, value);
        console.log(`✅ ${key} importado com sucesso`);
      } catch (error) {
        console.error(`❌ Erro ao importar ${key}:`, error);
      }
    }
    
    console.log("🎉 Banco de dados inicializado com sucesso!");
    return true;
    
  } catch (error) {
    console.error("❌ Erro na inicialização do banco:", error);
    return false;
  }
};

export default initializeDatabase;