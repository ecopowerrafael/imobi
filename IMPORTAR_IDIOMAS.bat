@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo  IMPORTAR IDIOMAS COMPLETOS NO FIREBASE
echo ========================================
echo.

cd /d "%~dp0"

set PROJECT=imobi-taxi

echo Carregando idioma inglês completo...
REM Primeiro, delete o campo languages anterior
firebase database:set /languages/lang1 --data null --project %PROJECT%

REM Agora importe o arquivo de idioma completo
REM Nota: Você pode usar jq ou outro parser JSON, mas como é simples, vamos usar dados inline

firebase database:set /languages/lang1/langName --data "\"English\"" --project %PROJECT%
firebase database:set /languages/lang1/langLocale --data "\"en\"" --project %PROJECT%
firebase database:set /languages/lang1/dateLocale --data "\"en-gb\"" --project %PROJECT%
firebase database:set /languages/lang1/default --data true --project %PROJECT%

echo.
echo ========================================
echo  Carregando arquivo de traduções...
echo ========================================
echo.

REM Importar o arquivo language-en.json como keyValuePairs
REM Este comando requer que o arquivo esteja bem formatado

echo Dica: Você pode importar manualmente pelo Firebase Console:
echo 1. Abra https://console.firebase.google.com/
echo 2. Vá em Realtime Database
echo 3. Clique no "+" ao lado de /languages/lang1
echo 4. Crie um novo item chamado "keyValuePairs"
echo 5. Copie e cole o conteúdo de json/language-en.json

echo.
echo ========================================
echo  CONCLUÍDO
echo ========================================
echo.

pause
