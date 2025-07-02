import React, { useState, useEffect } from 'react';
import { Search, Building2, FileText, CreditCard, CheckCircle, XCircle } from 'lucide-react';

const EnergivoriSearchTool = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [debugInfo, setDebugInfo] = useState('');

  // Funzione per formattare codici fiscali e partite IVA
  const formatFiscalCode = (value) => {
    if (!value) return '';
    // Converti in stringa e rimuovi spazi
    const cleaned = value.toString().replace(/\s/g, '');
    // Aggiungi zeri iniziali per arrivare a 11 cifre
    return cleaned.padStart(11, '0');
  };

  // Carica i dati dal JSON locale
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔍 Inizio caricamento dati...');
        setDebugInfo('Caricamento dati...');
        
        const response = await fetch('/Energivori2025_ottimizzato_compact.json');
        console.log('📨 Response ricevuta:', {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ JSON caricato con successo!');
        console.log('📊 Numero di aziende:', data.length);
        
        if (!Array.isArray(data)) {
          throw new Error(`I dati non sono un array. Tipo ricevuto: ${typeof data}`);
        }
        
        if (data.length === 0) {
          throw new Error('Array vuoto ricevuto dal server');
        }
        
        // Mappo i dati dal formato JSON ai nomi usati nel componente
        const cleanData = data.map((row, index) => {
          if (index < 3) {
            console.log(`🏢 Processando elemento ${index}:`, row);
          }
          
          return {
            partitaIva: formatFiscalCode(row.piva),
            codiceFiscale: formatFiscalCode(row.cf),
            ragioneSociale: row.ragione ? row.ragione.replace(/"/g, '').trim() : '',
            classeAgevolazione: row.classe || '',
            decorrenza: row.decorrenza || ''
          };
        });
        
        console.log('🎯 Dati finali processati:', cleanData.length, 'aziende');
        console.log('🏆 Primi 3 elementi finali:', cleanData.slice(0, 3));
        
        setDebugInfo(`✅ Successo: ${cleanData.length} aziende caricate`);
        setCompanies(cleanData);
        setIsLoading(false);
        
      } catch (error) {
        console.error('❌ ERRORE nel caricamento:', error);
        setDebugInfo(`❌ Errore: ${error.message}`);
        setIsLoading(false);
        setCompanies([]);
      }
    };

    loadData();
  }, []);

  // Funzione per normalizzare il testo per la ricerca
  const normalizeText = (text) => {
    return text.toLowerCase()
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôõö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[ñ]/g, 'n')
      .replace(/[^a-z0-9\s]/g, '');
  };

  // Cerca le aziende mentre l'utente digita
  useEffect(() => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }

    const normalizedSearch = normalizeText(searchTerm);
    
    const results = companies.filter(company => {
      const normalizedName = normalizeText(company.ragioneSociale);
      const partitaIvaMatch = company.partitaIva.includes(searchTerm);
      const codiceFiscaleMatch = company.codiceFiscale.includes(searchTerm);
      const nameMatch = normalizedName.includes(normalizedSearch);
      
      return partitaIvaMatch || codiceFiscaleMatch || nameMatch;
    }).slice(0, 5);

    console.log('Ricerca per:', searchTerm, 'Risultati:', results.length);
    setSuggestions(results);
  }, [searchTerm, companies]);

  const handleCompanySelect = (company) => {
    setSelectedCompany(company);
    setSearchTerm(company.ragioneSociale);
    setSuggestions([]);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value !== selectedCompany?.ragioneSociale) {
      setSelectedCompany(null);
    }
  };

  // Funzione per ottenere la descrizione della classe di agevolazione
  const getClasseDescription = (classe) => {
    const descriptions = {
      'ASOS1': {
        title: 'Settori ad Alto Rischio di Rilocalizzazione',
        description: 'Imprese operanti in settori ad alto rischio di rilocalizzazione secondo la Comunicazione CE 2022/C 80/01. Agevolazione applicata tramite aliquote ASOS ridotte in fattura.',
        agevolazione: 'Minor valore tra 15% della componente ASOS e 0,5% del VAL',
        modalita: 'Sconto diretto in bolletta'
      },
      'ASOS2': {
        title: 'Settori a Rischio di Rilocalizzazione',
        description: 'Imprese operanti in settori a rischio di rilocalizzazione secondo la Comunicazione CE 2022/C 80/01. Agevolazione applicata tramite aliquote ASOS ridotte in fattura.',
        agevolazione: 'Minor valore tra 25% della componente ASOS e 1% del VAL',
        modalita: 'Sconto diretto in bolletta'
      },
      'ASOS3': {
        title: 'Clausola "Grand Fathering"',
        description: 'Imprese beneficiarie delle agevolazioni 2022-2023 con codice ATECO del vecchio Allegato 3 o 5. Agevolazione progressiva fino al 2028.',
        agevolazione: '2024-2026: 35% ASOS/1,5% VAL | 2027: 55% ASOS/2,5% VAL | 2028: 80% ASOS/3,5% VAL',
        modalita: 'Sconto diretto in bolletta'
      },
      'VALR1': {
        title: 'Pagamento VAL - Classe 1 (Alto Rischio)',
        description: 'Imprese Classe 1 che hanno scelto il pagamento diretto del contributo minimo in percentuale del VAL invece dello sconto ASOS in bolletta.',
        agevolazione: 'Minor valore tra 15% della componente ASOS e 0,5% del VAL',
        modalita: 'Pagamento diretto a CSEA - ASOS azzerato in bolletta'
      },
      'VALR2': {
        title: 'Pagamento VAL - Classe 2 (Rischio Medio)',
        description: 'Imprese Classe 2 che hanno scelto il pagamento diretto del contributo minimo in percentuale del VAL invece dello sconto ASOS in bolletta.',
        agevolazione: 'Minor valore tra 25% della componente ASOS e 1% del VAL',
        modalita: 'Pagamento diretto a CSEA - ASOS azzerato in bolletta'
      },
      'VALR3': {
        title: 'Pagamento VAL - Classe 3 (Grand Fathering)',
        description: 'Imprese Classe 3 che hanno scelto il pagamento diretto del contributo minimo in percentuale del VAL invece dello sconto ASOS in bolletta.',
        agevolazione: '2024-2026: 35% ASOS/1,5% VAL | 2027: 55% ASOS/2,5% VAL | 2028: 80% ASOS/3,5% VAL',
        modalita: 'Pagamento diretto a CSEA - ASOS azzerato in bolletta'
      }
    };

    return descriptions[classe] || {
      title: 'Classe Non Riconosciuta',
      description: 'Classe di agevolazione non standard o non più valida',
      agevolazione: 'Consultare ARERA per dettagli specifici',
      modalita: 'Da verificare'
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-center">Caricamento dati...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/energy_power_icon.png" 
              alt="Energy Icon" 
              className="h-12 w-12 mr-3"
            />
            <h1 className="text-4xl font-bold text-gray-800">
              Verifica se l'Impresa è Energivora
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Controlla rapidamente se un'impresa italiana è classificata come energivora
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Cerca per Partita IVA, Codice Fiscale o Nome Azienda..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                {suggestions.map((company, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                    onClick={() => handleCompanySelect(company)}
                  >
                    <div className="font-medium text-gray-800">
                      {company.ragioneSociale}
                    </div>
                    <div className="text-sm text-gray-600">
                      P.IVA: {company.partitaIva} | CF: {company.codiceFiscale}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {searchTerm.length >= 2 && (
          <div className="max-w-2xl mx-auto">
            {selectedCompany ? (
              /* Company Card - Energivora */
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-green-500 p-4">
                  <div className="flex items-center justify-center text-white">
                    <CheckCircle className="h-8 w-8 mr-3" />
                    <h2 className="text-2xl font-bold">IMPRESA ENERGIVORA</h2>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Building2 className="h-5 w-5 text-gray-400 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                            Ragione Sociale
                          </p>
                          <p className="text-xl font-semibold text-gray-800">
                            {selectedCompany.ragioneSociale}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <FileText className="h-5 w-5 text-gray-400 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                            Codice Fiscale
                          </p>
                          <p className="text-lg font-mono text-gray-800">
                            {selectedCompany.codiceFiscale}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <CreditCard className="h-5 w-5 text-gray-400 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                            Partita IVA
                          </p>
                          <p className="text-lg font-mono text-gray-800">
                            {selectedCompany.partitaIva}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                            Classe di Agevolazione
                          </p>
                          <p className="text-lg font-semibold text-green-600 mb-2">
                            {selectedCompany.classeAgevolazione}
                          </p>
                          {(() => {
                            const classeInfo = getClasseDescription(selectedCompany.classeAgevolazione);
                            return (
                              <div className="text-sm text-gray-600">
                                <p className="font-medium text-gray-700 mb-1">
                                  {classeInfo.title}
                                </p>
                                <p className="mb-2">
                                  {classeInfo.description}
                                </p>
                                <p className="text-xs text-blue-600 font-medium mb-1">
                                  <strong>Agevolazione:</strong> {classeInfo.agevolazione}
                                </p>
                                <p className="text-xs text-purple-600 font-medium">
                                  <strong>Modalità:</strong> {classeInfo.modalita}
                                </p>
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                        <div>
                          <h3 className="text-lg font-semibold text-green-800">
                            Energivora: SÌ
                          </h3>
                          <p className="text-green-700 mb-3">
                            Questa impresa è classificata come energivora con decorrenza dal {selectedCompany.decorrenza}
                          </p>
                          <div className="text-sm text-green-600">
                            <p><strong>Requisiti soddisfatti:</strong></p>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              <li>Consumo annuo di energia elettrica ≥ 1 GWh</li>
                              <li>Diagnosi energetica in corso di validità</li>
                              <li>Settore incluso nella classificazione di rischio rilocalizzazione</li>
                              {selectedCompany.classeAgevolazione.startsWith('VALR') && (
                                <li className="text-purple-600 font-medium">
                                  Opzione VAL attivata: contributo pagato direttamente a CSEA
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : suggestions.length === 0 ? (
              /* Not Found Message */
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-red-500 p-4">
                  <div className="flex items-center justify-center text-white">
                    <XCircle className="h-8 w-8 mr-3" />
                    <h2 className="text-2xl font-bold">IMPRESA NON ENERGIVORA</h2>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="bg-red-50 rounded-lg p-6 text-center">
                    <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-red-800 mb-2">
                      L'azienda cercata non è Energivora
                    </h3>
                    <p className="text-red-700">
                      L'impresa cercata non è presente nell'elenco delle imprese energivore per l'anno 2025.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Footer Info */}
        <div className="max-w-2xl mx-auto mt-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Informazioni sul Tool
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <strong>Database:</strong> Elenco Imprese Energivore 2025
              </div>
              <div>
                <strong>Totale Imprese:</strong> {companies.length.toLocaleString()}
              </div>
              <div>
                <strong>Aggiornamento:</strong> 18-06-2025
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergivoriSearchTool;
