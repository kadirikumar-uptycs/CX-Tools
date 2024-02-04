import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import GoogleLogin from "./SignInWithGoogle";

export default function LoginPage() {
  const responseMessage = (response) => {
    console.log(response);
  };
  const errorMessage = (error) => {
    console.log(error);
  };
  return (
    <div>
      <GoogleLogin />
    </div>
  );
}
