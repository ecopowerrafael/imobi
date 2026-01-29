/**
 * Script para limpar o Firebase Realtime Database
 * Use apenas para desenvolvimento!
 */

import { ref, remove } from 'firebase/database';
import { getDatabase } from 'firebase/database';
import { getApp } from "firebase/app";

/**
 * Remove todos os dados do Firebase (deixa vazio)
 */
export const clearDatabase = async () => {
  try {
    console.log("🗑️  Iniciando limpeza do banco de dados...");
    
    const app = getApp();
    const database = getDatabase(app);
    
    if (!database) {
      console.warn("⚠️ Firebase database não está inicializado");
      return false;
    }
    
    // Remove tudo do banco
    const dbRef = ref(database, '/');
    await remove(dbRef);
    
    console.log("✅ Banco de dados limpo com sucesso!");
    return true;
    
  } catch (error) {
    console.error("❌ Erro ao limpar banco:", error);
    return false;
  }
};

export default clearDatabase;
