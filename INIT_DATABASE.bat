@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo  INICIALIZACAO DO FIREBASE
echo ========================================
echo.

cd /d "%~dp0"
echo Diretorio atual: %cd%
echo.

REM Verifica se firebase-tools esta instalado
echo Verificando se Firebase CLI esta instalado...
firebase --version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERRO] Firebase CLI nao encontrado!
    echo.
    echo Para instalar, abra PowerShell como Administrador e execute:
    echo   npm install -g firebase-tools
    echo.
    pause
    exit /b 1
)
echo OK - Firebase CLI encontrado
echo.

echo.
echo ========================================
echo PASSO 1: FAZER LOGIN
echo ========================================
echo.
echo Se voce nao estiver logado, uma janela do navegador vai abrir.
echo Faca login com sua conta Google do Firebase.
echo.
pause

REM Faz login
firebase login --no-localhost

echo.
echo ========================================
echo PASSO 2: CARREGANDO DADOS
echo ========================================
echo.

set PROJECT=imobi-taxi

echo Carregando settings no Firebase...
firebase database:set /settings --data "{\"appName\":\"Exicube\",\"appCat\":\"taxi\",\"code\":\"USD\",\"symbol\":\"$\",\"decimal\":2,\"country\":\"India\",\"AllowCountrySelection\":true,\"mobileLogin\":true,\"emailLogin\":true,\"socialLogin\":true}" --project %PROJECT%

echo Carregando tipos de carro...
firebase database:set /cartypes --data "{\"type1\":{\"category\":\"taxi\",\"base_fare\":10}}" --project %PROJECT%

echo Carregando razoes de cancelamento...
firebase database:set /cancel_reason --data "[{\"label\":\"Unable to Contact Driver\",\"value\":0}]" --project %PROJECT%

echo Carregando promocoes...
firebase database:set /promos --data "{\"promo1\":{\"promo_name\":\"Test\"}}" --project %PROJECT%

echo Carregando idiomas...
firebase database:set /languages --data "{\"lang1\":{\"langName\":\"English\",\"langLocale\":\"en\",\"default\":true}}" --project %PROJECT%

echo Carregando configuracoes de pagamento...
firebase database:set /payment_settings --data "{\"test\":{\"active\":true}}" --project %PROJECT%

echo.
echo ========================================
echo CONCLUIDO!
echo ========================================
echo.
echo Dados carregados com sucesso no Firebase!
echo.
echo Agora voce pode fazer login no painel web com:
echo - Pais: India
echo - Moeda: USD
echo.
echo Proximos passos:
echo 1. Clique em DEPLOY.bat para colocar o painel online
echo 2. Abra https://imobi-taxi.firebaseapp.com
echo.

pause
