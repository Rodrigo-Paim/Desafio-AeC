# Finalidade
Este projeto tem a finalidade de servir como criterio de aprovação para o processo seletivo AeC

## Funcionalidades
• Autenticação de usuário
• CRUD (Create, Read, Update, Delete) de endereços
• Busca de endereço por CEP através da API do ViaCEP
• Exportação de endereços para arquivo CSV



## Start
```
git clone Desafio-AeC
```
```
npm install

```
```
npm install express pg bcryptjs jsonwebtoken axios body-parser cors
```


## Como utilizar o Projeto
1 - Faça login com sua conta ou registre-se se for um novo usuário.
2 - Na página de gerenciamento de endereços, você pode adicionar um novo endereço manualmente, buscá-lo por CEP, editar um endereço existente ou excluí-lo.
3 - Você também pode exportar seus endereços salvos para um arquivo CSV clicando no botão "Export to CSV".