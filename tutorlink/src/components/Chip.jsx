export default function Chip({ children, tone = "gray" }) {
  const map = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-emerald-100 text-emerald-700",
    blue: "bg-blue-100 text-blue-700",
    yellow: "bg-yellow-100 text-yellow-700",
    red: "bg-red-100 text-red-700",
    violet: "bg-violet-100 text-violet-700",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs ${map[tone]}`}>
      {children}
    </span>
  );
}
