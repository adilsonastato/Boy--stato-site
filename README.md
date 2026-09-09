# Boy Ástato — Site V3

Projeto completo de arranque para um site de artista com:
- site público responsivo
- painel de administração
- API Node.js/Express
- autenticação por sessão
- SQLite
- gestão de músicas e vídeos

## Como executar

1. Instale Node.js 20+.
2. Abra o terminal nesta pasta.
3. Execute:
   npm install
   npm start
4. Abra:
   http://localhost:3000

Painel:
   http://localhost:3000/admin

## Segurança
A senha NÃO está escrita no código. Antes de colocar online, defina:
ADMIN_PASSWORD="uma-nova-senha-forte"
SESSION_SECRET="uma-chave-aleatoria-grande"

Não partilhe estas variáveis, passwords ou chaves API.
