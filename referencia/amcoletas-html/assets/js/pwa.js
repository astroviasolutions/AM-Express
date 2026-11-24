// Registrar o Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registrado com sucesso:', registration.scope);
      })
      .catch((error) => {
        console.log('Falha ao registrar o Service Worker:', error);
      });
  });
}

// Função para verificar se o app já está instalado
function isAppInstalled() {
  // Se display-mode é standalone ou fullscreen, significa que o app está instalado
  if (window.matchMedia('(display-mode: standalone)').matches || 
      window.matchMedia('(display-mode: fullscreen)').matches ||
      window.navigator.standalone === true) {
    return true;
  }
  return false;
}

// Função para verificar se é um dispositivo móvel
function isMobileDevice() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Função para verificar se o banner foi fechado recentemente
function bannerWasDismissed() {
  const dismissedTime = localStorage.getItem('pwaInstallBannerDismissed');
  if (!dismissedTime) return false;
  
  // Calcular se já passaram 24 horas desde que o usuário clicou em "não obrigado"
  const now = new Date().getTime();
  const dismissedAt = parseInt(dismissedTime);
  const hoursPassed = (now - dismissedAt) / (1000 * 60 * 60);
  
  return hoursPassed < 24; // Retorna true se ainda não passaram 24 horas
}

// Variáveis para o banner de instalação
let deferredPrompt;
const installBanner = document.getElementById('install-banner');
const installButton = document.getElementById('install-button');
const closeBannerButton = document.getElementById('close-install-banner');

// Ocultar o banner inicialmente (se existir)
if (installBanner) {
  installBanner.style.display = 'none';
}

// Verificar se o app já está instalado
if (isAppInstalled()) {
  console.log('App já está instalado, não exibindo banner');
  // Se app já está instalado, não fazer nada
} else {
  // Capturar o evento beforeinstallprompt apenas se app não estiver instalado
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevenir o comportamento padrão do Chrome
    e.preventDefault();
    
    // Armazenar o evento para uso posterior
    deferredPrompt = e;
    
    // Mostrar o banner de instalação apenas se:
    // 1. O banner existe no DOM
    // 2. É um dispositivo móvel
    // 3. O usuário não recusou recentemente
    // 4. O app não está instalado (já verificado pelo bloco if/else externo)
    if (installBanner && isMobileDevice() && !bannerWasDismissed()) {
      installBanner.style.display = 'block';
    }
  });
}

// Adicionar o evento de clique ao botão de instalação (se existir)
if (installButton) {
  installButton.addEventListener('click', () => {
    // Ocultar o banner de instalação
    installBanner.style.display = 'none';
    
    // Mostrar o prompt de instalação
    deferredPrompt.prompt();
    
    // Aguardar a resposta do usuário
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('Usuário aceitou a instalação do Aplicativo');
      } else {
        console.log('Usuário recusou a instalação do Aplicativo');
      }
      
      // Limpar a referência ao prompt
      deferredPrompt = null;
    });
  });
}

// Adicionar o evento de clique ao botão para fechar o banner (se existir)
if (closeBannerButton) {
  closeBannerButton.addEventListener('click', () => {
    // Ocultar o banner
    installBanner.style.display = 'none';
    
    // Salvar timestamp de quando o usuário clicou em "não obrigado"
    localStorage.setItem('pwaInstallBannerDismissed', new Date().getTime().toString());
  });
} 