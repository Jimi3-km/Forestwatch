

export interface Location {
  lat: number;
  lng: number;
}

export interface SatelliteTile {
  id: string;
  coordinates: [number, number][];
  risk_score: number;
  change_type: 'fire' | 'logging' | 'vegetation_loss' | 'unknown';
}

export interface SensorReading {
  sensor_id: string;
  location: Location;
  temperature: number;
  smoke_level: number;
  noise_level: number;
  timestamp: string;
}

export interface Report {
  report_id: string;
  location: Location;
  category: 'logging' | 'fire' | 'encroachment' | 'wildlife' | 'other';
  description: string;
  image_tags?: string[];
  timestamp: string;
}

export interface ForestDataInput {
  satellite_tiles: SatelliteTile[];
  sensor_readings: SensorReading[];
  reports: Report[];
}

export interface Alert {
  id: string;
  type: 'fire' | 'logging' | 'encroachment' | 'charcoal' | 'drought' | 'unknown';
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  location: Location;
  confidence: number;
  threat_weight_score: number;
  explanation: string;
  recommended_action: string;
  supporting_evidence: {
    satellite_ids: string[];
    sensor_ids: string[];
    report_ids: string[];
  };
}

export interface Summary {
  overall_forest_risk: 'Low' | 'Moderate' | 'High' | 'Critical';
  key_hotspots: string[];
  notable_patterns: string;
  recommended_priority_zones: string[];
}

export interface ForestWatchResponse {
  alerts: Alert[];
  summary: Summary;
  timestamp: string;
}

/* --- Waste / Circular Economy Types --- */

export type WasteType = 'plastic' | 'organic' | 'glass' | 'metal' | 'ewaste';

export interface SmartBin {
  id: string;
  location: Location;
  fill_level: number; // 0-100
  battery_level: number; // 0-100
  type: WasteType;
  last_collection: string;
  status: 'online' | 'offline' | 'maintenance';
}

export interface MarketPrice {
  material: WasteType;
  price_per_kg: number;
  trend: 'up' | 'down' | 'stable';
  currency: string;
}

export interface WasteTransaction {
  id: string;
  collector_id: string;
  hub_id: string;
  waste_type: WasteType;
  weight_kg: number;
  payout_amount: number;
  timestamp: string;
}

export interface WasteAnalysisSummary {
  efficiency_score: number; // 0-100
  fraud_risk_level: 'Low' | 'Medium' | 'High';
  suggested_route_optimization: string;
  economic_value_generated: number;
  carbon_offset_tonnes: number;
}

export interface WasteDataInput {
  smart_bins: SmartBin[];
  market_prices: MarketPrice[];
  recent_transactions: WasteTransaction[];
}

export interface CircularEconomyResponse {
    summary: WasteAnalysisSummary;
    actionable_insights: string[];
    timestamp: string;
}

/* --- PES & Incentives Types --- */

export type PesProgramType = "forest" | "waste";

export interface BenefitShare {
  stakeholder: string;      // e.g. "Community Forest Association", "Rangers", "Waste Picker Coop"
  percentage: number;       // must sum to 100 across one program
}

export interface PesProgram {
  id: string;
  name: string;             // e.g. "Mau Forest Block A PES", "Mukuru Plastics PES Pilot"
  type: PesProgramType;
  location?: Location;      // coordinate for map marker
  locationLabel: string;    // human-readable area
  linkedForestAreaIds?: string[];   // optional: IDs from forest module
  linkedWasteZoneIds?: string[];    // optional: IDs from waste module

  // Performance metrics coming from existing data:
  metrics: {
    forestAlertsAvoided?: number;   // e.g. fewer high/critical alerts vs baseline
    haMonitored?: number;
    wasteDiversionKg?: number;      // KG of material diverted
    co2eAvoidedTons?: number;       // estimated CO2 equivalent
  };

  // PES calculations:
  readinessScore: number;          // 0–1, based on data quality, governance, consistency
  indicativePaymentPerPeriodKes: number;
  benefitSharing: BenefitShare[];

  notes?: string;
}

export interface GeneratedPesInsights {
    suggestedPrograms: PesProgram[];
    narrativeSummary: string;
}

/* --- Restoration & Conservation Types --- */

export type RestorationType = "mangrove_planting" | "forest_replanting" | "beach_cleanup" | "wetland_restoration";
export type PartnerType = "community" | "ngo" | "cbo" | "tour_operator" | "knowledge_partner" | "donor";
export type IncentiveType = "cash_pes" | "voucher" | "badge" | "discount" | "tour_experience";
export type TourismProductType = "mangrove_tour" | "nature_walk" | "community_homestay";

export interface RestorationProject {
  id: string;
  name: string;
  type: RestorationType;
  location: {
    lat: number;
    lng: number;
    label: string;
  };
  ecosystem: "mangrove" | "forest" | "wetland" | "other";
  status: "planned" | "active" | "completed";
  degradationSource?: string; // e.g., illegal logging, erosion, pollution
  linkedAlertsIds?: string[]; // from Forest Watch alerts
  startDate?: string;
  endDate?: string;
  metrics: {
    areaHa?: number;
    mangrovesPlanted?: number;
    mangroveSurvivalRate?: number; // 0-1
    treesPlanted?: number;
    trashRemovedKg?: number;
    co2eSequesteredTons?: number;
  };
  participants: {
    communityGroupIds: string[];
    individualIds: string[];
    partnerIds: string[];
  };
  incentives: {
    pesProgramId?: string;
    totalBudgetKes?: number;
    disbursedKes?: number;
  };
}

export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  locationLabel?: string;
  contactEmail?: string;
  contactPhone?: string;
  roles: string[]; // e.g. "Restoration implementer", "Knowledge hub", "Tour operator"
  linkedProjectsIds: string[];
  linkedTourismProductsIds?: string[];
  description?: string;
  contributions?: {
    documentsUploaded?: number;
    trainingEvents?: number;
    volunteerHours?: number;
    fundsContributedKes?: number;
  };
}

export interface TourismProduct {
  id: string;
  name: string;
  type: TourismProductType;
  locationLabel: string;
  linkedRestorationProjectId?: string;
  priceKesApprox?: number;
  ecoFeeKesPerVisit?: number; // part going to PES pool
  description?: string;
}

export interface IncentiveRecord {
  id: string;
  userId: string;
  type: IncentiveType;
  amountKes?: number;
  badgeName?: string;
  description?: string;
  relatedProjectId?: string;
  createdAt: string;
}

export interface KnowledgeQueryResult {
    answer: string;
    relatedSpecies: string[];
    suggestedActions: string[];
}

export interface PlantAnalysisResult {
    commonName: string;
    scientificName: string;
    status: 'Invasive' | 'Native' | 'Endangered' | 'Common';
    healthAssessment: string;
    preservationActions: string[];
    funFact: string;
}

export type UserRole = 'common' | 'official';

export interface User {
    email: string;
    role: UserRole;
}