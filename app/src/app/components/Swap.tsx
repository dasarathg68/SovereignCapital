import React, { useState } from "react";

const TokenSwap = () => {
  const [token1, setToken1] = useState("");
  const [token2, setToken2] = useState("");
  const [selectedToken1, setSelectedToken1] = useState("ETH");
  const [selectedToken2, setSelectedToken2] = useState("GAL");

  const handleSwitch = () => {
    setToken1(token2);
    setToken2(token1);

    setSelectedToken1(selectedToken2);
    setSelectedToken2(selectedToken1);
  };

  return (
    <div className="max-w-lg mx-auto p-4 bg-base-200 rounded-lg ">
      <div className="flex justify-center text-xl pb-2">Swap Tokens</div>
      <div className="flex items-center justify-between bg-base-200 p-4 rounded-lg border border-primary w-full">
        <div>
          <input
            type="number"
            value={token1}
            step={0.01}
            onChange={(e) => setToken1(e.target.value)}
            className="w-full text-3xl bg-base-200 outline-none"
            required
            placeholder="0"
          />
        </div>
        <div className="flex items-center">
          <img
            src="https://cryptologos.cc/logos/ethereum-eth-logo.png"
            alt={selectedToken1}
            className="w-6 h-6"
          />
          <select
            className="bg-base-200 text-base-content text-lg outline-none cursor-pointer"
            value={selectedToken1}
            onChange={(e) => setSelectedToken1(e.target.value)}
          >
            <option value="GAL">GAL</option>
            <option value="ETH">SepETH</option>
          </select>
        </div>
      </div>
      {/* Switch Button */}
      <div className="flex justify-center bg-base-200 p-2">
        <button onClick={handleSwitch} className="btn btn-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
      <div className="flex items-center justify-between bg-base-200 p-4 rounded-lg border border-secondary w-full">
        <div>
          <input
            type="number"
            value={token2}
            step={0.01}
            onChange={(e) => setToken2(e.target.value)}
            className="w-full text-3xl bg-base-200 outline-none"
            required
            placeholder="0"
          />
        </div>
        <div className="flex items-center">
          <img
            src="https://cryptologos.cc/logos/ethereum-eth-logo.png"
            alt={selectedToken2}
            className="w-6 h-6"
          />
          <select
            className="bg-base-200 text-base-content text-lg cursor-pointer"
            value={selectedToken2}
            onChange={(e) => setSelectedToken2(e.target.value)}
          >
            <option value="ETH">SepETH</option>
            <option value="GAL">GAL</option>
          </select>
        </div>
      </div>
      <div className="mt-4">
        <button className="btn btn-primary w-full text-lg py-3 ">Swap</button>
      </div>
    </div>
  );
};

export default TokenSwap;
