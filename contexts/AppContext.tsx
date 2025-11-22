


import React, { createContext, useState, useContext, useCallback } from 'react';
import type { ForestDataInput, ForestWatchResponse, Alert, WasteDataInput, CircularEconomyResponse, PesProgram, GeneratedPesInsights, RestorationProject, Partner, TourismProduct, IncentiveRecord } from '../types';
import { SAMPLE_DATA_THREAT, SAMPLE_WASTE_DATA, MOCK_RESTORATION_PROJECTS, MOCK_PARTNERS, MOCK_TOURISM_PRODUCTS } from '../constants';
import { analyzeForestData, analyzeWasteData, analyzePesOpportunities } from '../services/geminiService';

interface AppContextType {
  isLoading: boolean;
  apiError: string | null;
  
  // Forest Data
  rawInput: ForestDataInput;
  setRawInput: React.Dispatch<React.SetStateAction<ForestDataInput>>;
  analysisResult: ForestWatchResponse | null;
  runAnalysis: () => Promise<void>;
  selectedAlert: Alert | null;
  setSelectedAlert: React.Dispatch<React.SetStateAction<Alert | null>>;

  // Waste Data
  wasteInput: WasteDataInput;
  setWasteInput: React.Dispatch<React.SetStateAction<WasteDataInput>>;
  wasteAnalysisResult: CircularEconomyResponse | null;
  runWasteAnalysis: () => Promise<void>;

  // PES Data
  pesPrograms: PesProgram[];
  setPesPrograms: React.Dispatch<React.SetStateAction<PesProgram[]>>;
  pesInsights: GeneratedPesInsights | null;
  runPesAnalysis: () => Promise<void>;

