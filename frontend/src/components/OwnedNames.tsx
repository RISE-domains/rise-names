import { useState } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { waitForTransactionReceipt, writeContract } from '@wagmi/core'
import { config } from '../lib/wagmi'
import { NAME_NFT_ADDRESS, nameNFTAbi } from '../lib/contracts'

function ExpiryLabel({ expiresAt }: { expiresAt: bigint }) {
  const ms = Number(expiresAt) * 1000
  const isExpired = ms < Date.now()
  const date = new Date(ms).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  return (
    <span className={isExpired ? 'expiry-expired' : 'expiry-ok'}>
      {isExpired ? `Expired ${date}` : `Expires ${date}`}
    </span>
  )
}

function NameCard({ tokenId }: { tokenId: bigint }) {
  const [renewing, setRenewing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: record } = useReadContract({
    address: NAME_NFT_ADDRESS,
    abi: nameNFTAbi,
    functionName: 'records',
    args: [tokenId],
  })

  const handleRenew = async () => {
    setRenewing(true)
    setError(null)
    try {
      const hash = await writeContract(config, {
        address: NAME_NFT_ADDRESS,
        abi: nameNFTAbi,
        functionName: 'renew',
        args: [tokenId],
      })
      await waitForTransactionReceipt(config, { hash })
    } catch (e) {
      setError(e instanceof Error ? e.message.slice(0, 80) : 'Failed')
    } finally {
      setRenewing(false)
    }
  }

  if (!record) return <div className="name-card skeleton" />

  const [label, , expiresAt] = record as readonly [string, bigint, bigint, bigint, bigint]

  return (
    <div className="name-card">
      <p className="name-card-title">{label}.RISE</p>
      <ExpiryLabel expiresAt={expiresAt} />
      {error && <p className="card-error">{error}</p>}
      <button type="button" className="btn-secondary btn-sm" onClick={handleRenew} disabled={renewing}>
        {renewing ? 'Renewing...' : 'Renew'}
      </button>
    </div>
  )
}

export function OwnedNames() {
  const { address } = useAccount()

  const { data: tokenIds, isLoading } = useReadContract({
    address: NAME_NFT_ADDRESS,
    abi: nameNFTAbi,
    functionName: 'tokensOfOwner',
    args: [address!],
    query: { enabled: !!address },
  })

  if (!address) {
    return <p className="empty-state">Connect your wallet to see your names.</p>
  }

  if (isLoading) {
    return <p className="empty-state">Loading...</p>
  }

  if (!tokenIds || tokenIds.length === 0) {
    return <p className="empty-state">You don't own any .RISE names yet.</p>
  }

  return (
    <div className="owned-names">
      <p className="owned-count">{tokenIds.length} name{tokenIds.length !== 1 ? 's' : ''}</p>
      <div className="names-grid">
        {tokenIds.map(id => (
          <NameCard key={id.toString()} tokenId={id} />
        ))}
      </div>
    </div>
  )
}
