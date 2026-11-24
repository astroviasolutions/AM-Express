/**
 * Sistema de Notificações Push
 * Este script permite que usuários recebam notificações quando o aplicativo estiver instalado
 */

// Verifica se o navegador suporta notificações push
function verificarSuporteNotificacoes() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('Notificações push não são suportadas por este navegador');
    return false;
  }
  return true;
}

// Verifica se as permissões de notificação já foram concedidas
async function verificarPermissoesNotificacao() {
  if (!verificarSuporteNotificacoes()) {
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission === 'denied') {
    console.log('Permissão de notificação negada pelo usuário');
    return false;
  }
  
  // Se a permissão ainda não foi solicitada, retorne null
  return null;
}

// Solicita permissão para notificações
async function solicitarPermissaoNotificacao() {
  try {
    const permissao = await Notification.requestPermission();
    return permissao === 'granted';
  } catch (e) {
    console.error('Erro ao solicitar permissão de notificação', e);
    return false;
  }
}

// Registra o endpoint de push no servidor
async function registrarEndpointNoServidor(subscription, tipoUsuario, usuarioId) {
  try {
    const response = await fetch('/api/registrar-notificacao.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscription: subscription,
        tipo_usuario: tipoUsuario, // 'cliente' ou 'motoboy'
        usuario_id: usuarioId
      })
    });
    
    if (!response.ok) {
      throw new Error('Falha ao registrar endpoint no servidor');
    }
    
    const data = await response.json();
    console.log('Endpoint registrado com sucesso:', data);
    return data;
  } catch (e) {
    console.error('Erro ao registrar endpoint:', e);
    return null;
  }
}

// Converte a chave VAPID (texto base64url) para o formato exigido pelo navegador
function chaveParaUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) {
    output[i] = raw.charCodeAt(i);
  }
  return output;
}

// Compara a chave usada numa inscricao existente com a chave atual do servidor
function mesmaChave(subscription, chaveAtual) {
  const usada = subscription.options && subscription.options.applicationServerKey;
  if (!usada) return true; // navegador nao informa: mantem a inscricao
  const a = new Uint8Array(usada);
  if (a.length !== chaveAtual.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== chaveAtual[i]) return false;
  }
  return true;
}

// Inscreve o usuário para receber notificações
async function inscreverParaNotificacoes(tipoUsuario, usuarioId) {
  if (!verificarSuporteNotificacoes()) {
    return false;
  }
  
  // Verificar ou solicitar permissão
  const permissao = await verificarPermissoesNotificacao();
  if (permissao === false) {
    return false; // Permissão negada
  } else if (permissao === null) {
    const solicitada = await solicitarPermissaoNotificacao();
    if (!solicitada) {
      return false;
    }
  }
  
  try {
    // Obter o service worker registration
    const registration = await navigator.serviceWorker.ready;
    
    // Obter a chave pública VAPID do servidor
    const response = await fetch('/api/get-vapid-key.php');
    if (!response.ok) {
      console.warn('[Push] Chave VAPID indisponível no servidor');
      return false;
    }
    const vapidKey = chaveParaUint8Array((await response.text()).trim());

    // Verificar se já existe uma subscription
    let subscription = await registration.pushManager.getSubscription();

    // Se a inscrição antiga foi feita com outra chave, refaz
    if (subscription && !mesmaChave(subscription, vapidKey)) {
      await subscription.unsubscribe();
      subscription = null;
    }

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey
      });
    }
    
    // Registrar subscription no servidor
    await registrarEndpointNoServidor(subscription, tipoUsuario, usuarioId);
    
    return true;
  } catch (e) {
    console.error('Erro ao configurar notificações push:', e);
    return false;
  }
}

// Função para inicializar o sistema de notificações
function inicializarNotificacoes() {
  // Identificar tipo de usuário e ID a partir de variáveis globais injetadas pelo servidor
  const tipoUsuario = window.USUARIO_TIPO || document.body.dataset.tipoUsuario;
  const usuarioId   = window.USUARIO_ID   || document.body.dataset.usuarioId;

  if (tipoUsuario && usuarioId) {
    // Inscrever para notificações no navegador ou no app instalado
    inscreverParaNotificacoes(tipoUsuario, usuarioId)
      .then(success => {
        if (success) {
          console.log(`[Push] ${tipoUsuario} #${usuarioId} inscrito para notificações push`);
        }
      });
  }
}

// Inicializar quando o documento estiver carregado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarNotificacoes);
} else {
  inicializarNotificacoes();
}