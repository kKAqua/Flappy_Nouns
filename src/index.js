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
        environmentId: '1ab0315b-cde0-4004-ab46-53a2033a410b',
        walletConnectors: [EthereumWalletConnectors],
      }}>
      <App />
    </DynamicContextProvider>
  </React.StrictMode>
);
