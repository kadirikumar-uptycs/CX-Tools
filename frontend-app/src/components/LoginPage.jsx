import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import GoogleLogin from "./SignInWithGoogle";
import ModalComponent from "./Modal";
import CreateAccount from "./CreateAccount";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import "./css/LoginPage.css";
import axios from "axios";
import BackdropEffect from "./BackdropEffect";
import config from "../config";
import {useNavigate} from 'react-router-dom';

const lightTheme = createTheme({
	palette: {
		mode: 'light',
		background: {
			default: '#e7f1f1'
		}
	},
});


export default function LoginPage() {
	const navigate =useNavigate();
	let [modal, setModal] = useState({
		show: false,
		title: "",
		body: "",
		titleColor: "#ff0000",
	});
	let [requestedUserEmail, setRequestedUserEmail] = useState("");
	let [isLoading, setIsLoading] = useState(false);
	let [message, setMessage] = useState('');

	axios.defaults.withCredentials = true;

	const validateEmail = (email) => {
		return String(email)
			.toLowerCase()
			.match(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			);
	};

	function closeModal() {
		setModal((prev) => ({
			...prev,
			show: false,
			titleColor: "#ff0000",
		}));
	}

	async function handleGoogleLogin(credential) {
		var tokens = credential.split(".");
		var payload = JSON.parse(atob(tokens[1]));

		let userInfo = {
			email: payload.email,
			name: payload.name,
			picture: payload.picture,
		};

		try {
			setIsLoading(true);
			setMessage('Validating...');
			console.log("Env:", process.env);
			await axios.post(`${config.SERVER_BASE_ADDRESS}/validateLoginUser`, userInfo, { withCredentials: true });
			setMessage('Verified!!!');
			navigate('/');
			setIsLoading(false);
		} catch (err) {
			console.log(err);
			setMessage('Error');
			setIsLoading(false);
			setModal({
				show: true,
				title: (err?.response?.status && err?.response?.status === 401) ? "Unauthorized" : "Login Failed",
				body: err.response?.data?.message || "Error",
				titleColor: "#ff0000",
			});
		}
	}

	async function handleUserRequest() {
		if (!validateEmail(requestedUserEmail)) {
			setModal({
				title: "Invalid Email",
				body: "Enter Valid Email, eg: abc@domain.com",
				show: true,
				titleColor: "#ff0000",
			});
		} else {
			let response;
			setMessage('Requesting...');
			setIsLoading(true);
			try {
				response = await axios.post(
					`${config.SERVER_BASE_ADDRESS}/storeUserRequest`,
					{ email: requestedUserEmail }
				);
			} catch (error) {
				console.log(error);
			}
			setMessage('Error');
			setIsLoading(false);
			setModal({
				show: true,
				title: response?.status === 200 ? `${requestedUserEmail}` : "Error⁈",
				body: response.data.message,
				titleColor: "#24001a",
			});
		}
	}

	return (
		<ThemeProvider theme={lightTheme}>
			<CssBaseline />
			<GoogleOAuthProvider clientId="293145640210-9na2vgecvu45cc8do0411rg8nd000766.apps.googleusercontent.com"></GoogleOAuthProvider>
			<section className="LoginApp">
				<div
					className="row g-0 d-flex justify-content-center align-items-center border border-light-subtle shadow-lg rounded-2 bg-light"
					style={{ width: "700px", height: "400px" }}
				>
					<div className="col-6" style={{ height: "100.5%" }}>
						<img
							src="images/small-robo.jpg"
							className="img-fluid rounded-start"
							style={{ height: "100%" }}
							alt="small robo"
						/>
					</div>
					<div
						className="col-6 d-flex flex-column justify-content-evenly align-items-center"
						style={{ height: "100%" }}
					>
						<CreateAccount
							requestedUserEmail={requestedUserEmail}
							handleUserInput={(email) => setRequestedUserEmail(email)}
							handleUserRequest={handleUserRequest}
						/>
						<div>
							<span className="text-secondary lead mb-5" id="or">
								or
							</span>
						</div>
						<GoogleLogin handleLogin={handleGoogleLogin} />
					</div>
				</div>
				<ModalComponent
					show={modal.show}
					title={modal.title}
					body={modal.body}
					closeModal={closeModal}
					titleColor={modal.titleColor}
				/>
			</section>
			<GoogleOAuthProvider />

			{/* Backdrop effect while credentials validation */}
			<BackdropEffect isLoading={isLoading} color="#fff" message={message} />

		</ThemeProvider>
	);
}
