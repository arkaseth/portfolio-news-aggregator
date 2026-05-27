interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
  negative?: boolean;
}

export function StatCard({ label, value, change, positive, negative }: StatCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
      {change && (
        <p
          className={`mt-1 text-sm font-medium ${
            positive
              ? "text-green-600"
              : negative
                ? "text-red-600"
                : "text-gray-500"
          }`}
        >
          {change}
        </p>
      )}
    </div>
  );
}
