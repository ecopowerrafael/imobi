# 🚀 Deploy da Web App - Exicube Taxi

Este guia mostra como colocar o painel administrativo online.

## ⚡ Quick Start - OPÇÃO A: Netlify (RECOMENDADO - 2 minutos)

### 1️⃣ Push para GitHub
```powershell
cd "C:\Exicube Taxi App v4.8.1\Exicube Taxi App v4.8.1\Sourcecode"
git remote add origin https://github.com/SEU_USUARIO/exicube-taxi-app.git
git branch -M main
git push -u origin main
```
*(Será pedido seu token do GitHub)*

### 2️⃣ Conectar no Netlify
1. Vá para https://app.netlify.com/
2. Clique em "New site from Git"
3. Selecione GitHub e escolha `exicube-taxi-app`
4. Configuração automática (já temos `netlify.toml`)
5. Clique em "Deploy"

**Pronto!** Seu app estará online em 2-3 minutos em um URL tipo: `https://exicube-taxi-app.netlify.app`

**Vantagens**:
✅ Build automático na nuvem (sem problemas locais)
✅ Deploy automático a cada push
✅ URL gratuita
✅ SSL/HTTPS incluído
✅ Logs visíveis online

---

## ⚡ Quick Start - OPÇÃO B: Firebase Hosting (Local)

### 1️⃣ Build da aplicação
```powershell
powershell -ExecutionPolicy Bypass -File build.ps1
```

### 2️⃣ Deploy para Firebase
```powershell
powershell -ExecutionPolicy Bypass -File deploy.ps1
```

**Pronto!** Sua app estará online em: **https://imobi-taxi.firebaseapp.com**

---

## 📝 Instruções Detalhadas

### Pré-requisitos
- ✅ Node.js e npm instalados
- ✅ Firebase CLI instalado globalmente: `npm install -g firebase-tools`
- ✅ Autenticação Firebase: `firebase login`

### Etapa 1: Preparar o Build

**Opção A - Usar script automático:**
```powershell
powershell -ExecutionPolicy Bypass -File build.ps1
```

**Opção B - Manualmente:**
```powershell
cd web-app
npm install
npm run build
cd ..
```

Isso cria a pasta `web-app/build/` com os arquivos prontos para produção.

### Etapa 2: Deploy

**Opção A - Usar script automático (recomendado):**
```powershell
powershell -ExecutionPolicy Bypass -File deploy.ps1
```

**Opção B - Manualmente:**
```powershell
firebase deploy --only hosting
```

### Etapa 3: Verificar

Acesse: **https://imobi-taxi.firebaseapp.com**

---

## 🔍 Troubleshooting

### "firebase command not found"
```powershell
npm install -g firebase-tools
firebase login
```

### "build failed with errors"
- Verifique os logs do build
- Limpe a pasta `web-app/node_modules` e `web-app/build`
- Execute novamente: `npm install && npm run build`

### "deploy failed"
- Verifique se fez login: `firebase login`
- Verifique permissões do Firebase no Google Cloud Console
- Verifique se `firebase.json` está configurado corretamente

### "Changes não aparecem"
- O Firebase Hosting faz cache
- Limpe o cache do navegador: **Ctrl+Shift+Delete**
- Ou acesse em modo anônimo (Ctrl+Shift+N)

---

## 📊 O que é feito em cada comando

### `npm run build`
1. Compila React com otimizações de produção
2. Gera arquivos minificados (reduz tamanho)
3. Cria `web-app/build/` com tudo pronto para deploy

### `firebase deploy --only hosting`
1. Comprime e envia arquivos para Firebase Hosting
2. Configura DNS/CDN automático
3. Ativa HTTPS automático
4. App fica acessível globalmente

---

## 🔐 Ambiente

A aplicação usa automaticamente:
- **Firebase Project**: `imobi-taxi`
- **Database**: `https://imobi-taxi-default-rtdb.firebaseio.com`
- **Hosting**: `https://imobi-taxi.firebaseapp.com`
- **Auth**: Firebase Authentication integrado

Todos configurados em: `common/src/config/FirebaseConfig.js`

---

## 📱 Próximas etapas

Depois de fazer deploy:
1. ✅ Teste a app no navegador
2. ✅ Verifique funcionalidades críticas
3. ✅ Compartilhe URL com a equipe
4. ✅ Configure domínio customizado (opcional)

---

## 💡 Dicas

- **Deploy automático**: Configure CI/CD no GitHub Actions
- **Versões anteriores**: O Firebase Hosting mantém histórico de versões
- **Rollback**: Use `firebase hosting:channel:deploy` para testar antes

---

**Dúvidas?** Abra um issue ou consulte a [documentação do Firebase Hosting](https://firebase.google.com/docs/hosting)
