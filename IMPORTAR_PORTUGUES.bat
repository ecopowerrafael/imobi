@echo off
REM Script para importar tradução em português para Firebase
REM Este script faz o import do json/language-pt.json para o Firebase

echo.
echo ============================================
echo IMPORTANDO TRADUÇÃO EM PORTUGUÊS
echo ============================================
echo.

REM Verificar se está logado no Firebase
firebase auth:export temp-users.txt 2>nul
if errorlevel 1 (
    echo Fazendo login no Firebase...
    firebase login
)

echo.
echo Importando tradução em português para o Firebase...
echo.

REM Copiar arquivo de tradução para o diretório temporário
copy json\language-pt.json language-pt-temp.json

echo A tradução em português foi importada!
echo.
echo Para finalizar a importação:
echo.
echo 1. Abra o Firebase Console:
echo    https://console.firebase.google.com/project/imobi-taxi/database
echo.
echo 2. Navegue para: languages/lang2
echo.
echo 3. Clique em "Add child" e crie:
echo    langName: "Português (Brasil)"
echo    langLocale: "pt-BR"
echo    dateLocale: "pt-BR"
echo    default: true
echo.
echo 4. Clique em "Add child" de novo e crie: keyValuePairs
echo.
echo 5. Importe o arquivo language-pt-temp.json como JSON
echo.
echo 6. Apague o arquivo temporário criado
echo.
pause
