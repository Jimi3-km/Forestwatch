

import React, { useState } from 'react';

const USSD_SCREENS: any = {
    'HOME': {
        text: "WasteHub KE\n1. Report Pickup\n2. Check Wallet\n3. Material Prices\n4. My History\n5. PES Rewards\n6. Restoration",
        options: { '1': 'PICKUP', '2': 'WALLET', '3': 'PRICES', '4': 'HISTORY', '5': 'PES', '6': 'RESTORE' }
    },
    'PICKUP': {
        text: "Select Waste Type:\n1. Plastic\n2. Metal\n3. Organic\n0. Back",
        options: { '1': 'PICKUP_CONFIRM_PLASTIC', '2': 'PICKUP_CONFIRM_METAL', '3': 'PICKUP_CONFIRM_ORGANIC', '0': 'HOME' }
    },
    'PICKUP_CONFIRM_PLASTIC': {
        text: "Enter Est. Weight (KG):",
        input: true,
        next: 'PICKUP_SENT'
    },
    'PICKUP_CONFIRM_METAL': {
        text: "Enter Est. Weight (KG):",
        input: true,
        next: 'PICKUP_SENT'
    },
    'PICKUP_CONFIRM_ORGANIC': {
        text: "Enter Est. Weight (KG):",
        input: true,
        next: 'PICKUP_SENT'
    },
    'PICKUP_SENT': {
        text: "Pickup Request Sent!\nID: 4829\nCollector notified.\n\n0. Main Menu",
        options: { '0': 'HOME' }
    },
    'WALLET': {
        text: "Bal: KES 450.00\nPending: KES 120.00\n\n1. Withdraw to M-Pesa\n0. Back",
        options: { '1': 'WITHDRAW', '0': 'HOME' }
    },
    'WITHDRAW': {
        text: "Sent KES 450 to 0722XXXXXX.\nFee: KES 15.\nRef: QWE12345\n\n0. Main Menu",
        options: { '0': 'HOME' }
    },
    'PRICES': {
        text: "Today's Prices/KG:\nPlastic: 15/=\nMetal: 45/=\nGlass: 5/=\n\n0. Back",
        options: { '0': 'HOME' }
    },
    'HISTORY': {
        text: "Last 3 Trans:\n27/10: 5kg Metal\n26/10: 12kg Plastic\n\n0. Back",
        options: { '0': 'HOME' }
    },
    'PES': {
        text: "Eco-Credits Earned:\nThis Month: KES 250\nProg: Nairobi East Pilot\nStatus: Active\n\n0. Back",
        options: { '0': 'HOME' }
    },
    'RESTORE': {
        text: "Restoration Action:\n1. My Rewards\n2. Upcoming Events\n\n0. Back",
        options: { '1': 'RESTORE_REWARDS', '2': 'RESTORE_EVENTS', '0': 'HOME' }
    },
    'RESTORE_REWARDS': {
        text: "Badges: Mangrove Guardian\nPoints: 1200\nNext Level: 2000\n\n0. Back",
        options: { '0': 'HOME' }
    },
    'RESTORE_EVENTS': {
        text: "Next Event:\nGazi Bay Planting\nDate: 12 Nov\nTarget: 500 Seedlings\n\n0. Back",
        options: { '0': 'HOME' }
    }
};

export default function USSDSimulator() {
    const [screen, setScreen] = useState('HOME');
    const [input, setInput] = useState('');
    
    const handleSend = () => {
        const currentScreen = USSD_SCREENS[screen];
        
        if (currentScreen.input) {
            setScreen(currentScreen.next);
            setInput('');
            return;
        }

        if (currentScreen.options && currentScreen.options[input]) {
            setScreen(currentScreen.options[input]);
            setInput('');
        } else {
            setInput(''); // Invalid input reset
        }
    };

    return (
        <div className="bg-gray-900 p-4 rounded-xl border-4 border-gray-700 w-64 mx-auto shadow-2xl">
            {/* Phone Brand */}
            <div className="text-center text-gray-500 text-xs font-bold mb-2 tracking-widest">NOKIA</div>
            
            {/* Screen */}
            <div className="bg-[#9ea792] p-3 rounded-sm h-48 font-mono text-sm text-black shadow-inner flex flex-col justify-between relative overflow-hidden">
                {/* Scanlines effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 pointer-events-none bg-[length:100%_2px]"></div>
                
                <div className="whitespace-pre-wrap z-10 font-bold leading-snug">
                    {USSD_SCREENS[screen].text}
                </div>
                <div className="border-b-2 border-black w-full h-6 mt-2 flex items-end z-10">
                    <span>{input}</span><span className="animate-pulse">_</span>
                </div>
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-2 mt-4">
                {['1','2','3','4','5','6','7','8','9','*','0','#'].map(key => (
                    <button 
                        key={key}
                        onClick={() => setInput(prev => prev + key)}
                        className="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 rounded shadow-md border-b-4 border-gray-950 active:border-b-0 active:translate-y-1 transition-all"
                    >
                        {key}
                    </button>
                ))}
            </div>

             {/* Action Buttons */}
             <div className="grid grid-cols-2 gap-4 mt-4">
                <button 
                    onClick={() => { setScreen('HOME'); setInput(''); }} 
                    className="bg-red-700 text-white text-xs font-bold py-2 rounded border-b-4 border-red-900 active:border-b-0 active:translate-y-1"
                >
                    END
                </button>
                <button 
                    onClick={handleSend} 
                    className="bg-green-700 text-white text-xs font-bold py-2 rounded border-b-4 border-green-900 active:border-b-0 active:translate-y-1"
                >
                    SEND
                </button>
            </div>
        </div>
    );
}
