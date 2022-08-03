import { useTimer } from 'react-timer-hook';
import { useAddress, useDisconnect, useMetamask , useChainId} from "@thirdweb-dev/react";
import { ContractAbi } from '../abis';
import Web3 from "web3";
const web3 = new Web3(Web3.givenProvider);
import Link from 'next/link'
import React, { useState, useEffect,useRef } from 'react';
import { useRouter } from 'next/router'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Clock from '../components/Clock';

export default function Home() {
  const [deadline, setDeadline] = useState('August 10, 2022')
  const [newDeadline, setNewDeadline] = useState('')

  const connectWithMetamask = useMetamask();
  const chainId = useChainId();
  const address = useAddress();
  const [presale, setPresale] = useState(0);
  const [phase, setPhase] = useState(0);
  const [sold, setSold] = useState(0);

  const [minUSD , setMinUSD] = useState(0);
  const [getMinBuyD , setgetMinBuyD] = useState(0);

  const[amountInput , setAmountInput] = useState('');

  const { query } = useRouter();

  var c_address = "0x0000000000000000000000000000000000000000";
  var c_sold = sold;
  c_sold = web3.utils.fromWei(c_sold.toString(),"ether");

  const copyHosy = () =>{
    var url = window.location.href+"?ref="+address;
    window.prompt("Copy to clipboard: Ctrl+C, Enter", url);

  }

  const getValues = async() =>{
    try{

        const vendorr = new web3.eth.Contract(
          ContractAbi,
        '0x4f847cD1171237e8d4F224C76AD85931Cd00837E'
        );

        await vendorr.methods.getRunningPhase().call(function (err, data) {
          if(data == 1){
            setPresale("0.000085 BNB per EBT");
            setPhase("Phase 1");
          }
          if(data == 2){
            setPresale("0.000102 BNB per EBT");
            setPhase("Phase 2");
          }
          if(data == 3){
            setPresale("0.0001224 BNB per EBT");
            setPhase("Phase 3");
          }
        })

        await vendorr.methods._SoldOut().call(function (err, data) {
          setSold(data);
        })

        await vendorr.methods.MinUSD().call(function (err, data) {
          setMinUSD(data);
        })


        await vendorr.methods.getMinBuyD().call(function (err, data) {
          setgetMinBuyD(web3.utils.fromWei(data, 'ether'));
        })

        

     }catch (err) {
      console.error(err);
     }
  }

  const buyEBT = async() =>{

        try{

          if(amountInput == 0){
            toast.error("please enter Amount", {
              position: toast.POSITION.TOP_CENTER,
              theme: "colored"
          }); 
            return;
          }
          
         if(amountInput < 1){
          const firstDigitStr = String(amountInput)[0];
          if(firstDigitStr != 0){
            amountInput = "0"+amountInput; 
          }
         }

      
          if(amountInput < Number.parseFloat(getMinBuyD).toFixed(2)){
            
            toast.error("The Amount greater then "+ Number.parseFloat(getMinBuyD).toFixed(2), {
              position: toast.POSITION.TOP_CENTER,
              theme: "colored"
          }); 
           
            return;
          }
  
        
          if(query.ref){
              c_address = query.ref;
          }
  
          console.log(c_address);
          const buyEBT = new web3.eth.Contract(
            ContractAbi,
            '0x4f847cD1171237e8d4F224C76AD85931Cd00837E'
        );
  
            await buyEBT.methods.joinPresale(c_address).send({
            from: address,
            value:web3.utils.toWei(amountInput.toString(), "ether")
            });


            toast.success("Transaction successful", {
              position: toast.POSITION.TOP_CENTER,
              theme: "colored"
          }); 

          location.reload();


            
  
        }catch (err) {
        console.error(err);
       }
     

     
  }



  useEffect(() => {
    getValues(); 
}, [address]);



function copyToClipboard() {
  var copyText  = window.location.href+"?ref="+address;
  navigator.clipboard.writeText(copyText).then(() => {
    toast.success("Copied to clipboard", {
      position: toast.POSITION.TOP_CENTER,
      theme: "colored"
  }); 
  });
}


 useEffect(() => {
      if(window.ethereum) {
          window.ethereum.on('chainChanged', () => {
            window.location.reload();
          })
      }
    });



  return (
   <div>
      <div class="container mt-5">
        <ToastContainer></ToastContainer>
        <div class="row">
          <div class="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">
          <div class="card text-center mt-3">
              <div class="card-header">
                <h3>Token Pre-sale is live</h3>
              </div>
              <div class="card-body">
                 
               <Clock deadline={deadline} /> 

                  <div class="row">
                      <div class="col-6 text-left">
                        <p>Running Phase:</p>
                      </div>
                      <div class="col-6 text-right">
                      {phase}
                      </div>
                  </div>


                  <div class="row">
                      <div class="col-6 text-left">
                        <p>Minimum  Purchase:</p>
                      </div>
                      <div class="col-6 text-right">
                      {minUSD}$ equal  {Number.parseFloat(getMinBuyD).toFixed(2)} BNB
                      </div>
                  </div>
                

                  <div class="row">
                      <div class="col-6 text-left">
                        <p>Pre-Sale Price:</p>
                      </div>
                      <div class="col-6 text-right">
                      {presale}
                      </div>
                  </div>


                  <div class="row">
                    <div class="col-12">
                    <div class="input-group mb-3">
                      <input value={amountInput} type="text" class="form-control" placeholder="0.01" aria-label="" aria-describedby="basic-addon2" onChange={(e) => setAmountInput(e.target.value)}/>
                      <span class="input-group-text" id="basic-addon2">BNB</span>
                    </div>
                    </div>
                  </div>


                  <div class="row">
                    <div class="col-12">
                    <div class="d-grid gap-2">
                    {address ? (
                 
                 <a onClick={buyEBT} class="btn btn-warning" type="button">Buy EBT</a>
               
                  ) : (
                  <a onClick={connectWithMetamask} class="btn btn-warning" type="button">Connect Metamak To Buy EBT</a>
                   )}
                        
                      </div>
                    </div>
                  </div>

                  <div class="row mt-3">
                      <div class="col-6 text-left">
                        <p>Total Sold:</p>
                      </div>
                      <div class="col-6 text-right">
                      {Number.parseFloat(c_sold).toFixed(2)} EBT  
                      </div>
                  </div>

                  <div class="row ">
                    <div class="col-12">
                     
                    <div class="progress">
                    {sold > 0 && sold < 1000000000000000000000000
                        ?  <div class="progress-bar progress-bar-striped progress-bar-animated bg-warning" role="progressbar"  aria-valuemin="0" aria-valuemax="100" style={{width:"1%"}}></div>
                        :  <div class="progress-bar progress-bar-striped progress-bar-animated bg-warning" role="progressbar"  aria-valuemin="0" aria-valuemax="100" style={{width:`${sold * 100 / 100000000000000000000000000}%`}}></div>
                      }
                     
                    </div>
                    </div>
                  </div>
              </div>
              
            </div>
            <iframe class="mt-3 mb-5" height="400"  width="100%" src="https://www.youtube.com/embed/vP9QpcqzSns" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
          <div class="col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6">

          <div class="card text-center mt-3">
                <div class="card-header">
                  <h3>Referral</h3>
                </div>
                <div class="card-body referral">
                    <h2>Referral to get 10% BNB + 100% EBT</h2>

                    <p class="text-left">Step 1: <br></br>Link your Metamask account to the EBToken app.</p>
                    <p class="text-left">	Step 2: <br></br>Make sure that you have an EBToken in your Metamask account.</p>
                    <p class="text-left">	Step 3: <br></br>Click the button below to copy the referral link, send it to your referral then the proceeds will be automatically sent to your wallet balance.</p>

                    <p class="text-left">***Note the referral incentive will not be credited if there is no EBToken in your Metamask account***</p>

                    <div class="row">
                    <div class="col-12">
                    <div class="d-grid gap-2 mt-4">
                    {address ? (
                 
                      <a onClick={copyToClipboard} class="btn btn-warning">Get Your  Referral Link</a>
                    
                       ) : (
                        <a onClick={connectWithMetamask} class="btn btn-outline-warning" >Connect Metamask</a>
                        )}
                      </div>
                    </div>
                  </div>
               
                </div>
              
              </div>


              <iframe class="mt-3 mb-5" height="400" width="100%" src="https://www.youtube.com/embed/BINytFeNx8Q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

          </div>
        </div>
      </div>
   </div>
  )
}
