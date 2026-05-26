import { useState } from 'react'
import { ConnectButton } from './components/ConnectButton'
import { NameSearch } from './components/NameSearch'
import { OwnedNames } from './components/OwnedNames'

type Tab = 'register' | 'names'

export function App() {
  const [tab, setTab] = useState<Tab>('register')

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-text">Rise Names</span>
          <span className="tld-badge">.RISE</span>
        </div>
        <ConnectButton />
      </header>

      <main className="main">
        <div className="tabs">
          <button
            type="button"
            className={`tab-btn ${tab === 'register' ? 'tab-active' : ''}`}
            onClick={() => setTab('register')}
          >
            Register
          </button>
          <button
            type="button"
            className={`tab-btn ${tab === 'names' ? 'tab-active' : ''}`}
            onClick={() => setTab('names')}
          >
            My Names
          </button>
        </div>

        <div className="tab-content">
          {tab === 'register' && <NameSearch />}
          {tab === 'names' && <OwnedNames />}
        </div>
      </main>
    </div>
  )
}
