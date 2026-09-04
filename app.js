import { FIREBASE_CONFIG, FIREBASE_VERSAO } from "./config.js";

const BASE = `https://www.gstatic.com/firebasejs/${FIREBASE_VERSAO}`;

/* ===================== UTILIDADES ===================== */
const $  = (s) => document.querySelector(s);
const $$ = (s) => Array.from(document.querySelectorAll(s));
function el(tag, cls, txt){ const e=document.createElement(tag); if(cls)e.className=cls; if(txt!=null)e.textContent=txt; return e; }
function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function money(c){ return "R$ " + ((c||0)/100).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}); }
function moneyNum(c){ return ((c||0)/100).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2}); }
function parseMoney(s){
  if(s==null) return 0;
  s = String(s).replace(/[^0-9.,-]/g,"").trim();
  if(!s) return 0;
  if(s.includes(",")) s = s.replace(/\./g,"").replace(",",".");
  const v = parseFloat(s);
  return (isNaN(v)||v<0) ? 0 : Math.round(v*100);
}
function chaveDia(ts){
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function dataBR(k){ const p=String(k).split("-"); return `${p[2]}/${p[1]}/${p[0]}`; }
function hora(ts){ const d=new Date(ts); return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`; }
function norm(s){ return String(s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,""); }
function combina(nome, termo){
  if(!termo) return true;
  const n = norm(nome);
  return norm(termo).split(/\s+/).filter(Boolean).every(t => n.includes(t));
}
function iniciais(nome, email){
  const base = (nome||email||"?").trim();
  const p = base.split(/\s+/);
  return ((p[0]?.[0]||"") + (p.length>1 ? (p[p.length-1][0]||"") : "")).toUpperCase() || "?";
}

let toastT;
function toast(msg){
  const t = $("#toast"); t.textContent = msg; t.classList.add("on");
  clearTimeout(toastT); toastT = setTimeout(()=> t.classList.remove("on"), 2400);
}
let confCb = null;
function confirmar(titulo, texto, cb){
  $("#mc-titulo").textContent = titulo;
  $("#mc-texto").textContent = texto;
  confCb = cb;
  $("#modal-conf").classList.add("on");
}

/* ===================== CONSTANTES ===================== */
const PAGAMENTOS = [
  {id:"dinheiro", nome:"Dinheiro", ic:"💵"},
  {id:"pix",      nome:"Pix",      ic:"⚡"},
  {id:"debito",   nome:"Débito",   ic:"💳"},
  {id:"credito",  nome:"Crédito",  ic:"💳"}
];
const nomePg = (id) => PAGAMENTOS.find(p=>p.id===id)?.nome || id;

const CATALOGO_INICIAL = [
  {nome:"AGUA MINALBA C/G 510ML", preco:400, cat:"Bebidas"},
  {nome:"COCA COLA S/AÇ 220ML", preco:500, cat:"Bebidas"},
  {nome:"DEL VALLE 290ML UVA", preco:500, cat:"Bebidas"},
  {nome:"GUARANÁ ANT. ZERO 350ML", preco:600, cat:"Bebidas"},
  {nome:"MONSTER 473ML AZ", preco:1400, cat:"Bebidas"},
  {nome:"MONSTER 473ML TR", preco:1400, cat:"Bebidas"},
  {nome:"MONSTER 473ML WHITE", preco:1400, cat:"Bebidas"},
  {nome:"MONSTER 473ML ZERO", preco:1400, cat:"Bebidas"},
  {nome:"SUCO NATURAL ONE 180ML", preco:500, cat:"Bebidas"},
  {nome:"YOPRO 250ML CHOC. 15G", preco:1000, cat:"Bebidas"},
  {nome:"YOPRO 250ML MOR. 15G", preco:1000, cat:"Bebidas"},
  {nome:"ANA MARIA 70G CEN/CHOC", preco:600, cat:"Bolos e Biscoitos"},
  {nome:"ANA MARIA 70G CHOC.", preco:600, cat:"Bolos e Biscoitos"},
  {nome:"ANA MARIA 70G TRIPLO", preco:600, cat:"Bolos e Biscoitos"},
  {nome:"BISC. MINI OREO 35G", preco:500, cat:"Bolos e Biscoitos"},
  {nome:"PANETIN 40G PRES. DEF.", preco:500, cat:"Bolos e Biscoitos"},
  {nome:"BALA FINI 15G DENTADURA", preco:500, cat:"Doces e Chocolates"},
  {nome:"BALA FINI 5G MOR.", preco:300, cat:"Doces e Chocolates"},
  {nome:"BARRA BOLD 40G BOMBO.", preco:1400, cat:"Doces e Chocolates"},
  {nome:"BARRA BOLD 40G COOK.", preco:1400, cat:"Doces e Chocolates"},
  {nome:"CHOC. SUFFLAIR 50G LEITE", preco:800, cat:"Doces e Chocolates"},
  {nome:"KITKAT 41,5G AO LEITE", preco:500, cat:"Doces e Chocolates"},
  {nome:"TRENTO 29G AO LEITE", preco:500, cat:"Doces e Chocolates"},
  {nome:"TRIDENT", preco:300, cat:"Doces e Chocolates"},
  {nome:"CANUDO BIO GFA GOLDEEN", preco:0, cat:"Outros", ativo:false},
  {nome:"AMEND. GRELHADITO 60G", preco:500, cat:"Salgadinhos"},
  {nome:"AMEND. MENDORATO 70G", preco:500, cat:"Salgadinhos"},
  {nome:"BAT. RUFFLES 33G CEB. SALS.", preco:600, cat:"Salgadinhos"},
  {nome:"BAT. RUFFLES 33G CHURRAS.", preco:600, cat:"Salgadinhos"},
  {nome:"BAT. RUFFLES 33G SAL", preco:600, cat:"Salgadinhos"},
  {nome:"SALG. CHEETOS 35G LUA", preco:600, cat:"Salgadinhos"},
  {nome:"SALG. CHEETOS 40G ONDA", preco:600, cat:"Salgadinhos"},
  {nome:"SALG. DORITOS 32G NACHOS", preco:700, cat:"Salgadinhos"},
  {nome:"SALG. FANDANGOS 35G", preco:600, cat:"Salgadinhos"}
];

/* ===================== ESTADO ===================== */
const S = {
  usuario: null,        // usuário do Firebase Auth
  perfil: null,         // documento em /usuarios
  produtos: [],
  vendasHoje: [],
  vendasDia: [],
  usuarios: [],
  config: {loja:"Cafeteria Igreja Onda", resp:""},
  carrinho: [],
  pagamentoSel: null,
  editandoId: null,
  diaRelatorio: chaveDia(Date.now()),
  pendentes: 0,
  doCache: false,
  carregandoProdutos: true,
  carregandoVendas: true
};
const ehAdmin = () => S.perfil?.papel === "admin";
let FB = null;      // funções do Firebase
let desinscrever = [];

/* ===================== FIREBASE ===================== */
function configPendente(){
  return !FIREBASE_CONFIG || !FIREBASE_CONFIG.apiKey || String(FIREBASE_CONFIG.apiKey).startsWith("COLE_AQUI");
}

async function carregarFirebase(){
  const [app, auth, fs] = await Promise.all([
    import(`${BASE}/firebase-app.js`),
    import(`${BASE}/firebase-auth.js`),
    import(`${BASE}/firebase-firestore.js`)
  ]);
  const aplicativo = app.initializeApp(FIREBASE_CONFIG);

  let bd;
  try{
    bd = fs.initializeFirestore(aplicativo, {
      localCache: fs.persistentLocalCache({ tabManager: fs.persistentMultipleTabManager() })
    });
  }catch(e){
    // navegador sem suporte a armazenamento local: segue só online
    bd = fs.getFirestore(aplicativo);
    console.warn("Sem persistência offline:", e);
  }

  FB = { ...fs, auth: auth.getAuth(aplicativo), bd, a: auth };
  return FB;
}

const ERROS = {
  "auth/invalid-email": "E-mail inválido.",
  "auth/user-not-found": "Não encontrei uma conta com esse e-mail.",
  "auth/wrong-password": "Senha incorreta.",
  "auth/invalid-credential": "E-mail ou senha incorretos.",
  "auth/invalid-login-credentials": "E-mail ou senha incorretos.",
  "auth/email-already-in-use": "Já existe uma conta com esse e-mail. Use “Entrar”.",
  "auth/weak-password": "A senha precisa ter pelo menos 6 caracteres.",
  "auth/missing-password": "Digite a senha.",
  "auth/too-many-requests": "Muitas tentativas. Espere um minuto e tente de novo.",
  "auth/network-request-failed": "Sem conexão com a internet.",
  "auth/operation-not-allowed": "Falta ativar “E-mail/senha” no Firebase (Authentication → Sign-in method).",
  "permission-denied": "Seu acesso não permite essa ação."
};
const traduzErro = (e) => ERROS[e?.code] || e?.message || "Não consegui completar a ação.";

/* ===================== TELAS DE ACESSO ===================== */
let modoCriar = false;

function mostrarLogin(){
  $("#tela-login").classList.add("on");
  $("#tela-espera").classList.remove("on");
}
function mostrarEspera(){
  $("#tela-espera").classList.add("on");
  $("#tela-login").classList.remove("on");
  $("#esp-nome").textContent = S.perfil?.nome || "tudo certo";
}
function mostrarApp(){
  $("#tela-login").classList.remove("on");
  $("#tela-espera").classList.remove("on");
}
function erroLogin(msg){
  const b = $("#lg-erro");
  b.textContent = msg || "";
  b.classList.toggle("on", !!msg);
  if(msg) $("#lg-ok").classList.remove("on");
}
function okLogin(msg){
  const b = $("#lg-ok");
  b.textContent = msg || "";
  b.classList.toggle("on", !!msg);
  if(msg) erroLogin("");
}
function alternarModo(criar){
  modoCriar = criar;
  $("#lg-titulo").textContent  = criar ? "Criar acesso" : "Entrar";
  $("#lg-acao").textContent    = criar ? "Criar minha conta" : "Entrar";
  $("#lg-alternar").textContent= criar ? "Já tenho conta — entrar" : "Não tenho conta — criar acesso";
  $("#campo-nome").style.display = criar ? "block" : "none";
  $("#lg-esqueci").style.display = criar ? "none" : "block";
  $("#lg-senha").setAttribute("autocomplete", criar ? "new-password" : "current-password");
  erroLogin(""); okLogin("");
}

async function acaoLogin(){
  const email = $("#lg-email").value.trim();
  const senha = $("#lg-senha").value;
  const nome  = $("#lg-nome").value.trim();
  if(!email){ return erroLogin("Digite seu e-mail."); }
  if(senha.length < 6){ return erroLogin("A senha precisa ter pelo menos 6 caracteres."); }
  if(modoCriar && !nome){ return erroLogin("Digite seu nome."); }

  const btn = $("#lg-acao");
  btn.disabled = true; btn.textContent = modoCriar ? "Criando..." : "Entrando...";
  try{
    if(modoCriar){
      const cred = await FB.a.createUserWithEmailAndPassword(FB.auth, email, senha);
      await FB.a.updateProfile(cred.user, { displayName: nome });
      await FB.setDoc(FB.doc(FB.bd, "usuarios", cred.user.uid), {
        nome, email, papel: "caixa", aprovado: false, criadoEm: FB.serverTimestamp()
      });
    }else{
      await FB.a.signInWithEmailAndPassword(FB.auth, email, senha);
    }
    $("#lg-senha").value = "";
  }catch(e){
    erroLogin(traduzErro(e));
  }finally{
    btn.disabled = false;
    btn.textContent = modoCriar ? "Criar minha conta" : "Entrar";
  }
}

async function recuperarSenha(){
  const email = $("#lg-email").value.trim();
  if(!email) return erroLogin("Digite seu e-mail para eu enviar o link de recuperação.");
  try{
    await FB.a.sendPasswordResetEmail(FB.auth, email);
    okLogin("Enviei um link de recuperação para " + email + ". Olhe também a caixa de spam.");
  }catch(e){ erroLogin(traduzErro(e)); }
}

/* ===================== SESSÃO / ESCUTAS ===================== */
function pararEscutas(){
  desinscrever.forEach(f => { try{ f(); }catch(e){} });
  desinscrever = [];
}

async function aoEntrar(user){
  S.usuario = user;
  let ref = FB.doc(FB.bd, "usuarios", user.uid);
  try{
    const snap = await FB.getDoc(ref);
    if(!snap.exists()){
      await FB.setDoc(ref, {
        nome: user.displayName || user.email.split("@")[0],
        email: user.email, papel: "caixa", aprovado: false, criadoEm: FB.serverTimestamp()
      });
    }
  }catch(e){ console.warn("perfil:", e); }

  // acompanha o próprio perfil (para reagir quando o admin liberar)
  desinscrever.push(FB.onSnapshot(ref, (snap) => {
    S.perfil = snap.exists() ? { id: snap.id, ...snap.data() } : null;
    aplicarPerfil();
  }, (e) => console.warn("perfil snapshot:", e)));
}

let escutasDados = false;
function aplicarPerfil(){
  if(!S.perfil){ mostrarEspera(); return; }
  if(!S.perfil.aprovado){
    escutasDados = false;
    mostrarEspera();
    return;
  }
  mostrarApp();
  $("#tab-equipe").style.display = ehAdmin() ? "flex" : "none";
  $("#card-identificacao").style.display = ehAdmin() ? "block" : "none";
  renderMinhaConta();
  if(!escutasDados){ escutasDados = true; ligarEscutas(); }
  else { renderProdutos(); renderRelatorio(); }
}

function ligarEscutas(){
  const bd = FB.bd, opc = { includeMetadataChanges: true };

  // produtos
  desinscrever.push(FB.onSnapshot(FB.collection(bd,"produtos"), opc, (snap) => {
    S.produtos = snap.docs.map(d => ({ id:d.id, ...d.data() }));
    S.carregandoProdutos = false;
    atualizarCaixa(); renderProdutos();
  }, (e) => { S.carregandoProdutos=false; console.warn("produtos:", e); toast("Não consegui ler os produtos"); }));

  // vendas de hoje (cabeçalho + estado de sincronização)
  const hoje = chaveDia(Date.now());
  desinscrever.push(FB.onSnapshot(
    FB.query(FB.collection(bd,"vendas"), FB.where("dia","==",hoje)), opc, (snap) => {
      S.vendasHoje = snap.docs.map(d => ({ id:d.id, ...d.data() }));
      S.pendentes = snap.docs.filter(d => d.metadata.hasPendingWrites).length;
      S.doCache = snap.metadata.fromCache;
      atualizarHeader();
      if(S.diaRelatorio === hoje){ S.vendasDia = S.vendasHoje; S.carregandoVendas = false; renderRelatorio(); }
    }, (e) => console.warn("vendas hoje:", e)));

  // configuração da loja
  desinscrever.push(FB.onSnapshot(FB.doc(bd,"config","geral"), (snap) => {
    if(snap.exists()){
      S.config = { loja:"Cafeteria Igreja Onda", resp:"", ...snap.data() };
      if(document.activeElement !== $("#in-nome-loja")) $("#in-nome-loja").value = S.config.loja || "";
      if(document.activeElement !== $("#in-resp"))      $("#in-resp").value      = S.config.resp || "";
    }
  }, (e) => console.warn("config:", e)));

  if(ehAdmin()) ligarEscutaUsuarios();
  assinarDia(S.diaRelatorio);
}

let offUsuarios = null;
function ligarEscutaUsuarios(){
  if(offUsuarios) return;
  offUsuarios = FB.onSnapshot(FB.collection(FB.bd,"usuarios"), (snap) => {
    S.usuarios = snap.docs.map(d => ({ id:d.id, ...d.data() }));
    renderUsuarios();
  }, (e) => console.warn("usuarios:", e));
  desinscrever.push(() => { offUsuarios && offUsuarios(); offUsuarios = null; });
}

let offDia = null;
function assinarDia(chave){
  const hoje = chaveDia(Date.now());
  if(offDia){ offDia(); offDia = null; }
  if(chave === hoje){
    S.vendasDia = S.vendasHoje;
    renderRelatorio();
    return;
  }
  S.carregandoVendas = true; renderRelatorio();
  offDia = FB.onSnapshot(
    FB.query(FB.collection(FB.bd,"vendas"), FB.where("dia","==",chave)),
    { includeMetadataChanges:true },
    (snap) => {
      S.vendasDia = snap.docs.map(d => ({ id:d.id, ...d.data() }));
      S.carregandoVendas = false;
      renderRelatorio();
    },
    (e) => { S.carregandoVendas=false; console.warn("vendas dia:", e); renderRelatorio(); });
  desinscrever.push(() => { offDia && offDia(); offDia = null; });
}

/* ===================== CABEÇALHO ===================== */
function atualizarHeader(){
  const total = S.vendasHoje.filter(v => !v.cancelada).reduce((a,v) => a + (v.total||0), 0);
  $("#hd-hoje").textContent = money(total);

  const box = $("#hd-status"), txt = $("#hd-status-txt");
  if(S.pendentes > 0){
    box.classList.add("off");
    txt.textContent = S.pendentes === 1 ? "1 venda pendente" : `${S.pendentes} vendas pendentes`;
    box.title = "Vendas registradas neste aparelho que ainda não subiram para a nuvem";
  }else if(!navigator.onLine || S.doCache){
    box.classList.add("off"); txt.textContent = "Offline";
    box.title = "Sem internet. As vendas continuam sendo registradas e sobem sozinhas depois.";
  }else{
    box.classList.remove("off"); txt.textContent = "Sincronizado";
    box.title = "Tudo salvo na nuvem";
  }
}

/* ===================== CAIXA ===================== */
const noCarrinho = (pid) => S.carrinho.find(i => i.pid === pid);

function renderGrade(){
  const area = $("#area-produtos"); area.innerHTML = "";
  if(S.carregandoProdutos){
    const c = el("div","carregando"); c.appendChild(el("div","spin"));
    c.appendChild(el("span",null,"Carregando produtos...")); area.appendChild(c); return;
  }
  const busca = ($("#in-busca").value || "").trim();
  let ativos = S.produtos.filter(p => p.ativo !== false);
  if(!ativos.length){
    area.appendChild(el("div","vazio", ehAdmin()
      ? "Nenhum produto cadastrado. Vá em Produtos para importar a lista."
      : "Nenhum produto cadastrado. Peça para um administrador cadastrar."));
    return;
  }
  ativos = ativos.filter(p => combina(p.nome, busca));
  if(!ativos.length){ area.appendChild(el("div","vazio", `Nenhum produto encontrado para “${busca}”.`)); return; }

  const mapa = {};
  ativos.forEach(p => { const c = (p.cat||"Geral").trim() || "Geral"; (mapa[c] ||= []).push(p); });
  Object.keys(mapa).sort((a,b)=>a.localeCompare(b,"pt-BR")).forEach(c => {
    area.appendChild(el("div","cat-titulo",c));
    const g = el("div","grade");
    mapa[c].sort((a,b)=>a.nome.localeCompare(b.nome,"pt-BR")).forEach(p => {
      const it = noCarrinho(p.id);
      const b = el("button","prod" + (it ? " tem" : ""));
      b.appendChild(el("div","nome",p.nome));
      b.appendChild(el("div","preco",money(p.preco)));
      if(it) b.appendChild(el("span","badge",String(it.qtd)));
      b.addEventListener("click", () => addItem(p));
      g.appendChild(b);
    });
    area.appendChild(g);
  });
}

function addItem(p){
  const it = noCarrinho(p.id);
  if(it) it.qtd++;
  else S.carrinho.push({ pid:p.id, nome:p.nome, preco:p.preco, qtd:1 });
  atualizarCaixa();
}
function mudarQtd(pid, d){
  const it = noCarrinho(pid); if(!it) return;
  it.qtd += d;
  if(it.qtd <= 0) S.carrinho = S.carrinho.filter(x => x.pid !== pid);
  atualizarCaixa();
}
const totalCarrinho = () => S.carrinho.reduce((a,i) => a + i.preco*i.qtd, 0);
const qtdItens     = () => S.carrinho.reduce((a,i) => a + i.qtd, 0);

function renderCarrinho(){
  const lista = $("#lista-carrinho"); lista.innerHTML = "";
  if(!S.carrinho.length){ lista.appendChild(el("div","vazio","Toque nos produtos para montar o pedido.")); return; }
  S.carrinho.forEach(it => {
    const row = el("div","item");
    const info = el("div","info");
    info.appendChild(el("div","n",it.nome));
    info.appendChild(el("div","u", money(it.preco)+" cada"));
    row.appendChild(info);
    const q = el("div","qtd");
    const menos = el("button",null,"−"); menos.addEventListener("click", ()=>mudarQtd(it.pid,-1));
    const mais  = el("button",null,"+"); mais.addEventListener("click", ()=>mudarQtd(it.pid,1));
    q.append(menos, el("span",null,String(it.qtd)), mais);
    row.appendChild(q);
    row.appendChild(el("div","tot", money(it.preco*it.qtd)));
    lista.appendChild(row);
  });
}

function renderPagamentos(){
  const box = $("#pgs"); box.innerHTML = "";
  PAGAMENTOS.forEach(p => {
    const b = el("button","pg" + (S.pagamentoSel===p.id ? " sel" : ""));
    b.appendChild(el("span","ic",p.ic));
    b.appendChild(document.createTextNode(p.nome));
    b.addEventListener("click", () => { S.pagamentoSel = (S.pagamentoSel===p.id ? null : p.id); atualizarCaixa(); });
    box.appendChild(b);
  });
}

function calcTroco(){
  const box = $("#box-troco");
  if(S.pagamentoSel !== "dinheiro"){ box.classList.remove("on"); $("#in-recebido").value=""; $("#troco-val").textContent=""; return true; }
  box.classList.add("on");
  const rec = parseMoney($("#in-recebido").value), tot = totalCarrinho(), out = $("#troco-val");
  if(!rec){ out.textContent=""; return true; }
  if(rec < tot){ out.textContent = "Falta " + money(tot-rec); out.style.color = "var(--vermelho)"; return false; }
  out.textContent = "Troco " + money(rec-tot); out.style.color = "var(--verde)";
  return true;
}

function atualizarCaixa(){
  const tot = totalCarrinho();
  $("#tot-val").textContent = money(tot);
  $("#bt-total").textContent = money(tot);
  const n = qtdItens();
  $("#bt-itens").textContent = n===1 ? "1 item" : `${n} itens`;
  renderGrade(); renderCarrinho(); renderPagamentos();
  const ok = calcTroco();
  $("#btn-finalizar").disabled = !(S.carrinho.length && S.pagamentoSel && ok);
  $("#btn-finalizar").textContent = S.carrinho.length ? "Finalizar venda · " + money(tot) : "Finalizar venda";
}

const abrirCarrinho  = () => { $("#carrinho").classList.add("aberto"); document.body.classList.add("carrinho-aberto"); };
const fecharCarrinho = () => { $("#carrinho").classList.remove("aberto"); document.body.classList.remove("carrinho-aberto"); };

function finalizar(){
  const tot = totalCarrinho();
  if(!S.carrinho.length || !S.pagamentoSel) return;
  const rec = S.pagamentoSel === "dinheiro" ? parseMoney($("#in-recebido").value) : 0;
  if(S.pagamentoSel === "dinheiro" && rec && rec < tot) return;

  const agora = Date.now();
  const venda = {
    dia: chaveDia(agora),
    ts: FB.serverTimestamp(),
    tsLocal: agora,
    itens: S.carrinho.map(i => ({ pid:i.pid, nome:i.nome, preco:i.preco, qtd:i.qtd })),
    total: tot,
    pagamento: S.pagamentoSel,
    recebido: rec || null,
    troco: (rec && rec >= tot) ? (rec - tot) : null,
    cancelada: false,
    uid: S.usuario.uid,
    autor: S.perfil?.nome || S.usuario.email
  };

  // não esperamos a nuvem responder: offline a promessa só resolve depois
  FB.addDoc(FB.collection(FB.bd,"vendas"), venda).catch(e => {
    console.warn("venda:", e);
    toast("A venda não subiu: " + traduzErro(e));
  });

  let msg = "Venda de " + money(tot) + " registrada";
  if(S.pagamentoSel === "dinheiro" && rec > tot) msg += " · troco " + money(rec - tot);
  S.carrinho = []; S.pagamentoSel = null;
  $("#in-recebido").value = ""; $("#in-busca").value = "";
  atualizarCaixa(); fecharCarrinho(); $("#area-produtos").scrollTop = 0; toast(msg);
}

/* ===================== PRODUTOS ===================== */
function renderProdutos(){
  const topo = $("#prod-topo"); topo.innerHTML = "";
  const box  = $("#lista-produtos"); box.innerHTML = "";

  if(!ehAdmin()){
    topo.appendChild(el("div","aviso-inline","Só quem é administrador pode alterar produtos e preços. Você pode conferir a lista abaixo."));
  }else{
    const b = el("button","btn bloco","+ Novo produto");
    b.addEventListener("click", () => abrirModalProd(null));
    topo.appendChild(b);
    if(!S.produtos.length && !S.carregandoProdutos){
      const imp = el("button","btn bloco sec","Importar a lista de 34 produtos da planilha");
      imp.addEventListener("click", importarCatalogo);
      topo.appendChild(imp);
    }
  }

  if(S.carregandoProdutos){
    const c = el("div","carregando"); c.appendChild(el("div","spin"));
    c.appendChild(el("span",null,"Carregando...")); box.appendChild(c); return;
  }
  if(!S.produtos.length){ box.appendChild(el("div","vazio","Nenhum produto cadastrado.")); return; }

  const mapa = {};
  S.produtos.forEach(p => { const c = (p.cat||"Geral").trim() || "Geral"; (mapa[c] ||= []).push(p); });
  const cats = Object.keys(mapa).sort((a,b)=>a.localeCompare(b,"pt-BR"));
  const dl = $("#dl-cats"); dl.innerHTML = "";
  cats.forEach(c => { const o = document.createElement("option"); o.value = c; dl.appendChild(o); });

  cats.forEach(c => {
    const card = el("div","card");
    card.appendChild(el("h3",null,c));
    mapa[c].sort((a,b)=>a.nome.localeCompare(b.nome,"pt-BR")).forEach(p => {
      const row = el("div","linha-prod" + (p.ativo===false ? " off" : ""));
      const nm = el("div","nm");
      nm.appendChild(el("b",null,p.nome));
      if(p.ativo === false) nm.appendChild(el("small",null,"Oculto no caixa"));
      row.appendChild(nm);
      row.appendChild(el("div","pr", money(p.preco)));
      if(ehAdmin()){
        const olho = el("button","acao");
        olho.innerHTML = p.ativo === false
          ? '<svg viewBox="0 0 24 24"><path d="M3 3l18 18M10.6 10.6A2 2 0 0 0 12 14a2 2 0 0 0 1.4-.6"/><path d="M9.9 5.1A9.5 9.5 0 0 1 12 5c5 0 9 4.5 9 7 0 .9-.7 2.2-1.9 3.4M6.5 6.7C4.3 8.1 3 10.2 3 12c0 2.5 4 7 9 7 1.4 0 2.7-.3 3.8-.9"/></svg>'
          : '<svg viewBox="0 0 24 24"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>';
        olho.title = "Mostrar/ocultar no caixa";
        olho.addEventListener("click", async () => {
          try{ await FB.updateDoc(FB.doc(FB.bd,"produtos",p.id), { ativo: p.ativo === false }); }
          catch(e){ toast(traduzErro(e)); }
        });
        row.appendChild(olho);
        const lapis = el("button","acao");
        lapis.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>';
        lapis.addEventListener("click", () => abrirModalProd(p));
        row.appendChild(lapis);
      }
      card.appendChild(row);
    });
    box.appendChild(card);
  });
}

async function importarCatalogo(){
  confirmar("Importar produtos", "Vou cadastrar os 34 produtos da planilha com os preços de lá.", async () => {
    try{
      const lote = FB.writeBatch(FB.bd);
      CATALOGO_INICIAL.forEach(p => {
        lote.set(FB.doc(FB.collection(FB.bd,"produtos")), {
          nome:p.nome, preco:p.preco, cat:p.cat, ativo: p.ativo !== false
        });
      });
      await lote.commit();
      toast("Produtos importados");
    }catch(e){ toast(traduzErro(e)); }
  });
}

function abrirModalProd(p){
  S.editandoId = p ? p.id : null;
  $("#mp-titulo").textContent = p ? "Editar produto" : "Novo produto";
  $("#mp-nome").value  = p ? p.nome : "";
  $("#mp-preco").value = p ? moneyNum(p.preco) : "";
  $("#mp-cat").value   = p ? (p.cat || "") : "";
  $("#mp-excluir").style.display = p ? "flex" : "none";
  $("#modal-prod").classList.add("on");
  setTimeout(() => $("#mp-nome").focus(), 80);
}
const fecharModalProd = () => { $("#modal-prod").classList.remove("on"); S.editandoId = null; };

async function salvarProduto(){
  const nome = $("#mp-nome").value.trim();
  const preco = parseMoney($("#mp-preco").value);
  const cat = $("#mp-cat").value.trim() || "Geral";
  if(!nome)   return toast("Informe o nome do produto");
  if(preco<=0) return toast("Informe um preço válido");
  try{
    if(S.editandoId){
      await FB.updateDoc(FB.doc(FB.bd,"produtos",S.editandoId), { nome, preco, cat });
      const it = noCarrinho(S.editandoId);
      if(it){ it.nome = nome; it.preco = preco; }
    }else{
      await FB.addDoc(FB.collection(FB.bd,"produtos"), { nome, preco, cat, ativo:true });
    }
    fecharModalProd(); atualizarCaixa(); toast("Produto salvo");
  }catch(e){ toast(traduzErro(e)); }
}

function excluirProduto(){
  const id = S.editandoId; if(!id) return;
  confirmar("Excluir produto","O produto sai da lista. As vendas já registradas continuam no relatório.", async () => {
    try{
      await FB.deleteDoc(FB.doc(FB.bd,"produtos",id));
      S.carrinho = S.carrinho.filter(i => i.pid !== id);
      fecharModalProd(); atualizarCaixa(); toast("Produto excluído");
    }catch(e){ toast(traduzErro(e)); }
  });
}

/* ===================== RELATÓRIO ===================== */
function ordenadas(vendas){
  return [...vendas].sort((a,b) => (a.tsLocal||0) - (b.tsLocal||0));
}
function resumo(vendas){
  const validas = vendas.filter(v => !v.cancelada);
  let total = 0;
  const porPg = {}, porProd = {};
  PAGAMENTOS.forEach(p => porPg[p.id] = { nome:p.nome, qtd:0, total:0 });
  validas.forEach(v => {
    total += v.total || 0;
    porPg[v.pagamento] ||= { nome: nomePg(v.pagamento), qtd:0, total:0 };
    porPg[v.pagamento].qtd++; porPg[v.pagamento].total += v.total || 0;
    (v.itens||[]).forEach(i => {
      porProd[i.nome] ||= { nome:i.nome, qtd:0, total:0 };
      porProd[i.nome].qtd += i.qtd;
      porProd[i.nome].total += i.preco * i.qtd;
    });
  });
  const prods = Object.values(porProd).sort((a,b) => b.total-a.total || a.nome.localeCompare(b.nome,"pt-BR"));
  const pgs = PAGAMENTOS.map(p => porPg[p.id])
    .concat(Object.keys(porPg).filter(k => !PAGAMENTOS.some(p=>p.id===k)).map(k => porPg[k]));
  return { total, nvendas: validas.length, prods, pgs, canceladas: vendas.length - validas.length };
}

function renderRelatorio(){
  const box = $("#conteudo-relatorio");
  const chave = S.diaRelatorio;
  const vendas = ordenadas(S.vendasDia);
  const r = resumo(vendas);
  let h = "";

  h += '<div class="kpis">';
  h += `<div class="kpi destaque"><small>Total recebido</small><b>${esc(money(r.total))}</b></div>`;
  h += `<div class="kpi"><small>Vendas</small><b>${r.nvendas}</b></div>`;
  h += `<div class="kpi"><small>Ticket médio</small><b>${esc(money(r.nvendas ? Math.round(r.total/r.nvendas) : 0))}</b></div>`;
  h += "</div>";

  if(S.carregandoVendas){
    box.innerHTML = h + '<div class="card"><div class="carregando"><div class="spin"></div><span>Carregando vendas...</span></div></div>';
    return;
  }
  if(!vendas.length){
    box.innerHTML = h + `<div class="card"><div class="vazio">Nenhuma venda registrada em ${esc(dataBR(chave))}.</div></div>`;
    return;
  }

  h += '<div class="card"><h3>Por forma de pagamento</h3><table class="t"><thead><tr>'
     + '<th>Forma</th><th class="num">Vendas</th><th class="num">Valor</th></tr></thead><tbody>';
  r.pgs.forEach(p => { h += `<tr><td>${esc(p.nome)}</td><td class="num">${p.qtd}</td><td class="num">${esc(money(p.total))}</td></tr>`; });
  h += `</tbody><tfoot><tr><td>Total</td><td class="num">${r.nvendas}</td><td class="num">${esc(money(r.total))}</td></tr></tfoot></table></div>`;

  h += '<div class="card"><h3>Produtos vendidos</h3><table class="t"><thead><tr>'
     + '<th>Produto</th><th class="num">Qtd</th><th class="num">Valor</th></tr></thead><tbody>';
  let somaQ = 0;
  r.prods.forEach(p => { somaQ += p.qtd; h += `<tr><td>${esc(p.nome)}</td><td class="num">${p.qtd}</td><td class="num">${esc(money(p.total))}</td></tr>`; });
  h += `</tbody><tfoot><tr><td>Total</td><td class="num">${somaQ}</td><td class="num">${esc(money(r.total))}</td></tr></tfoot></table></div>`;

  h += '<div class="card"><h3>Vendas do dia</h3><table class="t"><thead><tr>'
     + '<th>Hora</th><th>Itens</th><th>Pgto</th><th class="num">Valor</th><th></th></tr></thead><tbody>';
  vendas.forEach(v => {
    const desc = (v.itens||[]).map(i => `${i.qtd}x ${i.nome}`).join(", ");
    h += `<tr class="${v.cancelada ? "venda-cancelada" : ""}">`
       + `<td>${esc(hora(v.tsLocal))}${v.autor ? `<div class="autor">${esc(String(v.autor).split(" ")[0])}</div>` : ""}</td>`
       + `<td style="font-size:13px;color:var(--muted)">${esc(desc)}</td>`
       + `<td style="font-size:13px">${esc(nomePg(v.pagamento))}</td>`
       + `<td class="num">${esc(money(v.total))}</td>`
       + `<td class="num">${(ehAdmin() && !v.cancelada)
            ? `<button class="del-venda" data-id="${esc(v.id)}" style="color:var(--vermelho);font-size:19px;padding:2px 6px" title="Cancelar venda">&times;</button>` : ""}</td></tr>`;
  });
  h += "</tbody></table>";
  if(r.canceladas) h += `<p class="sub" style="margin:10px 0 0">${r.canceladas} venda(s) cancelada(s) não entram no total.</p>`;
  h += "</div>";
  box.innerHTML = h;

  box.querySelectorAll(".del-venda").forEach(btn => {
    btn.addEventListener("click", () => {
      confirmar("Cancelar venda","A venda deixa de contar no relatório, mas fica registrada como cancelada.", async () => {
        try{
          await FB.updateDoc(FB.doc(FB.bd,"vendas",btn.dataset.id), {
            cancelada:true, canceladaPor: S.perfil?.nome || S.usuario.email, canceladaEm: FB.serverTimestamp()
          });
          toast("Venda cancelada");
        }catch(e){ toast(traduzErro(e)); }
      });
    });
  });
}

function montarImpressao(){
  const chave = S.diaRelatorio;
  const vendas = ordenadas(S.vendasDia);
  const r = resumo(vendas);
  const ag = Date.now();
  let h = "";
  h += `<div class="cab"><img src="logo-azul.png" alt="Igreja Onda">`
     + `<div class="tt"><b>${esc(S.config.loja || "Cafeteria")}</b>`
     + `<span>Relatório de vendas &middot; ${esc(dataBR(chave))}</span></div></div>`;
  h += '<div class="resumo">'
     + `<div><small>Total recebido</small><b>${esc(money(r.total))}</b></div>`
     + `<div><small>Nº de vendas</small><b>${r.nvendas}</b></div>`
     + `<div><small>Ticket médio</small><b>${esc(money(r.nvendas ? Math.round(r.total/r.nvendas) : 0))}</b></div>`
     + "</div>";

  if(!r.nvendas){
    h += "<p style='margin-top:24px'>Nenhuma venda registrada nesta data.</p>";
    $("#impressao").innerHTML = h; return;
  }

  h += '<h4>Recebimentos por forma de pagamento</h4><table><thead><tr>'
     + '<th>Forma de pagamento</th><th class="num">Vendas</th><th class="num">Valor</th></tr></thead><tbody>';
  r.pgs.forEach(p => { h += `<tr><td>${esc(p.nome)}</td><td class="num">${p.qtd}</td><td class="num">${esc(money(p.total))}</td></tr>`; });
  h += `</tbody><tfoot><tr><td>TOTAL</td><td class="num">${r.nvendas}</td><td class="num">${esc(money(r.total))}</td></tr></tfoot></table>`;

  h += '<h4>Produtos vendidos</h4><table><thead><tr>'
     + '<th>Produto</th><th class="num">Qtd</th><th class="num">Valor unit.</th><th class="num">Total</th></tr></thead><tbody>';
  let somaQ = 0;
  r.prods.forEach(p => { somaQ += p.qtd;
    h += `<tr><td>${esc(p.nome)}</td><td class="num">${p.qtd}</td>`
       + `<td class="num">${esc(money(Math.round(p.total/p.qtd)))}</td>`
       + `<td class="num">${esc(money(p.total))}</td></tr>`; });
  h += `</tbody><tfoot><tr><td>TOTAL</td><td class="num">${somaQ}</td><td></td><td class="num">${esc(money(r.total))}</td></tr></tfoot></table>`;

  h += '<h4>Detalhamento das vendas</h4><table><thead><tr>'
     + '<th>Hora</th><th>Itens</th><th>Pagamento</th><th>Registrada por</th><th class="num">Valor</th></tr></thead><tbody>';
  vendas.filter(v => !v.cancelada).forEach(v => {
    const desc = (v.itens||[]).map(i => `${i.qtd}x ${i.nome}`).join(", ");
    h += `<tr><td>${esc(hora(v.tsLocal))}</td><td>${esc(desc)}</td><td>${esc(nomePg(v.pagamento))}</td>`
       + `<td>${esc(v.autor || "")}</td><td class="num">${esc(money(v.total))}</td></tr>`;
  });
  h += "</tbody></table>";
  h += `<div class="assin"><div>${esc(S.config.resp || "Responsável pelo caixa")}</div><div>Conferido por</div></div>`;
  h += `<div class="rodape">Emitido em ${esc(dataBR(chaveDia(ag)) + " às " + hora(ag))}</div>`;
  $("#impressao").innerHTML = h;
}

/* ===================== EQUIPE ===================== */
function renderUsuarios(){
  const box = $("#lista-usuarios"); box.innerHTML = "";
  if(!ehAdmin()) return;
  if(!S.usuarios.length){ box.appendChild(el("div","vazio","Ninguém cadastrado ainda.")); return; }

  const pend = S.usuarios.filter(u => !u.aprovado);
  const ativos = S.usuarios.filter(u => u.aprovado);
  const grupos = [["Aguardando liberação", pend], ["Com acesso liberado", ativos]];

  grupos.forEach(([titulo, lista]) => {
    if(!lista.length) return;
    const card = el("div","card");
    card.appendChild(el("h3",null,titulo));
    lista.sort((a,b)=> (a.nome||"").localeCompare(b.nome||"","pt-BR")).forEach(u => {
      const row = el("div","usuario");
      row.appendChild(el("div","av", iniciais(u.nome, u.email)));
      const dd = el("div","dd");
      dd.appendChild(el("b",null,(u.nome || u.email) + (u.id === S.usuario.uid ? " (você)" : "")));
      dd.appendChild(el("small",null,u.email || ""));
      row.appendChild(dd);
      row.appendChild(el("span","tag" + (u.papel==="admin" ? " adm" : (!u.aprovado ? " pend" : "")),
        !u.aprovado ? "Pendente" : (u.papel==="admin" ? "Admin" : "Caixa")));

      if(u.id !== S.usuario.uid){
        if(!u.aprovado){
          const b = el("button","btn","Liberar");
          b.addEventListener("click", () => mudarUsuario(u, { aprovado:true }));
          row.appendChild(b);
        }else{
          const b = el("button","btn sec", u.papel==="admin" ? "Tirar admin" : "Tornar admin");
          b.addEventListener("click", () => confirmar(
            u.papel==="admin" ? "Tirar administrador" : "Tornar administrador",
            u.papel==="admin" ? `${u.nome||u.email} deixa de poder alterar produtos e cancelar vendas.`
                              : `${u.nome||u.email} poderá alterar produtos, cancelar vendas e liberar pessoas.`,
            () => mudarUsuario(u, { papel: u.papel==="admin" ? "caixa" : "admin" })));
          row.appendChild(b);
          const x = el("button","btn perigo","Bloquear");
          x.addEventListener("click", () => confirmar("Bloquear acesso",
            `${u.nome||u.email} não conseguirá mais entrar no sistema.`,
            () => mudarUsuario(u, { aprovado:false, papel:"caixa" })));
          row.appendChild(x);
        }
      }
      card.appendChild(row);
    });
    box.appendChild(card);
  });
}

async function mudarUsuario(u, dados){
  try{ await FB.updateDoc(FB.doc(FB.bd,"usuarios",u.id), dados); toast("Atualizado"); }
  catch(e){ toast(traduzErro(e)); }
}

function renderMinhaConta(){
  const box = $("#minha-conta"); box.innerHTML = "";
  if(!S.perfil) return;
  box.appendChild(el("div","av", iniciais(S.perfil.nome, S.perfil.email)));
  const dd = el("div","dd");
  dd.appendChild(el("b",null,S.perfil.nome || ""));
  dd.appendChild(el("small",null,S.perfil.email || ""));
  box.appendChild(dd);
  box.appendChild(el("span","tag" + (ehAdmin() ? " adm" : ""), ehAdmin() ? "Admin" : "Caixa"));
}

/* ===================== AJUSTES ===================== */
let salvaT;
function salvarConfig(){
  clearTimeout(salvaT);
  salvaT = setTimeout(async () => {
    if(!ehAdmin()) return;
    try{
      await FB.setDoc(FB.doc(FB.bd,"config","geral"),
        { loja: $("#in-nome-loja").value, resp: $("#in-resp").value }, { merge:true });
    }catch(e){ console.warn("config:", e); }
  }, 700);
}

function exportarDia(){
  const dados = JSON.stringify({
    dia: S.diaRelatorio, loja: S.config.loja,
    geradoEm: new Date().toISOString(),
    vendas: ordenadas(S.vendasDia), resumo: resumo(S.vendasDia)
  }, null, 2);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([dados], {type:"application/json"}));
  a.download = `vendas-${S.diaRelatorio}.json`;
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  toast("Arquivo gerado");
}

/* ===================== NAVEGAÇÃO ===================== */
function irPara(nome){
  $$(".tela").forEach(t => t.classList.remove("on"));
  $("#tela-" + nome).classList.add("on");
  $$("#tabs button").forEach(b => b.classList.toggle("on", b.dataset.tela === nome));
  if(nome === "produtos") renderProdutos();
  if(nome === "relatorio") renderRelatorio();
  if(nome === "equipe") renderUsuarios();
  fecharCarrinho();
}

/* ===================== SERVICE WORKER ===================== */
function registrarSW(){
  if(!/^https?:/.test(location.protocol) || !("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("sw.js").then(reg => {
    if(reg.waiting) mostrarAtualizacao(reg);
    reg.addEventListener("updatefound", () => {
      const novo = reg.installing; if(!novo) return;
      novo.addEventListener("statechange", () => {
        if(novo.state === "installed" && navigator.serviceWorker.controller) mostrarAtualizacao(reg);
      });
    });
    setInterval(() => reg.update(), 60*60*1000);
  }).catch(()=>{});
  let recarregou = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if(recarregou) return; recarregou = true; location.reload();
  });
}
function mostrarAtualizacao(reg){
  const a = $("#aviso");
  a.textContent = "Nova versão disponível — toque aqui para atualizar";
  a.className = "on atualizar";
  a.onclick = () => {
    a.textContent = "Atualizando...";
    if(reg.waiting) reg.waiting.postMessage({ tipo:"atualizar" });
    else location.reload();
  };
}

/* ===================== INÍCIO ===================== */
async function init(){
  // eventos que não dependem do Firebase
  $$("#tabs button").forEach(b => b.addEventListener("click", () => irPara(b.dataset.tela)));
  $("#bt-abrir").addEventListener("click", abrirCarrinho);
  $("#carrinho").querySelector("h3").addEventListener("click", (e) => {
    if(e.target.id !== "btn-limpar" && document.body.classList.contains("carrinho-aberto")) fecharCarrinho();
  });
  $("#btn-limpar").addEventListener("click", () => {
    if(!S.carrinho.length){ fecharCarrinho(); return; }
    S.carrinho = []; S.pagamentoSel = null; $("#in-recebido").value = "";
    atualizarCaixa(); fecharCarrinho();
  });
  $("#btn-finalizar").addEventListener("click", finalizar);
  $("#in-recebido").addEventListener("input", () => {
    const ok = calcTroco();
    $("#btn-finalizar").disabled = !(S.carrinho.length && S.pagamentoSel && ok);
  });
  $("#in-busca").addEventListener("input", renderGrade);
  $("#in-busca").addEventListener("search", renderGrade);
  $("#in-busca").addEventListener("keydown", function(e){ if(e.key === "Enter") this.blur(); });

  $("#mp-cancelar").addEventListener("click", fecharModalProd);
  $("#mp-salvar").addEventListener("click", salvarProduto);
  $("#mp-excluir").addEventListener("click", excluirProduto);
  $("#modal-prod").addEventListener("click", function(e){ if(e.target === this) fecharModalProd(); });
  $("#mc-nao").addEventListener("click", () => { $("#modal-conf").classList.remove("on"); confCb = null; });
  $("#mc-sim").addEventListener("click", () => {
    $("#modal-conf").classList.remove("on");
    if(confCb){ const f = confCb; confCb = null; f(); }
  });
  $("#modal-conf").addEventListener("click", function(e){
    if(e.target === this){ this.classList.remove("on"); confCb = null; }
  });

  $("#in-data").value = S.diaRelatorio;
  $("#in-data").addEventListener("change", function(){
    S.diaRelatorio = this.value || chaveDia(Date.now());
    assinarDia(S.diaRelatorio);
  });
  $("#btn-hoje").addEventListener("click", () => {
    S.diaRelatorio = chaveDia(Date.now());
    $("#in-data").value = S.diaRelatorio;
    assinarDia(S.diaRelatorio);
  });
  $("#btn-imprimir").addEventListener("click", () => { montarImpressao(); setTimeout(() => window.print(), 120); });
  $("#in-nome-loja").addEventListener("input", salvarConfig);
  $("#in-resp").addEventListener("input", salvarConfig);
  $("#btn-exportar").addEventListener("click", exportarDia);

  $("#lg-acao").addEventListener("click", acaoLogin);
  $("#lg-senha").addEventListener("keydown", (e) => { if(e.key === "Enter") acaoLogin(); });
  $("#lg-alternar").addEventListener("click", () => alternarModo(!modoCriar));
  $("#lg-esqueci").addEventListener("click", recuperarSenha);
  $("#esp-sair").addEventListener("click", () => FB.a.signOut(FB.auth));
  $("#esp-recarregar").addEventListener("click", () => location.reload());
  $("#btn-sair").addEventListener("click", () => confirmar("Sair","Você vai precisar entrar de novo com e-mail e senha.",
    async () => { pararEscutas(); await FB.a.signOut(FB.auth); location.reload(); }));

  window.addEventListener("online",  atualizarHeader);
  window.addEventListener("offline", atualizarHeader);

  atualizarCaixa();
  registrarSW();

  if(configPendente()){ $("#tela-config").classList.add("on"); return; }

  try{
    await carregarFirebase();
  }catch(e){
    console.error(e);
    $("#cfg-msg").textContent = "Não consegui carregar o Firebase. Verifique a internet e as chaves em config.js.";
    $("#tela-config").classList.add("on");
    return;
  }

  FB.a.onAuthStateChanged(FB.auth, async (user) => {
    if(user){ await aoEntrar(user); }
    else{
      pararEscutas(); escutasDados = false;
      S.usuario = null; S.perfil = null;
      alternarModo(false);
      mostrarLogin();
    }
  });

  window.__api = { S, FB, addItem, finalizar, montarImpressao, resumo, irPara, atualizarCaixa,
                   setPg: (p) => { S.pagamentoSel = p; atualizarCaixa(); } };
}

if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
