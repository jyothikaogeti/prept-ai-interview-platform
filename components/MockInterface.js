export default function MockInterface({ rows = 3 }) {
  const widths = ["w-4/5", "w-3/5", "w-2/5", "w-4/5", "w-1/2"];
  const colors = [
    "bg-white/5",
    "bg-white/5",
    "bg-amber/400/15",
    "bg-white/5",
    "bg-white/5",
  ];

  return (
    <div className="bg-[#141417] border border-white/10 rounded-xl overflow-hidden mt-5">
      <div className="bg-white/5 border-b border-white/10 flex items-center gap-1.5 h-9 px-3.5">
        <span className="w-2 h-2 bg-[#ff5f57] rounded-full"></span>
        <span className="w-2 h-2 bg-[#ffbd2e] rounded-full"></span>
        <span className="w-2 h-2 bg-[#28c840] rounded-full"></span>
      </div>

      <div className="flex flex-col gap-2 p-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full ${widths[i]} ${colors[i]}`}
          />
        ))}
      </div>
    </div>
  );
}
