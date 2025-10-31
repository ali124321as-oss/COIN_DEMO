import React from "react";

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

        <span className="text-gray-700 font-medium">
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
        <div className="flex justify-center items-center w-full mt-3 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
          <p className="text-red-600 font-semibold text-lg">{endMessage}</p>
        </div>
      )}
    </div>
  );
};

export default Pagination;