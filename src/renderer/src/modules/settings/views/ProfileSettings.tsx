import { useRef } from 'react'
import { Camera, Mail, Save, User, Loader2 } from 'lucide-react'
import { useSettingsViewModel } from '../viewmodels/useSettingsViewModel'

export const ProfileSettings = () => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Custom ViewModel usage or extend existing one
  const vm = useSettingsViewModel()

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        alert("Dosya boyutu 2MB'dan küçük olmalıdır.")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        vm.setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <User className="text-blue-500" size={20} />
          Profil Bilgileri
        </h3>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center gap-3">
            <div
              className="relative w-32 h-32 rounded-full border-4 border-gray-100 dark:border-gray-700 overflow-hidden cursor-pointer group shadow-lg"
              onClick={handleImageClick}
            >
              {vm.profileImage ? (
                <img
                  src={vm.profileImage}
                  alt="Profil"
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                  <User size={48} />
                </div>
              )}

              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={24} />
              </div>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Değiştirmek için tıklayın
            </span>
          </div>

          {/* Form Section */}
          <div className="flex-1 w-full space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <User size={16} />
                  Ad Soyad
                </label>
                <input
                  type="text"
                  placeholder="Ad Soyad"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={vm.nameSurname}
                  onChange={(e) => vm.setNameSurname(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Mail size={16} />
                  Kurtarma E-postası
                </label>
                <input
                  type="email"
                  placeholder="ornek@email.com"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={vm.email}
                  onChange={(e) => vm.setEmail(e.target.value)}
                />
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  * Şifrenizi unutursanız bu adrese sıfırlama bağlantısı gönderilecektir.
                </p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={vm.saveProfileSettings}
                disabled={vm.yukleniyor}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {vm.yukleniyor ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                Değişiklikleri Kaydet
              </button>
            </div>
          </div>
        </div>

        {vm.bildirim && (
          <div
            className={`mt-4 p-3 rounded-lg text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${
              vm.bildirim.tur === 'basari'
                ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800'
            }`}
          >
            {vm.bildirim.mesaj}
          </div>
        )}
      </div>
    </div>
  )
}
