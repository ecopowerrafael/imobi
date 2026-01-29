# 🔧 RECUPERAR LANG1 (INGLÊS) - Passo a Passo

## ❌ O que aconteceu

Você deletou `lang1` (inglês) do Firebase, mas o código ainda precisa dele para funcionar corretamente, mesmo que apenas `lang2` (português) seja usado.

---

## ✅ Como Recuperar em 5 Minutos

### Passo 1: Abra o Firebase Console
```
https://console.firebase.google.com/project/imobi-taxi/database
```

### Passo 2: Localize "languages"
```
Realtime Database
├── bookings
├── cancel_reason
├── drivers
├── languages          ← CLIQUE AQUI
├── promos
├── settings
```

### Passo 3: Crie lang1 (Inglês)
Clique no "+" ao lado de "languages":

```
languages
├── lang2  
└── [+]  ← CLIQUE AQUI
```

Digite: `lang1` e clique Add

### Passo 4: Adicione os metadados
Clique em `lang1` e adicione (um por um):

```
lang1/
├── Add: langName = "English"
├── Add: langLocale = "en"  
├── Add: dateLocale = "en-gb"
└── Add: default = false
```

### Passo 5: Importe o arquivo de recuperação

**A) Crie a pasta keyValuePairs:**
- Clique no "+" em lang1
- Crie: `keyValuePairs`
- Deixe vazio

**B) Importe o JSON:**
- Clique nos **3 pontinhos** ao lado de `keyValuePairs`
- Selecione: **"Import JSON"**
- Abra o arquivo: `lang1-recovery.json` (gerado automaticamente)
- Copie todo o conteúdo
- Cole na caixa do Firebase
- Clique: **Import**

---

## 📋 Resultado Final

```
languages/
├── lang1/                          ← RESTAURADO
│   ├── dateLocale: "en-gb"
│   ├── default: false
│   ├── langLocale: "en"
│   ├── langName: "English"
│   └── keyValuePairs/ (960 chaves)
│
└── lang2/                          ← JÁ EXISTENTE
    ├── dateLocale: "pt-BR"
    ├── default: true
    ├── langLocale: "pt-BR"
    ├── langName: "Português (Brasil)"
    └── keyValuePairs/ (960 chaves)
```

---

## 🚀 Depois

1. **Limpe o cache:**
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   let dbs = await indexedDB.databases();
   dbs.forEach(db => indexedDB.deleteDatabase(db.name));
   setTimeout(() => window.location.reload(), 1000);
   ```

2. **Recarregue o site:**
   https://imobi-taxi.firebaseapp.com/

3. **Tudo deve voltar a funcionar** ✅

---

**Desculpa pela confusão! O seletor agora está oculto (não aparece) mas continua funcionando nos bastidores.**

