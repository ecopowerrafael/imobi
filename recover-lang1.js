#!/usr/bin/env node

/**
 * 🔧 RECUPERAR LANG1 (INGLÊS) NO FIREBASE
 * Execute isto para recriar o idioma inglês que foi deletado
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Inicializar Firebase Admin SDK
const serviceAccountPath = path.join(__dirname, 'path-to-serviceAccountKey.json');
// Se não tiver, use as credenciais do firebase.json

console.log("\n🔄 RECUPERANDO LANG1 (INGLÊS)...\n");

async function recoverLang1() {
    try {
        // Ler o arquivo language-en.json
        const enFilePath = path.join(__dirname, 'json', 'language-en.json');
        const enData = JSON.parse(fs.readFileSync(enFilePath, 'utf8'));
        
        console.log(`✅ Arquivo language-en.json carregado (${Object.keys(enData).length} chaves)`);
        
        // Estrutura completa de lang1
        const lang1 = {
            langName: "English",
            langLocale: "en",
            dateLocale: "en-gb",
            default: false,
            keyValuePairs: enData
        };
        
        console.log("\n📝 Estrutura de lang1:");
        console.log(JSON.stringify({
            langName: lang1.langName,
            langLocale: lang1.langLocale,
            dateLocale: lang1.dateLocale,
            default: lang1.default,
            keyValuePairs: `... ${Object.keys(lang1.keyValuePairs).length} chaves`
        }, null, 2));
        
        console.log("\n💾 Para restaurar, você pode:");
        console.log("1. Usar Firebase CLI:");
        console.log("   firebase database:set /languages/lang1 --json < lang1.json");
        console.log("\n2. Ou usar Firebase Console:");
        console.log("   - Vá para https://console.firebase.google.com/project/imobi-taxi/database");
        console.log("   - Clique em languages → [+]");
        console.log("   - Crie lang1 manualmente");
        console.log("   - Importe o JSON no keyValuePairs");
        
        // Salvar arquivo temporário para fácil cópia
        const tempPath = path.join(__dirname, 'lang1-recovery.json');
        fs.writeFileSync(tempPath, JSON.stringify(lang1, null, 2));
        console.log(`\n✅ Arquivo salvo em: ${tempPath}`);
        console.log("   Você pode usar este arquivo para restaurar via Firebase Console (Import JSON)");
        
    } catch (error) {
        console.error("❌ Erro:", error.message);
        console.log("\n💡 Alternativa: Restaure manualmente via Firebase Console");
    }
}

recoverLang1();

