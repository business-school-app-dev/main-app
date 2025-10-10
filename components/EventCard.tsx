interface EventCardProps {
  title: string;
  date: string;
  detail: string;
  onPress?: () => void;
}

export function EventCard({ title, date, detail, onPress }: EventCardProps) {
  return (
    <button
      onClick={onPress}
      className="flex-shrink-0 w-72 bg-white rounded-xl border border-gray-200 p-4 shadow-sm active:scale-95 transition-transform duration-150"
    >
      <div className="text-left space-y-2">
        <div className="text-xs font-medium text-[#E11932] uppercase tracking-wide">
          {date}
        </div>
        <h3 className="font-semibold text-black leading-tight">
          {title}
        </h3>
        <p className="text-sm text-gray-600">
          {detail}
        </p>
      </div>
    </button>
  );
}
