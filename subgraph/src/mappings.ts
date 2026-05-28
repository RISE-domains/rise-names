import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  NameRegistered,
  NameRenewed,
  AddrChanged,
  TextChanged,
  PrimaryNameSet,
} from "../generated/NameNFT/NameNFT"
import { Domain, Account, TextRecord } from "../generated/schema"

// ── helpers ──────────────────────────────────────────────────────────────────

function getOrCreateAccount(address: string): Account {
  let account = Account.load(address)
  if (account == null) {
    account = new Account(address)
    account.save()
  }
  return account as Account
}

function getOrCreateDomain(id: string): Domain {
  let domain = Domain.load(id)
  if (domain == null) {
    domain = new Domain(id)
  }
  return domain as Domain
}

// ── handlers ─────────────────────────────────────────────────────────────────

export function handleNameRegistered(event: NameRegistered): void {
  let tokenId = event.params.tokenId.toHex()
  let ownerAddr = event.params.owner.toHexString().toLowerCase()

  let owner = getOrCreateAccount(ownerAddr)

  let domain = getOrCreateDomain(tokenId)
  domain.name = event.params.label + ".rise"
  domain.labelName = event.params.label
  domain.owner = ownerAddr
  domain.resolvedAddress = ownerAddr   // defaults to owner until explicitly set
  domain.expiresAt = event.params.expiresAt
  domain.createdAt = event.block.timestamp
  domain.save()

  owner.save()
}

export function handleNameRenewed(event: NameRenewed): void {
  let tokenId = event.params.tokenId.toHex()
  let domain = Domain.load(tokenId)
  if (domain == null) return

  domain.expiresAt = event.params.newExpiresAt
  domain.save()
}

export function handleAddrChanged(event: AddrChanged): void {
  // node == tokenId (bytes32 cast of uint256)
  let tokenId = event.params.node.toHex()
  let resolvedAddr = event.params.addr.toHexString().toLowerCase()

  let domain = Domain.load(tokenId)
  if (domain == null) return

  let account = getOrCreateAccount(resolvedAddr)
  domain.resolvedAddress = resolvedAddr
  domain.save()

  account.save()
}

export function handleTextChanged(event: TextChanged): void {
  let tokenId = event.params.node.toHex()
  let key = event.params.key
  let value = event.params.value

  let domain = Domain.load(tokenId)
  if (domain == null) return

  let recordId = tokenId + "-" + key
  let record = TextRecord.load(recordId)
  if (record == null) {
    record = new TextRecord(recordId)
    record.domain = tokenId
    record.key = key
  }
  record.value = value
  record.save()
}

export function handlePrimaryNameSet(event: PrimaryNameSet): void {
  let addr = event.params.addr.toHexString().toLowerCase()
  let tokenId = event.params.tokenId.toHex()

  let account = getOrCreateAccount(addr)

  if (event.params.tokenId.equals(BigInt.fromI32(0))) {
    // tokenId 0 means they cleared their primary name
    account.primaryName = null
  } else {
    let domain = Domain.load(tokenId)
    if (domain == null) return
    account.primaryName = tokenId
  }

  account.save()
}
