/**
 * Sistema de atualização automática para o dashboard do cliente
 * Verifica periodicamente se existem atualizações nas entregas
 */

class AtualizacaoCliente {
    constructor(options = {}) {
        // Configurações padrão
        this.config = {
            intervalo: options.intervalo || 30000, // 30 segundos
            url: options.url || '../api/verificar-atualizacoes-cliente.php',
            seletorEntregas: options.seletorEntregas || '#entregas-container',
            seletorNotificacoes: options.seletorNotificacoes || '#notificacoes-badge',
            autoIniciar: options.autoIniciar !== undefined ? options.autoIniciar : true,
            onNovasAtualizacoes: options.onNovasAtualizacoes || null,
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
        this.verificarAtualizacoes();
        
        // Configurar verificação periódica
        this.intervalId = setInterval(() => {
            this.verificarAtualizacoes();
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
     * Verifica novas atualizações de entregas
     */
    verificarAtualizacoes() {
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
                
                // Verificar se há novas atualizações
                if (data.total_atualizacoes > 0) {
                    console.log(`${data.total_atualizacoes} entregas atualizadas!`);
                    this.exibirNovasAtualizacoes(data.entregas_atualizadas);
                    
                    // Chamar callback para novas atualizações, se definido
                    if (typeof this.config.onNovasAtualizacoes === 'function') {
                        this.config.onNovasAtualizacoes(data.entregas_atualizadas);
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
                console.error('Erro ao verificar atualizações:', error);
                
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
     * Exibe as entregas atualizadas
     * @param {Array} entregasAtualizadas Lista de entregas com status atualizado
     */
    exibirNovasAtualizacoes(entregasAtualizadas) {
        // Notificar visualmente e por som
        this.notificarAtualizacoes(entregasAtualizadas);
        
        // Atualizar elementos na interface conforme necessário
        // Este método pode ser estendido conforme as necessidades específicas
        const listaEntregas = document.querySelector(this.config.seletorEntregas);
        if (!listaEntregas) return;
        
        // Buscar todas as entregas já listadas para atualizar seu status
        entregasAtualizadas.forEach(entrega => {
            const elementoEntrega = document.querySelector(`[data-entrega-id="${entrega.id}"]`);
            if (elementoEntrega) {
                // Atualizar status da entrega
                const statusElement = elementoEntrega.querySelector('.status-badge');
                if (statusElement) {
                    // Remover classes anteriores de status
                    statusElement.className = 'status-badge';
                    
                    // Adicionar nova classe conforme status
                    switch (entrega.status) {
                        case 'aguardando_coleta':
                            statusElement.classList.add('status-aguardando');
                            break;
                        case 'a_caminho':
                            statusElement.classList.add('status-caminho');
                            break;
                        case 'coletado':
                            statusElement.classList.add('status-coletado');
                            break;
                        case 'centro_distribuicao':
                            statusElement.classList.add('status-distribuicao');
                            break;
                        case 'entregue':
                            statusElement.classList.add('status-entregue');
                            break;
                    }
                    
                    // Atualizar texto do status
                    statusElement.textContent = entrega.status_texto;
                    
                    // Destacar a atualização
                    elementoEntrega.classList.add('highlight');
                    setTimeout(() => {
                        elementoEntrega.classList.remove('highlight');
                    }, 5000);
                }
                
                // Atualizar informação de motoboy, se disponível
                const motoboyCampo = elementoEntrega.querySelector('.motoboy-nome');
                if (motoboyCampo && entrega.motoboy_nome) {
                    motoboyCampo.textContent = entrega.motoboy_nome;
                }
                
                // Atualizar data de atualização
                const dataCampo = elementoEntrega.querySelector('.data-atualizacao');
                if (dataCampo) {
                    dataCampo.textContent = entrega.data_hora_formatada;
                }
            }
        });
    }
    
    /**
     * Notifica o usuário sobre atualizações de entregas
     * @param {Array} entregasAtualizadas Lista de entregas atualizadas
     */
    notificarAtualizacoes(entregasAtualizadas) {
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
            
            // Criar mensagem personalizada com base nas atualizações
            let titulo = `Atualização de entrega`;
            let mensagem = '';
            
            if (entregasAtualizadas.length === 1) {
                const entrega = entregasAtualizadas[0];
                titulo = `Entrega #${entrega.id} atualizada`;
                mensagem = `Status: ${entrega.status_texto}`;
                
                if (entrega.motoboy_nome && entrega.status === 'a_caminho') {
                    mensagem += `<br>Motoboy: ${entrega.motoboy_nome}`;
                }
            } else {
                titulo = `${entregasAtualizadas.length} entregas atualizadas`;
                mensagem = 'Clique para ver os detalhes das atualizações.';
            }
            
            toastElement.innerHTML = `
                <div class="toast-header bg-primary text-white">
                    <i class="bi bi-truck me-2"></i>
                    <strong class="me-auto">${titulo}</strong>
                    <small>Agora</small>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Fechar"></button>
                </div>
                <div class="toast-body">
                    ${mensagem}
                    <div class="mt-2 pt-2 border-top">
                        <a href="#entregas-container" class="btn btn-sm btn-primary">Ver entregas</a>
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
        
        // Notification API (Web Push)
        if ("Notification" in window && Notification.permission === "granted") {
            let titulo = '';
            let mensagem = '';
            
            if (entregasAtualizadas.length === 1) {
                const entrega = entregasAtualizadas[0];
                titulo = `Entrega #${entrega.id} atualizada`;
                mensagem = `Status: ${entrega.status_texto}`;
                
                if (entrega.motoboy_nome && entrega.status === 'a_caminho') {
                    mensagem += ` - Motoboy: ${entrega.motoboy_nome}`;
                }
            } else {
                titulo = `${entregasAtualizadas.length} entregas atualizadas`;
                mensagem = 'Clique para ver os detalhes das atualizações.';
            }
            
            const opcoes = {
                body: mensagem,
                icon: "../pwa-icons/icon-192x192.png",
                vibrate: [200, 100, 200],
                badge: "../pwa-icons/badge-96x96.png"
            };
            
            try {
                const notification = new Notification(titulo, opcoes);
                
                notification.onclick = function() {
                    window.focus();
                    notification.close();
                    // Rolar para a seção de entregas
                    document.querySelector('#entregas-container').scrollIntoView({ 
                        behavior: 'smooth' 
                    });
                };
            } catch (e) {
                console.log('Erro ao criar notificação:', e);
            }
        }
    }
}

// Exportar para uso global
window.AtualizacaoCliente = AtualizacaoCliente; 