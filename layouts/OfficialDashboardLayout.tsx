import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function OfficialDashboardLayout(): React.ReactElement {
    return (
        <div className="flex h-[calc(100vh-65px)]">
            <Sidebar />
            <div className="flex-grow bg-gray-900/80 p-4 lg:p-6 overflow-y-auto">
                <Outlet />
            </div>
        </div>
    );
}