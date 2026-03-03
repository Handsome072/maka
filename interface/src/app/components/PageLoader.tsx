import { Loader2 } from "lucide-react";

export function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-emerald-500" />
        <p className="text-gray-500 font-medium">Chargement de HOMIQIO...</p>
      </div>
    </div>
  );
}
