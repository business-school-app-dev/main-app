// import { LucideIcon } from "lucide-react"; // figma version 
import { LucideIcon } from "lucide-react-native";

interface ActionCardProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  onPress?: () => void;
}

export function ActionCard({ title, subtitle, icon: Icon, onPress }: ActionCardProps) {
  return (
    <button
      onClick={onPress}
      className="w-full bg-white rounded-xl border border-gray-200 p-5 shadow-sm active:scale-95 transition-transform duration-150"
    >
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-[#E11932] rounded-full flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-semibold text-black">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
