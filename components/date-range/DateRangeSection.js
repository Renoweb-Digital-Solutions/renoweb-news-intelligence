import ClayCard from "../ui/ClayCard";

export default function DateRangeSection({ fromDate, setFromDate, toDate, setToDate }) {
    return (
        <ClayCard>
            <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#f0f3ff] text-[#4460ef] text-xs font-bold">3</span>
                <h2 className="text-lg font-semibold text-[#191919]">
                    Date Range
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col">
                    <label className="text-xs font-medium text-[var(--muted)] mb-1.5 uppercase tracking-wider">From</label>
                    <input
                        type="date"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="clay-input px-3.5 py-2.5 w-full"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-xs font-medium text-[var(--muted)] mb-1.5 uppercase tracking-wider">To</label>
                    <input
                        type="date"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="clay-input px-3.5 py-2.5 w-full"
                    />
                </div>
            </div>
        </ClayCard>
    );
}