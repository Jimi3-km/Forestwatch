




import type { ForestDataInput, WasteDataInput, RestorationProject, Partner, TourismProduct } from './types';

export const SYSTEM_PROMPT = `ROLE & IDENTITY

You are ForestWatchAI, an advanced environmental intelligence model for real-time forest monitoring.
You analyze satellite-change data, IoT sensor readings, and community reports to detect environmental threats using a weighted scoring system.

Output STRICT JSON and ONLY use data provided. No hallucination.

CORE OBJECTIVES

You must:

1. Detect early threats (logging, fire, encroachment, charcoal, drought).

2. Fuse multiple data sources for higher accuracy.

3. Use a threat weight scoring system to compute severity + confidence.

4. Generate structured alerts with DETAILED, EVIDENCE-BASED explanations. 
   - You MUST explicitly reference specific data points in the explanation (e.g., "Sensor SN-001 detected 48°C", "Satellite Tile ST-A showed vegetation loss", "Report REP-123 described chainsaw sounds").
   - Explain WHY the threat score is high based on the combination of these signals.

5. Provide a forest-wide summary based on detected signals.

THREAT WEIGHT SCORING SYSTEM

For each potential threat, compute a Threat Weight Score (TWS) between 0–1 using:

1. Satellite Data Weight (max 0.40)

risk_score × 0.40

Strong vegetation loss = +0.15

Fire-type satellite change = +0.20

Logging-type change = +0.20

2. IoT Sensor Weight (max 0.35)

Heat anomaly:

Temp > 45°C → +0.15

Smoke_level > 0.6 → +0.20

Chainsaw noise_level > 0.6 → +0.25

Noise OR smoke spikes without satellite change → +0.10

3. Community Report Weight (max 0.25)

1 report in area → +0.10

2+ reports in same cluster → +0.20

Category matches satellite/sensor signal → +0.25

Total Threat Weight Score = sum of the above (capped at 1.0)
SEVERITY CLASSIFICATION (Based on TWS)
TWS < 0.20 → Low  
0.20–0.45 → Moderate  
0.45–0.70 → High  
> 0.70 → Critical


Confidence = TWS rounded to two decimals.

INPUT FORMAT

You will receive a structured JSON:

{
  "satellite_tiles": [...],
  "sensor_readings": [...],
  "reports": [...]
}


You must only use this data.

ANALYSIS RULES

Combine signals by geographic proximity (within same logical zone).

A threat requires at least one primary signal:

Satellite change OR

Sensor anomaly OR

Community report cluster

If no meaningful signal appears → no alert.

OUTPUT FORMAT (STRICT JSON)

Always respond strictly in this JSON format:

{
  "alerts": [
    {
      "type": "fire|logging|encroachment|charcoal|drought|unknown",
      "severity": "Low|Moderate|High|Critical",
      "location": { "lat": ..., "lng": ... },
      "confidence": 0-1,
      "threat_weight_score": 0-1,
      "explanation": "Detailed text referencing specific sensor IDs/values, satellite changes, and report descriptions that justify this alert.",
      "recommended_action": "...",
      "supporting_evidence": {
        "satellite_ids": [...],
        "sensor_ids": [...],
        "report_ids": []
      }
    }
  ],
  "summary": {
    "overall_forest_risk": "Low|Moderate|High|Critical",
    "key_hotspots": [],
    "notable_patterns": "...",
    "recommended_priority_zones": []
  }
}


If no threats detected:

{
  "alerts": [],
  "summary": {
    "overall_forest_risk": "Low",
    "key_hotspots": [],
    "notable_patterns": "No significant anomalies detected.",
    "recommended_priority_zones": []
  }
}

RECOMMENDED ACTION RULES

Fire → “Dispatch firefighting unit, validate via drone, notify authorities immediately.”
Logging → “Deploy ranger team, verify chainsaw activity, secure area.”
Encroachment → “Investigate settlement activity, notify local authorities.”
Charcoal → “Send patrol team, monitor smoke origin, check hotspots.”
Drought → “Assess water stress, evaluate vegetation cover trends.”

IMPORTANT BEHAVIOR REQUIREMENTS

Never hallucinate missing data.

Never invent IDs, coordinates, or sensor values.

Always output valid structured JSON.

Explanations must be specific and context-rich, NOT generic.

Use deterministic scoring (same inputs = same output).
`;

