export const GrayTitle = ({ children }) => (
  <span className="bg-linear-to-br from-stone-100 via-stone-300 to-stone-500 text-transparent bg-clip-text">
    {children}
  </span>
);

export const GoldTitle = ({ children }) => (
  <span className="bg-linear-to-br from-amber-300 via-amber-400 to-amber-600 text-transparent bg-clip-text">
    {children}
  </span>
);

export const SectionLabel = ({ children }) => (
  <p className="text-amber-400 text-xs font-semibold inline-flex items-center gap-2 uppercase tracking-[0.14em] mb-4">
    <span className="w-4 h-px bg-amber-400" />
    {children}
  </p>
);

export const SectionHeading = ({ grayText, goldText }) => (
  <h2 className="font-serif text-[clamp(2rem,4vw,3rem)] tracking-tight leading-[1.1]">
    <GrayTitle>{grayText}</GrayTitle>
    <br />
    <GoldTitle>{goldText}</GoldTitle>
  </h2>
);

export default function PageHeader({
  grayText,
  goldText,
  label,
  description,
  right,
}) {
  return (
    <div className="border-b border-white/8 px-8 py-10">
      <div className="max-w-6xl mx-auto flex justify-between items-center gap-4">
        <div>
          {label && <SectionLabel>{label}</SectionLabel>}
          <h1 className="text-5xl font-serif tracking-tight mt-1">
            {grayText && <GrayTitle>{grayText}</GrayTitle>}{" "}
            {goldText && <GoldTitle>{goldText}</GoldTitle>}
          </h1>
          {description && (
            <p className="text-stone-500 text-sm font-light mt-2">
              {description}
            </p>
          )}
        </div>

        {right && <div className="shrink-0">{right}</div>}
      </div>
    </div>
  );
}
