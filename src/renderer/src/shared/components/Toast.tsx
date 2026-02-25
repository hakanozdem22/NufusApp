import { useEffect } from 'react'
import { CheckCircle, AlertCircle, XCircle, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning'

interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
  duration?: number
}

export const Toast = ({ message, type, onClose, duration = 3000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const icons = {
    success: <CheckCircle size={20} className="text-green-500" />,
    error: <XCircle size={20} className="text-red-500" />,
    warning: <AlertCircle size={20} className="text-yellow-500" />
  }

  const bgColors = {
    success: 'bg-green-50 border-green-100',
    error: 'bg-red-50 border-red-100',
    warning: 'bg-yellow-50 border-yellow-100'
  }

  return (
    <div
      className={`fixed top-5 right-5 z-[9999] flex items-center justify-between gap-4 min-w-[300px] p-4 rounded-lg shadow-lg border animate-in slide-in-from-right ${bgColors[type]}`}
    >
      <div className="flex items-center gap-3">
        {icons[type]}
        <p className="text-sm font-medium text-gray-800">{message}</p>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
        <X size={16} />
      </button>
    </div>
  )
}
