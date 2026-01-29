# Script para fazer build da Web App
# Executar com: powershell -ExecutionPolicy Bypass -File build.ps1

Write-Host "🔨 Iniciando build da web-app..." -ForegroundColor Green
Write-Host ""

# Verificar se está na pasta correta
if (-Not (Test-Path "web-app/package.json")) {
    Write-Host "❌ Erro: pasta web-app não encontrada!" -ForegroundColor Red
    Write-Host "Execute este script da pasta raiz do projeto (Sourcecode/)" -ForegroundColor Yellow
    exit 1
}

# Etapa 1: Instalar dependências se necessário
Write-Host "📦 Verificando dependências..." -ForegroundColor Yellow
Push-Location web-app
if (-Not (Test-Path "node_modules")) {
    Write-Host "   Instalando dependências..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao instalar dependências" -ForegroundColor Red
        Pop-Location
        exit 1
    }
}
else {
    Write-Host "   ✅ Dependências já instaladas" -ForegroundColor Green
}

# Etapa 2: Build
Write-Host ""
Write-Host "🔨 Compilando aplicação..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao compilar" -ForegroundColor Red
    Pop-Location
    exit 1
}

Pop-Location

Write-Host ""
Write-Host "✅ Build concluído com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📁 Arquivos compilados estão em: web-app/build/" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para fazer deploy, execute: powershell -ExecutionPolicy Bypass -File deploy.ps1" -ForegroundColor Yellow
