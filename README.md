# Energivori Tool - Verifica Imprese Energivore

React application per la verifica delle imprese energivore italiane per l'anno 2025.

## 🌐 Demo Live

[Visualizza l'applicazione](https://your-netlify-url.netlify.app)

## Funzionalità

- 🔍 Ricerca per Partita IVA, Codice Fiscale o Ragione Sociale
- 📊 Database completo delle imprese energivore 2025
- ⚡ Ricerca intelligente con normalizzazione del testo
- 📱 Design responsive con Tailwind CSS
- 🏷️ Descrizioni dettagliate delle classi di agevolazione

## Deploy su Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/YOUR_USERNAME/energivori-tool)

### Build automatico

```bash
# Build command
npm run build

# Publish directory
build
```

## Avvio rapido

```bash
# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm start

# Build per produzione
npm run build
```

## Deploy su Netlify

1. Connetti il repository GitHub a Netlify
2. Configura build:
   - Build command: `npm run build`
   - Publish directory: `build`
3. Deploy automatico ad ogni push su main

## Classi di Agevolazione

- **ASOS1**: Settori ad Alto Rischio di Rilocalizzazione
- **ASOS2**: Settori a Rischio di Rilocalizzazione  
- **ASOS3**: Clausola "Grand Fathering"
- **VALR1-3**: Pagamento VAL (contributo diretto a CSEA)

## Struttura

```
src/
├── App.js          # Componente principale
├── index.js        # Entry point
└── index.css       # Stili Tailwind

public/
├── index.html      # Template HTML
├── manifest.json   # PWA manifest
└── Energivori2025_ottimizzato_compact.json  # Database
```

## Sviluppo

Il database viene caricato da `public/Energivori2025_ottimizzato_compact.json`.
Per aggiornare i dati, sostituire il file JSON e ridistribuire.
