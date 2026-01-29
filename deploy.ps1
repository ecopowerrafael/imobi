# Script para fazer deploy da Web App para Firebase Hosting
# Executar com: powershell -ExecutionPolicy Bypass -File deploy.ps1

Write-Host "🚀 Iniciando processo de deploy..." -ForegroundColor Green
Write-Host ""

# Verificar se está na pasta correta
if (-Not (Test-Path "firebase.json")) {
    Write-Host "❌ Erro: arquivo firebase.json não encontrado!" -ForegroundColor Red
    Write-Host "Execute este script da pasta raiz do projeto (Sourcecode/)" -ForegroundColor Yellow
    exit 1
}

# Etapa 1: Instalar dependências
Write-Host "📦 Etapa 1: Instalando dependências..." -ForegroundColor Yellow
Write-Host "   └─ web-app..." -ForegroundColor Cyan
Push-Location web-app
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências da web-app" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location

Write-Host "   └─ common..." -ForegroundColor Cyan
Push-Location common
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao instalar dependências da common" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location

# Etapa 2: Build da web-app
Write-Host ""
Write-Host "🔨 Etapa 2: Compilando web-app..." -ForegroundColor Yellow
Push-Location web-app
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao compilar web-app" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location
Write-Host "✅ Build concluído com sucesso!" -ForegroundColor Green

# Etapa 3: Deploy
Write-Host ""
Write-Host "🌐 Etapa 3: Fazendo deploy para Firebase..." -ForegroundColor Yellow
Write-Host "   Autenticando na sua conta Firebase..." -ForegroundColor Cyan

firebase deploy --only hosting
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao fazer deploy" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎉 Deploy concluído com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Sua aplicação está online!" -ForegroundColor Cyan
Write-Host "   Verifique: https://imobi-taxi.firebaseapp.com" -ForegroundColor Cyan
