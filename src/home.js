import Caver from "caver-js";
import { useState } from "react";
import { googyeContractAddress, goongyeContractAbi } from "./Utils/Goongye";
import { stakingContractAddress, stakingContractAbi } from "./Utils/Staking";
import { toast } from "react-toastify";

let isItConnected = false;
const caver = new Caver(window.klaytn);

let accounts;
const getAccounts = async () => {
  const { klaytn } = window;
  try {
    // accounts = await klaytn.selectedAddress;
    accounts = await caver.klay.getAccounts();
    return accounts[0];
  } catch (error) {
    console.log("Error while fetching acounts: ", error);
    return null;
  }
};

const loadWeb3 = async () => {
  try {
    const { klaytn } = window;
    if (klaytn) {
      await klaytn.enable();
      let netId = await klaytn.networkVersion;
      switch (netId.toString()) {
        case "8217": //mainnet 8217 ,testnet 1001
          isItConnected = true;
          break;
        default:
          isItConnected = false;
      }
      if (isItConnected == true) {
        let accounts = await getAccounts();
        return accounts;
      } else {
        let res = "Wrong Network";
        return res;
      }
    } else {
      let res = "No Wallet";
      return res;
    }
  } catch (error) {
    let res = "No Wallet";
    return res;
  }
};

export const Home = () => {
  const [acc, setAccount] = useState("Connect Wallet");
  const [value, setValue] = useState("");
  const onConnectAccount = async () => {
    let res = await loadWeb3();
    console.log(res, "res");
    setAccount(res);
    // setCollectionModalShow(true);
  };
  const handleChange = (e) => {
    if (e.target.value >= "0" && e.target.value <= "9") {
      setValue(e.target.value);
    } else {
      setValue("");
    }
  };
  const handleSubmit = async () => {
    try {
      if (acc !== "Connect Wallet") {
        if (value >= 1 && value <= 4) {
          let contractOf = new caver.klay.Contract(
            goongyeContractAbi,
            googyeContractAddress
          );
          console.log("value", value);
          let res = await contractOf.methods
            .setSale(value)
            .send({ from: acc, gas: "5000000" });
          console.log("res", res);
          setValue("");
          toast.success("Sale successfully set");
        } else {
          toast.info("Please Enter Number From 1-4");
        }
      } else {
        toast.info("Please Connect Wallet First");
      }
    } catch (e) {
      console.log("e", e);
      toast.error("Error While Set Sale");
    }
  };
  const handlePesaWasool = async () => {
    let contractOfPesaWasool = new caver.klay.Contract(
      stakingContractAbi,
      stakingContractAddress
    );
    console.log("contractOfPesaWasool", contractOfPesaWasool);
    let result = await contractOfPesaWasool.methods.WithdrawToken().send({
      from: acc,
      gas: "5000000",
    });
    if (result) {
      toast.success("Transaction Successfl");
    }
  };

  return (
    <div className="homeContainer">
      <div className="container-fluid d-flex justify-content-center align-items-center inner">
        <div className="row">
          <div className="col-12">
            <button
              className="btnConnect  pt-3 pb-1"
              onClick={onConnectAccount}
            >
              {acc === "No Wallet"
                ? "No Wallet"
                : acc === "Connect Wallet"
                ? "Connect Wallet"
                : acc === "Wrong Network"
                ? "Wrong Network"
                : acc.substring(0, 4) + "..." + acc.substring(acc.length - 4)}
            </button>
          </div>
        </div>
        <div className="row spanTitle">
          <span>Enter 1 for 1st Presale</span>
          <span>Enter 2 for 2nd Presale</span>
          <span>Enter 3 for 3rd Presale</span>
          <span>Enter 4 for Public sale</span>
        </div>
        <div className="row">
          <input
            type="text"
            className="inputBox"
            value={value}
            // min="1"
            // max="4"
            placeholder="Enter value from 1-4 "
            onChange={(e) => handleChange(e)}
          ></input>
        </div>
        <div className="row">
          <button className="button btnConnect" onClick={() => handleSubmit()}>
            Submit
          </button>
        </div>
        <div className="row mt-3">
          <button className="pesaWasool" onClick={() => handlePesaWasool()}>
            PesaWasool
          </button>
        </div>
      </div>
    </div>
  );
};
