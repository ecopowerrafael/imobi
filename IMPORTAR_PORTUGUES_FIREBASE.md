# 🇧🇷 Como Importar Português para o Firebase

## MÉTODO 1: Pela Interface Visual (MAIS FÁCIL) ⭐

### Passo 1: Acesse o Firebase Console
```
https://console.firebase.google.com/project/imobi-taxi/database
```

### Passo 2: Localize a Seção de Idiomas
Na árvore do lado esquerdo, procure por **languages**:

```
Realtime Database
├── bookings
├── cancel_reason
├── drivers
├── languages          ← CLIQUE AQUI
├── promos
├── settings
└── ...
```

---

## Passo 3: CRIAR O IDIOMA PORTUGUÊS (lang2)

### A) Clique no "+" ao lado de "languages"

```
languages
├── lang1 (English)
└── [+]  ← CLIQUE AQUI para adicionar novo idioma
```

### B) Crie um novo item com a chave: **lang2**

Você verá uma tela assim:

```
Key:         [lang2]
String value: [       ]
```

Deixe vazio mesmo (é apenas um container)

### C) Pressione ENTER ou clique em "Add"

---

## Passo 4: ADICIONAR OS METADADOS DO PORTUGUÊS

Agora você tem:
```
languages
├── lang1
│   ├── dateLocale
│   ├── default
│   ├── keyValuePairs
│   └── langName
└── lang2  ← CLIQUE AQUI
```

**Clique em `lang2`** e adicione estes dados clicando no "+" para cada um:

### Adicionar: langName
- **Key**: `langName`
- **Value**: `Português (Brasil)`
- Click Add

### Adicionar: langLocale
- **Key**: `langLocale`
- **Value**: `pt-BR`
- Click Add

### Adicionar: dateLocale
- **Key**: `dateLocale`
- **Value**: `pt-BR`
- Click Add

### Adicionar: default
- **Key**: `default`
- **Value**: `true` (IMPORTANTE: torna português o idioma padrão)
- Click Add

Depois:
```
lang2/
├── dateLocale: "pt-BR"
├── default: true
├── langLocale: "pt-BR"
├── langName: "Português (Brasil)"
└── [+]  ← Continue aqui
```

---

## Passo 5: IMPORTAR AS TRADUÇÕES (keyValuePairs)

### A) Ainda em lang2, clique no "+" para adicionar keyValuePairs

```
lang2/
├── dateLocale
├── default
├── langLocale
├── langName
└── [+]  ← CLIQUE AQUI
```

Crie um novo item:
- **Key**: `keyValuePairs`
- **Value**: (deixe vazio, será substituído)
- Click Add

### B) Agora você tem:
```
lang2/
├── dateLocale: "pt-BR"
├── default: true
├── langLocale: "pt-BR"
├── langName: "Português (Brasil)"
└── keyValuePairs  ← CLIQUE AQUI (nos 3 pontinhos)
```

### C) Clique nos **3 pontinhos (⋮)** ao lado de `keyValuePairs`

Você verá um menu:
```
[⋮]
├── Edit
├── Delete
├── Import JSON  ← CLIQUE AQUI
└── Export JSON
```

### D) Selecione "Import JSON"

Uma janela vai abrir. Você precisa copiar o conteúdo do arquivo `json/language-pt.json`:

```
INSTRUÇÕES:
1. Abra o arquivo:   json/language-pt.json
2. Selecione TUDO:   Ctrl+A
3. Copie:            Ctrl+C
4. Cole na caixa:    Ctrl+V
5. Clique:           Import
```

---

## Passo 6: VERIFICAR SE FUNCIONOU

Depois de importar, você deve ver:

```
lang2/
├── dateLocale: "pt-BR"
├── default: true
├── keyLocale: "pt-BR"
├── langName: "Português (Brasil)"
└── keyValuePairs/
    ├── ACCEPTED: "ACEITO"
    ├── AppName: "Nome do App"
    ├── about_us: "Sobre Nós"
    ├── accept: "ACEITAR"
    ├── ... (960+ mais strings)
    └── zoom_level: "Nível de Zoom"
```

---

## 🎉 PRONTO!

Agora:
1. Recarregue a página: https://imobi-taxi.firebaseapp.com/
2. Tudo deve estar em **PORTUGUÊS** 🇧🇷
3. Se quiser usar português por padrão, já está configurado com `default: true`

---

## MÉTODO 2: Via Firebase CLI (Para Avançados)

Se preferir fazer pelo terminal:

```powershell
# Faça login
firebase login

# Importe os dados
firebase database:set /languages/lang2 $(Get-Content json/language-pt.json -Raw | ConvertFrom-Json) --json
```

---

## ❌ Se não funcionar:

### Problema: Texto aparece em inglês mesmo após importar

**Solução:**
1. Verifique se `default: true` está em `lang2`
2. Limpe o cache: **Ctrl + Shift + Delete**
3. Recarregue a página

### Problema: Algumas palavras em inglês

**Causa:** Seu banco tem mais chaves que o arquivo de tradução

**Solução:**
1. Abra o arquivo `json/language-en.json`
2. Procure pela chave faltante
3. Encontre a tradução no `json/language-pt.json`
4. Adicione manualmente no Firebase

---

## 📋 Resumo da Estrutura Final

```
languages/
├── lang1/
│   ├── dateLocale: "en"
│   ├── default: false
│   ├── langLocale: "en"
│   ├── langName: "English"
│   └── keyValuePairs/
│       ├── ACCEPTED: "ACCEPTED"
│       ├── AppName: "App Name"
│       └── ... (960+ strings em inglês)
│
└── lang2/
    ├── dateLocale: "pt-BR"          ✅
    ├── default: true                ✅
    ├── langLocale: "pt-BR"          ✅
    ├── langName: "Português (Brasil)" ✅
    └── keyValuePairs/
        ├── ACCEPTED: "ACEITO"       ✅
        ├── AppName: "Nome do App"   ✅
        └── ... (960+ strings em português) ✅
```

---

## 💡 Dicas

- **Sempre** coloque `default: true` em um idioma para torná-lo o padrão
- As chaves em `keyValuePairs` devem ser **exatamente** como em `lang1`
- Se mudar `default` de `lang1` para `false`, o novo idioma padrão será `lang2`
- Você pode ter quantos idiomas quiser: `lang3`, `lang4`, etc.

---

**Data:** 29/01/2026  
**Status:** ✅ Pronto para usar  
**Suporte:** Português Brasil (pt-BR)
