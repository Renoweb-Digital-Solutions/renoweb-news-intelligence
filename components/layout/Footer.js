import { Chewy } from "next/font/google";

const chewy = Chewy({ weight: '400', subsets: ['latin'] });

export default function Footer() {
    return (
        <footer className="mt-auto py-12 border-t-[3px] border-[var(--border)] bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
                
                {/* Big Branding */}
                <div className={`flex flex-col items-center md:items-start ${chewy.className}`}>
                    <span className="text-5xl md:text-7xl text-[#191919] tracking-wide drop-shadow-[4px_4px_0_var(--rw-yellow)] -rotate-2 origin-left">
                        Snooptel 🕵️‍♂️
                    </span>
                    <p className="text-[#191919] font-sans font-bold tracking-widest uppercase text-xs mt-3 rotate-1">
                        Snooping the web so you don't have to
                    </p>
                </div>

                {/* Legal and Copyright */}
                <div className="flex flex-col items-center md:items-end gap-5">
                    <div className="flex flex-wrap gap-4 text-sm font-bold text-[var(--muted)] uppercase tracking-wider">
                        <a href="#" className="hover:text-[#4460ef] transition-colors border-b-[3px] border-transparent hover:border-[#4460ef] pb-0.5">Terms of Service</a>
                        <span className="text-[var(--border)]">•</span>
                        <a href="#" className="hover:text-[#4460ef] transition-colors border-b-[3px] border-transparent hover:border-[#4460ef] pb-0.5">Privacy Policy</a>
                        <span className="text-[var(--border)]">•</span>
                        <a href="#" className="hover:text-[#4460ef] transition-colors border-b-[3px] border-transparent hover:border-[#4460ef] pb-0.5">Cookie Policy</a>
                    </div>
                    <div className="text-sm font-black text-[#191919] bg-[var(--rw-sky)] px-4 py-2 rounded-md border-2 border-[#191919] shadow-[2px_2px_0_#191919] rotate-1">
                        &copy; {new Date().getFullYear()} Renoweb Digital Solutions
                    </div>
                </div>

            </div>
        </footer>
    );
}