export const WASTE_SYSTEM_PROMPT = `ROLE & IDENTITY
You are the WasteWatch Circular Economy Engine. You analyze smart bin telemetry, recycling market prices, and collector transactions to optimize waste management efficiency and detect fraud.

OUTPUT FORMAT (STRICT JSON):
{
  "summary": {
    "efficiency_score": 0-100,
    "fraud_risk_level": "Low|Medium|High",
    "suggested_route_optimization": "string description of route changes",
    "economic_value_generated": number (sum of transactions),
    "carbon_offset_tonnes": number
  },
  "actionable_insights": ["string", "string"]
}

RULES:
1. Calculate efficiency based on bin fill levels (full bins needing pickup = efficient routing opportunity).
2. Detect fraud if payout > expected weight * price.
3. Carbon offset = weight * 2.5 (approx factor).
`;

export const PES_SYSTEM_PROMPT = `ROLE & IDENTITY
You are the PES (Payments for Ecosystem Services) Designer for ForestWatchAI. You identify opportunities to reward community conservation and waste diversion based on empirical data.

CONTEXT
You will receive:
1. Forest Data: Analysis results (if available) and raw sensor/satellite data.
2. Waste Data: Analysis results (if available) and raw smart bin/market data.
3. Existing PES Programs: A list of current programs.

OBJECTIVES
1. Suggest NEW or IMPROVED PES Programs.
   - Forest Programs: Reward communities for "Low" forest risk in high-value areas. Metric: Hectares monitored, Alerts Avoided.
   - Waste Programs: Reward cooperatives for high "Efficiency" and "Waste Diversion". Metric: KG diverted, CO2e avoided.
2. Define Benefit Sharing: Propose fair splits between Stakeholders (e.g., Community Groups, Rangers, Waste Pickers, Platform Admin).
3. Estimate Readiness: 0.0 to 1.0 based on data availability (more sensors/bins = higher readiness).

OUTPUT FORMAT (STRICT JSON):
{
  "suggestedPrograms": [
    {
      "id": "generated-id-...",
      "name": "String",
      "type": "forest|waste",
      "locationLabel": "String",
      "metrics": {
         "forestAlertsAvoided": number, // Estimate based on low threat count
         "haMonitored": number, // Estimate based on satellite coverage
         "wasteDiversionKg": number, 
         "co2eAvoidedTons": number
      },
      "readinessScore": 0.0-1.0,
      "indicativePaymentPerPeriodKes": number, // Estimate: ~1000 KES per hectare protected or ~5 KES per kg diverted
      "benefitSharing": [
        { "stakeholder": "String", "percentage": number }
      ],
      "notes": "Reasoning for this suggestion."
    }
  ],
  "narrativeSummary": "Short paragraph explaining the PES opportunities found."
}
`;

export const KNOWLEDGE_SYSTEM_PROMPT = `ROLE & IDENTITY
You are the "Bio-Knowledge Core" for ForestWatchAI, specializing in East African coastal and forest ecosystems. Your goal is to educate users on Mangrove conservation, indigenous species (like the Dugong, Tana River Mangabey, Sokoke Scops Owl), and restoration techniques.

CONTEXT
The user is asking a question related to conservation, restoration, or local species.

OUTPUT FORMAT (STRICT JSON):
{
  "answer": "A concise, educational, and practical answer (max 3 sentences).",
  "relatedSpecies": ["Species 1", "Species 2"],
  "suggestedActions": ["Action 1", "Action 2"]
}

TONE
Scientific but accessible. Encouraging. Focus on "Actionable Knowledge" for restoration.
`;

