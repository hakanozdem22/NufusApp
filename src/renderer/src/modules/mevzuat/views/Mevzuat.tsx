import { MevzuatHeader } from '../components/MevzuatHeader'
import { MevzuatWebview } from '../components/MevzuatWebview'
import { useMevzuatViewModel } from '../viewmodels/useMevzuatViewModel'

export const Mevzuat = () => {
  const vm = useMevzuatViewModel()

  return (
    <div className="flex flex-col h-full bg-gray-50/50 dark:bg-gray-900 relative overflow-hidden transition-colors">
      <MevzuatHeader onRefresh={vm.refreshWebView} onOpenExternal={vm.openExternal} />

      {/* Bilgilendirme Notu */}
      <div className="mx-4 mt-2 px-2 text-[10px] text-gray-400 text-center">
        * Dosyalar görünmüyorsa veya erişim izni hatası alıyorsanız:{' '}
        <b>Ayarlar &gt; Google Drive Bağlantısı</b> bölümünden giriş yapınız.
      </div>

      <MevzuatWebview driveUrl={vm.driveUrl} />
    </div>
  )
}
