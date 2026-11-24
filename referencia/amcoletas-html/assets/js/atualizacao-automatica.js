/**
 * Sistema de atualização automática para o dashboard do motoboy
 * Verifica periodicamente se existem novas coletas disponíveis
 */

class AtualizacaoAutomatica {
    constructor(options = {}) {
        // Configurações padrão
        this.config = {
            intervalo: options.intervalo || 30000, // 30 segundos
            url: options.url || '../api/verificar-coletas-novas.php',
            seletorColetas: options.seletorColetas || '#coletas-disponiveis',
            seletorNovasColetas: options.seletorNovasColetas || '#total-coletas-disponiveis',
            seletorNotificacoes: options.seletorNotificacoes || '#notificacoes-badge',
            autoIniciar: options.autoIniciar !== undefined ? options.autoIniciar : true,
            onNovasColetas: options.onNovasColetas || null,
            onAtualizacao: options.onAtualizacao || null,
            onErro: options.onErro || null
        };
        
        // Estado interno
        this.ultimoTimestamp = 0;
        this.intervalId = null;
        this.primeiraExecucao = true;
        
        // Iniciar automaticamente se configurado
        if (this.config.autoIniciar) {
            this.iniciar();
        }
    }
    
    /**
     * Inicia o processo de verificação automática
     */
    iniciar() {
        if (this.intervalId) {
            return; // Já está em execução
        }
        
        // Realizar primeira verificação imediatamente
        this.verificarNovasColetas();
        
        // Configurar verificação periódica
        this.intervalId = setInterval(() => {
            this.verificarNovasColetas();
        }, this.config.intervalo);
        
        console.log('Atualização automática iniciada. Intervalo:', this.config.intervalo / 1000, 'segundos');
    }
    
    /**
     * Para o processo de verificação automática
     */
    parar() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            console.log('Atualização automática parada.');
        }
    }
    
    /**
     * Verifica novas coletas disponíveis
     */
    verificarNovasColetas() {
        const urlCompleta = `${this.config.url}?ultimo_timestamp=${this.ultimoTimestamp}`;
        
        fetch(urlCompleta)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Atualizar o timestamp para próxima consulta
                this.ultimoTimestamp = data.timestamp_atual;
                
                // Na primeira execução, apenas armazenar timestamp
                if (this.primeiraExecucao) {
                    this.primeiraExecucao = false;
                    
                    // Chamar callback de atualização, se definido
                    if (typeof this.config.onAtualizacao === 'function') {
                        this.config.onAtualizacao(data);
                    }
                    
                    return;
                }
                
                // Verificar se há novas coletas
                if (data.total_novas_coletas > 0) {
                    console.log(`${data.total_novas_coletas} novas coletas disponíveis!`);
                    this.exibirNovasColetas(data.novas_coletas);
                    
                    // Chamar callback para novas coletas, se definido
                    if (typeof this.config.onNovasColetas === 'function') {
                        this.config.onNovasColetas(data.novas_coletas);
                    }
                }
                
                // Verificar se há novas notificações
                if (data.novas_notificacoes > 0) {
                    this.atualizarNotificacoes(data.novas_notificacoes);
                }
                
                // Chamar callback de atualização, se definido
                if (typeof this.config.onAtualizacao === 'function') {
                    this.config.onAtualizacao(data);
                }
            })
            .catch(error => {
                console.error('Erro ao verificar novas coletas:', error);
                
                // Chamar callback de erro, se definido
                if (typeof this.config.onErro === 'function') {
                    this.config.onErro(error);
                }
            });
    }
    
    /**
     * Atualiza a contagem de notificações não lidas
     * @param {number} novasNotificacoes Número de novas notificações
     */
    atualizarNotificacoes(novasNotificacoes) {
        const elemento = document.querySelector(this.config.seletorNotificacoes);
        
        if (elemento) {
            // Atualizar contagem
            const contagemAtual = parseInt(elemento.textContent || '0');
            elemento.textContent = contagemAtual + novasNotificacoes;
            
            // Exibir elemento, caso esteja oculto
            elemento.style.display = 'inline-block';
            
            // Adicionar animação para chamar atenção
            elemento.classList.add('pulsing');
            setTimeout(() => {
                elemento.classList.remove('pulsing');
            }, 2000);
        }
    }
    
    /**
     * Exibe as novas coletas disponíveis
     * @param {Array} novasColetas Lista de novas coletas disponíveis
     */
    exibirNovasColetas(novasColetas) {
        const contenedorColetas = document.querySelector(this.config.seletorColetas);
        const elementoContagem = document.querySelector(this.config.seletorNovasColetas);
        
        // Exibir notificação sonora e visual
        this.notificarNovasColetas(novasColetas.length);
        
        // Atualizar contagem
        if (elementoContagem) {
            const contagemAtual = parseInt(elementoContagem.textContent || '0');
            elementoContagem.textContent = contagemAtual + novasColetas.length;
            
            // Animação para destacar
            elementoContagem.classList.add('pulsing');
            setTimeout(() => {
                elementoContagem.classList.remove('pulsing');
            }, 2000);
        }
        
        // Se não há onde inserir as coletas, sair
        if (!contenedorColetas) {
            return;
        }
        
        // Adicionar novas coletas ao topo da lista
        novasColetas.forEach(coleta => {
            // Criar elemento para a nova coleta
            const novoElemento = document.createElement('div');
            novoElemento.className = 'coleta-item card mb-3 border-primary nova-coleta';
            
            novoElemento.innerHTML = `
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <h5 class="card-title mb-0">Coleta #${coleta.id}</h5>
                        <span class="badge bg-primary">Nova</span>
                    </div>
                    <p class="card-text mb-1">
                        <strong>Cliente:</strong> ${coleta.cliente_nome}
                    </p>
                    <p class="card-text mb-1">
                        <strong>Origem:</strong> ${coleta.cidade_origem}
                    </p>
                    <p class="card-text mb-1">
                        <strong>Destino:</strong> ${coleta.cidade_destino}
                    </p>
                    <p class="card-text text-muted small">
                        <i class="bi bi-clock"></i> ${coleta.data_hora_formatada}
                    </p>
                    <div class="d-grid gap-2 mt-3">
                        <a href="aceitar_coleta.php?id=${coleta.id}" class="btn btn-success">
                            <i class="bi bi-check-circle"></i> Aceitar Coleta
                        </a>
                    </div>
                </div>
            `;
            
            // Adicionar ao início do contêiner
            contenedorColetas.insertBefore(novoElemento, contenedorColetas.firstChild);
            
            // Adicionar efeito para destacar o novo item
            setTimeout(() => {
                novoElemento.classList.add('highlight');
                
                // Remover classe após a animação
                setTimeout(() => {
                    novoElemento.classList.remove('highlight', 'nova-coleta');
                }, 5000);
            }, 100);
        });
    }
    
    /**
     * Notifica o usuário sobre novas coletas disponíveis
     * @param {number} quantidade Quantidade de novas coletas
     */
    notificarNovasColetas(quantidade) {
        // Notificação sonora
        try {
            const audio = new Audio('../assets/sounds/notification.mp3');
            audio.play().catch(e => console.log('Reprodução automática de áudio bloqueada pelo navegador'));
        } catch (e) {
            console.log('Erro ao reproduzir notificação sonora:', e);
        }
        
        // Notificação visual (toast)
        if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
            // Criar elemento para o toast
            const toastContainer = document.getElementById('toast-container');
            
            if (!toastContainer) {
                // Criar container de toasts se não existir
                const container = document.createElement('div');
                container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
                container.id = 'toast-container';
                document.body.appendChild(container);
            }
            
            const toastElement = document.createElement('div');
            toastElement.className = 'toast';
            toastElement.setAttribute('role', 'alert');
            toastElement.setAttribute('aria-live', 'assertive');
            toastElement.setAttribute('aria-atomic', 'true');
            
            const mensagem = quantidade === 1 
                ? 'Há uma nova coleta disponível!' 
                : `Há ${quantidade} novas coletas disponíveis!`;
            
            toastElement.innerHTML = `
                <div class="toast-header bg-primary text-white">
                    <i class="bi bi-bell-fill me-2"></i>
                    <strong class="me-auto">Nova Coleta</strong>
                    <small>Agora</small>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Fechar"></button>
                </div>
                <div class="toast-body">
                    ${mensagem}
                    <div class="mt-2 pt-2 border-top">
                        <a href="#coletas-disponiveis" class="btn btn-sm btn-primary">Ver coletas</a>
                    </div>
                </div>
            `;
            
            document.getElementById('toast-container').appendChild(toastElement);
            
            // Inicializar e exibir o toast
            const toast = new bootstrap.Toast(toastElement, {
                autohide: true,
                delay: 8000
            });
            
            toast.show();
        }
    }
}

