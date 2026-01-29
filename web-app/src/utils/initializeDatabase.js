/**
 * Firebase Database Initialization Script
 * 
 * Importa dados do arquivo taxi-sample-db.json para o Firebase Realtime Database
 * Executa automaticamente na primeira vez que o app carrega
 */

import { ref, get, set } from 'firebase/database';
import { getDatabase } from 'firebase/database';
import { initializeApp, getApp, getApps } from "firebase/app";
import { FirebaseConfig } from '../config/FirebaseConfig';

/**
 * Inicializa o banco de dados com dados de exemplo
 * Só executa se o banco estiver vazio
 */
export const initializeDatabase = async () => {
  try {
    console.log("🔧 Iniciando verificação do banco de dados...");
    
    // Obtém a instância Firebase (inicializada automaticamente pelo FirebaseProvider)
    let app;
    try {
      app = getApp();
    } catch (error) {
      console.log("⚠️ Firebase app não inicializado ainda. Inicializando...");
      app = initializeApp(FirebaseConfig);
    }
    
    const database = getDatabase(app);
    
    if (!database) {
      console.warn("⚠️ Firebase database não está inicializado ainda");
      return false;
    }
    
    // Verifica se o banco já tem dados
    const dbRef = ref(database, '/');
    const snapshot = await get(dbRef);
    
    // Também verifica especificamente se languages existe
    const languagesRef = ref(database, '/languages');
    const languagesSnapshot = await get(languagesRef);
    
    if (snapshot.exists() && snapshot.val()) {
      console.log("✅ Banco de dados já populado. Verificando integridade...");
      
      // Se languages está vazio, precisa ser preenchido
      if (!languagesSnapshot.exists()) {
        console.warn("⚠️ Languages não encontrado! Vou preencher agora...");
        // Continua para preencher languages
      } else {
        console.log("✅ Languages confirmado. Pulando inicialização.");
        return false;
      }
    }
    
    console.log("📦 Banco de dados vazio ou incompleto. Carregando dados de exemplo...");
    
    // Importa os dados de forma lazy para evitar timeout
    let dataToImport;
    try {
      const imported = await import('../data/taxi-sample-db.json');
      dataToImport = imported.default || imported;
    } catch (error) {
      console.error("❌ Erro ao importar arquivo de dados:", error);
      console.warn("⚠️ Continuando sem dados iniciais...");
      return false;
    }
    
    console.log("📊 Dados disponíveis:", Object.keys(dataToImport));
    console.log("📊 Estrutura de languages:", dataToImport.languages ? "✅ Presente" : "❌ Ausente");
    
    // Se apenas languages está faltando, importa só isso
    if (snapshot.exists() && snapshot.val() && !languagesSnapshot.exists()) {
      console.log("🎯 Preenchendo apenas languages...");
      try {
        const languagesCollectionRef = ref(database, '/languages');
        await set(languagesCollectionRef, dataToImport.languages);
        console.log("✅ Languages importado com sucesso");
        
        // Agora atualiza settings com AllowCriticalEditsAdmin
        console.log("🎯 Atualizando settings...");
        const settingsRef = ref(database, '/settings');
        const settingsSnapshot = await get(settingsRef);
        const mergedSettings = { ...settingsSnapshot.val(), ...dataToImport.settings };
        await set(settingsRef, mergedSettings);
        console.log("✅ Settings atualizado com sucesso");
        
        return true;
      } catch (error) {
        console.error("❌ Erro ao atualizar dados:", error);
        return false;
      }
    }
    
    // Caso contrário, importa tudo
    // Escreve cada coleção no Firebase com timeout
    const writeTimeout = 30000; // 30 segundos por coleção
    
    for (const [key, value] of Object.entries(dataToImport)) {
      try {
        console.log(`⏳ Importando ${key}...`);
        console.log(`📍 Tamanho de ${key}:`, JSON.stringify(value).length, "bytes");
        const collectionRef = ref(database, `/${key}`);
        
        // Cria promise com timeout
        const writePromise = set(collectionRef, value);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`Timeout ao escrever ${key}`)), writeTimeout)
        );
        
        await Promise.race([writePromise, timeoutPromise]);
        console.log(`✅ ${key} importado com sucesso`);
      } catch (error) {
        console.error(`❌ Erro ao importar ${key}:`, error.message);
        // Continua com próximas coleções mesmo em caso de erro
      }
    }
    
    console.log("🎉 Banco de dados inicializado com sucesso!");
    
    // Verifica se os dados foram realmente escritos
    console.log("🔍 Verificando se dados foram salvos no Firebase...");
    const verifySnapshot = await get(ref(database, '/languages'));
    if (verifySnapshot.exists()) {
      console.log("✅ Languages confirmado no Firebase:", Object.keys(verifySnapshot.val()));
    } else {
      console.warn("⚠️ Languages NÃO foi encontrado após escrita!");
    }
    
    return true;
    
  } catch (error) {
    console.error("❌ Erro na inicialização do banco:", error);
    return false;
  }
};

export default initializeDatabase;