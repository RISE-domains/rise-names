== Logs ==
  MockUSDC deployed: 0xe39cfEb6aad944Cc88b07bFaaEC5E266e8E9dcCf
  NameNFT deployed: 0x35b78504bBAdBe7ab6d244725Ec685a7C7402398
  SubdomainRegistrar deployed: 0xcFa7c424B398F2b31872f9Cb8b914C66989C72c8

=== Deployment Summary ===
  Chain ID:            11155931
  Deployer:            0x9D0616E0DA062907A0E64c44bD09d0A3DD2e3408
  Fee recipient:       0x9D0616E0DA062907A0E64c44bD09d0A3DD2e3408
  Payment token:       0xe39cfEb6aad944Cc88b07bFaaEC5E266e8E9dcCf
  NameNFT:             0x35b78504bBAdBe7ab6d244725Ec685a7C7402398
  SubdomainRegistrar:  0xcFa7c424B398F2b31872f9Cb8b914C66989C72c8

## Setting up 1 EVM.

==========================

Chain 11155931

Estimated gas price: 0.000000019 gwei

Estimated total gas used for script: 9713591

Estimated amount required: 0.000000000184558229 ETH

==========================

##### 11155931
✅  [Success] Hash: 0xeabe185c010321d2e67ce031070d38160b2d1cadacc6190ac1be1c647f983ade
Contract Address: 0xe39cfEb6aad944Cc88b07bFaaEC5E266e8E9dcCf
Block: 44729259
Paid: 0.00000000000493472 ETH (493472 gas * 0.00000001 gwei)


##### 11155931
✅  [Success] Hash: 0xe34bc6ce14f2b14cc7726c3ca79494c5eb1be4b41c2df3164857dde29bf95394
Block: 44729260
Paid: 0.00000000000210555 ETH (210555 gas * 0.00000001 gwei)


##### 11155931
✅  [Success] Hash: 0x0511126c724ba659ec9f33670f18d12b5d72490641a1d8aabec2bbf0edc2faf6
Contract Address: 0xeD799B12aefCF05b611ff31CB34F83DD5E3cd245
Block: 44729260
Paid: 0.00000000001297793 ETH (1297793 gas * 0.00000001 gwei)


##### 11155931
✅  [Success] Hash: 0x7dd2613694357d6adf77c3a7d9ebea974ce9587bcff1470f8ecfc7ae12f51ba8
Block: 44729260
Paid: 0.00000000000027997 ETH (27997 gas * 0.00000001 gwei)


##### 11155931
✅  [Success] Hash: 0x4ad8809d4fcbb24e0ee10b99f1c3b977cf9391ab5b9ee356aa4c450078edd4e3
Block: 44729260
Paid: 0.00000000000030079 ETH (30079 gas * 0.00000001 gwei)


##### 11155931
✅  [Success] Hash: 0x20bbab907d4cf3f0837ec956c64336d56f3d80c691bbbd48a4005713067d4f44
Contract Address: 0xe0226d5D67af74Fd8EF98def0d7034253B59b2Be
Block: 44729260
Paid: 0.00000000005382153 ETH (5382153 gas * 0.00000001 gwei)

✅ Sequence #1 on 11155931 | Total Paid: 0.00000000007442049 ETH (7442049 gas * avg 0.00000001 gwei)
                                                                                                                                            

==========================

ONCHAIN EXECUTION COMPLETE & SUCCESSFUL.

Transactions saved to: /Users/akshatpatil/Desktop/freelance/rise-names/broadcast/Deploy.s.sol/11155931/run-latest.json

Sensitive values saved to: /Users/akshatpatil/Desktop/freelance/rise-names/cache/Deploy.s.sol/11155931/run-latest.json

akshatpatil@Akshats-MacBook-Air-2 rise-names % export MOCK_USDC=0xe39cfEb6aad944Cc88b07bFaaEC5E266e8E9dcCf
  export NAME_NFT=0xe0226d5D67af74Fd8EF98def0d7034253B59b2Be
  export REGISTRAR=0xeD799B12aefCF05b611ff31CB34F83DD5E3cd245
  export DEPLOYER=0x9D0616E0DA062907A0E64c44bD09d0A3DD2e3408
