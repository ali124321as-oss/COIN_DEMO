import React from "react";
import { useSelector } from "react-redux";

const Pagination = ({
  page,
  perPage,
  total,
  isLoading = false,
  handlePrev,
  handleNext,
  currSlice,
  message = "",
  endMessage = "",
}) => {
  const allCoinSliceStates = useSelector((state) => state.coinsSlice);
  const theme = allCoinSliceStates.theme;
  
  const totalPages = total ? Math.ceil(total / perPage) : null;

  // Don't show anything during loading
  if (isLoading) {
    return <></>;
  }

  return (
    <div className="max-w-[1200px] w-full mx-auto mb-5 mt-5 px-6">
      {/* Pagination buttons row */}
      <div className="flex justify-between items-center w-full">
        <button
          onClick={handlePrev}
          disabled={page <= 1 || isLoading}
          className="cursor-pointer py-2 px-8 text-white bg-red-600 hover:scale-95 disabled:opacity-50 transition-transform"
        >
          Prev
        </button>

        <span className={`font-medium ${
          theme === "black" 
            ? "text-white" 
            : "text-gray-700"
        }`}>
          Page {page} {totalPages && `of ${totalPages}`}
        </span>

        <button
          onClick={handleNext}
          disabled={isLoading || (totalPages ? page >= totalPages : false)}
          className="cursor-pointer py-2 px-8 text-white bg-green-600 hover:scale-95 disabled:opacity-50 transition-transform"
        >
          Next
        </button>
      </div>

      {/* End message below the buttons */}
      {endMessage && (
        <div className={`flex justify-center items-center w-full mt-3 p-4 border rounded-lg ${
          theme === "black" 
            ? "bg-yellow-900 border-yellow-700" 
            : "bg-yellow-100 border-yellow-300"
        }`}>
          <p className={`font-semibold text-lg ${
            theme === "black" 
              ? "text-yellow-300" 
              : "text-red-600"
          }`}>
            {endMessage}
          </p>
        </div>
      )}
    </div>
  );
};

export default Pagination;