// Exportar para uso global
window.AtualizacaoAutomatica = AtualizacaoAutomatica;

// Sistema de detecção e atualização automática para PWA
let refreshing = false;

// Registrar o Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker registrado com sucesso:', registration.scope);
        
        // Verificar atualizações a cada 30 minutos
        setInterval(() => {
          registration.update();
          console.log('Verificando atualizações do Service Worker...');
        }, 30 * 60 * 1000);
        
        // Verificar se há uma atualização na inicialização
        registration.update();
      })
      .catch((error) => {
        console.log('Falha ao registrar o Service Worker:', error);
      });
      
    // Ouvir eventos de atualização
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        console.log('Nova versão detectada! Recarregando...');
        window.location.reload();
      }
    });
    
    // Ouvir mensagens do Service Worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
        // A troca de versão já é automática (o service worker assume e a página recarrega
        // sozinha no evento "controllerchange"). Por isso o aviso "Nova versão disponível"
        // não é mais exibido: ele aparecia repetidas vezes sem necessidade.
        console.log(`Nova versão instalada: ${event.data.version}`);
      }
    });
    
    // Verificar se há atualizações quando a página ficar visível
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CHECK_UPDATE'
        });
      }
    });
  });
}

// Função para exibir notificação de atualização
function exibirNotificacaoAtualizacao(versao) {
  // Verificar se já existe uma notificação
  if (document.getElementById('atualizacao-notificacao')) {
    return;
  }
  
  const notificacao = document.createElement('div');
  notificacao.id = 'atualizacao-notificacao';
  notificacao.className = 'atualizacao-notificacao';
  notificacao.innerHTML = `
    <div class="atualizacao-conteudo">
      <p>Nova versão disponível! (${versao})</p>
      <div class="atualizacao-botoes">
        <button id="atualizar-agora" class="btn-atualizar">Atualizar agora</button>
        <button id="atualizar-depois" class="btn-depois">Depois</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(notificacao);
  
  // Mostrar a notificação com animação
  setTimeout(() => {
    notificacao.classList.add('mostrar');
  }, 100);
  
  // Configurar eventos dos botões
  document.getElementById('atualizar-agora').addEventListener('click', () => {
    notificacao.classList.remove('mostrar');
    setTimeout(() => {
      window.location.reload();
    }, 300);
  });
  
  document.getElementById('atualizar-depois').addEventListener('click', () => {
    notificacao.classList.remove('mostrar');
    setTimeout(() => {
      notificacao.remove();
    }, 300);
  });
} 