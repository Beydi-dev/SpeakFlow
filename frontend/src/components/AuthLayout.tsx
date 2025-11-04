// composant style pour login et sign up

interface AuthLayoutProps {
  subtitle: string
  children: React.ReactNode
}

export default function AuthLayout({ subtitle, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        
        {/* EN-TÊTE FIXE */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-3xl">👤</span>
            <h1 className="text-2xl font-bold">SpeakFlow</h1>
          </div>
          <p className="text-gray-600 text-sm">{subtitle}</p>
        </div>

        {/* CONTENU (formulaire) */}
        {children}

      </div>
    </div>
  )
}