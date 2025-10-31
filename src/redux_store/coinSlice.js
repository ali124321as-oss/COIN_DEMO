import { createSlice } from "@reduxjs/toolkit";


const loadLocal = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

const loadSession = (key, fallback) => {
  try {
    const v = sessionStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

// **New helpers to set values**
const setLocal = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

const setSession = (key, value) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

const initialState = {
  theme: loadLocal("theme", "white"),
  favouriteCoins: loadLocal("favouriteCoins", {}),

  currcoinsSlice: loadSession("currcoinsSlice", []),

  allCoinsData: loadSession("allCoinsData", {}),
  SingleCoinsData: loadSession("SingleCoinsData", []),
  showSingleCoinPage: loadSession("showSingleCoinPage", false),
  isShowCoinGraph: loadSession("showGraph", false),
     isShowSinglePage:loadSession("showSinglePage", false),
      
};

const coinSlice = createSlice({
  name: "coinsSlice",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      setLocal("theme", state.theme);
    },

    addFavouriteCoin: (state, action) => {
      const coin = action.payload;
      if (!state.favouriteCoins[coin.id]) {
        state.favouriteCoins[coin.id] = coin;
        setLocal("favouriteCoins", state.favouriteCoins);
      }
    },

    removeFavouriteCoin: (state, action) => {
      const id = action.payload;
      delete state.favouriteCoins[id];
      setLocal("favouriteCoins", state.favouriteCoins);
    },

    setCurrentSlice: (state, action) => {
      state.currcoinsSlice = action.payload;
      setSession("currcoinsSlice", state.currcoinsSlice);
    },

    setSingleCoinsData: (state, action) => {
      state.SingleCoinsData = action.payload;
      setSession("SingleCoinsData", state.SingleCoinsData);
    },

    setShowSingleCoinPage: (state, action) => {
      state.showSingleCoinPage = action.payload;
      setSession("showSingleCoinPage", state.showSingleCoinPage);
    },

    storeinAllCoins: (state, action) => {
      const { page, newSlice } = action.payload;
      if (!state.allCoinsData[page]) {
        state.allCoinsData[page] = newSlice;
        setSession("allCoinsData", state.allCoinsData);
      }
    },

    handleShowCoinGraph: (state, action) => {
      state.isShowCoinGraph = action.payload;
      setSession("showGraph", state.isShowCoinGraph);
    },
           
        
  },
});

export const {
  setTheme,
  addFavouriteCoin,
  removeFavouriteCoin,
  setCurrentSlice,
  setSingleCoinsData,
  setShowSingleCoinPage,
  storeinAllCoins,
  handleShowCoinGraph,
    
} = coinSlice.actions;

export default coinSlice.reducer;
