import React, { Component } from 'react'
import ContractABI from './abi/fxcoin.json'
import ConnectWallet from './components/ConnectWallet';
import Web3 from 'web3'
import Loading from './components/Loading';

class App extends Component {
  
    state = {
      FXCoincontract: null,
      accountAddress: false,
      accountAVAXBalance: 0,
      accountFXBalance: 0,
      metamaskConnected: false,
      loading: false,
      amount: 0,
      targetAccount: "",
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
      let accountAVAXBalance = await web3.eth.getBalance(accounts[0]);
      accountAVAXBalance = web3.utils.fromWei(accountAVAXBalance, "Ether");
      this.setState({ accountAVAXBalance });
      this.setState({ loading: false });
      const FXCoincontract = new web3.eth.Contract(
        ContractABI.abi,
        "0x22dA4D55b711b2b7C99C5A489D6BcED65C36D93B"
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
    let GetBalance = await this.state.FXCoincontract
    .methods
    .balanceOf(this.state.accountAddress)
    .call()
    GetBalance = web3.utils.fromWei(GetBalance, "Ether");
    this.setState({accountFXBalance: GetBalance});
  }

  buyToken = async () => {
    this.setState({ loading: true });
    const price = window.web3.utils.toWei("1", "Ether");
    this.state.FXCoincontract.methods
      .presale(this.state.amount)
      .send({ from: this.state.accountAddress, value: price*this.state.amount})
      .on("confirmation", () => {
        localStorage.setItem(this.state.accountAddress, new Date().getTime());
        this.setState({ loading: false });
        window.location.reload();
      });
  }
  // 0xd2Cf613eeCbeF79893984cebc1f0aAc57184f21B
  sendToken = async () => {
    this.setState({ loading: true });
      console.log(this.state.targetAccount)
    const price = window.web3.utils.toWei(this.state.amount, "Ether");
    await this.state.FXCoincontract.methods
      .transfer(this.state.targetAccount, price)
      .send({ from: this.state.accountAddress});
  }

  render() {
    const { accountAddress, accountAVAXBalance, accountFXBalance, amount, loading } = this.state;
    return (
      <div className="p-0 m-0 d-flex flex-column bg-dark text-white" style={{minHeight:"100vh",minWidth:"100vw"}}>
        {
          loading
          ?
          <Loading />
          :
          <></>
        }
        {
          accountAddress
          ?
          <div className="btn btn-success">
            {accountAddress}
          </div>
          :
          <ConnectWallet connectToMetamask={this.connectToMetamask} />
        }
          <span>Address: {accountAddress}</span>
          <span>AVAX Balance: {accountAVAXBalance}</span>
          <span>FX Coin Balance: {accountFXBalance}</span>
          
          <div className="d-flex flex-column bg-secondary text-white w-50 align-self-center justify-content-center align-items-center gap-3 rounded rounded-1 p-3">
              <span className="fw-bold text-warning fs-3">
                Presale FX-Coin 
              </span>
              <span className="small">1 FX Coin = 1 AVAX</span>
              <input type="number" 
              className='bg-dark border-0 text-white form-control w-50' 
              defaultValue={amount}
              onChange={(e) => this.setState({amount: e.target.value})}
              />
              <button className="btn btn-success" onClick={() => {this.buyToken();}}>BUY</button>
          </div>

          <div className="d-flex flex-column bg-secondary text-white w-50 align-self-center justify-content-center align-items-center gap-3 rounded rounded-1 p-3 mt-5">
              <span className="fw-bold text-warning fs-3">
                Send Token
              </span>
              <div className="input-group w-50">
                <span className="input-group-text bg-dark text-white border-0">Address</span>
                <input type="text" 
                className='bg-dark border-0 text-white form-control w-50' 
                onChange={(e) => this.setState({targetAccount: e.target.value})}
                />
              </div>
              <div className="input-group w-50">
                <span className="input-group-text bg-dark text-white border-0">Amount</span>
                <input type="number" 
                className='bg-dark border-0 text-white form-control w-50' 
                defaultValue={amount}
                onChange={(e) => this.setState({amount: e.target.value})}
                />
              </div>
              <button className="btn btn-success" onClick={() => {this.sendToken();}}>SEND</button>
          </div>

      </div>
    )
  }
}


export default App;
