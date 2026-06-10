import { useState, useEffect, useCallback, useRef } from 'react'
import { playTokenSound, playFollowSound } from './sounds'
import TopBar from './components/TopBar'
import VideoFeed from './components/VideoFeed'
import ChatPanel from './components/ChatPanel'
import Watermark from './components/Watermark'
import USERNAMES from './data/usernames.json'
import MESSAGES from './data/messages.json'

export const BROADCASTER = 'sexy_online'

const MOD_MESSAGES = [
  'Por favor respeten las reglas del chat.',
  'Sin spam, gracias.',
  'Sean respetuosos con la modelo.',
  'Recuerden que los insultos llevan ban.',
  'Ambiente positivo por favor 🙏',
  'No se permiten links externos.',
  'Traten bien a la modelo o habrá ban.',
  'Recuerden suscribirse para apoyarla 💕',
]

let msgId = 0

function randomUser() {
  return USERNAMES[Math.floor(Math.random() * USERNAMES.length)]
}

function makeMsg(type) {
  const username = randomUser()
  const tokens = Math.floor(Math.random() * 200) + 15
  msgId += 1
  if (type === 'tip') return { id: msgId, type: 'tip', username, tokens, text: `te envió ${tokens} tokens` }
  if (type === 'mod') return { id: msgId, type: 'mod', username: '🛡️ MOD_' + username.slice(0, 8), text: MOD_MESSAGES[Math.floor(Math.random() * MOD_MESSAGES.length)] }
  return { id: msgId, type: 'regular', username, text: MESSAGES[Math.floor(Math.random() * MESSAGES.length)] }
}

export default function App() {
  const [isDark, setIsDark] = useState(true)
  const [viewers, setViewers] = useState(1247)
  const [tokenBalance, setTokenBalance] = useState(0)
  const [messages, setMessages] = useState([])
  const [streamActive] = useState(true)
  const [alertQueue, setAlertQueue] = useState([])
  const alertIdRef = useRef(0)

  // Aplicar clase dark al html
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  // Arrancar siempre en dark
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  const pushAlert = useCallback((alert) => {
    alertIdRef.current += 1
    setAlertQueue(q => [...q, { ...alert, _id: alertIdRef.current }])
  }, [])

  const popAlert = useCallback(() => {
    setAlertQueue(q => q.slice(1))
  }, [])

  // Viewer drift
  useEffect(() => {
    const id = setInterval(() => {
      setViewers(v => Math.max(0, v + Math.floor(Math.random() * 7) - 3))
    }, 4000)
    return () => clearInterval(id)
  }, [])

  // Chat simulation
  useEffect(() => {
    const id = setInterval(() => {
      const roll = Math.random()
      const type = roll > 0.85 ? 'tip' : roll > 0.75 ? 'mod' : 'regular'
      const msg = makeMsg(type)
      setMessages(prev => [...prev.slice(-99), msg])
      if (type === 'tip') {
        setTokenBalance(b => b + msg.tokens)
        pushAlert({ type: 'tip', username: msg.username, tokens: msg.tokens })
        playTokenSound()
      }
    }, 3000)
    return () => clearInterval(id)
  }, [pushAlert])

  // Follow simulation
  useEffect(() => {
    let tid
    const schedule = () => {
      tid = setTimeout(() => {
        const username = randomUser()
        msgId += 1
        setMessages(prev => [...prev.slice(-99), { id: msgId, type: 'follow', username, text: '¡ahora te sigue!' }])
        pushAlert({ type: 'follow', username })
        playFollowSound()
        schedule()
      }, 8000 + Math.random() * 6000)
    }
    schedule()
    return () => clearTimeout(tid)
  }, [pushAlert])

  const handleSend = useCallback((text) => {
    if (!text.trim()) return
    msgId += 1
    setMessages(prev => [...prev.slice(-99), { id: msgId, type: 'regular', username: 'Tú', text }])
  }, [])

  const handleSendTokens = useCallback((amount) => {
    msgId += 1
    setMessages(prev => [...prev.slice(-99), { id: msgId, type: 'tip', username: 'Tú', tokens: amount, text: `enviaste ${amount} tokens` }])
    setTokenBalance(b => b + amount)
    pushAlert({ type: 'tip', username: 'Tú', tokens: amount })
    playTokenSound()
  }, [pushAlert])

  // Cuando el usuario da Seguir → alerta en el video
  const handleFollow = useCallback(() => {
    pushAlert({ type: 'follow', username: 'Tú', self: true })
    playFollowSound()
  }, [pushAlert])

  return (
    <div className="h-screen bg-gray-100 dark:bg-bg text-gray-900 dark:text-white font-sans flex flex-col overflow-hidden relative">
      <Watermark isDark={isDark} />
      <div className="relative z-10 flex flex-col h-full">
        <TopBar
          viewers={viewers}
          onSendTokens={handleSendTokens}
          onFollow={handleFollow}
          isDark={isDark}
          onToggleTheme={() => setIsDark(d => !d)}
        />

        <main className="flex flex-1 overflow-hidden">
          <div className="flex flex-col flex-1 min-w-0">
            <VideoFeed
              tokenBalance={tokenBalance}
              streamActive={streamActive}
              currentAlert={alertQueue[0] ?? null}
              onAlertDone={popAlert}
            />
          </div>

          <div className="w-[260px] flex-shrink-0 border-l border-gray-200 dark:border-border flex flex-col">
            <ChatPanel messages={messages} onSend={handleSend} />
          </div>
        </main>
      </div>
    </div>
  )
}
