import { useAddress, useDisconnect ,useMetamask, ChainId } from "@thirdweb-dev/react";
import { useState , useEffect, useRef} from "react";
import Web3 from "web3";
const web3 = new Web3(Web3.givenProvider);


export default function Navbar() {

    const trigger = useRef(null);
    const connectWithMetamask = useMetamask();
    const disconnectWithMetamask = useDisconnect();
    const address = useAddress();
   
    const getNetworkId = async () => {
      const currentChainId = await web3.eth.net.getId()
      return currentChainId
    }


 
    

    const swichNetwork = async (chainId) => {

      const currentChainId = await getNetworkId()
      
      if (currentChainId !== chainId) {
        try {
          await web3.currentProvider.request({
            method: 'wallet_switchEthereumChain',
              params: [{ chainId: Web3.utils.toHex(chainId) }],
            });
            
            trigger.current?.click();
        } catch (switchError) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchError.code === 4902) {
            alert('add this chain id')
          }
        }
      }
    }


    useEffect(() => {
      swichNetwork(56);
    });
 

    return (
      <>

        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
       
          <div class="container">
          <a class="navbar-brand" href="#">
              <img src="/eb.png" alt="" width="60" height="60" class="d-inline-block align-text-top"/>
              
            </a>
          
            <form class="d-flex ">
            {address ? (
                <a  onClick={disconnectWithMetamask} class="btn btn-outline-warning" >Disconnect Metamask</a>
                ) : (
              <a ref={trigger} onClick={connectWithMetamask} class="btn btn-outline-warning" >Connect Metamask</a>
              )}
              </form>
          </div>
        </nav>
      </>
    )
  }