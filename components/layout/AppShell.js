"use client";

import Topbar from "./TopBar";


export default function AppShell({ children }) {
    return (
        <div className="flex h-screen overflow-hidden">
            <div className="flex-1 flex flex-col">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-8 space-y-8">
                    {children}
                </main>
            </div>
        </div>
    );
}