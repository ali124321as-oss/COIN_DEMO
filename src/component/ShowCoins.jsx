import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addFavouriteCoin,
  removeFavouriteCoin,
} from "../redux_store/coinSlice";
import { FaRegStar, FaStar } from "react-icons/fa";
import "../component/spinner.css";
import SingleCoinData from "./singleCoinData";
import Alert from "./alert/Alert";
import { getSession, setSession } from "../redux_store/Storage";

const ShowCoins = ({ currSlice, isLoading, hasSearched, onGoBack }) => {
  const allCoinSliceStates = useSelector((state) => state.coinsSlice);
  const favArr = Object.values(allCoinSliceStates.favouriteCoins);
  const dispatch = useDispatch();

  // ✅ Local state WITH session persistence
  const [selectedCoin, setSelectedCoin] = useState(() => getSession("selectedCoin", null));
  const [isShowAlert, setIsShowAlert] = useState(() => getSession("isShowAlert", false));

  const { favouriteCoins } = useSelector((state) => state.coinsSlice);

  // Persist all states to session storage
  useEffect(() => setSession("selectedCoin", selectedCoin), [selectedCoin]);
  useEffect(() => setSession("isShowAlert", isShowAlert), [isShowAlert]);

  const handleShowData = (item) => {
    if (favouriteCoins[item.id]) {
      setSelectedCoin(item);
    } else {
      setIsShowAlert(true);
    }
  };

  // Show loading spinner
  if (isLoading) {
    return (
      <div className="flex justify-center items-center mt-10">
        <span className="loader"></span>
      </div>
    );
  }

  // Show "No data found" with Go Back button when user has searched but found nothing
  if (hasSearched && (!currSlice || currSlice.length === 0)) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-500 text-lg mb-4">No data found.</p>
        <button
          className="bg-red-600 text-white py-2 px-6 rounded hover:bg-red-700 transition-colors"
          onClick={onGoBack}
        >
          Go Back to Main List
        </button>
      </div>
    );
  }

  if (!currSlice || currSlice.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-10 text-lg">
        <p>No data found.</p>
      </div>
    );
  }

  return (
    <>
      {/* ✅ Show single coin data when selectedCoin is set */}
      {selectedCoin && (
        <SingleCoinData
          clickedItem={selectedCoin}
          onClose={() => setSelectedCoin(null)}
        />
      )}

      {/* Alert component */}
      {isShowAlert && <Alert setisShowAlert={setIsShowAlert} />}

      {/* Coins grid */}
      <div className="relative max-w-[1200px] mt-10 w-full mx-auto grid gap-6 sm:grid-cols-2 md:grid-cols-3 px-6 lg:grid-cols-4">
        {currSlice.map((item) => {
          const isUp = item.price_change_percentage_24h > 0;
          return (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-md hover:scale-[1.02] hover:border-gray-400 transition-all duration-200 cursor-pointer"
              onClick={() => handleShowData(item)}
            >
              {/* Top */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <img src={item.image} alt="" className="w-8 h-8" />
                  <div className="flex flex-col gap-2 leading-tight">
                    <p className="font-bold text-black/90">
                      {item.name.split(" ").slice(0, 2)}
                    </p>
                    <p className="text-xs text-black/90 uppercase">
                      {item.symbol}
                    </p>
                  </div>
                </div>

                {favouriteCoins[item.id] ? (
                  <FaStar
                    size={18}
                    className="text-orange-400 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(removeFavouriteCoin(item.id));
                    }}
                  />
                ) : (
                  <FaRegStar
                    size={18}
                    className="text-gray-400 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(addFavouriteCoin(item));
                    }}
                  />
                )}
              </div>

              {/* Price + Change */}
              <div className="flex flex-col gap-2">
                <div className="flex w-full justify-between md:flex-col gap-4 md:justify-start">
                  <p className="text-lg font-semibold">${item.current_price}</p>
                  <p
                    className={`text-xs w-fit px-2 py-0.5 rounded-full ${
                      isUp
                        ? "bg-green-200 text-green-700"
                        : "bg-red-200 text-red-700"
                    }`}
                  >
                    {item.price_change_percentage_24h?.toFixed(2)}%
                  </p>
                </div>
                <div className="w-full h-px bg-gray-200 mt-2"></div>
              </div>

              {/* Bottom stats */}
              <div className="flex justify-between text-xs text-gray-500">
                <p>Market Cap</p>
                <p>${item.market_cap?.toLocaleString()}</p>
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                <p>Volume (24h)</p>
                <p>${item.total_volume?.toLocaleString()}</p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ShowCoins;