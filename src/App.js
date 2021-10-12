import './App.css';
import Web3Modal from 'web3modal';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import {bankContract, tokenContract} from './contract-address.json';
import Bank from './artifacts/contracts/Bank.sol/Bank.json';
import Token from './artifacts/contracts/Token.sol/Token.json';


function App() {
  //States
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [WalletConnected, setWalletConnect] = useState("connect to wallet");
  const [vault , setVault] = useState();
  const [userAssets, setUserAssets] = useState();
  const [yieldToken, setYieldTokens] = useState();
  useEffect(() => {
    connectToWallet()
  }, [])


  //Connect to wallet
  async function connectToWallet() {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const bankInfo = new ethers.Contract(bankContract, Bank.abi, provider);
    const tokenInfo = new ethers.Contract(tokenContract, Token.abi, provider);
    const bankAssets = ethers.utils.formatEther(await bankInfo.totalAssets(), 'ether');
    const userAssets = ethers.utils.formatEther(await bankInfo.accounts(await signer.getAddress()))
    const totalTokens = ethers.utils.formatEther(await tokenInfo.balanceOf(await signer.getAddress()))
    setVault(bankAssets);
    setUserAssets(userAssets);
    setYieldTokens(totalTokens);
    setWalletConnect(connection.selectedAddress);

    console.log(connection.selectedAddress);
    console.log(bankAssets);
    console.log(userAssets);
    console.log(totalTokens);
  }

  async function deposit(event) {
    event.preventDefault();
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const bankInfo = new ethers.Contract(bankContract, Bank.abi, signer);
    const tokenInfo = new ethers.Contract(tokenContract, Token.abi, signer);
    const tx = await bankInfo.deposit(
      {value: ethers.utils.parseEther(depositAmount.toString())});
    await tx.wait();
    const bankAssets = ethers.utils.formatEther(await bankInfo.totalAssets(), 'ether');
    const userAssets = ethers.utils.formatEther(await bankInfo.accounts(await signer.getAddress()))
    const totalTokens = ethers.utils.formatEther(await tokenInfo.balanceOf(await signer.getAddress()))
    setVault(bankAssets);
    setUserAssets(userAssets);
    setYieldTokens(totalTokens);
  }

  async function withdraw(event) {
    event.preventDefault();
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const bankInfo = new ethers.Contract(bankContract, Bank.abi, signer);
    const tokenInfo = new ethers.Contract(tokenContract, Token.abi, signer);
    const tx = await bankInfo.withdraw( 
     ethers.utils.parseEther(withdrawAmount.toString()),
     tokenContract
     );
     await tx.wait();
     const bankAssets = ethers.utils.formatEther(await bankInfo.totalAssets(), 'ether');
    const userAssets = ethers.utils.formatEther(await bankInfo.accounts(await signer.getAddress()))
    const totalTokens = ethers.utils.formatEther(await tokenInfo.balanceOf(await signer.getAddress()))
     setVault(bankAssets);
     setUserAssets(userAssets);
     setYieldTokens(totalTokens);
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <header className="">
        <h1 className="text-3xl	text-center	">DA BANK</h1>
        <p className="text-3xl text-center mb-2 ">A decentralized bank</p>
        <button className="text-2xl mb-5 " onClick={() => connectToWallet()}>{WalletConnected}</button>
        <p className="border-black border-solid	rounded-sm border-2 text-3xl	"> Bank vault: {vault} </p>
        <p className="border-black border-solid rounded-sm border-2	my-5 text-3xl	"> your Amount: {userAssets} </p>
        <p className="border-black border-solid rounded-sm border-2 mb-1	text-3xl	"> Da tokens(yieldToken): {yieldToken} </p>

        <div className="flex space-x-5 ">
        <form onSubmit={deposit}>
          <label className="text-3xl">
            Deposit:
            <input className="text-center"
              type="number"
              name="depositAmount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>

        <form onSubmit={withdraw}>
          <label className="text-3xl">
            Withdrawal:
            <input className="text-center"
              type="number"
              name="withdrawalAmount"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
        </div>
      </header>
    </div>
  );
}

export default App;
