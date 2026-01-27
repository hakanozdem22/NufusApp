import { User, Save } from 'lucide-react'

interface SettingsFormProps {
  username: string
  setUsername: (val: string) => void
  onSave: () => void
  yukleniyor: boolean
}

export const SettingsForm = ({ username, setUsername, onSave, yukleniyor }: SettingsFormProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <User size={16} className="text-gray-400" /> Kullanıcı Adı
          </label>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Adınız Soyadınız"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <p className="text-xs text-gray-400 mt-1">
            Bu isim raporlarda ve program başlığında görünecektir.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end">
        <button
          onClick={onSave}
          disabled={yukleniyor}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-bold shadow-md flex items-center gap-2 transition transform active:scale-95"
        >
          <Save size={18} />
          {yukleniyor ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>
      </div>
    </div>
  )
}
