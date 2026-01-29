/**
 * 🧹 LIMPADOR DE CACHE - Firebase Languages
 * Execute isto no console do navegador (F12) para limpar tudo
 */

console.clear();
console.log("🧹 INICIANDO LIMPEZA DE CACHE...\n");

// 1. Limpar localStorage
console.log("1️⃣ Limpando localStorage...");
const keysToKeep = []; // Manter as chaves que não queremos deletar
const allKeys = Object.keys(localStorage);

allKeys.forEach(key => {
    if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key);
        console.log(`   ✅ Removido: ${key}`);
    }
});

// 2. Limpar sessionStorage
console.log("\n2️⃣ Limpando sessionStorage...");
sessionStorage.clear();
console.log("   ✅ sessionStorage limpo");

// 3. Limpar IndexedDB (Firebase Realtime DB usa isto)
console.log("\n3️⃣ Limpando IndexedDB (pode levar alguns segundos)...");

async function clearIndexedDB() {
    const dbs = await indexedDB.databases();
    for (let db of dbs) {
        indexedDB.deleteDatabase(db.name);
        console.log(`   ✅ Deletado: ${db.name}`);
    }
    
    console.log("\n✅ LIMPEZA COMPLETA!");
    console.log("\n⏳ Aguardando 2 segundos e recarregando...");
    
    setTimeout(() => {
        window.location.reload();
    }, 2000);
}

clearIndexedDB().catch(err => {
    console.error("❌ Erro ao limpar IndexedDB:", err);
    console.log("\n🔄 Recarregando mesmo assim...");
    setTimeout(() => {
        window.location.reload();
    }, 1000);
});

console.log("\n💡 O site será recarregado automaticamente...");
console.log("   Quando recarregar, o Firebase vai buscar as traduções do ZERO");
