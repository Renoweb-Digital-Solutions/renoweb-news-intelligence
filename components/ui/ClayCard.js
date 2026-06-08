export default function ClayCard({ children }) {
    return (
        <div className="clay-card p-8 transition-transform duration-300">
            {children}
        </div>
    );
}
