

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import OfficialAnalysisPage from './OfficialAnalysisPage';
import OfficialMapPage from './OfficialMapPage';
import OfficialAlertsPage from './OfficialAlertsPage';
import OfficialReportsHistoryPage from './OfficialReportsHistoryPage';
import OfficialDataInputsPage from './OfficialDataInputsPage';
import OfficialManagementPage from './OfficialManagementPage';
import WasteDashboardPage from './WasteDashboardPage';
import PesDashboardPage from './PesDashboardPage';
import RestorationDashboardPage from './RestorationDashboardPage';
import PartnerHubPage from './PartnerHubPage';
import KnowledgeHubPage from './KnowledgeHubPage';
import { useAuth } from '../contexts/AuthContext';

const officialPages: { [key: string]: React.ReactElement } = {
    'analysis': <OfficialAnalysisPage />,
    'map': <OfficialMapPage />,
    'alerts': <OfficialAlertsPage />,
    'reports': <OfficialReportsHistoryPage />,
    'data-inputs': <OfficialDataInputsPage />,
    'management': <OfficialManagementPage />,
    'waste': <WasteDashboardPage />,
    'pes': <PesDashboardPage />,
    'restoration': <RestorationDashboardPage />,
    'partners': <PartnerHubPage />,
    'knowledge': <KnowledgeHubPage />
};

const getOfficialRoute = () => {
    return window.location.hash.split('/')[2] || 'analysis';
};

export default function OfficialDashboardLayout(): React.ReactElement {
    const { user } = useAuth();
    const [page, setPage] = useState(getOfficialRoute());

    useEffect(() => {
        const handleHashChange = () => {
            if (window.location.hash.startsWith('#/dashboard')) {
                setPage(getOfficialRoute());
            }
        };
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    if (!user) return <div className="text-white text-center p-8">Redirecting to login...</div>;

    const ActivePage = officialPages[page] || officialPages['analysis'];

    return (
        <div className="flex h-[calc(100vh-65px)]">
            <Sidebar />
            <div className="flex-grow bg-gray-900/80 p-4 lg:p-6 overflow-y-auto">
                {ActivePage}
            </div>
        </div>
    );
}
