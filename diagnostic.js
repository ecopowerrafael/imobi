#!/usr/bin/env node

/**
 * 🔍 SCRIPT DE DIAGNÓSTICO - Firebase Languages
 * Verifica se as traduções foram importadas corretamente
 */

const fs = require('fs');
const path = require('path');

console.log("\n🔍 DIAGNÓSTICO DE LINGUAGENS\n");
console.log("=" .repeat(60));

// 1. Verificar se o arquivo language-pt.json existe
const ptFilePath = path.join(__dirname, 'json', 'language-pt.json');
console.log("\n📄 Verificando arquivo language-pt.json...");

if (fs.existsSync(ptFilePath)) {
    console.log("✅ Arquivo encontrado!");
    
    try {
        const ptData = JSON.parse(fs.readFileSync(ptFilePath, 'utf8'));
        const keyCount = Object.keys(ptData).length;
        
        console.log(`📊 Total de chaves: ${keyCount}`);
        
        // Mostrar primeiras 5 chaves
        console.log("\n🔑 Primeiras 5 chaves:");
        Object.keys(ptData).slice(0, 5).forEach((key, idx) => {
            console.log(`   ${idx + 1}. ${key} = "${ptData[key]}"`);
        });
        
        if (keyCount === 0) {
            console.log("\n❌ ERRO: language-pt.json está VAZIO!");
        }
    } catch (e) {
        console.log(`❌ ERRO ao ler arquivo: ${e.message}`);
    }
} else {
    console.log("❌ Arquivo language-pt.json NÃO ENCONTRADO!");
}

// 2. Verificar se language-en.json existe
const enFilePath = path.join(__dirname, 'json', 'language-en.json');
console.log("\n📄 Verificando arquivo language-en.json...");

if (fs.existsSync(enFilePath)) {
    console.log("✅ Arquivo encontrado!");
    
    try {
        const enData = JSON.parse(fs.readFileSync(enFilePath, 'utf8'));
        const keyCount = Object.keys(enData).length;
        
        console.log(`📊 Total de chaves: ${keyCount}`);
    } catch (e) {
        console.log(`❌ ERRO ao ler arquivo: ${e.message}`);
    }
} else {
    console.log("❌ Arquivo language-en.json NÃO ENCONTRADO!");
}

// 3. Verificar Firebase CLI instalado
console.log("\n🔥 Verificando Firebase CLI...");
try {
    const { execSync } = require('child_process');
    const version = execSync('firebase --version', { encoding: 'utf-8' }).trim();
    console.log(`✅ Firebase CLI instalado: ${version}`);
} catch (e) {
    console.log("❌ Firebase CLI não está instalado");
    console.log("📝 Para instalar: npm install -g firebase-tools");
}

// 4. Verificar se está logado no Firebase
console.log("\n🔐 Verificando autenticação Firebase...");
try {
    const { execSync } = require('child_process');
    execSync('firebase projects:list', { encoding: 'utf-8', stdio: 'pipe' });
    console.log("✅ Você está autenticado no Firebase");
} catch (e) {
    console.log("❌ Você NÃO está autenticado no Firebase");
    console.log("📝 Execute: firebase login");
}

console.log("\n" + "=".repeat(60));
console.log("\n💡 PRÓXIMOS PASSOS:\n");
console.log("1. Verifique se language-pt.json tem conteúdo (962+ chaves)");
console.log("2. Acesse: https://console.firebase.google.com/project/imobi-taxi/database");
console.log("3. Delete completamente 'lang2' se existir");
console.log("4. Crie 'lang2' do ZERO com os metadados corretos");
console.log("5. Importe language-pt.json para keyValuePairs");
console.log("\n");

