# Energivori Tool Deployment Guide

## Deploy su Netlify (Raccomandato)

### Opzione 1: GitHub + Auto Deploy
1. **Push su GitHub**: Assicurati che il codice sia su GitHub
2. **Collega a Netlify**:
   - Vai su [netlify.com](https://netlify.com)
   - "New site from Git"
   - Seleziona GitHub e il repository
3. **Configurazione build**:
   - Build command: `npm run build`
   - Publish directory: `build`
   - Deploy!

### Opzione 2: Manual Deploy
1. **Build locale**:
   ```bash
   npm run build
   ```
2. **Drag & Drop**: Trascina la cartella `build/` su netlify.com/drop

## File pronti per il deploy

Tutto il necessario è già configurato:
- ✅ React app con Tailwind CSS
- ✅ JSON database in `public/`
- ✅ Build scripts configurati
- ✅ Manifest.json per PWA
- ✅ Meta tags SEO ottimizzati

## URL di esempio
Una volta deployato, l'app sarà disponibile su un URL tipo:
`https://energivori-tool-123456.netlify.app`

## Custom Domain (Opzionale)
Nelle impostazioni Netlify puoi configurare un dominio personalizzato:
`energivori.tuodominio.com`

## Aggiornamenti futuri
- Sostituisci il file JSON in `public/`
- Push su GitHub (deploy automatico)
- O rifai il build manuale per deploy via drag&drop