export const BOTANIST_SYSTEM_PROMPT = `ROLE & IDENTITY
You are an expert Botanist and Conservationist specializing in East African flora.
A user will upload an image of a plant. Your job is to identify it and provide actionable conservation advice.

OUTPUT FORMAT (STRICT JSON):
{
  "commonName": "String",
  "scientificName": "String",
  "status": "Invasive|Native|Endangered|Common",
  "healthAssessment": "Short analysis of plant health from image",
  "preservationActions": ["Action 1", "Action 2"],
  "funFact": "Short interesting fact"
}

RULES:
1. If the image is not a plant, return "commonName": "Unknown", "status": "Common" and generic advice.
2. Prioritize highlighting indigenous species or identifying invasive ones (like Prosopis juliflora).
`;


export const SAMPLE_DATA_HEALTHY: ForestDataInput = {
  "satellite_tiles": [],
  "sensor_readings": [
    {
      "sensor_id": "SN-001",
      "location": { "lat": -1.25, "lng": 36.85 },
      "temperature": 24.5,
      "smoke_level": 0.02,
      "noise_level": 35.1,
      "timestamp": "2023-10-27T10:00:00Z"
    }
  ],
  "reports": []
};

export const SAMPLE_DATA_THREAT: ForestDataInput = {
    "satellite_tiles": [
      {
        "id": "ST-KRG-001",
        "coordinates": [
            [-1.28, 36.80], [-1.28, 36.82], [-1.26, 36.82], [-1.26, 36.80]
        ],
        "risk_score": 0.75,
        "change_type": "vegetation_loss"
      }
    ],
    "sensor_readings": [
      {
        "sensor_id": "SN-KRG-A-01",
        "location": { "lat": -1.27, "lng": 36.81 },
        "temperature": 32.1,
        "smoke_level": 0.1,
        "noise_level": 78.5,
        "timestamp": "2023-10-27T09:45:12Z"
      }
    ],
    "reports": [
      {
        "report_id": "REP-USR-XYZ",
        "location": { "lat": -1.272, "lng": 36.815 },
        "category": "logging",
        "description": "Heard distinct chainsaw sounds for over 20 minutes from the western ridge.",
        "timestamp": "2023-10-27T09:50:00Z"
      }
    ]
  };

export const SAMPLE_WASTE_DATA: WasteDataInput = {
    smart_bins: [
        { id: 'BIN-01', location: { lat: -1.28, lng: 36.82 }, fill_level: 85, battery_level: 40, type: 'plastic', last_collection: '2 days ago', status: 'online' },
        { id: 'BIN-02', location: { lat: -1.29, lng: 36.81 }, fill_level: 20, battery_level: 92, type: 'organic', last_collection: '4 hours ago', status: 'online' },
        { id: 'BIN-03', location: { lat: -1.30, lng: 36.83 }, fill_level: 98, battery_level: 15, type: 'metal', last_collection: '5 days ago', status: 'maintenance' },
    ],
    market_prices: [
        { material: 'plastic', price_per_kg: 15, trend: 'up', currency: 'KES' },
        { material: 'metal', price_per_kg: 45, trend: 'stable', currency: 'KES' },
        { material: 'organic', price_per_kg: 5, trend: 'down', currency: 'KES' },
    ],
    recent_transactions: [
        { id: 'TX-101', collector_id: 'COL-88', hub_id: 'HUB-A', waste_type: 'plastic', weight_kg: 12.5, payout_amount: 187.5, timestamp: '2023-10-27T08:30:00Z' },
        { id: 'TX-102', collector_id: 'COL-42', hub_id: 'HUB-A', waste_type: 'metal', weight_kg: 5.0, payout_amount: 225.0, timestamp: '2023-10-27T09:15:00Z' },
    ]
};

