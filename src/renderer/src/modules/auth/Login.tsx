import React, { useState, useEffect } from 'react'
import { User, Lock, Eye, EyeOff, Loader2, X, Mail, CheckCircle, AlertCircle } from 'lucide-react'

interface LoginProps {
  onLogin: () => void
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [profileImage, setProfileImage] = useState<string>('')

  const [isRemembered, setIsRemembered] = useState(false)

  // Forgot Password State
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [code, setCode] = useState('')
  const [resetStep, setResetStep] = useState<
    'input' | 'sending' | 'verify' | 'new_password' | 'success' | 'error'
  >('input')

  const loadProfile = async () => {
    try {
      if (window.api) {
        const img = await window.api.getSetting('profile_image')
        if (img) setProfileImage(img)
      }
    } catch (e) {
      console.error('Profil resmi yüklenemedi', e)
    }
  }

  useEffect(() => {
    const rememberedUser = localStorage.getItem('remembered_username')
    if (rememberedUser) {
      setUsername(rememberedUser)
      setIsRemembered(true)
      setRememberMe(true)
    }
    loadProfile()
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      if (username === 'hakanozdem' && password === 'Hakan2843*') {
        if (rememberMe) {
          localStorage.setItem('remembered_username', username)
        } else {
          localStorage.removeItem('remembered_username')
        }
        onLogin()
      } else {
        setError('Kullanıcı adı veya şifre hatalı')
        setLoading(false)
      }
    }, 800)
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!resetEmail) return

    setResetStep('sending')

    // Simulate API call
    setTimeout(async () => {
      try {
        if (window.api) {
          const savedEmail = await window.api.getSetting('recovery_email')

          if (savedEmail && savedEmail.toLowerCase() === resetEmail.toLowerCase()) {
            setResetStep('verify')
            console.log('SIMULATED CODE: 1234')
            // For demo purposes, we alert the code so user knows it
            alert('Demo için Doğrulama Kodu: 1234')
          } else {
            setResetStep('error')
          }
        } else {
          setResetStep('error')
        }
      } catch {
        setResetStep('error')
      }
    }, 1500)
  }

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault()
    if (code === '1234') {
      setResetStep('new_password')
    } else {
      alert('Hatalı Kod! (Demo kodu: 1234)')
    }
  }

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    setResetStep('success')
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/30 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-sm px-4">
        {/* Glass Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 transition-all hover:bg-white/15">
          {/* Logo / Icon Area */}
          <div className="flex justify-center mb-8">
            <div
              className={`w-24 h-24 rounded-full border-4 border-white/30 flex items-center justify-center bg-white/5 shadow-inner overflow-hidden ${profileImage ? 'p-0' : 'p-4'}`}
            >
              {profileImage ? (
                <img src={profileImage} alt="User" className="w-full h-full object-cover" />
              ) : (
                <User size={40} className="text-white/80" />
              )}
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-sm p-3 rounded-lg text-center animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {!isRemembered && (
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User
                      size={18}
                      className="text-white/50 group-focus-within:text-white transition-colors"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Kullanıcı Adı"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/40 outline-none focus:border-white/40 focus:bg-black/30 transition-all font-light tracking-wide"
                  />
                </div>
              )}

              {isRemembered && (
                <div className="text-center mb-2">
                  <h3 className="text-white text-lg font-medium">{username}</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setIsRemembered(false)
                      setUsername('')
                      setProfileImage('') // Reset to default or allow re-fetch if username typed
                      localStorage.removeItem('remembered_username')
                      loadProfile() // Re-fetch default settings or clear
                    }}
                    className="text-white/40 text-xs hover:text-white transition-colors mt-1"
                  >
                    Farklı bir hesapla giriş yap
                  </button>
                </div>
              )}

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock
                    size={18}
                    className="text-white/50 group-focus-within:text-white transition-colors"
                  />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Şifre"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-lg py-3 pl-10 pr-12 text-white placeholder-white/40 outline-none focus:border-white/40 focus:bg-black/30 transition-all font-light tracking-wide"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer text-white/70 hover:text-white transition-colors">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer w-4 h-4 appearance-none border border-white/30 rounded checked:bg-blue-500 checked:border-blue-500 transition-colors"
                  />
                  <svg
                    className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 left-0.5 top-0.5 transition-opacity"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                Beni Hatırla
              </label>
              <button
                type="button"
                onClick={() => {
                  setResetStep('input')
                  setResetEmail('')
                  setShowForgotModal(true)
                }}
                className="text-white/50 hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                Şifremi Unuttum?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium py-3 rounded-lg shadow-lg shadow-blue-500/30 transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-wider text-sm"
            >
              {loading ? <Loader2 size={20} className="animate-spin" /> : 'GİRİŞ YAP'}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-white/20 text-xs font-light tracking-widest">
          &copy; 2026 Mevzuat
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#1e293b] border border-white/10 p-6 rounded-2xl w-full max-w-sm shadow-2xl relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="text-blue-400" size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {resetStep === 'input' && 'Şifremi Unuttum'}
                {resetStep === 'verify' && 'Doğrulama Kodu'}
                {resetStep === 'new_password' && 'Yeni Şifre'}
                {(resetStep === 'success' || resetStep === 'error') && 'Bildirim'}
              </h3>
              <p className="text-white/60 text-sm">
                {resetStep === 'input' && 'Hesabınıza kayıtlı e-posta adresinizi girin.'}
                {resetStep === 'verify' && 'E-postanıza gönderilen 4 haneli kodu girin.'}
                {resetStep === 'new_password' && 'Yeni şifrenizi belirleyin.'}
              </p>
            </div>

            {resetStep === 'input' && (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <input
                  type="email"
                  required
                  placeholder="E-posta adresiniz"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-white/40 outline-none focus:border-white/40 focus:bg-black/30 transition-all"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  Kod Gönder
                </button>
              </form>
            )}

            {resetStep === 'verify' && (
              <form onSubmit={handleVerify} className="space-y-4">
                <div className="flex justify-center gap-4">
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="0000"
                    className="w-32 text-center text-2xl tracking-[0.5em] bg-black/20 border border-white/10 rounded-lg py-2 text-white outline-none focus:border-blue-500 transition-all"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-500 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  Doğrula
                </button>
              </form>
            )}

            {resetStep === 'new_password' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <input
                  type="password"
                  required
                  placeholder="Yeni Şifre"
                  className="w-full bg-black/20 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-white/40 outline-none focus:border-white/40 focus:bg-black/30 transition-all"
                />
                <input
                  type="password"
                  required
                  placeholder="Yeni Şifre (Tekrar)"
                  className="w-full bg-black/20 border border-white/10 rounded-lg py-3 px-4 text-white placeholder-white/40 outline-none focus:border-white/40 focus:bg-black/30 transition-all"
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  Şifreyi Değiştir
                </button>
              </form>
            )}

            {resetStep === 'sending' && (
              <div className="py-8 flex flex-col items-center justify-center space-y-4">
                <Loader2 size={40} className="text-blue-500 animate-spin" />
                <p className="text-white/60 text-sm">İşlem yapılıyor...</p>
              </div>
            )}

            {resetStep === 'success' && (
              <div className="py-4 text-center space-y-4 animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto text-green-400">
                  <CheckCircle size={32} />
                </div>
                <div>
                  <h4 className="text-green-400 font-bold mb-1">Başarılı!</h4>
                  <p className="text-white/60 text-sm px-4">Şifreniz başarıyla değiştirildi.</p>
                </div>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-lg transition-colors mt-2"
                >
                  Giriş'e Dön
                </button>
              </div>
            )}

            {resetStep === 'error' && (
              <div className="py-4 text-center space-y-4 animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-400">
                  <AlertCircle size={32} />
                </div>
                <div>
                  <h4 className="text-red-400 font-bold mb-1">Başarısız Oldu</h4>
                  <p className="text-white/60 text-sm px-4">Bu e-posta adresi kayıtlı değil.</p>
                </div>
                <button
                  onClick={() => setResetStep('input')}
                  className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-lg transition-colors mt-2"
                >
                  Tekrar Dene
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
