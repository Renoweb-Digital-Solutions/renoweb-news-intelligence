export default function ClayCard({ children }) {
    return (
        <div className="neo-card p-4 sm:p-8 transition-transform duration-300">
            {children}
        </div>
    );
}
