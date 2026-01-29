@echo off
REM Script para Popular o Firebase com Dados de Exemplo
REM Execute isto uma única vez para inicializar o banco de dados

cd /d "%~dp0"

echo.
echo ========================================
echo  INICIANDO FIREBASE COM DADOS DE EXEMPLO
echo ========================================
echo.

REM Faz login no Firebase
firebase login

echo.
echo Importando dados de exemplo no Firebase...
echo.

REM Importa os dados do arquivo JSON para o banco de dados Firebase
firebase database:set /settings json/taxi-sample-db.json#/settings
firebase database:set /cartypes json/taxi-sample-db.json#/cartypes
firebase database:set /cancel_reason json/taxi-sample-db.json#/cancel_reason
firebase database:set /promos json/taxi-sample-db.json#/promos
firebase database:set /languages json/taxi-sample-db.json#/languages
firebase database:set /payment_settings json/taxi-sample-db.json#/payment_settings

echo.
echo ========================================
echo  ✅ DADOS CARREGADOS COM SUCESSO!
echo ========================================
echo.
echo Agora você pode fazer login no painel web
echo.

pause
