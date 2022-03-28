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

  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [bnb, setBnb] = useState(0);
  const [content, setContent] = useState('');

  const [funcContract, setFuncContract] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const loadProvider = async function() {
      const provider = await detectEthereumProvider();
      const contract = await loadContract('Fund', provider);
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

  useEffect(() => {
    const loadBalance = async function() {
      const {contract, web3} = web3Api;
      const balance = await web3.eth.getBalance(contract.address);
      setBalance(web3.utils.fromWei(balance, "ether"));
    };
    web3Api.contract && loadBalance();
  }, [web3Api]);

  // useEffect(() => {
  //   const getAccount = async function() {
  //     const accounts = await web3Api.web3.eth.getAccounts()
  //     setAccount(accounts[0]);
  //   }
  //   web3Api.web3 && getAccount()
  // }, [web3Api.web3]);

  useEffect(() => {
    const initContract = () => {
      const {contract, web3} = web3Api;
      const Contract = new web3.eth.Contract(contract.abi, contract.address);
      setFuncContract(Contract);
    };
    web3Api.contract && initContract();
  }, [web3Api]);

  useEffect(() => {
    const loadMembers = async () => {
      const {web3} = web3Api;
      const totalMember = await funcContract.methods.counter().call();
      if (totalMember > 0) {
        for (var i = 0; i < totalMember; i++) {
          funcContract.methods.getDetail(i).call().then(info => {
            setMembers(oldMembers => [...oldMembers, {
              address: info[0],
              bnb: web3.utils.fromWei(info[1], 'ether'),
              msg: info[2]
            }]);
          });
        }
      }
    };
    funcContract && loadMembers();
    console.log('here funcContract');
  }, [funcContract]);

  const connect = async () => {
    return web3Api.provider.request({method:"eth_requestAccounts"});
  }

  const callConnect = () => {
    connect().then(data => {
      setAccount(data[0]);
    });
  }

  const onDeposit = () => {
    if (account) {
      const {web3} = web3Api;
      funcContract.methods.Deposit(content).send({
        from: account,
        value: web3.utils.toWei(bnb, 'ether')
      })
    } else {
      alert("Please login MM")
    }
  }

  return (
    <div className="fund-wrapper">
      <div className="fund container">
        <h1 className="title is-1">Fund</h1>
        { !isConnected && <h3 className="title is-3" id="install_MM">Please install metamask</h3> }
        <hr/>
        { isConnected && <>
            <button className="button is-primary" id="btn_connect_MM" onClick={callConnect}>Connect Metamask</button>
            <h3 className="title is-3" id="account"> Current Address: {account ? account : 'Account denied'}</h3>
            <input className="input is-primary mb-2" onChange={event => setBnb(event.target.value)} type="text" placeholder="BNB" />
            <input className="input is-primary mb-2" onChange={event => setContent(event.target.value)} type="text" placeholder="Message" />
            <button className="button is-link" id="btn_Deposit" onClick={onDeposit}>Deposit</button>
            <hr/>
            <h2 className="title is-2">Total: <span id="total">{balance}</span> BNB</h2> 
            
            <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth" id="tblMember">
                <thead>
                  <tr>
                      <th>Account</th>
                      <th>BNB</th>
                      <th>Message</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    members.map((row, i) => (
                      <tr key={i} className="table-row">
                          <td>{row.address}</td>
                          <td>{row.bnb}</td>
                          <td>{row.msg}</td>
                      </tr>
                    ))
                  }
                </tbody>
            </table>
          </>
        }
      </div>
    </div>
  );
}

export default App;
