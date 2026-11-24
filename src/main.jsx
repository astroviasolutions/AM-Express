import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './estilos/app.compilado.css';
import { ToastProvider } from './sistema/acesso-toast';
import { SistemaProvider } from './sistema/estado';
import { App } from './rotas';

createRoot(document.getElementById("root")).render(<StrictMode><BrowserRouter><ToastProvider><SistemaProvider><App /></SistemaProvider></ToastProvider></BrowserRouter></StrictMode>);
