/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';

registerSW({ immediate: true });
import './index.css';
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convexUrl = import.meta.env.VITE_CONVEX_URL;

if (!convexUrl) {
  createRoot(document.getElementById('root')!).render(
    <div className="min-h-screen bg-[#f7f5f0] flex items-center justify-center p-6 text-[#434138] font-sans">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#e5e1d5] max-w-lg w-full text-center">
        <h1 className="text-2xl font-serif italic text-[#3e4a36] mb-4">Configuration Requise</h1>
        <p className="mb-6">Pour utiliser cette application avec Convex, veuillez ajouter votre variable d'environnement <code className="bg-[#f1eee4] px-2 py-1 rounded text-[#5d6d53]">VITE_CONVEX_URL</code> dans les paramètres (Secrets).</p>
        <p className="text-sm text-[#8c887d]">Si vous testez en local, assurez-vous d'avoir lancé <code className="bg-[#f1eee4] px-1 rounded">npx convex dev</code>.</p>
      </div>
    </div>
  );
} else {
  const convex = new ConvexReactClient(convexUrl);

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ConvexProvider client={convex}>
        <App />
      </ConvexProvider>
    </StrictMode>,
  );
}
