# 🔧 COMO CORRIGIR O BUG DE "SLUG"

## O Problema
Quando o site mostra apenas "slug" (como "profile_title", "email", etc.) é porque as traduções não foram carregadas corretamente no Firebase ou há cache antigo.

## ⚡ SOLUÇÃO MAIS RÁPIDA: Limpar Cache

**Abra o site e execute isto no Console (F12):**

```javascript
// Cole tudo isto de uma vez no console do navegador:
localStorage.clear();
sessionStorage.clear();
let dbs = await indexedDB.databases();
dbs.forEach(db => indexedDB.deleteDatabase(db.name));
console.log("✅ Cache limpo! Recarregando em 2 segundos...");
setTimeout(() => window.location.reload(), 2000);
```

**Ou download do script:**
- Veja o arquivo `cleanup-cache.js` para copiar e colar no console

---

## Solução Completa (Se cache não resolver)

### Via Firebase Console:

**1. Delete completamente `lang2`:**
```
Firebase Console → Realtime Database → languages → lang2 → [⋮] → Delete
```

**2. Crie `lang2` do ZERO:**
- Clique no "+" ao lado de "languages"
- Crie com chave: `lang2`

**3. Adicione os metadados (um por um):**

```
lang2 [+]
├── Adicione: langName = "Português (Brasil)"
├── Adicione: langLocale = "pt-BR"
├── Adicione: dateLocale = "pt-BR"
└── Adicione: default = true
```

**4. Crie a pasta `keyValuePairs`:**
- Clique no "+" dentro de `lang2`
- Crie com chave: `keyValuePairs`
- Deixe o valor vazio

**5. IMPORTE o JSON:**
- Clique nos **3 pontinhos** ao lado de `keyValuePairs`
- Selecione **"Import JSON"**
- Abra o arquivo: `json/language-pt.json`
- Copie TODO o conteúdo (Ctrl+A, Ctrl+C)
- Cole na caixa do Firebase (Ctrl+V)
- Clique em **Import**

**6. Verifique a estrutura:**
```
lang2/
├── dateLocale: "pt-BR" ✅
├── default: true ✅
├── langLocale: "pt-BR" ✅
├── langName: "Português (Brasil)" ✅
└── keyValuePairs/
    ├── ACCEPTED: "ACEITO"
    ├── AppName: "Nome do App"
    ├── about_us: "Sobre Nós"
    └── ... (960+ strings)
```

**7. Recarregue o site:**
```
https://imobi-taxi.firebaseapp.com/
```

---

## Se Ainda Não Funcionar

### Limpe o cache do navegador:
```
Pressione: Ctrl + Shift + Delete
Selecione: "Todos os tempos"
Marque: "Cookies e outros dados de sites"
Clique: "Limpar dados"
```

### Recarregue:
```
F5 ou Ctrl + Shift + R
```


## Verificação Rápida

Abra o **Console do navegador** (F12) e execute:

```javascript
// Ver as linguagens carregadas
console.log(i18n.language);
console.log(i18n.resources);

// Se mostrar "pt-BR" com os dados, está funcionando!
```

---

**Espera que o Firebase atualize**: Às vezes leva 1-2 segundos para sincronizar. Se ainda não funcionar, tente novamente em alguns segundos.

## 📋 Resumo

| Situação | Solução |
|----------|---------|
| Mostra "slug" (keys em inglês) | Limpar cache no console |
| Algumas palavras em português, outras em inglês | Verificar se `lang2/keyValuePairs` foi importado |
| Nada em português | Verificar se `lang2` existe e tem `default: true` |
| Botão de idioma ainda aparece | MyProfile.js já foi atualizado, limpar cache do navegador |

---

**Data:** 29/01/2026  
**Status:** ✅ Script de limpeza disponível

