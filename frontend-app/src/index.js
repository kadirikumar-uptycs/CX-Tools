import React from "react";
import ReactDOM from "react-dom/client";
import LoginPage from "./components/LoginPage";
import { GoogleOAuthProvider } from '@react-oauth/google';
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId="293145640210-9na2vgecvu45cc8do0411rg8nd000766.apps.googleusercontent.com">
    <React.StrictMode>
      <LoginPage />
    </React.StrictMode>
  </GoogleOAuthProvider>
);
