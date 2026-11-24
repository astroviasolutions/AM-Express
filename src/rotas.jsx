import { Navigate, Route, Routes } from 'react-router-dom';
import { useSistema } from './sistema/estado';
import { Ur, qr } from './sistema/acesso-toast';
import { Login } from './telas/login';
import { RoteiroTeste } from './telas/teste';
import { Rastreio } from './telas/rastreio';
import { Layout } from './componentes/layout';
import { VisaoGeral } from './telas/visao-geral';
import { Clientes } from './telas/clientes';
import { Analise } from './telas/analise';
import { Caixa } from './telas/caixa';
import { Financeiro } from './telas/financeiro';
import { Configuracoes } from './telas/configuracoes';
import { Equipe } from './telas/equipe';
import { Registros } from './telas/registros';
import { Processos } from './telas/processos';
import { FilaColetas } from './telas/fila-coletas';
import { Conferencia } from './telas/conferencia';
import { Expedicao } from './telas/expedicao';
import { Ocorrencias } from './telas/ocorrencias';
import { MinhasParadas } from './telas/minhas-paradas';
import { MeusGanhos } from './telas/meus-ganhos';
import { DetalheParada } from './telas/detalhe-parada';
import { NovaRemessa } from './telas/nova-remessa';
import { MinhasRemessas } from './telas/minhas-remessas';
import { Extrato } from './telas/extrato';

export function RotaProtegida({
  papeis: e,
  perm: t,
  children: n
}) {
  let {
    usuario: r,
    cfg: i
  } = useSistema();
  return r ? (t ? Ur(r, t) && (t !== "caixa" || i.caixaAtivo) : e?.includes(r.papel)) ? <>{n}</> : <Navigate to={qr(r, i.caixaAtivo)} replace /> : <Navigate to="/login" replace />;
}

export function SemAcesso() {
  let {
    usuario: e,
    sair: t
  } = useSistema();
  return <div className="mx-auto grid min-h-full max-w-md place-items-center p-6 text-center"><div><b className="disp text-3xl">Sem acesso</b><p className="mt-3 text-on2">{e ? `A conta de ${e.nome} ainda não tem nenhuma área liberada.` : ""} Peça ao dono para definir o que esta conta pode acessar.</p><button type="button" onClick={t} className="mt-5 min-h-11 rounded-full bg-on px-6 text-sm font-semibold text-frame">Trocar de perfil</button></div></div>;
}

export function RotaInicial() {
  let {
    usuario: e,
    cfg: t
  } = useSistema();
  return <Navigate to={e ? qr(e, t.caixaAtivo) : "/login"} replace />;
}

export function App() {
  return <Routes><Route path="/" element={<RotaInicial />} /><Route path="/login" element={<Login />} /><Route path="/teste" element={<RoteiroTeste />} /><Route path="/rastreio" element={<Rastreio />} /><Route path="/rastreio/:codigo" element={<Rastreio />} /><Route element={<Layout />}><Route path="/dono" element={<RotaProtegida perm="visao"><VisaoGeral /></RotaProtegida>} /><Route path="/dono/clientes" element={<RotaProtegida perm="clientes"><Clientes /></RotaProtegida>} /><Route path="/dono/analise" element={<RotaProtegida perm="analise"><Analise /></RotaProtegida>} /><Route path="/dono/caixa" element={<RotaProtegida perm="caixa"><Caixa /></RotaProtegida>} /><Route path="/dono/financeiro" element={<RotaProtegida perm="financeiro"><Financeiro /></RotaProtegida>} /><Route path="/dono/configuracoes" element={<RotaProtegida perm="configuracoes"><Configuracoes /></RotaProtegida>} /><Route path="/dono/equipe" element={<RotaProtegida perm="equipe"><Equipe /></RotaProtegida>} /><Route path="/dono/registros" element={<RotaProtegida perm="registros"><Registros /></RotaProtegida>} /><Route path="/op/processos" element={<RotaProtegida perm="operacao"><Processos /></RotaProtegida>} /><Route path="/op/fila" element={<RotaProtegida perm="operacao"><FilaColetas /></RotaProtegida>} /><Route path="/op/conferencia" element={<RotaProtegida perm="operacao"><Conferencia /></RotaProtegida>} /><Route path="/op/expedicao" element={<RotaProtegida perm="operacao"><Expedicao /></RotaProtegida>} /><Route path="/op/ocorrencias" element={<RotaProtegida perm="operacao"><Ocorrencias /></RotaProtegida>} /><Route path="/mot" element={<RotaProtegida papeis={["motorista"]}><MinhasParadas /></RotaProtegida>} /><Route path="/mot/ganhos" element={<RotaProtegida papeis={["motorista"]}><MeusGanhos /></RotaProtegida>} /><Route path="/mot/:id" element={<RotaProtegida papeis={["motorista"]}><DetalheParada /></RotaProtegida>} /><Route path="/cli/nova" element={<RotaProtegida papeis={["cliente"]}><NovaRemessa /></RotaProtegida>} /><Route path="/cli/remessas" element={<RotaProtegida papeis={["cliente"]}><MinhasRemessas /></RotaProtegida>} /><Route path="/cli/extrato" element={<RotaProtegida papeis={["cliente"]}><Extrato /></RotaProtegida>} /></Route><Route path="/sem-acesso" element={<SemAcesso />} /><Route path="*" element={<RotaInicial />} /></Routes>;
}

