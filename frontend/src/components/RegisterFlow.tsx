import { useState, useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { readContract, waitForTransactionReceipt, writeContract } from '@wagmi/core'
import { formatUnits, maxUint256 } from 'viem'
import { config } from '../lib/wagmi'
import { NAME_NFT_ADDRESS, MOCK_USDC_ADDRESS, nameNFTAbi, mockUSDCAbi } from '../lib/contracts'

type Step = 'loading' | 'approve' | 'commit' | 'waiting' | 'reveal' | 'done'

interface Pending {
  label: string
  secret: `0x${string}`
  committedAt: number
}

const MIN_WAIT_MS = 65_000 // 65s to give a small buffer over the 60s minimum

const pendingKey = (address: string) => `rise_pending_${address.toLowerCase()}`

function randomSecret(): `0x${string}` {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  return `0x${Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')}` as `0x${string}`
}

function parseError(e: unknown): string {
  if (e instanceof Error) {
    if (e.message.toLowerCase().includes('user rejected')) return 'Transaction cancelled'
    return e.message.slice(0, 120)
  }
  return 'Transaction failed'
}

interface Props {
  label: string
  fee: bigint
  onDone: () => void
}

export function RegisterFlow({ label, fee, onDone }: Props) {
  const { address } = useAccount()
  const [step, setStep] = useState<Step>('loading')
  const [secret, setSecret] = useState<`0x${string}` | null>(null)
  const [, setCommittedAt] = useState<number | null>(null)
  const [countdown, setCountdown] = useState(65)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: allowance, isLoading: allowanceLoading, refetch: refetchAllowance } =
    useReadContract({
      address: MOCK_USDC_ADDRESS,
      abi: mockUSDCAbi,
      functionName: 'allowance',
      args: [address!, NAME_NFT_ADDRESS],
      query: { enabled: !!address },
    })

  // Determine initial step once allowance is known
  useEffect(() => {
    if (!address || allowanceLoading) return

    const stored = localStorage.getItem(pendingKey(address))
    if (stored) {
      try {
        const pending: Pending = JSON.parse(stored)
        if (pending.label === label) {
          setSecret(pending.secret)
          setCommittedAt(pending.committedAt)
          const elapsed = Date.now() - pending.committedAt
          if (elapsed >= MIN_WAIT_MS) {
            setStep('reveal')
          } else {
            setCountdown(Math.ceil((MIN_WAIT_MS - elapsed) / 1000))
            setStep('waiting')
          }
          return
        }
      } catch {
        localStorage.removeItem(pendingKey(address))
      }
    }

    setStep(allowance !== undefined && allowance >= fee ? 'commit' : 'approve')
  }, [address, allowance, allowanceLoading, fee, label])

  // Live countdown while waiting
  useEffect(() => {
    if (step !== 'waiting') return
    const id = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(id)
          setStep('reveal')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [step])

  const handleApprove = async () => {
    if (!address) return
    setLoading(true)
    setError(null)
    try {
      const hash = await writeContract(config, {
        address: MOCK_USDC_ADDRESS,
        abi: mockUSDCAbi,
        functionName: 'approve',
        args: [NAME_NFT_ADDRESS, maxUint256],
      })
      await waitForTransactionReceipt(config, { hash })
      await refetchAllowance()
      setStep('commit')
    } catch (e) {
      setError(parseError(e))
    } finally {
      setLoading(false)
    }
  }

  const handleCommit = async () => {
    if (!address) return
    setLoading(true)
    setError(null)
    try {
      const sec = randomSecret()
      setSecret(sec)

      const commitment = await readContract(config, {
        address: NAME_NFT_ADDRESS,
        abi: nameNFTAbi,
        functionName: 'makeCommitment',
        args: [label, address, sec],
      })

      const hash = await writeContract(config, {
        address: NAME_NFT_ADDRESS,
        abi: nameNFTAbi,
        functionName: 'commit',
        args: [commitment],
      })
      await waitForTransactionReceipt(config, { hash })

      const now = Date.now()
      setCommittedAt(now)
      const pending: Pending = { label, secret: sec, committedAt: now }
      localStorage.setItem(pendingKey(address), JSON.stringify(pending))
      setCountdown(65)
      setStep('waiting')
    } catch (e) {
      setError(parseError(e))
    } finally {
      setLoading(false)
    }
  }

  const handleReveal = async () => {
    if (!address || !secret) return
    setLoading(true)
    setError(null)
    try {
      const hash = await writeContract(config, {
        address: NAME_NFT_ADDRESS,
        abi: nameNFTAbi,
        functionName: 'reveal',
        args: [label, secret],
      })
      await waitForTransactionReceipt(config, { hash })
      localStorage.removeItem(pendingKey(address))
      setStep('done')
    } catch (e) {
      setError(parseError(e))
    } finally {
      setLoading(false)
    }
  }

  const STEPS: { key: Step; label: string }[] = [
    { key: 'approve', label: 'Approve' },
    { key: 'commit', label: 'Secure' },
    { key: 'waiting', label: 'Wait' },
    { key: 'reveal', label: 'Claim' },
  ]

  const stepOrder: Step[] = ['approve', 'commit', 'waiting', 'reveal', 'done']
  const currentIdx = stepOrder.indexOf(step)

  if (step === 'loading') {
    return <div className="flow-loading">Checking allowance...</div>
  }

  return (
    <div className="register-flow">
      {/* Step indicator */}
      <div className="step-indicator">
        {STEPS.map(({ key, label: stepLabel }, i) => {
          const isDone = i < currentIdx
          const isActive = stepOrder[currentIdx] === key || (step === 'done' && i === STEPS.length - 1)
          return (
            <div key={key} className={`step-item ${isDone ? 'step-done' : isActive ? 'step-active' : ''}`}>
              <div className="step-dot">{isDone ? '✓' : i + 1}</div>
              <span className="step-label">{stepLabel}</span>
              {i < STEPS.length - 1 && <div className={`step-line ${isDone ? 'line-done' : ''}`} />}
            </div>
          )
        })}
      </div>

      {error && <p className="flow-error">{error}</p>}

      <div className="step-body">
        {step === 'approve' && (
          <>
            <p className="step-desc">
              Allow the contract to charge{' '}
              <strong>{formatUnits(fee, 18)} MOCKUSDC</strong> for registration.
            </p>
            <button className="btn-primary" onClick={handleApprove} disabled={loading}>
              {loading ? 'Approving...' : 'Approve MOCKUSDC'}
            </button>
          </>
        )}

        {step === 'commit' && (
          <>
            <p className="step-desc">
              Lock in your claim for <strong>{label}.RISE</strong>. This prevents frontrunning.
            </p>
            <button className="btn-primary" onClick={handleCommit} disabled={loading}>
              {loading ? 'Securing...' : 'Secure Name'}
            </button>
          </>
        )}

        {step === 'waiting' && (
          <>
            <p className="step-desc">
              Waiting {countdown}s before you can claim. This enforces the anti-frontrun window.
            </p>
            <div className="countdown-bar">
              <div
                className="countdown-fill"
                style={{ width: `${Math.max(0, ((65 - countdown) / 65) * 100)}%` }}
              />
            </div>
            <p className="countdown-label">{countdown}s remaining</p>
          </>
        )}

        {step === 'reveal' && (
          <>
            <p className="step-desc">
              Claim <strong>{label}.RISE</strong> and pay{' '}
              <strong>{formatUnits(fee, 18)} MOCKUSDC</strong>.
            </p>
            <button className="btn-primary" onClick={handleReveal} disabled={loading}>
              {loading ? 'Claiming...' : 'Claim Name'}
            </button>
          </>
        )}

        {step === 'done' && (
          <div className="success-state">
            <div className="success-icon">✓</div>
            <p className="success-text">
              <strong>{label}.RISE</strong> is yours!
            </p>
            <button className="btn-secondary" onClick={onDone}>
              Register another
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
