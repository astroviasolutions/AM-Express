import { useEffect, useRef, useState } from 'react';
import { useSistema } from '../sistema/estado';
import { useToast } from '../sistema/acesso-toast';
import { Jn } from '../lib/regras';
import { Di_, R } from './ui';

/* Telefone utilizável para ligar/WhatsApp: 10 ou 11 dígitos (com ou sem o 55). */
export function telefoneValido(t) {
  let d = String(t || "").replace(/\D/g, "");
  if (d.startsWith("55") && d.length > 11) d = d.slice(2);
  return d.length === 10 || d.length === 11 ? d : "";
}

/* Botões Ligar e WhatsApp: só aparecem quando há telefone válido. */
export function BotoesContato({ telefone, className = "mt-4 grid grid-cols-2 gap-2" }) {
  let d = telefoneValido(telefone);
  if (!d) return <p className="mt-4 rounded-2xl bg-white/10 p-3 text-sm text-on2">Sem telefone cadastrado para este contato.</p>;
  return <div className={className}><a href={`tel:${d}`} className="grid min-h-12 place-items-center rounded-full bg-white/10 text-sm font-semibold hover:bg-white/20">Ligar</a><a href={`https://wa.me/55${d}`} target="_blank" rel="noreferrer" className="grid min-h-12 place-items-center rounded-full bg-ok text-sm font-semibold text-ink hover:brightness-110">WhatsApp</a></div>;
}

/* O QR da etiqueta guarda o link /rastreio/AM-XXXXXXXX; o código de barras guarda só o código. */
export function codigoDaEtiqueta(txt) {
  let m = /AM-[0-9A-F]{8}/i.exec(String(txt || ""));
  return m ? m[0].toUpperCase() : String(txt || "").trim().toUpperCase();
}

/* Lê o QR (ou o código de barras) da etiqueta do pacote com a câmera.
   Usa o BarcodeDetector do navegador e, sem ele (iPhone, por exemplo), a biblioteca jsQR.
   Sem câmera, dá para digitar o código impresso na etiqueta. */
export function LeitorEtiqueta({ codigo, titulo = "Ler a etiqueta do pacote", onOk, onClose }) {
  let video = useRef(null),
    [erro, setErro] = useState(""),
    [semCamera, setSemCamera] = useState(false),
    [digitado, setDigitado] = useState(""),
    feito = useRef(false);
  let conferir = txt => {
    if (feito.current) return;
    let c = codigoDaEtiqueta(txt);
    if (c === codigo) {
      feito.current = true;
      onOk(c);
    } else setErro(`Esse código (${c || "vazio"}) não é desta coleta. Leia a etiqueta do pacote que você está pegando.`);
  };
  useEffect(() => {
    let parar = false, stream, timer;
    (async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error("sem camera");
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
        if (parar) return stream.getTracks().forEach(t => t.stop());
        let v = video.current;
        v.srcObject = stream;
        await v.play();
        let det = window.BarcodeDetector ? new window.BarcodeDetector({ formats: ["qr_code", "code_128"] }) : null,
          jsQR = det ? null : (await import("jsqr")).default,
          cv = document.createElement("canvas"),
          ultimo = "";
        let ciclo = async () => {
          if (parar) return;
          try {
            let txt = "";
            if (det) txt = (await det.detect(v))[0]?.rawValue ?? "";
            else if (v.videoWidth) {
              cv.width = v.videoWidth;
              cv.height = v.videoHeight;
              let cx = cv.getContext("2d", { willReadFrequently: true });
              cx.drawImage(v, 0, 0);
              let im = cx.getImageData(0, 0, cv.width, cv.height);
              txt = jsQR(im.data, im.width, im.height)?.data ?? "";
            }
            if (txt && txt !== ultimo) {
              ultimo = txt;
              conferir(txt);
            }
          } catch {}
          timer = setTimeout(ciclo, 250);
        };
        ciclo();
      } catch {
        setSemCamera(true);
      }
    })();
    return () => {
      parar = true;
      clearTimeout(timer);
      stream?.getTracks().forEach(t => t.stop());
    };
  }, []);
  return <Di_ aberto onFechar={onClose} titulo={titulo}><div className="space-y-3 text-ink">{!semCamera ? <><video ref={video} muted playsInline className="aspect-square w-full rounded-2xl bg-black object-cover" aria-label="Câmera para ler a etiqueta" /><p className="text-sm text-ink/70">Aponte a câmera para o QR da etiqueta colada no pacote. A coleta só é concluída com a leitura.</p></> : <p className="rounded-2xl bg-warn/15 p-3 text-sm text-ink">Não consegui abrir a câmera. Digite o código impresso na etiqueta do pacote.</p>}{erro && <p role="alert" className="rounded-2xl bg-acc/10 p-3 text-sm text-ink">{erro}</p>}<label className="block text-xs font-semibold uppercase tracking-[.1em] text-ink/60">Ou digite o código da etiqueta<input value={digitado} onChange={e => setDigitado(e.target.value)} placeholder="AM-XXXXXXXX" autoComplete="off" className="mt-1 min-h-11 w-full rounded-xl border border-ink/20 bg-white px-3 font-mono text-sm normal-case tracking-normal text-ink" /></label><R tone="dark" className="w-full" disabled={digitado.trim().length < 6} onClick={() => conferir(digitado)}>Confirmar código</R></div></Di_>;
}

/* Resolver e reprogramar: exige a anotação do que foi combinado e a nova data. */
export function ResolverOcorrencia({ r, onClose }) {
  let { resolverOcorrencia } = useSistema(),
    toast = useToast(),
    [nota, setNota] = useState(""),
    [data, setData] = useState(""),
    [erro, setErro] = useState(""),
    campo = "min-h-11 w-full rounded-xl border border-ink/20 bg-white px-3 text-sm text-ink";
  let ok = nota.trim().length >= 5 && data >= Jn() && data !== "";
  return <Di_ aberto onFechar={onClose} titulo="Resolver e reprogramar"><div className="space-y-3 text-ink"><p className="text-sm text-ink/70"><b>{r.destinatario}</b> · {r.codigo}<br />Motivo: {r.ocorrencia?.motivo}{r.ocorrencia?.detalhe ? ` — ${r.ocorrencia.detalhe}` : ""}</p>{r.ocorrencia?.foto && <img src={r.ocorrencia.foto} alt="Foto registrada pelo motoboy" className="max-h-40 rounded-xl" />}<label className="block text-xs font-semibold uppercase tracking-[.1em] text-ink/60">O que foi combinado<textarea value={nota} onChange={e => setNota(e.target.value)} rows={3} placeholder="Ex.: falei com o destinatário, recebe sexta à tarde" className={campo + " mt-1 py-2 normal-case tracking-normal"} /></label><label className="block text-xs font-semibold uppercase tracking-[.1em] text-ink/60">Nova data de entrega<input type="date" min={Jn()} value={data} onChange={e => setData(e.target.value)} className={campo + " mt-1 normal-case tracking-normal"} /></label>{erro && <p role="alert" className="rounded-2xl bg-acc/10 p-3 text-sm">{erro}</p>}<R tone="acc" className="w-full" disabled={!ok} onClick={() => {
    try {
      resolverOcorrencia(r.id, { nota, novaData: data });
      toast("Ocorrência resolvida", "O pacote voltou para a expedição com a nova data.");
      onClose();
    } catch (e) {
      setErro(e.message);
    }
  }}>Salvar e reprogramar</R></div></Di_>;
}
