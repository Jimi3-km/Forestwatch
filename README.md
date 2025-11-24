
# ForestWatch eOS – Environmental Operating System for East Africa

> A Digital Twin for environmental action – from satellite, to alert, to restoration, to payments.

---

## 0. Hackathon Submission Meta

- **Hackathon:** Wangari Maathai Hackathon 2025  
- **Team Name:** Afro-Jasiri 
- **Track:** Forest protection, data collection & community engagement  

**Team**

- Mathew Wahome – Team Lead & Systems Architect  
- James Koikai – AI & Product Lead  
- Tony Mputhia – Data & Infrastructure Engineer  
- Ephraim Kisaka – UX & Partnerships Lead  

**Submission Assets**

- **Pitch Deck (PDF):** `  [Presentation - eOS (1).pdf](https://github.com/user-attachments/files/23701263/Presentation.-.eOS.1.pdf)

- **Demo Video (2–3 min):** ``  

https://github.com/user-attachments/assets/77472ce9-f17c-45d4-8b37-800db1702e35


- MVP prototype: https://ai.studio/apps/drive/1NEftWR9H_0M2eLyMrXYEl3onpOVIly7z  

---

## 1. Overview

**ForestWatch eOS** is an **Environmental Operating System** built for the East African context.

It acts as a **Digital Twin for environmental action**, unifying:

- **Eyes – Forest Intelligence:** satellite tiles, IoT sensors, community reports → Threat Weight Score + AI alerts  
- **Hands – Restoration & Circular Economy:** alerts → restoration projects, smart-bin waste flows, USSD interactions  
- **Wallet – PES & Eco-Tourism:** PES readiness scores, indicative KES payments, eco-fee flows to communities  
- **Brain – Bio-Knowledge Core:** AI assistant for restoration and species questions, tuned to East African ecosystems  

The goal is to help WMF/GBM, counties and communities **detect threats, mobilize action, and route payments** in one platform.

---

## 2. Key Features (MVP)

- **ForestWatch Map Dashboard**
  - Simulated sensors, satellite tiles and community reports  
  - AI-generated alerts with **Threat Weight Score (TWS)** and explainable evidence

- **Restoration Hub**
  - Turn alerts into **Restoration Projects** (e.g. mangrove replanting)  
  - Track area restored, trees/mangroves planted, survival rate, CO₂e (example metrics)

- **Circular Economy Hub**
  - Smart-bin style cards (fill level, battery, material type)  
  - **USSD simulator** for waste pickers to report pickups and check PES-style wallet balances

- **PES & Incentives**
  - Example **PES Readiness Scores** and indicative payments in KES  
  - Simple benefit-sharing models across communities, rangers and platform

- **Bio-Knowledge Core**
  - UI wired to Gemini in AI Studio for contextual Q&A  
  - Designed to answer practical “how do we restore / plant / manage” questions

---

## 3. Architecture & Tech Stack

- **Frontend**
  - React (Vite)
  - TypeScript
  - Tailwind CSS (Dark Forest theme)
  - React Router DOM (multi-page app: Eyes / Hands / Wallet / Brain)

- **AI / Intelligence**
  - Google AI Studio (Gemini 2.5 Flash)
  - Custom prompts for:
    - Forest threat analysis (TWS)
    - Restoration & PES suggestions
    - Circular economy analysis
    - Knowledge-core Q&A

- **Data & Simulation**
  - Local JSON / `dataGenerator.ts` for:
    - Satellite-like tiles
    - Sensor readings
    - Waste/USSD events
    - Restoration/PES examples

Designed so it can later plug into real IoT, satellite APIs, USSD providers and payments (e.g. M-Pesa).

---

## 4. Run Locally

**Prerequisites:** Node.js

1. Install dependencies  
   ```bash
   npm install

