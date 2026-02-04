/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react'
import { Key, Save, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'

export const ApiKeysSettings = (): React.ReactElement => {
    const [driveApiKey, setDriveApiKey] = useState('')
    const [geminiApiKey, setGeminiApiKey] = useState('')
    const [showDriveKey, setShowDriveKey] = useState(false)
    const [showGeminiKey, setShowGeminiKey] = useState(false)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        loadSettings()
    }, [])

    const loadSettings = async (): Promise<void> => {
        try {
            const drive = await (window as any).electronAPI.getSetting('drive_api_key')
            const gemini = await (window as any).electronAPI.getSetting('gemini_api_key')
            if (drive) setDriveApiKey(drive)
            if (gemini) setGeminiApiKey(gemini)
        } catch (err) {
            console.error('Ayarlar yüklenemedi:', err)
        }
    }

    const handleSave = async (): Promise<void> => {
        setSaving(true)
        try {
            await (window as any).electronAPI.setSetting({ key: 'drive_api_key', value: driveApiKey })
            await (window as any).electronAPI.setSetting({ key: 'gemini_api_key', value: geminiApiKey })
            setSaved(true)
            setTimeout(() => setSaved(false), 3000)
        } catch (err) {
            console.error('Kaydetme hatası:', err)
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <Key size={20} className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 dark:text-white">API Anahtarları</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Google Drive ve Gemini AI için API anahtarlarını buradan yönetin.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Google Drive API Key */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Google Drive API Anahtarı
                        </label>
                        <div className="relative">
                            <input
                                type={showDriveKey ? 'text' : 'password'}
                                value={driveApiKey}
                                onChange={(e) => setDriveApiKey(e.target.value)}
                                placeholder="AIza..."
                                className="w-full px-4 py-2.5 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <button
                                type="button"
                                onClick={() => setShowDriveKey(!showDriveKey)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                {showDriveKey ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Google Cloud Console'dan alabilirsiniz. Drive API'yi etkinleştirmeniz gerekir.
                        </p>
                    </div>

                    {/* Gemini API Key */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Gemini API Anahtarı
                        </label>
                        <div className="relative">
                            <input
                                type={showGeminiKey ? 'text' : 'password'}
                                value={geminiApiKey}
                                onChange={(e) => setGeminiApiKey(e.target.value)}
                                placeholder="AIza..."
                                className="w-full px-4 py-2.5 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <button
                                type="button"
                                onClick={() => setShowGeminiKey(!showGeminiKey)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                {showGeminiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Google AI Studio'dan alabilirsiniz: ai.google.dev
                        </p>
                    </div>

                    {/* Save Button */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                        {saved && (
                            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                                <CheckCircle size={16} />
                                <span>Kaydedildi!</span>
                            </div>
                        )}
                        {!saved && (
                            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm">
                                <AlertCircle size={16} />
                                <span>API anahtarlarınızı güvenli tutun.</span>
                            </div>
                        )}
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg transition-colors"
                        >
                            <Save size={16} />
                            <span>{saving ? 'Kaydediliyor...' : 'Kaydet'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Help Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">
                    API Anahtarı Nasıl Alınır?
                </h4>
                <div className="space-y-3 text-sm text-blue-700 dark:text-blue-400">
                    <div>
                        <strong>Google Drive API:</strong>
                        <ol className="list-decimal list-inside mt-1 space-y-1 ml-2">
                            <li>console.cloud.google.com adresine gidin</li>
                            <li>Yeni proje oluşturun veya mevcut projeyi seçin</li>
                            <li>"API'ler ve Hizmetler" → "Kitaplık"a gidin</li>
                            <li>"Google Drive API"yi bulun ve etkinleştirin</li>
                            <li>"Kimlik Bilgileri" → "API Anahtarı Oluştur"a tıklayın</li>
                        </ol>
                    </div>
                    <div>
                        <strong>Gemini API:</strong>
                        <ol className="list-decimal list-inside mt-1 space-y-1 ml-2">
                            <li>ai.google.dev adresine gidin</li>
                            <li>Google hesabınızla giriş yapın</li>
                            <li>"Get API key" butonuna tıklayın</li>
                            <li>API anahtarınızı kopyalayın</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    )
}
