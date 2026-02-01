import { Minus, Square, X } from 'lucide-react'

export const TitleBar = () => {
    return (
        <div className="h-8 bg-gray-200 dark:bg-gray-800 flex items-center justify-between select-none relative z-50">
            {/* Sürükleme Alanı - App Region Drag */}
            <div className="flex-1 h-full drag-region flex items-center px-4">
                <span className="text-xs text-gray-500 font-medium">T.C. Kapaklı İlçe Nüfus Müdürlüğü</span>
            </div>

            {/* Pencere Kontrolleri - No Drag */}
            <div className="flex h-full no-drag">
                <button
                    onClick={() => window.api.minimizeWindow()}
                    className="w-10 h-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                >
                    <Minus size={16} className="text-gray-600 dark:text-gray-300" />
                </button>
                <button
                    onClick={() => window.api.maximizeWindow()}
                    className="w-10 h-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                >
                    <Square size={14} className="text-gray-600 dark:text-gray-300" />
                </button>
                <button
                    onClick={() => window.api.closeWindow()}
                    className="w-10 h-full flex items-center justify-center hover:bg-red-500 hover:text-white transition group"
                >
                    <X size={16} className="text-gray-600 dark:text-gray-300 group-hover:text-white" />
                </button>
            </div>
        </div>
    )
}
