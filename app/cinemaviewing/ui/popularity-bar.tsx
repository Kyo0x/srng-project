type PopularityBarProps = {
  popularity: number;
};

export function PopularityBar({ popularity }: PopularityBarProps) {
  const isEmpty = popularity < 20;

  return (
    <div className="flex flex-col items-end gap-1.5">
      <span
        className={
          isEmpty
            ? "text-xs font-semibold text-emerald-400"
            : "text-xs text-slate-300"
        }
      >
        {isEmpty ? "Empty" : `${popularity}% full`}
      </span>
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full ${isEmpty ? "bg-emerald-500" : "bg-slate-600"}`}
          style={{ width: `${popularity}%` }}
        />
      </div>
    </div>
  );
}
