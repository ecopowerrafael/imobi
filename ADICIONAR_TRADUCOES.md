# Como Adicionar Traduções ao Firebase

## Problema
O painel está com textos em "slug" porque as **traduções em inglês não foram importadas**.

## Solução - 5 Passos Simples:

### Passo 1: Abra o Firebase Console
Acesse: https://console.firebase.google.com/
- Clique no projeto **imobi-taxi**

### Passo 2: Vá para Realtime Database
- No menu esquerdo, clique em **Build** > **Realtime Database**

### Passo 3: Crie a estrutura de idiomas
Você deve ter isto no banco:
```
languages/
  lang1/
    langName: "English"
    langLocale: "en"
    dateLocale: "en-gb"
    default: true
    keyValuePairs: (aqui vamos adicionar)
```

### Passo 4: Abra o arquivo de traduções
1. Na sua pasta do projeto, abra: `json/language-en.json`
2. Copie **TODO** o conteúdo do arquivo (Ctrl+A, Ctrl+C)

### Passo 5: Adicione ao Firebase
1. No Firebase Console, clique no **+** ao lado de `lang1`
2. Crie um novo campo com chave: `keyValuePairs`
3. Clique no ícone de JSON (`{}`) no lado direito
4. Cole o conteúdo do `language-en.json`
5. Clique em **Add**

## Pronto!
Agora as traduções estão no Firebase. Reabra o site e o texto deve aparecer em inglês corretamente!

---

## Alternativa: Usar o script
Se preferir usar o terminal:
1. Clique em `IMPORTAR_IDIOMAS.bat`
2. Siga as instruções que aparecerem
