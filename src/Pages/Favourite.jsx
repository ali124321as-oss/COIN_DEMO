import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ShowCoins from "../component/ShowCoins";
import Pagination from "../component/pagination";
import { getSession, setSession } from "../redux_store/Storage";

const Favourite = () => {
  const allCoinSliceStates = useSelector((state) => state.coinsSlice);
  const favArr = Object.values(allCoinSliceStates.favouriteCoins);
  const perPage = 20;

  const [favPage, setFavPage] = useState(() => getSession("favPage", 1));
  const [isLoading, setIsLoading] = useState(() => getSession("isLoading", true));
  const [initialLoad, setInitialLoad] = useState(() => getSession("initialLoad", true));

  useEffect(() => {
    setSession("favPage", favPage);
  }, [favPage]);

  useEffect(() => {
    setSession("isLoading", isLoading);
  }, [isLoading]);

  useEffect(() => {
    setSession("initialLoad", initialLoad);
  }, [initialLoad]);

  // Simulate initial loading for 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setInitialLoad(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  // Calculate total pages
  const totalPages = Math.ceil(favArr.length / perPage);
  
  // Check if reached the end - FIXED
  const hasReachedEnd = favPage >= totalPages;
  const endMessage = hasReachedEnd ? "You have reached the end" : "";

  // --- Favourite Pagination ---
  const handleFavNext = async () => {
    if (isLoading || hasReachedEnd) return;
    setIsLoading(true);
    await delay(500);

    setFavPage(favPage + 1);
    setIsLoading(false);
  };

  const handleFavPrev = async () => {
    if (isLoading || favPage <= 1) return;
    setIsLoading(true);
    await delay(500);

    setFavPage(favPage - 1);
    setIsLoading(false);
  };

  // --- Data Slice - FIXED ---
  const startIndex = (favPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const favSlice = favArr.slice(startIndex, endIndex);

  return (
    <>
      {initialLoad ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader"></div>
        </div>
      ) : (
        <>
          <ShowCoins currSlice={favSlice} isLoading={isLoading} />
          
          {/* Show pagination only if there are more favorites than perPage */}
          {favArr.length > perPage && (
            <Pagination
              page={favPage}
              perPage={perPage}
              isLoading={isLoading}
              handlePrev={handleFavPrev}
              handleNext={handleFavNext}
              currSlice={favSlice}
              total={favArr.length}
              endMessage={endMessage}
            />
          )}
        </>
      )}
    </>
  );
};

export default Favourite;