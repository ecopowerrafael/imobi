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
where firebase >nul 2>&1
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

REM Verifica se esta logado
echo Verificando autenticacao Firebase...
firebase projects:list >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo.
    echo Voce nao esta logado. Abrindo pagina de login...
    echo.
    timeout /t 2 /nobreak
    firebase login --no-localhost
    if %ERRORLEVEL% neq 0 (
        echo.
        echo [ERRO] Falha ao fazer login
        echo.
        pause
        exit /b 1
    )
    echo.
    echo Login realizado com sucesso!
    echo.
)

echo Carregando dados no Firebase...
echo.

REM Define o projeto
set PROJECT=imobi-taxi
echo Projeto: %PROJECT%
echo.

REM Carrega settings basicos
echo [1/6] Carregando settings...
firebase database:set /settings --data "{\"appName\":\"Exicube\",\"appCat\":\"taxi\",\"code\":\"USD\",\"symbol\":\"$\",\"decimal\":2,\"country\":\"India\",\"AllowCountrySelection\":true,\"mobileLogin\":true,\"emailLogin\":true,\"socialLogin\":true}" --project %PROJECT% 2>&1
if %ERRORLEVEL% neq 0 (
    echo AVISO: Nao foi possivel carregar settings
)

echo [2/6] Carregando tipos de carro...
firebase database:set /cartypes --data "{\"type1\":{\"category\":\"taxi\",\"base_fare\":10}}" --project %PROJECT% 2>&1

echo [3/6] Carregando razoes de cancelamento...
firebase database:set /cancel_reason --data "[{\"label\":\"Unable to Contact Driver\",\"value\":0}]" --project %PROJECT% 2>&1

echo [4/6] Carregando promocoes...
firebase database:set /promos --data "{\"promo1\":{\"promo_name\":\"Test\"}}" --project %PROJECT% 2>&1

echo [5/6] Carregando idiomas...
firebase database:set /languages --data "{\"lang1\":{\"langName\":\"English\",\"langLocale\":\"en\",\"default\":true}}" --project %PROJECT% 2>&1

echo [6/6] Carregando configuracoes de pagamento...
firebase database:set /payment_settings --data "{\"test\":{\"active\":true}}" --project %PROJECT% 2>&1

echo.
echo ========================================
echo  CONCLUIDO!
echo ========================================
echo.
echo Dados carregados com sucesso no Firebase!
echo.
echo Agora voce pode:
echo 1. Fazer deploy do painel (clique em DEPLOY.bat)
echo 2. Abrir o painel e fazer login
echo.
echo Pais padrao: India
echo Moeda: USD ($)
echo.

pause
