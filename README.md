
# Planning Poker 

Essa é a versão base para o projeto Planning Poker. Ela foi construída de forma bem simples, utilizando **Vue 2**, **Node** e **Socket.io**.

Para ver o projeto rodando em produção, acesse [aqui](https://planningpoker.gereon.com.br/). 

### Instalação

Para instalar o projeto. Clone o repositório na sua máquina e no diretório raiz, execute no terminal:

    bash install.sh

Feita a instalação, será necessário criar dois arquivos "**.env**". Para o backend, na pasta raiz, copie e cole o arquivo **.env.example** e renomeio para .env.

    PORT=9292
    NODE_ENV=development
    VUE_APP_GTAG=NONE

Para o frontend, acesse a pasta ./frontend, copie e cole o arquivo "**.env.example**". Você também deverá renomear este arquivo para "**.env**".

    VUE_APP_GTAG=NONE

Você deverá substituir os valores conforme sua necessidade. Os valores de GTAG, você obtém de uma conta do google analytics.

### Desenvolvimento

Para rodar o projeto, acesse a pasta raiz e a pasta frontend e digite o comando: (cada um em uma janela de terminal diferente)

    npm run dev

Rodando tanto o backend e o frontend, você conseguira visualizar as alterações diretamente na rota:

    http://localhost:8080

### Build

Para gerar o build do projeto. Só é preciso rodar o seguinte comando:

    bash build.sh

Os arquivos gerados no processo de build do frontend, serão colocados na pasta ./public onde o node irá utilizar para exibição. O endereço para visualização do build provavelmente será o IP da sua maquina, porta **9292** ou:

    http://localhost:9292


É isso, bom divertimento!