@echo off
REM Script de Deploy Automático para Firebase
REM Basta clicar neste arquivo para fazer deploy!

cd /d "%~dp0"

echo.
echo ========================================
echo  DEPLOY PARA FIREBASE HOSTING
echo ========================================
echo.

REM 1. Copiar AccessKey
echo [1/4] Preparando arquivos...
copy common\src\other\AccessKey.example.js common\src\other\AccessKey.js >nul 2>&1

REM 2. Instalar dependências
echo [2/4] Instalando dependências (isso pode levar alguns minutos)...
cd web-app
call npm install --legacy-peer-deps
if %ERRORLEVEL% neq 0 (
    echo ERRO: Falha na instalação de dependências!
    pause
    exit /b 1
)

REM 3. Fazer build
echo [3/4] Compilando aplicação...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo ERRO: Falha na compilação!
    pause
    exit /b 1
)

REM 4. Deploy no Firebase
cd ..
echo [4/4] Fazendo upload para Firebase...
call firebase deploy --only hosting

if %ERRORLEVEL% equ 0 (
    echo.
    echo ========================================
    echo  ✅ DEPLOY CONCLUÍDO COM SUCESSO!
    echo ========================================
    echo.
    echo Seu site está online em:
    echo https://imobi-taxi.firebaseapp.com
    echo.
) else (
    echo.
    echo ========================================
    echo  ❌ ERRO NO DEPLOY
    echo ========================================
    echo.
)

pause
