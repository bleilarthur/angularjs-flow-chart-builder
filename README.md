# Prova Técnica | Front-end | Arthur Bleil

### O desafio
Criar um sistema onde seja possível criar um fluxograma simples com nós e arestas utilizando HTML/CSS/JS. A idéia é que você utilize alguma framework SPA como React ou Angular.

### A aplicação
Ao rodar a aplicação, gostaria de:
- Ser capaz de criar um fluxograma simples através de drag 'n drop
- Salvá-los (pode ser em disco, local storage, banco de dados, etc...)
- Carregá-lo novamente

### Wish to have
- Ter vários tipos de nós (quadrado, triângulo, retângulo, losango, etc...)

### O que será avaliado
- HTML/CSS/JS (voce pode customizar a biblioteca pra ficar com uma aparência diferente)
- Organização e simplicidade do código
- Testes
- Uso de um framework SPA(ReactJS de preferência)

### O que foi realizado
- Uso de HTML/CSS/JS
- Uso do framework AngularJS 1.6.4
- Uso e customizações na biblioteca ngFlowchart (source at: https://github.com/ONE-LOGIC/ngFlowchart)
- Testes de unidade utilizando Jasmine e Karma

### Instalação e deploy
```
npm install
gulp
```

### Testes
```
karma start
```

### Ambiente de produção
```
gulp dist
```