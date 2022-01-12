import React, { Component } from 'react'
import ContractABI from './abi/fxcoin.json'
import ConnectWallet from './components/ConnectWallet';

class App extends Component {
  
    state = {
      FXCoincontract: null,
      accountAddress: "",
      accountAVAXBalance: "",
      accountFXBalance: 0,
      metamaskConnected: false,
      loading: false,
    };


  componentWillMount = async () => {
    await this.loadWeb3();
    await this.loadBlockchainData();
    await this.GetAccountFXBalance();
  };
  
  loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  connectToMetamask = async () => {
    await window.ethereum.enable();
    this.setState({ metamaskConnected: true });
    window.location.reload();
  };

  loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) {
      this.setState({ metamaskConnected: false });
    } else {
      this.setState({ metamaskConnected: true });
      this.setState({ loading: true });
      this.setState({ accountAddress: accounts[0] });
      let accountBalance = await web3.eth.getBalance(accounts[0]);
      accountBalance = web3.utils.fromWei(accountBalance, "Ether");
      this.setState({ accountBalance });
      this.setState({ loading: false });
      const FXCoincontract = new web3.eth.Contract(
        ContractABI.abi,
        "0x8248CF87A20995Db5407057cC82058f9740Ac7eE"
      );
      FXCoincontract.defaultCommon = {customChain:{
        name: "AVAX Fuji Testnet",
        networkId: 1,
        chainId: 43113
      }}
      this.setState({ FXCoincontract });
    };
  }

  GetAccountFXBalance = async() => {
    const web3 = window.web3;
    const GetBalance = await this.state.FXCoincontract
    .methods
    .balanceOf(this.state.accountAddress)
    .call()
    this.setState({accountFXBalance: GetBalance});
  }

  render() {
    const { accountAddress, accountAVAXBalance, accountFXBalance } = this.state;
    return (
      <div className="p-0 m-0 d-flex flex-column bg-dark">
        <ConnectWallet connectToMetamask={this.connectToMetamask} />
          <span>{accountAddress}</span>
          <span>{accountAVAXBalance}</span>
          <span>{accountFXBalance}</span>
      </div>
    )
  }
}


export default App;
