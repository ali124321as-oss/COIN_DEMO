import React, { useState, useEffect } from "react";
import { FaStar, FaMoon } from "react-icons/fa";
import { Bitcoin } from "lucide-react";
import { Link } from "react-router-dom";
import { getSession, setSession } from "../redux_store/Storage";
import { useDispatch, useSelector } from "react-redux";
import { setTheme } from "../redux_store/coinSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const allCoinSliceStates = useSelector((state) => state.coinsSlice);
  const theme = allCoinSliceStates.theme; // Access theme directly, not Object.values()
  const [home, setHome] = useState(() => {
    return getSession("showHome", "true");
  });

  useEffect(() => {
    setSession("showHome", home);
  }, [home]);

  return (
    <div className="max-w-[1200px] w-full mx-auto flex justify-between items-center text-[rgb(255,255,255)] mt-5 px-4 md:px-8">
      {/* Left Section */}
      <div className="flex gap-2 items-center">
        <div className="bg-blue-600 p-2 rounded-xl flex items-center justify-center">
          <Bitcoin className="text-white" />
        </div>
        <h1 className="text-[#333131] font-bold text-xl hidden sm:block">
          Crypto Dashboard 
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex gap-4">
        {/* Conditional rendering based on home state */}
        {home === "true" ? (
          <Link to="/favourite" onClick={() => setHome("false")}>
            <div className="flex cursor-pointer bg-slate-600 gap-1 items-center justify-center px-3 py-2 rounded-md">
              <FaStar size={20} className="text-orange-400" />
              <p className="text-black/60 font-bold">Favourites</p>
            </div>
          </Link>
        ) : (
          <Link to="/" onClick={() => setHome("true")}>
            <div className="flex cursor-pointer bg-slate-600 gap-1 items-center justify-center px-3 py-2 rounded-md">
              <p className="text-black/60 font-bold">Home</p>
            </div>
          </Link>
        )}

        {/* Moon Icon - FIXED: Use theme directly, not Object.values() */}
        <div
          className="flex cursor-pointer bg-slate-600 items-center justify-center px-3 py-2 rounded-md"
          onClick={() => {
            if (theme === "white") {
              dispatch(setTheme("black"));
            } else {
              dispatch(setTheme("white"));
            }
          }}
        >
          <FaMoon size={20} className="text-orange-400" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;