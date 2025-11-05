import React, { useState, useEffect } from "react";
import axios from "axios";
import CreateGraph from "../component/CreateGraph";
import "../component/spinner.css";

const SingleCoinData = ({ clickedItem, onClose }) => {
  const [coinData, setCoinData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDays, setSelectedDays] = useState(7);
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
       
  const handleFetchCoinData = async (id, days = 7) => {
    if (!id) return;
    
    setIsLoading(true);
    await delay(2000);
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}&interval=daily`
      );
      const data = response.data;
      setCoinData(data);
    } catch (error) {
      console.log("error", error);
      setCoinData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDaysChange = (days) => {
    setSelectedDays(days);
    if (clickedItem && clickedItem.id) {
      handleFetchCoinData(clickedItem.id, days);
    }
  };

  useEffect(() => {
    if (clickedItem && clickedItem.id) {
      handleFetchCoinData(clickedItem.id, selectedDays);
    }
  }, [clickedItem]);

  const formatNumber = (num) => {
    if (!num) return "N/A";
    if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
    return num.toFixed(2);
  };

  if (!clickedItem) {
    return (
      <div className="flex flex-col fixed justify-center items-center bg-white w-full h-full">
        <p>No coin data available</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
      {isLoading ? (
        <div className="flex justify-center items-center bg-white w-[95%] md:w-[750px] max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden">
          <span className="loader"></span>
        </div>
      ) : (
        <div className="flex flex-col bg-white w-[95%] md:w-[750px] max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex justify-between items-center w-full px-6 py-5 bg-white">
            <div className="flex gap-3 items-center">
              <img
                src={clickedItem.image}
                alt={clickedItem.name}
                className="h-12 w-12 rounded-full"
              />
              <div className="flex flex-col">
                <p className="text-2xl font-bold text-gray-800">
                  {clickedItem.name.split(" ").slice(0, 2).join(" ")}
                </p>
                <p className="text-gray-500 uppercase font-medium">
                  {clickedItem.symbol}
                </p>
              </div>
            </div>

            <button
              className="text-gray-400 cursor-pointer hover:text-gray-600 hover:bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 text-xl"
              onClick={() => {
                setCoinData(null);
                onClose();
              }}
            >
              ✕
            </button>
          </div>

          <div className="overflow-y-auto flex-1">
            <div className="px-6 py-6 flex-col w-full sm:justify-between border-gray-200 md:w-[70%]">
              <div className="flex justify-between items-center w-full gap-6">
                <div className="flex flex-col gap-1">
                  <p className="text-gray-500 text-sm">Current Price</p>
                  <p className="text-3xl font-bold text-gray-800">
                    ${clickedItem.current_price?.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <p className="text-gray-500 text-sm">24h Change</p>
                  <div
                    className={`px-3 py-1 rounded-xl ${
                      clickedItem.price_change_percentage_24h > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    <p className="text-lg font-semibold">
                      {clickedItem.price_change_percentage_24h?.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-3">
              <div className="bg-gray-100 p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col gap-1 text-center">
                    <p className="text-gray-500 text-sm">Market Cap</p>
                    <p className="text-lg font-bold text-gray-800">
                      ${formatNumber(clickedItem.market_cap)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 text-center">
                    <p className="text-gray-500 text-sm">24h Volume</p>
                    <p className="text-lg font-bold text-gray-800">
                      ${formatNumber(clickedItem.total_volume)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 text-center">
                    <p className="text-gray-500 text-sm">Circulating Supply</p>
                    <p className="text-lg font-bold text-gray-800">
                      {formatNumber(clickedItem.circulating_supply)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Section */}
            <div className="px-6 py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Price Chart of {selectedDays} days
                </h2>
                <div className="flex items-center gap-2">
                  <select 
                    value={selectedDays}
                    onChange={(e) => handleDaysChange(Number(e.target.value))}
                    className="w-32 px-8 py-2 border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-600 text-gray-800 bg-white font-medium shadow-sm hover:border-blue-600 transition-colors duration-200 cursor-pointer"
                  >
                    <option value={7}>7 days</option>
                    <option value={10}>10 days</option>
                    <option value={20}>20 days</option>
                    <option value={30}>30 days</option>
                    <option value={40}>40 days</option>
                    <option value={50}>50 days</option>
                  </select>
                </div>
              </div>
              <div className="bg-gray-50 p-6">
                {coinData && coinData.prices ? (
                  <CreateGraph prices={coinData.prices} />
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">⏳</span>
                    </div>
                    <p className="text-gray-700 font-medium">
                      Data not Found 
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleCoinData;