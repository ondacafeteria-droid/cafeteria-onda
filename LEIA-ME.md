# Cafeteria Igreja Onda — versão nuvem

Sistema de caixa com **login por pessoa**, **banco de dados na nuvem** e **sincronização em tempo real**:
vários celulares vendem ao mesmo tempo e todos veem o mesmo relatório.

Tudo gratuito. São dois serviços:

- **Firebase (Google)** — guarda as vendas, os produtos e os logins. Não pede cartão de crédito.
- **Render** — hospeda a página do app. Também não pede cartão.

---

## Arquivos desta pasta

| Arquivo | O que é |
|---|---|
| `index.html` | A tela do app |
| `app.js` | Toda a lógica (caixa, produtos, relatório, equipe) |
| **`config.js`** | **O único arquivo que você precisa editar** — as chaves do seu Firebase |
| `firestore.rules` | As regras de segurança, para colar no Firebase |
| `sw.js` | Faz o app abrir sem internet |
| `manifest.json`, `icon-*.png`, `logo-*.png` | Ícone, logo e instalação na tela inicial |
| `render.yaml` | Configuração automática do Render |

---

# PARTE 1 — Criar o banco de dados no Firebase

1. Acesse **console.firebase.google.com** e entre com uma conta Google.
2. **Criar um projeto** → nome `cafeteria-onda` → pode **desativar** o Google Analytics → **Criar projeto**.

### 1.1 Ligar o login por e-mail
3. No menu da esquerda: **Criação → Authentication** → **Vamos começar**.
4. Aba **Sign-in method** → clique em **E-mail/senha** → ligue a primeira chave → **Salvar**.

### 1.2 Criar o banco
5. Menu **Criação → Firestore Database** → **Criar banco de dados**.
6. Local: **southamerica-east1 (São Paulo)**. Modo: **produção**. → **Criar**.
7. Aba **Regras** → apague tudo o que estiver lá → abra o arquivo `firestore.rules` desta pasta, copie o conteúdo inteiro e cole → **Publicar**.

> Sem esse passo 7 ninguém consegue usar o sistema — são essas regras que dizem quem pode o quê.

### 1.3 Pegar as chaves
8. Clique na **engrenagem ⚙ → Configurações do projeto**.
9. Role até **Seus apps** → clique no ícone **`</>`** (Web) → apelido `cafeteria` → **Registrar app**.
10. Vai aparecer um bloco parecido com este:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "cafeteria-onda.firebaseapp.com",
  projectId: "cafeteria-onda",
  storageBucket: "cafeteria-onda.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

11. Abra o arquivo **`config.js`** no Bloco de Notas e troque cada `"COLE_AQUI"` pelo valor correspondente. Salve.

---

# PARTE 2 — Publicar o app no Render

### 2.1 GitHub
1. Crie uma conta gratuita em **github.com**.
2. **New repository** → nome `cafeteria-onda` → **Public** → **Create repository**.
3. Clique em **uploading an existing file** e arraste **todos os arquivos desta pasta** (os arquivos soltos, não a pasta) → **Commit changes**.

### 2.2 Render
4. Crie a conta em **render.com** (dá para entrar com o GitHub).
5. **New +** → **Static Site** → escolha o repositório `cafeteria-onda`.
6. Preencha:
   - **Name:** `cafeteria-onda`
   - **Branch:** `main`
   - **Build Command:** deixe vazio
   - **Publish Directory:** `.` (um ponto)
7. **Create Static Site** e espere aparecer **Live**.

Seu endereço: `https://cafeteria-onda.onrender.com`

### 2.3 Autorizar o endereço no Firebase (não pule!)
8. Volte ao Firebase → **Authentication** → aba **Settings** → **Domínios autorizados** → **Adicionar domínio** → digite `cafeteria-onda.onrender.com` → Adicionar.

> Sem isso o login dá erro, porque o Firebase só aceita entrar a partir de endereços que você autorizou.

---

# PARTE 3 — Virar o primeiro administrador

Ninguém pode se liberar sozinho — é isso que impede um estranho de entrar. O primeiro acesso você libera na mão:

1. Abra o endereço no navegador → **Não tenho conta — criar acesso** → seu nome, e-mail e uma senha de 6+ caracteres.
2. Vai aparecer *"Acesso aguardando liberação"*. É o esperado.
3. Volte ao Firebase → **Firestore Database** → coleção **`usuarios`** → clique no documento que apareceu (é o seu).
4. Mude **`aprovado`** de `false` para **`true`** e **`papel`** de `caixa` para **`admin`**. Salve.
5. No app, toque em **"Já liberaram, verificar"**. Pronto, você está dentro.
6. Vá na aba **Produtos** → **"Importar a lista de 34 produtos da planilha"**.

A partir daqui é tudo pelo app: cada voluntário cria a conta dele e **você libera na aba Equipe**.

---

## Como instalar no celular

Abra o endereço no **Chrome** (ou Safari no iPhone) → menu **⋮** → **Instalar app** / **Adicionar à tela inicial**.

## Quem pode o quê

| | Caixa | Administrador |
|---|---|---|
| Registrar vendas | sim | sim |
| Ver relatórios | sim | sim |
| Criar/editar produtos e preços | **não** | sim |
| Cancelar uma venda | **não** | sim |
| Liberar e bloquear pessoas | **não** | sim |

## Sem internet

Depois da primeira abertura, o app continua funcionando offline: as vendas ficam guardadas no
aparelho e o topo mostra *"1 venda pendente"*. Quando a internet volta, elas sobem sozinhas e
aparecem nos outros celulares. **Só não feche o app antes de voltar a internet.**

## Publicar uma alteração depois

1. Suba o arquivo alterado no GitHub (mesmo nome, substitui).
2. Edite `sw.js` e troque `onda-pdv-nuvem-v1` por `...v2` (depois v3, v4...).
3. O Render publica sozinho. Nos celulares aparece a faixa azul *"Nova versão disponível"*.

## Limites do plano gratuito

O Firebase gratuito permite **20 mil gravações e 50 mil leituras por dia**. Uma venda usa
1 gravação. Uma cafeteria de igreja não chega perto disso.

## Se algo der errado

| Sintoma | Causa provável |
|---|---|
| Tela "Falta conectar o banco de dados" | `config.js` ainda com `COLE_AQUI`, ou erro de digitação nas chaves |
| "Falta ativar E-mail/senha no Firebase" | Passo 1.1 não foi feito |
| Login não funciona só no celular/no endereço publicado | Passo 2.3 (domínio autorizado) não foi feito |
| "Seu acesso não permite essa ação" | A pessoa não é admin, ou as regras (passo 7) não foram publicadas |
| Produtos não aparecem | Falta importar a lista na aba Produtos |
