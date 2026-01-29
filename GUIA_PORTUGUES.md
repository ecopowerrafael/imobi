# 🇧🇷 Guia: Importar Tradução em Português

## O que foi criado?
✅ Arquivo `json/language-pt.json` com 962 strings traduzidas para português!

## Como Importar para o Firebase

### Opção 1: Via Firebase Console (Mais Fácil)

1. **Acesse o Firebase Console**
   - URL: https://console.firebase.google.com/project/imobi-taxi/database
   - Login com sua conta Google

2. **Crie a estrutura de idioma**
   
   Na seção "Realtime Database", clique em "+" ao lado de "languages" para criar um novo idioma:
   
   ```
   languages/
   ├── lang1 (Inglês - já existe)
   └── lang2 (CRIAR NOVO - Português)
   ```

3. **Configure lang2 com os metadados**
   
   Clique em `lang2` e adicione as seguintes propriedades:
   - `langName`: "Português (Brasil)"
   - `langLocale`: "pt-BR"
   - `dateLocale`: "pt-BR"  
   - `default`: true (para tornar português o idioma padrão)

4. **Importe os valores de tradução**
   
   - Crie um nó "child" chamado `keyValuePairs` dentro de `lang2`
   - Abra o arquivo `json/language-pt.json` na pasta do projeto
   - Copie TODOS os conteúdos (Ctrl+A dentro do arquivo JSON)
   - No Firebase Console, clique nos 3 pontinhos (...) em `keyValuePairs` e selecione "Import JSON"
   - Cole o conteúdo do arquivo e confirme

### Opção 2: Via Comando (Usando Firebase CLI)

```bash
# 1. Faça login (se não estiver)
firebase login

# 2. Importe os dados de idioma
firebase database:set /languages/lang2 @json/language-pt.json

# 3. Configure como padrão (opcional)
firebase database:set /languages/lang2/default true
firebase database:set /languages/lang2/langName "Português (Brasil)"
firebase database:set /languages/lang2/langLocale "pt-BR"
firebase database:set /languages/lang2/dateLocale "pt-BR"
```

## Estrutura Esperada no Firebase

Após importar, sua estrutura deve ser:

```
languages/
├── lang1/
│   ├── langName: "English"
│   ├── langLocale: "en"
│   ├── dateLocale: "en"
│   ├── default: false
│   └── keyValuePairs/
│       ├── ACCEPTED: "ACCEPTED"
│       ├── AppName: "App Name"
│       └── ... (960+ outras strings)
│
└── lang2/          ✨ NOVO - PORTUGUÊS
    ├── langName: "Português (Brasil)"
    ├── langLocale: "pt-BR"
    ├── dateLocale: "pt-BR"
    ├── default: true
    └── keyValuePairs/
        ├── ACCEPTED: "ACEITO"
        ├── AppName: "Nome do App"
        └── ... (960+ strings em português)
```

## Verificar se Funcionou

Após importar, recarregue a aplicação web:

1. **Abra**: https://imobi-taxi.firebaseapp.com/
2. **Login**: Use as credenciais de teste
3. **Verificar**: 
   - Todas as mensagens devem aparecer em PORTUGUÊS
   - Não deve aparecer mais "slug" (chaves de tradução)
   - Datas devem estar em formato brasileiro (DD/MM/YYYY)

## Solução de Problemas

### "Erro ao importar JSON"
- Verifique se o JSON está valido em: https://jsonlint.com/
- Certifique-se de que NÃO há caracteres especiais não permitidos

### "Texto continua em inglês"
- Verifique se `default: true` está setado em `lang2`
- Limpe o cache do navegador (Ctrl+Shift+Delete)
- Recarregue a página

### "Algumas strings faltam"
- O arquivo tem 962 strings traduzidas
- Se algumas faltarem, é porque seu banco tinha mais chaves
- Adicione manualmente no Firebase Console

## Próximas Etapas

1. ✅ Arquivo português criado
2. ⏳ Importar para Firebase (você faz isso)
3. ⏳ Recarregar o site
4. ⏳ Verificar que tudo está em português

## Dúvidas?

Se tiver problemas na importação, posso ajudar via chat ou criar um script automatizado!

---
**Data**: 2024
**Status**: Pronto para importação
