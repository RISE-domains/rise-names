export const NAME_NFT_ADDRESS = '0x35b78504bBAdBe7ab6d244725Ec685a7C7402398' as const
export const MOCK_USDC_ADDRESS = '0xe39cfEb6aad944Cc88b07bFaaEC5E266e8E9dcCf' as const
export const REGISTRAR_ADDRESS = '0xcFa7c424B398F2b31872f9Cb8b914C66989C72c8' as const

export const nameNFTAbi = [
  {
    type: 'function',
    name: 'isAvailable',
    inputs: [
      { name: 'label', type: 'string' },
      { name: 'parentId', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getFee',
    inputs: [{ name: 'length', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getPremium',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'makeCommitment',
    inputs: [
      { name: 'label', type: 'string' },
      { name: 'owner', type: 'address' },
      { name: 'secret', type: 'bytes32' },
    ],
    outputs: [{ name: '', type: 'bytes32' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    name: 'commit',
    inputs: [{ name: 'commitment', type: 'bytes32' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'reveal',
    inputs: [
      { name: 'label', type: 'string' },
      { name: 'secret', type: 'bytes32' },
    ],
    outputs: [{ name: 'tokenId', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'tokensOfOwner',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'records',
    inputs: [{ name: '', type: 'uint256' }],
    outputs: [
      { name: 'label', type: 'string' },
      { name: 'parent', type: 'uint256' },
      { name: 'expiresAt', type: 'uint64' },
      { name: 'epoch', type: 'uint64' },
      { name: 'parentEpoch', type: 'uint64' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'renew',
    inputs: [{ name: 'tokenId', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'computeId',
    inputs: [{ name: 'fullName', type: 'string' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'pure',
  },
] as const

export const mockUSDCAbi = [
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ name: 'result', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'allowance',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: 'result', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'approve',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'mint',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'decimals',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'pure',
  },
] as const
