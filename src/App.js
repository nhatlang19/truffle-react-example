import { useEffect, useState } from "react";
import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider'
import {loadContract} from "./utils/LoadContract";

function App() {
  const [isConnected, setIsConnected] = useState(false);

  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null
  });

  const [account, setAccount] = useState('Account denied');

  useEffect(() => {
    const loadProvider = async function() {
      const provider = await detectEthereumProvider();
      const contract = await loadContract('Fund');
      if (provider) {
        setWeb3Api({
          provider,
          web3: new Web3(provider),
          contract
        });
        setIsConnected(true);
      } else {
        setIsConnected(false);
      }
    }
    loadProvider()
  }, []);

  // useEffect(() => {
  //   const getAccount = async function() {
  //     const accounts = await web3Api.web3.eth.getAccounts()
  //     setAccount(accounts[0]);
  //   }
  //   web3Api.web3 && getAccount()
  // }, [web3Api.web3]);

  const connect = async () => {
    return web3Api.provider.request({method:"eth_requestAccounts"});
  }

  const callConnect = () => {
    connect().then(data => {
      setAccount(data[0]);
    });
  }

  const onDeposit = () => {
    console.log(web3Api);
  }

  return (
    <div className="fund-wrapper">
      <div className="fund container">
        <h1 className="title is-1">Fund</h1>
        { !isConnected && <h3 className="title is-3" id="install_MM">Please install metamask</h3> }
        <hr/>
        { isConnected && <>
            <button className="button is-primary" id="btn_connect_MM" onClick={callConnect}>Connect Metamask</button>
            <h3 className="title is-3" id="account"> Current Address: {account}</h3>
            <input className="input is-primary mb-2" id="txt_BNB" type="text" placeholder="BNB" />
            <input className="input is-primary mb-2" id="txt_Content" type="text" placeholder="Message" />
            <button className="button is-link" id="btn_Deposit" onClick={onDeposit}>Deposit</button>
            <hr/>
            <h2 className="title is-2">Total: <span id="total">0.00</span> BNB</h2>
            <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth" id="tblMember">
                <thead>
                  <tr>
                      <th>Account</th>
                      <th>BNB</th>
                      <th>Message</th>
                  </tr>
                </thead>
            </table>
          </>
        }
      </div>
    </div>
  );
}

export default App;
