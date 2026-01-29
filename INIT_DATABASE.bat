@echo off
REM Script para Popular o Firebase com Dados de Exemplo
REM Execute isto uma única vez para inicializar o banco de dados

cd /d "%~dp0"

echo.
echo ========================================
echo  INICIANDO FIREBASE COM DADOS DE EXEMPLO
echo ========================================
echo.

REM Verifica se está logado
firebase projects:list >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo [1/2] Você precisa fazer login no Firebase...
    echo.
    firebase login --no-localhost
    echo.
    echo Aguarde alguns instantes...
    timeout /t 3 /nobreak
)

echo [2/2] Importando dados de exemplo no Firebase...
echo.

REM Importa os dados do arquivo JSON para o banco de dados Firebase
echo Carregando settings...
firebase database:set /settings --data "{\"appName\":\"Exicube\",\"appCat\":\"taxi\",\"code\":\"USD\",\"symbol\":\"$\",\"decimal\":2,\"country\":\"India\",\"AllowCountrySelection\":true,\"mobileLogin\":true,\"emailLogin\":true,\"socialLogin\":true}" --project imobi-taxi

if %ERRORLEVEL% equ 0 (
    echo.
    echo ========================================
    echo  ✅ DADOS CARREGADOS COM SUCESSO!
    echo ========================================
    echo.
    echo Agora você pode fazer login no painel web com:
    echo - País: India
    echo - Moeda: USD ($)
    echo.
) else (
    echo.
    echo ❌ ERRO: Falha ao carregar dados
    echo.
    echo Verifique se:
    echo 1. Você está conectado à internet
    echo 2. Você fez login com uma conta que tem acesso ao projeto Firebase
    echo 3. O projeto ID está correto (imobi-taxi)
    echo.
)

pause
