# Script para fazer push do código para GitHub

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  EXICUBE TAXI - PUSH PARA GITHUB" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Perguntar o nome do repositório
$repoName = Read-Host "Nome do repositório no GitHub (ex: exicube-taxi-app)"
$githubUser = Read-Host "Seu usuário do GitHub (ex: imobidriver)"

$repoUrl = "https://github.com/$githubUser/$repoName.git"

Write-Host ""
Write-Host "⏳ Configurando repositório remoto..." -ForegroundColor Yellow
git remote add origin $repoUrl 2>$null

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Repositório remoto configurado" -ForegroundColor Green
} else {
    Write-Host "⚠️  Atualizando repositório remoto..." -ForegroundColor Yellow
    git remote set-url origin $repoUrl
}

Write-Host ""
Write-Host "⏳ Fazendo push para main..." -ForegroundColor Yellow
git branch -M main
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✅ PUSH COMPLETADO COM SUCESSO!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Próximos passos:" -ForegroundColor Cyan
    Write-Host "1. Vá para: https://app.netlify.com/" -ForegroundColor White
    Write-Host "2. Clique em 'New site from Git'" -ForegroundColor White
    Write-Host "3. Selecione GitHub e escolha '$repoName'" -ForegroundColor White
    Write-Host "4. A configuração é automática (já temos netlify.toml)" -ForegroundColor White
    Write-Host "5. Clique em 'Deploy' e aguarde 2-3 minutos" -ForegroundColor White
    Write-Host ""
    Write-Host "Seu app estará online em: https://$repoName.netlify.app" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ ERRO ao fazer push!" -ForegroundColor Red
    Write-Host "Verifique se você tem um token de acesso do GitHub configurado" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Para configurar um token:" -ForegroundColor Cyan
    Write-Host "1. Vá para: https://github.com/settings/tokens" -ForegroundColor White
    Write-Host "2. Clique em 'Generate new token (classic)'" -ForegroundColor White
    Write-Host "3. Selecione scopes: repo, workflow" -ForegroundColor White
    Write-Host "4. Copie o token" -ForegroundColor White
    Write-Host "5. Use como senha quando git pedir" -ForegroundColor White
    Write-Host ""
}

Read-Host "Pressione ENTER para sair"