  // Restoration & Conservation Data
  restorationProjects: RestorationProject[];
  setRestorationProjects: React.Dispatch<React.SetStateAction<RestorationProject[]>>;
  partners: Partner[];
  setPartners: React.Dispatch<React.SetStateAction<Partner[]>>;
  tourismProducts: TourismProduct[];
  setTourismProducts: React.Dispatch<React.SetStateAction<TourismProduct[]>>;
  incentiveRecords: IncentiveRecord[];
  setIncentiveRecords: React.Dispatch<React.SetStateAction<IncentiveRecord[]>>;
}

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Initial PES Data Mock
const INITIAL_PES_PROGRAMS: PesProgram[] = [
    {
        id: 'PES-FOREST-001',
        name: 'Mau Forest Block A Conservation',
        type: 'forest',
        locationLabel: 'Mau Complex, Rift Valley',
        location: { lat: -0.55, lng: 35.7 }, // Approx Mau location
        linkedForestAreaIds: ['AREA-MAU-A'],
        metrics: { haMonitored: 500, forestAlertsAvoided: 12 },
        readinessScore: 0.85,
        indicativePaymentPerPeriodKes: 600000, // 500ha * 1200
        benefitSharing: [
            { stakeholder: 'Community Forest Association', percentage: 60 },
            { stakeholder: 'KWS Ranger Support', percentage: 25 },
            { stakeholder: 'Platform Admin Fee', percentage: 15 }
        ],
        notes: 'High readiness due to dense sensor network.'
    },
    {
        id: 'PES-WASTE-002',
        name: 'Nairobi East Circular Pilot',
        type: 'waste',
        locationLabel: 'Embakasi / Dandora',
        location: { lat: -1.285, lng: 36.89 }, // Approx Nairobi East
        linkedWasteZoneIds: ['ZONE-NBO-E'],
        metrics: { wasteDiversionKg: 2500, co2eAvoidedTons: 6.25 },
        readinessScore: 0.65,
        indicativePaymentPerPeriodKes: 28125, // (2500 * 10) + (6.25 * 500)
        benefitSharing: [
            { stakeholder: 'Waste Picker Cooperative', percentage: 70 },
            { stakeholder: 'Aggregator Hub', percentage: 20 },
            { stakeholder: 'Platform Admin Fee', percentage: 10 }
        ],
        notes: 'Data gaps in manual weighing logs affect score.'
    }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  // Forest State
  const [rawInput, setRawInput] = useState<ForestDataInput>(SAMPLE_DATA_THREAT);
  const [analysisResult, setAnalysisResult] = useState<ForestWatchResponse | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  // Waste State
  const [wasteInput, setWasteInput] = useState<WasteDataInput>(SAMPLE_WASTE_DATA);
  const [wasteAnalysisResult, setWasteAnalysisResult] = useState<CircularEconomyResponse | null>(null);

  // PES State
  const [pesPrograms, setPesPrograms] = useState<PesProgram[]>(INITIAL_PES_PROGRAMS);
  const [pesInsights, setPesInsights] = useState<GeneratedPesInsights | null>(null);

  // Restoration State
  const [restorationProjects, setRestorationProjects] = useState<RestorationProject[]>(MOCK_RESTORATION_PROJECTS);
  const [partners, setPartners] = useState<Partner[]>(MOCK_PARTNERS);
  const [tourismProducts, setTourismProducts] = useState<TourismProduct[]>(MOCK_TOURISM_PRODUCTS);
  const [incentiveRecords, setIncentiveRecords] = useState<IncentiveRecord[]>([]);


  const runAnalysis = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    setSelectedAlert(null);
    try {
      const result = await analyzeForestData(rawInput);
      const newResponse: ForestWatchResponse = {
        ...result,
        timestamp: new Date().toISOString(),
        alerts: result.alerts.map((alert, index) => ({
          ...alert,
          id: `${new Date().getTime()}-${index}`,
        })),
      };
      setAnalysisResult(newResponse);
    } catch (e) {
      setApiError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsLoading(false);
    }
  }, [rawInput]);

  const runWasteAnalysis = useCallback(async () => {
      setIsLoading(true);
      setApiError(null);
      try {
          const result = await analyzeWasteData(wasteInput);
          setWasteAnalysisResult(result);
      } catch (e) {
          setApiError(e instanceof Error ? e.message : String(e));
      } finally {
          setIsLoading(false);
      }
  }, [wasteInput]);

  const runPesAnalysis = useCallback(async () => {
    setIsLoading(true);
    setApiError(null);
    try {
        const input = {
            forestAnalysis: analysisResult,
            wasteAnalysis: wasteAnalysisResult,
            forestInput: rawInput,
            wasteInput: wasteInput,
            existingPrograms: pesPrograms
        };
        const insights = await analyzePesOpportunities(input);
        setPesInsights(insights);
        
        // Merge new suggestions if ID doesn't exist
        if (insights.suggestedPrograms.length > 0) {
             setPesPrograms(prev => {
                const newPrograms = insights.suggestedPrograms.filter(
                    sp => !prev.some(p => p.id === sp.id)
                );
                return [...prev, ...newPrograms];
             });
        }

    } catch (e) {
         setApiError(e instanceof Error ? e.message : String(e));
    } finally {
        setIsLoading(false);
    }
  }, [analysisResult, wasteAnalysisResult, rawInput, wasteInput, pesPrograms]);

  return (
    <AppContext.Provider value={{
      isLoading,
      apiError,
      rawInput,
      setRawInput,
      analysisResult,
      runAnalysis,
      selectedAlert,
      setSelectedAlert,
      wasteInput,
      setWasteInput,
      wasteAnalysisResult,
      runWasteAnalysis,
      pesPrograms,
      setPesPrograms,
      pesInsights,
      runPesAnalysis,
      restorationProjects,
      setRestorationProjects,
      partners,
      setPartners,
      tourismProducts,
      setTourismProducts,
      incentiveRecords,
      setIncentiveRecords
    }}>
      {children}
    </AppContext.Provider>
  );
};