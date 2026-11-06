# Atualização: abrir e fechar caixa

## O que mudou

- **Caixas cadastrados**: Sábado, Domingo de manhã e Domingo à noite já vêm criados na primeira
  vez que o app abre. Dá para criar outros (eventos) na hora de abrir.
- **Abrir caixa** com fundo de troco, registrando quem abriu e a que horas.
- **Fechar caixa** com conferência: o app mostra quanto deveria ter na gaveta, você conta e digita,
  ele calcula sobra ou falta e guarda tudo.
- **Venda bloqueada** enquanto nenhum caixa estiver aberto.
- **Aviso de caixa esquecido**: faixa laranja quando um caixa de outro dia continua aberto.
- **Relatório** ganhou as visões **Dia** e **Caixas**, com PDF do fechamento de cada caixa.

Nada do que já existia foi perdido: produtos, vendas antigas, logins e permissões continuam iguais.
Vendas registradas antes desta versão aparecem no relatório agrupadas como **"Sem caixa"**.

---

## Como publicar (10 minutos)

### 1. Substituir os arquivos no GitHub

Suba **só estes 4 arquivos** (mesmo nome, eles substituem os antigos):

| Arquivo | |
|---|---|
| `index.html` | telas novas |
| `app.js` | a lógica de abrir/fechar |
| `sw.js` | já vem com o cache `v2`, que avisa os celulares da atualização |
| `LEIA-ME.md` | instruções atualizadas (opcional) |

No GitHub: entre no repositório → **Add file → Upload files** → arraste os arquivos →
**Commit changes**. O Render publica sozinho em cerca de 1 minuto.

> **Não suba o `config.js`.** O seu já está preenchido com as chaves do Firebase e não mudou nesta
> versão. Se subir o que veio comigo, apaga a sua configuração.

### 2. Publicar as regras novas no Firebase

Isso é obrigatório — sem ele o app não consegue gravar a abertura e o fechamento.

1. Abra o **Firebase** → seu projeto → **Firestore Database** → aba **Regras**.
2. Apague tudo o que estiver lá.
3. Abra o arquivo `firestore.rules` que veio junto, copie o conteúdo inteiro e cole.
4. **Publicar**.

### 3. Conferir no celular

1. Abra o app. Deve aparecer a faixa azul *"Nova versão disponível — toque aqui para atualizar"*.
2. Depois de atualizar, a tela de Caixa mostra **"Nenhum caixa aberto"**.
3. Toque em **Abrir caixa**, escolha um, digite um fundo de troco e confirme.
4. Faça uma venda de teste e feche o caixa conferindo o dinheiro.
5. Se quiser apagar o teste: a venda pode ser cancelada pelo administrador no relatório.

---

## Detalhe técnico, caso precise

As vendas agora guardam o caixa em que foram feitas (`sessaoId`, `pontoNome`). As regras exigem que
toda venda nova tenha um caixa, **mas não exigem que ele ainda esteja aberto** — isso é de propósito:
uma venda feita sem internet sobe depois, e se o caixa tivesse sido fechado nesse meio tempo a venda
seria recusada e perdida. Quem impede a venda sem caixa aberto é o aplicativo.
