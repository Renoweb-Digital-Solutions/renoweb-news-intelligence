"use client";

import Topbar from "./TopBar";
import Footer from "./Footer";

export default function AppShell({ children }) {
    return (
        <div className="min-h-screen flex flex-col">
            <Topbar />
            <main className="flex-1 flex flex-col">
                <div className="flex-1 p-8 space-y-8">
                    {children}
                </div>
                <Footer />
            </main>
        </div>
    );
}