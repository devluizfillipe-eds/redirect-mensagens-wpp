import { useState } from 'react'
import './App.css'

function formatPhoneNumber(value: string): string {
  // Remove tudo que não for dígito
  const digits = value.replace(/\D/g, '')

  // Formata de acordo com a quantidade de dígitos
  if (digits.length <= 2) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
}

function App() {
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhone(formatted)
    if (error) setError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const phoneDigits = phone.replace(/\D/g, '')

    if (phoneDigits.length < 10) {
      setError('Por favor, insira um número de telefone válido.')
      return
    }

    if (!message.trim()) {
      setError('Por favor, insira uma mensagem.')
      return
    }

    setSending(true)

    // Monta o número no formato internacional (Brasil +55)
    const internationalPhone = phoneDigits.startsWith('55')
      ? phoneDigits
      : `55${phoneDigits}`

    const encodedMessage = encodeURIComponent(message.trim())
    // Usamos api.whatsapp.com/send pois tem melhor compatibilidade com deep links em celulares.
    // Observação: Apesar de ter "api" no link, essa NÃO é a API paga. É apenas o link público oficial de redirecionamento.
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${internationalPhone}&text=${encodedMessage}`

    // Abre o WhatsApp imediatamente no mesmo fluxo do clique.
    // Remover o setTimeout resolve o erro de "falha ao abrir a URL" bloqueado por celulares.
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')

    // Limpa o número mas mantém a mensagem
    setPhone('')
    setError('')
    setSending(false)
  }

  const isFormValid =
    phone.replace(/\D/g, '').length >= 10 && message.trim().length > 0

  return (
    <div className="app-container">
      {/* Background animated blobs */}
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />
      <div className="bg-blob bg-blob-3" />

      <div className="card">
        {/* Header */}
        <div className="card-header">
          <div className="icon-wrapper">
            <svg viewBox="0 0 24 24" fill="currentColor" className="whatsapp-icon">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
          <h1 className="card-title">Automação Whatsapp</h1>
          <p className="card-subtitle">Envie mensagens personalizadas instantaneamente</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="form" noValidate>
          {/* Phone field */}
          <div className="field-group">
            <label htmlFor="phone" className="field-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="label-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Número de Telefone
            </label>
            <div className="input-wrapper">
              <span className="input-prefix">🇧🇷 +55</span>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="(31) 99999-9999"
                className="input-field input-with-prefix"
                maxLength={15}
                autoComplete="tel"
              />
            </div>
          </div>

          {/* Message field */}
          <div className="field-group">
            <label htmlFor="message" className="field-label">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="label-icon">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Mensagem
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
                if (error) setError('')
              }}
              placeholder="Digite sua mensagem aqui..."
              className="textarea-field"
              rows={4}
            />
            <div className="char-count">
              {message.length} caracteres
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="error-message" role="alert">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="error-icon">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            id="send-button"
            disabled={!isFormValid || sending}
            className={`send-button ${sending ? 'sending' : ''}`}
          >
            {sending ? (
              <>
                <span className="spinner" />
                Abrindo WhatsApp...
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="currentColor" className="btn-icon">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Enviar Mensagem
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="footer-text">
          Você será redirecionado para o WhatsApp após clicar
        </p>
      </div>
    </div>
  )
}

export default App
