# 🗺️ EXPLORADOR DE CIDADES BRASILEIRAS - INSTRUÇÕES DE INSTALAÇÃO

## PRÉ-REQUISITOS
- Node.js 18 ou superior
- npm ou yarn
- Chave da API Google Gemini

## PASSO A PASSO DE INSTALAÇÃO

1. BAIXAR O PROJETO
   git clone https://github.com/seu-usuario/city-explorer.git
   cd city-explorer

2. INSTALAR DEPENDÊNCIAS
   npm install

3. CONFIGURAR API KEY DO GEMINI

   A) Obter API Key:
   - Acesse: https://makersuite.google.com/app/apikey
   - Faça login com Google
   - Clique em "Create API Key"
   - Copie a chave gerada

   B) Configurar no projeto:

   Crie o arquivo: src/environments/environment.ts

   Conteúdo do arquivo:
   export const environment = {
     production: false,
     geminiApiKey: 'COLE_SUA_CHAVE_AQUI'
   };

   Substitua 'COLE_SUA_CHAVE_AQUI' pela sua chave real do Gemini.

4. EXECUTAR APLICAÇÃO
   npm start

5. ACESSAR NO NAVEGADOR
   http://localhost:4200

## COMANDOS ÚTEIS

npm start          - Executar em desenvolvimento
npm run build:prod - Build para produção
npm test           - Executar testes

## ESTRUTURA DO PROJETO

city-explorer/
├── src/
│   ├── app/
│   │   ├── services/gemini.service.ts
│   │   ├── interfaces/itinerary.interface.ts
│   │   └── pages/home/
│   ├── environments/environment.ts
│   └── ...
├── package.json
└── angular.json

## SOLUÇÃO DE PROBLEMAS COMUNS

ERRO: "Cannot find module"
Solucão: 
  rm -rf node_modules package-lock.json
  npm install

ERRO: "Port 4200 already in use"
Solução:
  npm start -- --port 4201

ERRO: "Invalid API Key"
Solução:
  Verifique se a chave do Gemini está correta no environment.ts

## CONTATO
Em caso de dúvidas, abra uma issue no repositório ou entre em contato.

--- FIM DAS INSTRUÇÕES ---