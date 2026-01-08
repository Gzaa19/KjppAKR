interface StatItemProps {
    value: number | string;
    label: string;
    color?: "red" | "dark";
}

function StatItem({ value, label, color = "red" }: StatItemProps) {
    const colorClass = color === "red" ? "text-kjpp-red" : "text-kjpp-dark";

    return (
        <div>
            <div className={`text-5xl font-extrabold ${colorClass} mb-2`}>
                {value}
            </div>
            <div className="text-sm font-bold text-kjpp-dark uppercase tracking-widest">
                {label}
            </div>
        </div>
    );
}

interface ClientStatsProps {
    totalClients: number;
    bankClients: number;
    nonBankClients: number;
}

export function ClientStats({ totalClients, bankClients, nonBankClients }: ClientStatsProps) {
    return (
        <div className="mt-20 pt-12 border-t border-slate-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <StatItem value={`${totalClients}+`} label="Total Klien" />
                <StatItem value={bankClients} label="Bank BUMN/Swasta" />
                <StatItem value={nonBankClients} label="Non Bank" />
            </div>
        </div>
    );
}
