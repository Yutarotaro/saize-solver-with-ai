import React, { createContext, useContext, useState } from 'react';

// コンテキストの作成
const StateContext = createContext();

// コンテキストプロバイダコンポーネント
export const StateProvider = ({ children }) => {
  const [activeState, setActiveState] = useState(1);
  return (
    <StateContext.Provider value={{ activeState, setActiveState }}>
      {children}
    </StateContext.Provider>
  );
};

// コンテキストを使用するためのカスタムフック
export const useStateContext = () => useContext(StateContext);
