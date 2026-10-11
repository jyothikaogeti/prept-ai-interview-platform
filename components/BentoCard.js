export default function BentoCard({
  icon,
  title,
  description,
  children,
  className = "",
}) {
  return (
    <div
      className={`relative bg-[#0f0f11] border border-white/10 hover:border-amber-400/20 rounded-2xl transition overflow-hidden h-full duration-300 p-9 ${className}`}
    >
      <div className="absolute inset-0 bg-linear-to-br from-amber-400/5 via-transparent pointer-events-none" />

      <span className="w-11 h-11 bg-amber-400/10 text-xl border border-amber-400/20 flex justify-center items-center rounded-xl mb-5">
        {icon}
      </span>

      <h3 className="text-xl font-serif tracking-tight mb-2">{title}</h3>

      <p className="text-stone-400 text-sm leading-relaxed">{description}</p>

      {children}
    </div>
  );
}
