interface LoginEmailTemplateProps {
  magicLink: string
  userEmail: string
  expiresIn?: string
}

export default function LoginEmailTemplate({ 
  magicLink, 
  userEmail, 
  expiresIn = "15 minutes" 
}: LoginEmailTemplateProps) {
  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      padding: '40px 20px'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, #6366F1, #3B82F6)',
          borderRadius: '12px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          <span style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>F</span>
        </div>
        <h1 style={{
          color: '#0F172A',
          fontSize: '28px',
          fontWeight: 'bold',
          margin: '0 0 8px 0'
        }}>
          Sign in to Fomi
        </h1>
        <p style={{
          color: '#64748B',
          fontSize: '16px',
          margin: '0'
        }}>
          Click the button below to securely sign in to your account
        </p>
      </div>

      {/* Main Content */}
      <div style={{
        backgroundColor: '#F8FAFC',
        borderRadius: '12px',
        padding: '32px',
        marginBottom: '32px',
        border: '1px solid #E2E8F0'
      }}>
        <p style={{
          color: '#374151',
          fontSize: '16px',
          lineHeight: '1.6',
          margin: '0 0 24px 0'
        }}>
          Hello,
        </p>
        <p style={{
          color: '#374151',
          fontSize: '16px',
          lineHeight: '1.6',
          margin: '0 0 24px 0'
        }}>
          We received a request to sign in to your Fomi account using this email address: <strong>{userEmail}</strong>
        </p>
        
        {/* Magic Link Button */}
        <div style={{ textAlign: 'center', margin: '32px 0' }}>
          <a 
            href={magicLink}
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #6366F1, #3B82F6)',
              color: 'white',
              textDecoration: 'none',
              padding: '16px 32px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
            }}
          >
            Sign in to Fomi
          </a>
        </div>

        <p style={{
          color: '#6B7280',
          fontSize: '14px',
          lineHeight: '1.5',
          margin: '24px 0 0 0',
          textAlign: 'center'
        }}>
          This link will expire in <strong>{expiresIn}</strong> for security reasons.
        </p>
      </div>

      {/* Alternative Link */}
      <div style={{
        backgroundColor: '#FEF3C7',
        border: '1px solid #FCD34D',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '32px'
      }}>
        <p style={{
          color: '#92400E',
          fontSize: '14px',
          margin: '0 0 8px 0',
          fontWeight: '600'
        }}>
          Having trouble with the button?
        </p>
        <p style={{
          color: '#92400E',
          fontSize: '14px',
          margin: '0',
          wordBreak: 'break-all'
        }}>
          Copy and paste this link into your browser: <br />
          <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{magicLink}</span>
        </p>
      </div>

      {/* Security Notice */}
      <div style={{
        borderTop: '1px solid #E5E7EB',
        paddingTop: '24px',
        marginBottom: '24px'
      }}>
        <h3 style={{
          color: '#374151',
          fontSize: '16px',
          fontWeight: '600',
          margin: '0 0 12px 0'
        }}>
          Security Notice
        </h3>
        <ul style={{
          color: '#6B7280',
          fontSize: '14px',
          lineHeight: '1.5',
          margin: '0',
          paddingLeft: '20px'
        }}>
          <li>If you didn't request this sign-in, you can safely ignore this email</li>
          <li>This link can only be used once and expires in {expiresIn}</li>
          <li>Never share this link with anyone else</li>
        </ul>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        borderTop: '1px solid #E5E7EB',
        paddingTop: '24px'
      }}>
        <p style={{
          color: '#9CA3AF',
          fontSize: '14px',
          margin: '0 0 8px 0'
        }}>
          This email was sent to {userEmail}
        </p>
        <p style={{
          color: '#9CA3AF',
          fontSize: '12px',
          margin: '0'
        }}>
          © 2024 Fomi. All rights reserved.
        </p>
      </div>
    </div>
  )
}