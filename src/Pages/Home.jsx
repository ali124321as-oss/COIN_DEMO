import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import SearchBar from "../component/Search";
import ShowCoins from "../component/ShowCoins";
import Pagination from "../component/pagination";
import { setCurrentSlice, storeinAllCoins } from "../redux_store/coinSlice";
import { getSession, setSession } from "../redux_store/Storage";

const Home = () => {
  const apiUrl = import.meta.env.VITE_API_KEY;
  const dispatch = useDispatch();
  const perPage = 20;

  const { currcoinsSlice, allCoinsData } = useSelector((state) => state.coinsSlice);
  
  const [searchedValue, setSearchedValue] = useState(() => getSession("SearchedPage", ""));
  const [page, setPage] = useState(() => getSession("homePage", 1));
  const [prevPage, setPrevPage] = useState(() => getSession("prevPage", 1));
  const [filterPage, setFilterPage] = useState(() => getSession("filterPage", 1));
  const [filterData, setFilterData] = useState(() => getSession("filterData", []));
  const [isLoading, setIsLoading] = useState(() => getSession("isLoading", false));
  const [hasSearched, setHasSearched] = useState(() => getSession("hasSearched", false));
  const [sortBy, setSortBy] = useState(() => getSession("sortBy", ""));
  const [sortMessage, setSortMessage] = useState(() => getSession("sortMessage", ""));
  const [isSortedData, setIsSortedData] = useState(() => getSession("isSortedData", false));

  // Persist all states
  useEffect(() => setSession("homePage", page), [page]);
  useEffect(() => setSession("prevPage", prevPage), [prevPage]);
  useEffect(() => setSession("filterPage", filterPage), [filterPage]);
  useEffect(() => setSession("filterData", filterData), [filterData]);
  useEffect(() => setSession("isLoading", isLoading), [isLoading]);
  useEffect(() => setSession("SearchedPage", searchedValue), [searchedValue]);
  useEffect(() => setSession("hasSearched", hasSearched), [hasSearched]);
  useEffect(() => setSession("sortBy", sortBy), [sortBy]);
  useEffect(() => setSession("sortMessage", sortMessage), [sortMessage]);
  useEffect(() => setSession("isSortedData", isSortedData), [isSortedData]);

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  // Fetch data
  const fetchData = async (pageNumber) => {
    if (allCoinsData[pageNumber]) return allCoinsData[pageNumber];

    try {
      const response = await axios.get(`${apiUrl}&page=${pageNumber}&per_page=${perPage}`);
      const data = response.data;
      dispatch(storeinAllCoins({ page: pageNumber, newSlice: data }));
      return data;
    } catch (error) {
      console.error("Failed to fetch data for page", pageNumber, error.message);
      return [];
    }
  };

  // Sort function for currSlice
  const handleSort = async (sortType) => {
    if (isLoading || hasSearched || !currcoinsSlice.length) return;
    
    setIsLoading(true);
    setSortBy(sortType);
    
    let message = "";
    let sortedData = [...currcoinsSlice];
    
    await delay(1000);

    switch (sortType) {
      case "price":
        sortedData.sort((a, b) => b.current_price - a.current_price);
        message = "Sorted by Price (High to Low)";
        setIsSortedData(true); // Mark as sorted data
        break;
      case "volume":
        sortedData.sort((a, b) => b.total_volume - a.total_volume);
        message = "Sorted by Volume (High to Low)";
        setIsSortedData(true); // Mark as sorted data
        break;
      case "market_cap":
        sortedData.sort((a, b) => b.market_cap - a.market_cap);
        message = "Sorted by Market Cap (High to Low)";
        setIsSortedData(true); // Mark as sorted data
        break;
      case "none":
        await handleResetFilters();
        return;
      default:
        sortedData = currcoinsSlice;
        message = "";
        setIsSortedData(false); // Not sorted
        break;
    }
    
    setSortMessage(message);
    dispatch(setCurrentSlice(sortedData));
    setIsLoading(false);
  };

  // Reset all filters and fetch original data
  const handleResetFilters = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setSortBy("");
    setSortMessage("");
    setIsSortedData(false); // Reset sorted flag
    
    await delay(1000);
    
    // Fetch the original data for current page
    const data = await fetchData(page);
    if (data.length > 0) {
      dispatch(setCurrentSlice(data));
    }
    
    setIsLoading(false);
  };

  // Main pagination handlers
  const handleNext = async () => {
    if (isLoading) return;
    setIsLoading(true);
    await delay(3000);

    const newPage = page + 1;
    const data = await fetchData(newPage);
    if (data.length > 0) {
      dispatch(setCurrentSlice(data));
      setPage(newPage);
      setSortBy("");
      setSortMessage("");
      setIsSortedData(false); // Reset when changing pages
    }
    await delay(3000);
    setIsLoading(false);
  };

  const handlePrev = async () => {
    if (page <= 1 || isLoading) return;
    setIsLoading(true);
    await delay(3000);
     
    const newPage = page - 1;
    const data = allCoinsData[newPage] || [];
    dispatch(setCurrentSlice(data));
    setPage(newPage);
    setSortBy("");
    setSortMessage("");
    setIsSortedData(false); // Reset when changing pages

    setIsLoading(false);
  };

  // Initial fetch - ONLY fetch if we don't have sorted data persisted
  useEffect(() => {
    const getFirstSlice = async () => {
      // If we have sorted data persisted, don't fetch - use the persisted data
      if (isSortedData && currcoinsSlice.length > 0) {
        console.log("Using persisted sorted data");
        return;
      }
      
      // Only fetch if we don't have data or we're not on sorted data
      if (currcoinsSlice.length === 0 || !isSortedData) {
        setIsLoading(true);
        await delay(2000);
        const data = await fetchData(page);
        dispatch(setCurrentSlice(data));
        setIsLoading(false);
      }
    };
    getFirstSlice();
  }, [page]); // Only depend on page changes

  // Rest of your component remains the same...
  const handleFilterData = async (searchedValue) => {
    setIsLoading(true);
    await delay(2000);
    
    setHasSearched(true);
    setSortBy("");
    setSortMessage("");
    setIsSortedData(false); // Reset sorted flag when searching
    
    const allDataArray = Object.values(allCoinsData).flat(1);
    
    const seenIds = new Set();
    const uniqueDataArray = [];
    
    for (let i = 0; i < allDataArray.length; i++) {
      const coin = allDataArray[i];
      if (!seenIds.has(coin.id)) {
        seenIds.add(coin.id);
        uniqueDataArray.push(coin);
      }
    }
    
    const filtered = uniqueDataArray.filter((item) =>
      item.name.toLowerCase().includes(searchedValue.trim().toLowerCase())
    );

    setFilterData(filtered);
    setPrevPage(page);

    if (filtered.length > 0) {
      setFilterPage(1);
    }

    setIsLoading(false);
    return filtered;
  };

  // Handle go back - reset sorted flag
  const handleGoBack = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    await delay(3000);
    
    setHasSearched(false);
    setSearchedValue("");
    setFilterData([]);
    setFilterPage(1);
    setSortBy("");
    setSortMessage("");
    setIsSortedData(false); // Reset sorted flag
    
    setPage(prevPage);
    setIsLoading(false);
  };

  // SEPARATE INSTANCES: Main and search slices
  const mainSlice = currcoinsSlice;
  const searchSlice = filterData.slice((filterPage - 1) * perPage, filterPage * perPage);

  // Search pagination handlers
  const handleSearchNext = () => {
    if (isLoading) return;
    setIsLoading(true);
    const newPage = filterPage + 1;
    if (filterData.length > (newPage - 1) * perPage) {
      setFilterPage(newPage);
    }
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleSearchPrev = () => {
    if (isLoading || filterPage <= 1) return; 
    setIsLoading(true);
    setFilterPage(filterPage - 1);
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <>
      <SearchBar
        filterCoinBySearchedValue={handleFilterData}
        searchedValue={searchedValue}
        setSearchedValue={setSearchedValue}
        placeholder="Search coins..."
        sortBy={sortBy}
        onSort={handleSort}
        hasSearched={hasSearched}
        isLoading={isLoading}
      />

      {/* Sort message */}
      {sortMessage && !hasSearched && (
        <div className="max-w-[1200px] mx-auto px-6 mt-4">
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm font-medium">
            {sortMessage}
          </div>
        </div>
      )}

      {/* SEPARATE INSTANCES: ShowCoins for MAIN DATA */}
      {!hasSearched && (
        <ShowCoins 
          currSlice={mainSlice} 
          isLoading={isLoading} 
          hasSearched={false}
          onGoBack={handleGoBack}
        />
      )}

      {/* SEPARATE INSTANCES: ShowCoins for SEARCH DATA */}
      {hasSearched && (
        <ShowCoins 
          currSlice={searchSlice} 
          isLoading={isLoading} 
          hasSearched={true}
          onGoBack={handleGoBack}
          setIsLoading={setIsLoading}
        />
      )}
      
      {/* SEPARATE INSTANCES: Go Back button for search results with data */}
      {(hasSearched && filterData.length > 0 && !isLoading) && (
        <div className="max-w-[1200px] mx-auto px-4 mt-4 cursor-pointer">
          <button 
            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
            onClick={handleGoBack}
          >
            Go Back to Main List
          </button>
        </div>
      )}
      
      {/* SEPARATE INSTANCES: Search pagination */}
      {hasSearched && filterData.length > 0 && filterData.length > perPage && (
        <Pagination
          page={filterPage}
          perPage={perPage}
          isLoading={isLoading}
          handlePrev={handleSearchPrev}
          handleNext={handleSearchNext}
          currSlice={searchSlice}
          total={filterData.length}
        />
      )}

      {/* SEPARATE INSTANCES: Main pagination */}
      {!hasSearched && currcoinsSlice.length === perPage && (
        <Pagination
          page={page}
          perPage={perPage}
          isLoading={isLoading}
          handlePrev={handlePrev}
          handleNext={handleNext}
          currSlice={mainSlice}
          total={undefined}
        />
      )}
    </>
  );
};

export default Home;