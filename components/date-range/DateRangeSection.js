import ClayCard from "../ui/ClayCard";

export default function DateRangeSection() {
    return (
        <ClayCard>
            <h2 className="text-xl font-semibold mb-6 text-slate-800">
                3. Date Range
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-slate-500 mb-2">From</label>
                    <input
                        type="date"
                        className="clay-input p-3 w-full text-slate-600"
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-slate-500 mb-2">To</label>
                    <input
                        type="date"
                        className="clay-input p-3 w-full text-slate-600"
                    />
                </div>
            </div>
        </ClayCard>
    );
}