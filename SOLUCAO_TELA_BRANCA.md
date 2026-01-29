# Solução para Tela Branca no Painel

## Se você vê uma tela branca ao abrir o site:

### Passo 1: Verificar Erros (IMPORTANTE)
1. Abra https://imobi-taxi.firebaseapp.com
2. Aperte **F12** para abrir Developer Tools
3. Clique na aba **Console** (tem uma mensagem vermelha?)
4. Copie E ENVIE PARA MIM exatamente o que aparece em vermelho

---

## Possíveis Soluções:

### Solução 1: Fazer Deploy Novamente
Se não fez deploy após importar os dados:

1. Clique em **DEPLOY.bat**
2. Deixe ele compilar (pode levar 3-5 minutos)
3. Quando terminar, aperte ENTER
4. Recarregue o site (Ctrl+F5 ou F5)

### Solução 2: Limpar Cache do Navegador
1. Aperte **Ctrl+Shift+Delete** 
2. Selecione "Todos os tempos"
3. Marque tudo e clique "Limpar"
4. Reabra o site: https://imobi-taxi.firebaseapp.com

### Solução 3: Verificar se Dados Estão no Firebase
1. Abra https://console.firebase.google.com/
2. Clique no projeto **imobi-taxi**
3. Vai em **Build** > **Realtime Database**
4. Verifica se tem dados sob `/settings`
   - Se não tiver, importar novamente o JSON

---

## Próximo Passo:

Me avisa qual erro aparece no Console (F12) que resolvo rápido!
