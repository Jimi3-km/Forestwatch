import { ForestDataInput } from '../types';

const BASE_COORDINATES = { lat: -1.25, lng: 36.85 };

const createTile = (id: string, center: [number, number], risk: number, type: 'fire' | 'logging' | 'vegetation_loss' | 'unknown'): any => ({
    id,
    coordinates: [
        [center[0] - 0.05, center[1] - 0.05],
        [center[0] - 0.05, center[1] + 0.05],
        [center[0] + 0.05, center[1] + 0.05],
        [center[0] + 0.05, center[1] - 0.05],
    ],
    risk_score: risk,
    change_type: type,
});

const createSensor = (id: string, location: { lat: number, lng: number }, temp: number, smoke: number, noise: number): any => ({
    sensor_id: id,
    location,
    temperature: temp,
    smoke_level: smoke,
    noise_level: noise,
    timestamp: new Date().toISOString(),
});

const createReport = (id: string, location: { lat: number, lng: number }, category: 'logging' | 'fire', description: string): any => ({
    report_id: id,
    location,
    category,
    description,
    timestamp: new Date().toISOString(),
});


const SCENARIOS: Record<string, () => ForestDataInput> = {
    "imminent-wildfire": () => ({
        satellite_tiles: [createTile("tile-fire-A", [BASE_COORDINATES.lat, BASE_COORDINATES.lng], 0.95, "fire")],
        sensor_readings: [
            createSensor("sensor-fire-1", { lat: BASE_COORDINATES.lat + 0.01, lng: BASE_COORDINATES.lng + 0.01 }, 85.5, 0.9, 30.2),
            createSensor("sensor-fire-2", { lat: BASE_COORDINATES.lat - 0.02, lng: BASE_COORDINATES.lng - 0.01 }, 70.1, 0.75, 25.0)
        ],
        reports: [createReport("report-fire-1", { lat: BASE_COORDINATES.lat, lng: BASE_COORDINATES.lng }, "fire", "Visible smoke plume reported near the old trail.")],
    }),
    "illegal-logging": () => ({
        satellite_tiles: [createTile("tile-log-A", [BASE_COORDINATES.lat + 0.3, BASE_COORDINATES.lng + 0.3], 0.8, "vegetation_loss")],
        sensor_readings: [
            createSensor("sensor-log-1", { lat: BASE_COORDINATES.lat + 0.31, lng: BASE_COORDINATES.lng + 0.29 }, 35.1, 0.1, 95.8),
            createSensor("sensor-log-2", { lat: BASE_COORDINATES.lat + 0.28, lng: BASE_COORDINATES.lng + 0.32 }, 33.0, 0.15, 88.1)
        ],
        reports: [
            createReport("report-log-1", { lat: BASE_COORDINATES.lat + 0.3, lng: BASE_COORDINATES.lng + 0.3 }, "logging", "Heard chainsaws and saw trucks leaving the area."),
            createReport("report-log-2", { lat: BASE_COORDINATES.lat + 0.305, lng: BASE_COORDINATES.lng + 0.305 }, "logging", "Second report confirming logging activity.")
        ],
    }),
    "healthy-forest": () => ({
        satellite_tiles: [],
        sensor_readings: [
            createSensor("sensor-healthy-1", { lat: BASE_COORDINATES.lat, lng: BASE_COORDINATES.lng }, 28.5, 0.05, 25.1),
            createSensor("sensor-healthy-2", { lat: BASE_COORDINATES.lat + 0.3, lng: BASE_COORDINATES.lng + 0.3 }, 29.1, 0.04, 22.8)
        ],
        reports: [],
    }),
     "drought-stress": () => ({
        satellite_tiles: [
            createTile("tile-drought-A", [BASE_COORDINATES.lat, BASE_COORDINATES.lng], 0.6, "vegetation_loss"),
            createTile("tile-drought-B", [BASE_COORDINATES.lat + 0.1, BASE_COORDINATES.lng - 0.1], 0.65, "vegetation_loss"),
        ],
        sensor_readings: [
            createSensor("sensor-drought-1", { lat: BASE_COORDINATES.lat, lng: BASE_COORDINATES.lng }, 46.0, 0.1, 30.0),
        ],
        reports: [],
    }),
};

export const generateScenarioData = (scenario: string): ForestDataInput => {
    return SCENARIOS[scenario]?.() || SCENARIOS['healthy-forest']();
};

export const simulateDataUpdate = (data: ForestDataInput, scenario: string): ForestDataInput => {
    const newData = JSON.parse(JSON.stringify(data));

    if (scenario === 'imminent-wildfire') {
        newData.sensor_readings.forEach((sensor: any) => {
            sensor.temperature = Math.min(100, sensor.temperature + Math.random() * 5);
            sensor.smoke_level = Math.min(1, sensor.smoke_level + Math.random() * 0.1);
        });
    } else if (scenario === 'illegal-logging') {
        newData.sensor_readings.forEach((sensor: any) => {
            sensor.noise_level = sensor.noise_level > 50 ? Math.max(50, sensor.noise_level + (Math.random() - 0.3) * 10) : sensor.noise_level;
        });
        if (Math.random() > 0.8 && newData.reports.length < 4) {
             newData.reports.push(createReport(`report-log-${newData.reports.length+1}`, { lat: BASE_COORDINATES.lat + 0.3 + (Math.random()-0.5)*0.02, lng: BASE_COORDINATES.lng + 0.3 + (Math.random()-0.5)*0.02 }, "logging", "More chainsaw sounds detected."));
        }
    } else {
        newData.sensor_readings.forEach((sensor: any) => {
            sensor.temperature += (Math.random() - 0.5) * 2;
            sensor.smoke_level = Math.max(0, Math.min(1, sensor.smoke_level + (Math.random() - 0.5) * 0.02));
            sensor.noise_level += (Math.random() - 0.5) * 5;
        });
    }

    return newData;
};