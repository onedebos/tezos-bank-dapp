import { BeaconWallet } from "@taquito/beacon-wallet";
import { NetworkType } from "@airgap/beacon-sdk";
import { TezosToolkit } from "@taquito/taquito";
import { useState, useRef } from "react";

export default function IndexPage() {
  const rpcUrl = "https://ghostnet.ecadinfra.com";
  const Tezos = new TezosToolkit(rpcUrl);
  const network = NetworkType.GHOSTNET;

  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const walletRef = useRef(null);

  const disconnectWallet = () => {
    if (walletRef.current != "disconnected") {
      walletRef.current.client.clearActiveAccount();
      walletRef.current = "disconnected";
      console.log("Disconnected");
    } else {
      console.log("Already disconnected");
    }
  };

  const getWalletBalance = async (walletAddress) => {
    const balanceMutez = await Tezos.tz.getBalance(walletAddress);
    return balanceMutez.div(1000000).toFormat(2);
  };

  const connectWallet = async () => {
    const newWallet = new BeaconWallet({
      name: "Simple dApp tutorial",
      preferredNetwork: network,
    });
    await newWallet.requestPermissions({
      network: { type: network, rpcUrl },
    });
    const address = await newWallet.getPKH();
    const balance = await getWalletBalance(address);

    setBalance(balance);
    setWalletAddress(address);
    walletRef.current = newWallet;
  };

  return (
    <div>
      <h2>Tezos Bank dApp</h2>
      <p>The address of the conneected wallet is {walletAddress}</p>
      <p>
        It's balance in tez is <span style={{ color: "red" }}>{balance}</span>{" "}
        tz
      </p>

      <button onClick={disconnectWallet}>Disconnect Wallet</button>
      <button onClick={connectWallet}>Connect Wallet</button>
    </div>
  );
}