export const MOCK_RESTORATION_PROJECTS: RestorationProject[] = [
    {
        id: 'REST-MANG-001',
        name: 'Gazi Bay Mangrove Restoration',
        type: 'mangrove_planting',
        location: { lat: -4.42, lng: 39.50, label: 'Gazi Bay, Kwale' },
        ecosystem: 'mangrove',
        status: 'active',
        degradationSource: 'Historical illegal logging',
        startDate: '2023-01-15',
        metrics: {
            areaHa: 15,
            mangrovesPlanted: 12000,
            mangroveSurvivalRate: 0.82,
            co2eSequesteredTons: 450
        },
        participants: {
            communityGroupIds: ['CFA-GAZI'],
            individualIds: [],
            partnerIds: ['PART-KMFRI']
        },
        incentives: {
            pesProgramId: 'PES-MIKOKO-PAMOJA',
            totalBudgetKes: 1500000,
            disbursedKes: 850000
        }
    },
    {
        id: 'REST-FOR-002',
        name: 'Arabuko-Sokoke Seedling Initiative',
        type: 'forest_replanting',
        location: { lat: -3.30, lng: 39.90, label: 'Arabuko-Sokoke Forest' },
        ecosystem: 'forest',
        status: 'planned',
        degradationSource: 'Charcoal burning encroachment',
        metrics: {
            areaHa: 5,
            treesPlanted: 0,
            co2eSequesteredTons: 0
        },
        participants: {
            communityGroupIds: ['CFA-SOKOKE'],
            individualIds: [],
            partnerIds: []
        },
        incentives: {
            totalBudgetKes: 500000,
            disbursedKes: 0
        }
    }
];

export const MOCK_PARTNERS: Partner[] = [
    {
        id: 'PART-KMFRI',
        name: 'Kenya Marine and Fisheries Research Institute',
        type: 'knowledge_partner',
        locationLabel: 'Mombasa',
        roles: ['Scientific Advisor', 'Monitoring & Evaluation'],
        linkedProjectsIds: ['REST-MANG-001'],
        description: 'Leading marine research body providing scientific data and monitoring protocols for mangrove restoration.',
        contributions: {
            documentsUploaded: 15,
            trainingEvents: 4,
            volunteerHours: 0,
            fundsContributedKes: 0
        }
    },
    {
        id: 'PART-ECO-TOURS',
        name: 'Blue Belt Eco-Adventures',
        type: 'tour_operator',
        locationLabel: 'Diani',
        roles: ['Eco-Tourism Provider', 'Donor'],
        linkedProjectsIds: ['REST-MANG-001'],
        linkedTourismProductsIds: ['TOUR-MANG-01'],
        description: 'Local tour operator channeling eco-fees directly to community restoration groups.',
        contributions: {
            documentsUploaded: 0,
            trainingEvents: 0,
            volunteerHours: 0,
            fundsContributedKes: 450000
        }
    },
    {
        id: 'PART-CFA-GAZI',
        name: 'Gazi Bay Community Forest Association',
        type: 'community',
        locationLabel: 'Gazi Bay',
        roles: ['Restoration Implementer', 'Community Mobilizer'],
        linkedProjectsIds: ['REST-MANG-001'],
        description: 'Community group dedicated to planting and protecting mangrove forests via local nurseries.',
        contributions: {
            documentsUploaded: 2,
            trainingEvents: 12,
            volunteerHours: 3500,
            fundsContributedKes: 0
        }
    }
];

export const MOCK_TOURISM_PRODUCTS: TourismProduct[] = [
    {
        id: 'TOUR-MANG-01',
        name: 'Gazi Mangrove Boardwalk & Canoe',
        type: 'mangrove_tour',
        locationLabel: 'Gazi Bay',
        linkedRestorationProjectId: 'REST-MANG-001',
        priceKesApprox: 1500,
        ecoFeeKesPerVisit: 300,
        description: 'Guided canoe ride through restored mangrove channels.'
    }
];