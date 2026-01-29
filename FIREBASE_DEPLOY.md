# Deploy no Firebase Hosting

## Pré-requisitos

1. **Firebase CLI instalado**:
```bash
npm install -g firebase-tools
```

2. **Estar autenticado no Firebase**:
```bash
firebase login
```

## Build Local

Para testar o build localmente antes de fazer deploy:

```bash
# 1. Copiar arquivo AccessKey
cp common/src/other/AccessKey.example.js common/src/other/AccessKey.js

# 2. Instalar dependências do web-app
cd web-app
npm install --legacy-peer-deps

# 3. Fazer build
npm run build

# 4. Voltar para a raiz
cd ..
```

## Deploy no Firebase

```bash
# Build e deploy em um comando
firebase deploy --only hosting

# Ou fazer build primeiro e depois deploy
cd web-app
npm run build
cd ..
firebase deploy --only hosting
```

## Conectar ao seu projeto Firebase

Certifique-se de que o `.firebaserc` está configurado com seu projeto:

```bash
firebase use seu-projeto-id
```

## Ver o site publicado

Após o deploy bem-sucedido, você verá a URL como:
```
Hosting URL: https://seu-projeto.firebaseapp.com
```

## Disabilitar Netlify

O arquivo `netlify.toml` foi desativado. Se você quiser remover completamente o Netlify:

1. Acesse [app.netlify.com](https://app.netlify.com)
2. Encontre seu site
3. Em Site settings → Danger zone → Delete this site

Ou simplesmente ignore - não será mais feito deploy automático para lá.
