# 🚖 Exicube Taxi App v4.8.1

Plataforma completa de taxi com painel administrativo, aplicativo mobile (iOS/Android) e backend com Firebase.

## 📱 Estrutura do Projeto

```
Sourcecode/
├── common/              # Estado compartilhado (Redux)
├── mobile-app/          # React Native (iOS/Android)
├── web-app/             # Dashboard administrativo (React)
├── functions/           # Backend (Firebase Cloud Functions)
└── json/                # Dados de exemplo
```

## 🚀 Deploy Rápido

### Opção A: Netlify (Recomendado - 2 minutos)

1. Execute o script:
```powershell
powershell -ExecutionPolicy Bypass -File push-github.ps1
```

2. Acesse https://app.netlify.com e conecte seu GitHub

3. Pronto! App online em 2-3 minutos

### Opção B: Firebase Hosting

Consulte `DEPLOY_GUIDE.md`

## 🔧 Tecnologias

- **Frontend**: React 19, Redux Toolkit, Material-UI
- **Mobile**: React Native, Expo
- **Backend**: Firebase (Database, Functions, Auth, Storage)
- **Pagamentos**: 20+ gateways de pagamento

## 📝 Requisitos Locais

- Node.js v20+
- npm 10+
- Git

## ✅ Status

- ✅ Banco de dados populado
- ✅ Demo mode desabilitado
- ✅ Todos os idiomas carregados
- ✅ Pronto para deploy

## 📖 Documentação

- Guia de deploy: [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md)
- Instruções do Copilot: [.github/copilot-instructions.md](.github/copilot-instructions.md)

---

**Desenvolvido para:** Exicube Taxi Platform
**Versão:** 4.8.1