akshatpatil@Akshats-MacBook-Air-2 rise-names %   forge verify-contract $MOCK_USDC src/mocks/MockUSDC.sol:MockUSDC \
    --verifier blockscout \
    --verifier-url https://explorer.testnet.riselabs.xyz/api \
    --rpc-url $RPC_URL
Start verifying contract `0xe39cfEb6aad944Cc88b07bFaaEC5E266e8E9dcCf` deployed on 11155931

Submitting verification for [src/mocks/MockUSDC.sol:MockUSDC] 0xe39cfEb6aad944Cc88b07bFaaEC5E266e8E9dcCf.
Error: Encountered an error verifying this contract:
Response: `Address is not a smart-contract`
Details:
                        `Address is not a smart-contract`
akshatpatil@Akshats-MacBook-Air-2 rise-names %   forge verify-contract $MOCK_USDC src/mocks/MockUSDC.sol:MockUSDC \
    --verifier blockscout \
    --verifier-url https://explorer.testnet.riselabs.xyz/api \
    --rpc-url $RPC_URL
Start verifying contract `0xe39cfEb6aad944Cc88b07bFaaEC5E266e8E9dcCf` deployed on 11155931

Submitting verification for [src/mocks/MockUSDC.sol:MockUSDC] 0xe39cfEb6aad944Cc88b07bFaaEC5E266e8E9dcCf.
Submitted contract for verification:
        Response: `OK`
        GUID: `e39cfeb6aad944cc88b07bfaaec5e266e8e9dccf6a15deed`
        URL: https://explorer.testnet.riselabs.xyz/address/0xe39cfeb6aad944cc88b07bfaaec5e266e8e9dccf
akshatpatil@Akshats-MacBook-Air-2 rise-names %   forge verify-contract $NAME_NFT src/NameNFT.sol:NameNFT \
    --verifier blockscout \
    --verifier-url https://explorer.testnet.riselabs.xyz/api \
    --constructor-args $(cast abi-encode "constructor(address,address)" $MOCK_USDC $DEPLOYER) \
    --rpc-url $RPC_URL
Start verifying contract `0xe0226d5D67af74Fd8EF98def0d7034253B59b2Be` deployed on 11155931
Constructor args: 0x000000000000000000000000e39cfeb6aad944cc88b07bfaaec5e266e8e9dccf0000000000000000000000009d0616e0da062907a0e64c44bd09d0a3dd2e3408

Submitting verification for [src/NameNFT.sol:NameNFT] 0xe0226d5D67af74Fd8EF98def0d7034253B59b2Be.
Submitted contract for verification:
        Response: `OK`
        GUID: `e0226d5d67af74fd8ef98def0d7034253b59b2be6a15df23`
        URL: https://explorer.testnet.riselabs.xyz/address/0xe0226d5d67af74fd8ef98def0d7034253b59b2be
akshatpatil@Akshats-MacBook-Air-2 rise-names %   forge verify-contract $REGISTRAR src/SubdomainRegistrar.sol:SubdomainRegistrar \
    --verifier blockscout \
    --verifier-url https://explorer.testnet.riselabs.xyz/api \
    --constructor-args $(cast abi-encode "constructor(address,address)" $NAME_NFT $MOCK_USDC) \
    --rpc-url $RPC_URL
Start verifying contract `0xeD799B12aefCF05b611ff31CB34F83DD5E3cd245` deployed on 11155931
Constructor args: 0x000000000000000000000000e0226d5d67af74fd8ef98def0d7034253b59b2be000000000000000000000000e39cfeb6aad944cc88b07bfaaec5e266e8e9dccf

Submitting verification for [src/SubdomainRegistrar.sol:SubdomainRegistrar] 0xeD799B12aefCF05b611ff31CB34F83DD5E3cd245.
Submitted contract for verification:
        Response: `OK`
        GUID: `ed799b12aefcf05b611ff31cb34f83dd5e3cd2456a15df3d`
        URL: https://explorer.testnet.riselabs.xyz/address/0xed799b12aefcf05b611ff31cb34f83dd5e3cd245
akshatpatil@Akshats-MacBook-Air-2 rise-names % 