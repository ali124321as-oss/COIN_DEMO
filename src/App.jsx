import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Pages/Navbar";
import NotFound from "./Pages/NotFound";
import Favourite from "./Pages/Favourite";
import Home from "./Pages/Home";

const App = () => {
  const allCoinSliceStates = useSelector((state) => state.coinsSlice);
  const theme = allCoinSliceStates.theme;
  console.log("in app", theme);

  // Apply theme to document.body
  useEffect(() => {
    if (theme === "black") {
      document.body.classList.add("bg-gradient-to-br", "from-gray-900", "via-gray-700", "to-gray-800");
      document.body.classList.remove("bg-white");
      document.body.style.backgroundAttachment = "fixed";
    } else {
      document.body.classList.add("bg-white");
      document.body.classList.remove("bg-gradient-to-br", "from-gray-900", "via-gray-700", "to-gray-800");
      document.body.style.backgroundAttachment = "";
    }
  }, [theme]);

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      theme === "black" 
        ? "bg-gradient-to-br from-gray-900 via-gray-700 to-gray-800 text-white" 
        : "bg-white text-gray-900"
    }`}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/favourite" element={<Favourite />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;