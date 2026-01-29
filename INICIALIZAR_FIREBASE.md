# Como Inicializar o Firebase - Passo a Passo Simples

## Opção 1: Pelo Firebase Console (MAIS FÁCIL)

### Passo 1: Abra o Firebase Console
1. Abra no navegador: https://console.firebase.google.com/
2. Clique no seu projeto **imobi-taxi**

### Passo 2: Vá para Realtime Database
1. No menu esquerdo, clique em **Build** > **Realtime Database**
2. Clique no botão **Start in test mode** (ou criar um novo banco se não tiver)

### Passo 3: Importar Dados
1. Clique nos **3 pontinhos** (⋮) próximo ao nome do banco
2. Selecione **Importar JSON**
3. Escolha o arquivo: `json/taxi-sample-db.json`
4. Clique em **Importar**

**Pronto!** Os dados estão no Firebase.

---

## Opção 2: Manualmente pelo Console

Se preferir, você pode adicionar manualmente:

### Adicionar Settings:
1. No Firebase Console, clique no **+** para criar novo item
2. Defina a chave como `settings`
3. Adicione estes dados:
```
appName: Exicube
appCat: taxi
country: India
code: USD
symbol: $
decimal: 2
```

---

## Depois que os dados estiverem no Firebase:

1. Clique em **DEPLOY.bat** para colocar o painel online
2. Abra: https://imobi-taxi.firebaseapp.com
3. Faça login normalmente (país India, qualquer telefone)

---

## Precisa de ajuda?

Se ficar preso em algum passo, me avisa que passo a passo detalhado!
