#!/usr/bin/env node

/**
 * 🔧 DELETE LANG1 - Remove inglês do Firebase
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

console.log("\n🗑️ DELETANDO LANG1 DO FIREBASE...\n");
console.log("Para remover via Firebase Console:");
console.log("1. Acesse: https://console.firebase.google.com/project/imobi-taxi/database");
console.log("2. Localize: languages → lang1");
console.log("3. Clique nos 3 pontinhos → Delete");
console.log("4. Confirme\n");

console.log("Para remover via CLI:");
console.log("firebase database:remove /languages/lang1 --confirm\n");

console.log("⚠️ Depois disso, apenas português (pt-BR) ficará ativo!");
console.log("✅ O código foi atualizado para FORÇAR português como padrão.\n");
