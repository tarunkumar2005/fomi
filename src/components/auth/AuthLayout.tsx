'use client'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
  icon: React.ReactNode
}

export default function AuthLayout({ children, title, subtitle, icon }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-2xl p-8 glow-shadow relative overflow-hidden">
          {/* Decorative gradient overlay */}
          <div className="absolute top-0 left-0 w-full h-1 gradient-primary"></div>
          
          <div className="text-center mb-8">
            <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              {icon}
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">{title}</h1>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
