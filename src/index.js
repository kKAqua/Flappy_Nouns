import React from "react";
import ReactDOM from "react-dom/client";
import { DynamicConnectButton, DynamicWidget, useDynamicContext, DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <DynamicContextProvider
      settings={{
        environmentId: '09e57ca9-5204-43cd-8626-c41dd4eba386',
        walletConnectors: [EthereumWalletConnectors],
      }}>
      <App />
    </DynamicContextProvider>
  </React.StrictMode>
);
