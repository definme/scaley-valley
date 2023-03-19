/**
 * Script to deploy warp routes
 * Accepts 3 arguments:
 *   - private-key : Hex string of private key. Note: deployment requires funds on all chains
 *   - token-config : Path to token config JSON file (see example in ./configs)
 *   - chain-config : (Optional) Path to chain config JSON file (see example in ./configs)
 * Example: yarn ts-node scripts/deploy.ts --private-key $PRIVATE_KEY --token-config ./configs/warp-route-token-config.json
 */
import { ContractFactory, ethers } from 'ethers';
import fs from 'fs';
import path from 'path';

import yargs from 'yargs';

const contractAbi = JSON.parse(fs.readFileSync("/Users/dmitry/PycharmProjects/EthScalling/scaley-valley/hyperlane-warp-router/scripts/abiERC721.json").toString());

import {
  chainMetadata,
  MultiProvider,
} from '@hyperlane-xyz/sdk';

async function deployWarpRoute() {
  const argv = await yargs
    .option('private-key', {
      type: 'string',
      describe: 'Private key for signing transactions',
      demandOption: true,
    })
    .option('token-config', {
      type: 'string',
      describe: 'Path to token config JSON file',
      demandOption: true,
    })
    .option('chain-config', {
      type: 'string',
      describe: 'Path to chain config JSON file',
    }).argv;

  const privateKey = argv['private-key'];
  const tokenConfigPath = argv['token-config'];
  const chainConfigPath = argv['chain-config'];

  console.log('Reading warp route configs');

  const tokenConfigs = JSON.parse(
    fs.readFileSync(path.resolve(tokenConfigPath), 'utf-8'),
  );
  const targetChains = Object.keys(tokenConfigs);
  console.log(
    `Found token configs for ${targetChains.length} chains:`,
    targetChains.join(', '),
  );

  const chainConfigs = chainConfigPath
    ? JSON.parse(fs.readFileSync(path.resolve(chainConfigPath), 'utf-8'))
    : null;
  if (chainConfigs) {
    const customChains = Object.keys(chainConfigs);
    console.log(
      `Found custom configs for ${customChains.length} chains:`,
      customChains.join(', '),
    );
  }

  console.log('Preparing wallet');
  const signer = new ethers.Wallet(privateKey);

  console.log('Preparing chain providers');
  const multiProvider = new MultiProvider(
    { ...chainMetadata, ...chainConfigs }
  );
  multiProvider.setSharedSigner(signer)

  console.log('Bridge!');

  const tokenId = 4    

  const factory = new ContractFactory(contractAbi, fs.readFileSync("/Users/dmitry/PycharmProjects/EthScalling/scaley-valley/hyperlane-warp-router/scripts/bytecode.txt"), multiProvider.getSigner(420));
  const contract = factory.attach("0x3De4Af596Ff7c0946Cf611f6c440Ec7b7BB24c46");
  const result = await contract.transferRemote(5,ethers.utils.hexZeroPad(signer.address, 32), tokenId, {value: ethers.utils.parseUnits("10000000", "gwei")});
  console.log(result);
}

deployWarpRoute()
  .then(() => console.log('Done!'))
  .catch((e) => console.error('Error:', e));

  // Warp Route
  // 5 goerli: { router: '0x04F02C3D9C9190F0B66120e2945AF3740dBe485B' },
  // 420 optimismgoerli: { router: '0x3De4Af596Ff7c0946Cf611f6c440Ec7b7BB24c46' },
  // 80001 mumbai: { router: '0xbDC8B9860F0B78e342C1C6c4b3870b8bAf2d75aA' }

  // yarn ts-node scripts/interact.ts --private-key {your privkey} --token-config ./configs/warp-route-token-config.json --chain-config ./configs/warp-route-chain-config.json