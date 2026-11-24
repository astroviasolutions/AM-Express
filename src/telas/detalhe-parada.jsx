import { useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSistema } from '../sistema/estado';
import { useToast } from '../sistema/acesso-toast';
import { B, Ci_, Ii_, L, R, V, Z } from '../componentes/ui';

export var Do = ["Destinatário ausente", "Endereço não encontrado", "Recusou o pacote", "Local fechado", "Outro motivo"];

export function Oo() {
  return new Promise(e => {
    if (!("geolocation" in navigator)) return e(void 0);
    navigator.geolocation.getCurrentPosition(t => e({
      lat: +t.coords.latitude.toFixed(6),
      lng: +t.coords.longitude.toFixed(6),
      precisao: Math.round(t.coords.accuracy)
    }), () => e(void 0), {
      enableHighAccuracy: !0,
      timeout: 8e3,
      maximumAge: 3e4
    });
  });
}

export async function ko(e) {
  let t = await createImageBitmap(e),
    n = Math.min(1, 900 / Math.max(t.width, t.height)),
    r = document.createElement("canvas");
  return r.width = Math.round(t.width * n), r.height = Math.round(t.height * n), r.getContext("2d").drawImage(t, 0, 0, r.width, r.height), r.toDataURL("image/jpeg", .6);
}

export function DetalheParada() {
  let {
      id: e
    } = useParams(),
    {
      minhasRemessas: t,
      clienteDe: n,
      entregar: r,
      registrarOcorrencia: i
    } = useSistema(),
    a = useToast(),
    o = useNavigate(),
    s = t.find(t => t.id === e),
    [c, l] = useState(""),
    [u, d] = useState(""),
    [f, p] = useState(!0),
    [m, h] = useState(!1),
    [g, v] = useState(),
    [y, b] = useState(Do[0]),
    [x, S] = useState(!1),
    C = useRef(null);
  if (!s) return <L><p>Essa entrega não está na sua lista.</p><Link to="/mot" className="mt-3 inline-block underline">Voltar às paradas</Link></L>;
  let w = s.telefone.replace(/\D/g, "");
  return <><Link to="/mot" className="mb-2 inline-flex min-h-11 items-center text-sm text-on2 hover:text-on">← Minhas paradas</Link><Ii_ sub={s.endereco}>{s.destinatario}</Ii_><div className="grid gap-3 lg:grid-cols-2"><L><div className="mb-3 flex flex-wrap gap-2"><V tone="blue">{s.cidade}</V><V>{s.volumes} volume(s)</V><V>{n(s.clienteId)?.nome}</V></div><p className="font-mono text-sm text-on2">{s.codigo}</p><div className="mt-4 grid grid-cols-2 gap-2"><a href={`tel:${w}`} className="grid min-h-12 place-items-center rounded-full bg-white/10 text-sm font-semibold hover:bg-white/20">Ligar</a><a href={`https://wa.me/55${w}`} target="_blank" rel="noreferrer" className="grid min-h-12 place-items-center rounded-full bg-ok text-sm font-semibold text-ink hover:brightness-110">WhatsApp</a></div></L><L tone="light" i={1}>{x ? <div className="space-y-4"><h2 className="disp text-xl">Registrar ocorrência</h2><div className={"[&_select]:!border-ink/20 [&_select]:!bg-white [&_select]:!text-ink [&_span]:!text-ink/60"}><B label="Motivo" value={y} onChange={e => b(e.target.value)}>{Do.map(e => <option key={e}>{e}</option>)}</B></div><R tone="dark" className="w-full" onClick={() => {
            i(s.id, y), a("Ocorrência registrada", "A matriz foi avisada."), o("/mot");
          }}>Registrar e avisar a matriz</R><button type="button" className="min-h-11 w-full text-sm text-ink/70 underline" onClick={() => S(!1)}>Voltar</button></div> : <div className="space-y-4"><h2 className="disp text-xl">Comprovante de entrega</h2><input ref={C} type="file" accept="image/*" capture="environment" className="sr-only" aria-label="Foto da entrega" onChange={async e => {
            let t = e.target.files?.[0];
            t && v(await ko(t));
          }} />{g ? <img src={g} alt="Foto da entrega" className="max-h-56 w-full rounded-2xl object-cover" /> : <button type="button" onClick={() => C.current?.click()} className="grid min-h-32 w-full place-items-center rounded-2xl border-2 border-dashed border-ink/25 text-sm text-ink/70 hover:bg-white">Tirar foto da entrega</button>}{g && <button type="button" className="text-xs underline" onClick={() => C.current?.click()}>Tirar outra foto</button>}<div className={"[&_input]:!border-ink/20 [&_input]:!bg-white [&_input]:!text-ink [&_span]:!text-ink/60"}><Z label="Quem recebeu" value={c} onChange={e => l(e.target.value)} placeholder="Nome de quem recebeu" /></div><div className={"[&_input]:!border-ink/20 [&_input]:!bg-white [&_input]:!text-ink [&_span]:!text-ink/60"}><Z label="Documento de quem recebeu" value={u} onChange={e => d(e.target.value)} placeholder="CPF ou RG" inputMode="numeric" /></div><Ci_ label="Registrar o local da entrega (GPS)" checked={f} onChange={p} className={"[&_*]:!text-ink"} /><R tone="acc" className="w-full" disabled={m || c.trim().length < 2 || u.trim().length < 4} onClick={async () => {
            h(!0);
            let e = f ? await Oo() : void 0;
            r(s.id, c.trim(), u.trim(), g, e), a("Entrega confirmada", e ? "O lojista foi avisado. Local registrado." : "O lojista foi avisado."), o("/mot");
          }}>{m ? "Registrando…" : "Confirmar entrega"}</R><button type="button" className="min-h-11 w-full text-sm text-ink/70 underline" onClick={() => S(!0)}>Não consegui entregar</button></div>}</L></div></>;
}

