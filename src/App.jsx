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
      document.body.classList.add("bg-black");
      document.body.classList.remove("bg-white");
 
    } else {
      document.body.classList.add("bg-white");
      document.body.classList.remove("bg-black");

    }
    
  
   
  }, [theme]);

  return (
    <div className="min-h-screen">
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