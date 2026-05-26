import { useState } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { formatUnits } from 'viem'
import { waitForTransactionReceipt, writeContract } from '@wagmi/core'
import { config } from '../lib/wagmi'
import { NAME_NFT_ADDRESS, MOCK_USDC_ADDRESS, nameNFTAbi, mockUSDCAbi } from '../lib/contracts'
import { RegisterFlow } from './RegisterFlow'

export function NameSearch() {
  const { address } = useAccount()
  const [input, setInput] = useState('')
  const [searchedLabel, setSearchedLabel] = useState('')
  const [showFlow, setShowFlow] = useState(false)
  const [minting, setMinting] = useState(false)

  const label = searchedLabel.replace(/\.rise$/i, '').toLowerCase().trim()

  const { data: available, isLoading: checking } = useReadContract({
    address: NAME_NFT_ADDRESS,
    abi: nameNFTAbi,
    functionName: 'isAvailable',
    args: [label, 0n],
    query: { enabled: label.length > 0 },
  })

  const { data: fee } = useReadContract({
    address: NAME_NFT_ADDRESS,
    abi: nameNFTAbi,
    functionName: 'getFee',
    args: [BigInt(label.length)],
    query: { enabled: label.length > 0 },
  })

  const handleSearch = () => {
    const cleaned = input.replace(/\.rise$/i, '').toLowerCase().trim()
    if (!cleaned) return
    setSearchedLabel(cleaned)
    setShowFlow(false)
  }

  const handleMintUSDC = async () => {
    if (!address) return
    setMinting(true)
    try {
      const hash = await writeContract(config, {
        address: MOCK_USDC_ADDRESS,
        abi: mockUSDCAbi,
        functionName: 'mint',
        args: [address, BigInt(1000e18)],
      })
      await waitForTransactionReceipt(config, { hash })
    } catch {
      // ignore user reject
    } finally {
      setMinting(false)
    }
  }

  return (
    <div className="search-section">
      <h1 className="headline">Claim your .RISE name</h1>
      <p className="subline">Own your identity on Rise.</p>

      <div className="search-row">
        <div className="input-wrap">
          <input
            className="name-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="yourname"
            spellCheck={false}
          />
          <span className="tld-suffix">.RISE</span>
        </div>
        <button className="btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Testnet faucet */}
      {address && (
        <p className="faucet-hint">
          Need test tokens?{' '}
          <button className="link-btn" onClick={handleMintUSDC} disabled={minting}>
            {minting ? 'Minting...' : 'Mint 1000 MOCKUSDC'}
          </button>
        </p>
      )}

      {/* Search result */}
      {label && (
        <div className="result-section">
          {checking ? (
            <p className="muted">Checking availability...</p>
          ) : (
            <>
              <div className="result-row">
                <span className="result-name">{label}.RISE</span>
                {available ? (
                  <span className="badge badge-green">Available</span>
                ) : (
                  <span className="badge badge-red">Taken</span>
                )}
              </div>

              {available && fee != null && (
                <>
                  <p className="fee-line">
                    {formatUnits(fee, 18)} MOCKUSDC / year
                  </p>
                  {!showFlow ? (
                    <button
                      className="btn-primary"
                      onClick={() => setShowFlow(true)}
                      disabled={!address}
                      title={!address ? 'Connect wallet first' : ''}
                    >
                      Register
                    </button>
                  ) : (
                    <RegisterFlow
                      label={label}
                      fee={fee}
                      onDone={() => {
                        setSearchedLabel('')
                        setInput('')
                        setShowFlow(false)
                      }}
                    />
                  )}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
