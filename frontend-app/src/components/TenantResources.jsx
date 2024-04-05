import React, { useContext, useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import AccordionComponent from "./Accordion";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";
import SnackBar from "./SnackBar";
import { ContextProvider } from "./MigrateResources";
import Typography from "@mui/material/Typography";
import "./css/TenantResources.css";
import config from "../config";

export default function TenantResources({ type }) {
	let { state, setState } = useContext(ContextProvider);

	/* 
  
	  reloadControllerValue :-
  
	  When targetReload is set to true, useEffect runs and inside that useEffect after reloading
	  resources by calling API, targetReload is set to false which will again render the component and as 
	  the targetReload is indirectly set as a dependency for useEffect, useEffect will also run for the 2nd time as 
	  Object.keys(credentials).length > 0 is true. To avoid this we are using useRef hook to track the multiple reloads
  
	  Thus setting this useRef's current value to true will signal to stop running the useEffect code. 
	  Once the useEffect is run, useRef's current value is set to false.
  
	  */
	let reloadControllerValue = useRef(false);

	let navigate = useNavigate();

	const sleep = (time) => new Promise((res) => setTimeout(res, time));

	let setSnackBar;

	function setChildState(childStateSetter) {
		setSnackBar = childStateSetter;
	}

	let [isLoading, setIsLoading] = useState(false);
	let [errors, setErrors] = useState({ 'status': 200, 'error': null });

	let data = type === "source" ? state.sourceResources : state.targetResources;

	let accordionElements = data.map((item) => (
		<AccordionComponent
			key={item.id}
			type={type}
			summary={item.name}
			details={item}
		/>
	));

	let [searchParams] = useSearchParams();
	let resourceFromURL = searchParams.get("resource") || "flagProfiles";

	let doReload = type === "target" ? state.targetReload : false;

	let credentials =
		type === "source" ? state.sourceCredentials : state.targetCredentials;

	useEffect(() => {
		const fetchData = async () => {
			if (
				credentials &&
				Object.keys(credentials).length > 0 &&
				!reloadControllerValue.current
			) {
				setIsLoading(true);
				const url = `${config.SERVER_BASE_ADDRESS}/get/${resourceFromURL}`;
				try {
					const response = await axios.post(url, { credentials: credentials }, { withCredentials: true });
					setIsLoading(false);
					let responseData = response.data;
					if (responseData.length === 0) {
						setSnackBar({
							open: true,
							message: `No data found on ${type}`,
							severity: "warning",
							duration: 4500,
						});
						setState((prev) => ({
							...prev,
							[type + "Resources"]: [],
							targetReload: false,
						}));
						setErrors(prev => ({
							...prev,
							error: 404, // when no data is found
						}));
					} else {
						setState((prev) => ({
							...prev,
							[type + "Resources"]: responseData,
							targetReload: false,
						}));

						setErrors(prev => ({
							...prev,
							error: null,
						}));
					}
				} catch (err) {
					console.log(err);
					setIsLoading(false);
					setState((prev) => ({
						...prev,
						[type + "FileName"]: "No File Choosen",
						[type + "Resources"]: [],
						[type + "Credentials"]: {},
						targetReload: false,
					}));
					let errorStatus = err?.response?.status;
					if (errorStatus === 401) {

						if (err?.response?.data?.Authorized === false) {
							setSnackBar({
								open: true,
								message: "Session Expired",
								severity: "error",
								duration: 4500,
							});
							setErrors({
								status: 401,
								error: 'Session Expired'
							});
							await sleep(2000);
							navigate("/login");
						} else {
							setSnackBar({
								open: true,
								message:
									type + ": " + err?.response?.data?.message?.details ||
									"API Key Unauthorized",
								severity: "error",
								duration: 4500,
							});
							setErrors(prev => ({
								status: 401,
								error: 'API Key Unauthorized'
							}));
						}
					} else if (errorStatus === 403) {
						setErrors(prev => ({
							status: 403,
							error: err?.response?.data?.message || 'Not Allowed'
						}));
					} else {
						setSnackBar({
							open: true,
							message: type.toUpperCase() + ": Server is unavailable",
							severity: "error",
							duration: 7000,
						});
					}
				}
			}
		};

		fetchData();
		reloadControllerValue.current = doReload; // eslint-disable-next-line
	}, [credentials, resourceFromURL, doReload]);

	// Templae based on error status
	function resourceTemplate() {

		if (!errors?.error) {
			return accordionElements;
		} else if (errors?.status === 403) {
			return (
				<>
					<dotlottie-player
						src="https://lottie.host/245437d3-3eb3-4cfb-831f-1eb4750e182a/B4SlG6l3Cl.json"
						background="transparent"
						speed="1"
						style={{ width: "300px", height: "300px" }}
						loop
						autoplay
					></dotlottie-player>
					<span className="message--403">{errors?.error}</span>
				</>
			);
		} else if (errors?.status === 404) {
			return (
				<dotlottie-player
					src="https://lottie.host/f4c6e1c2-5c61-4d41-995c-15070bb2bd3b/lOMPC2KUK5.json"
					background="transparent"
					speed="1"
					style={{ width: "300px", height: "300px" }}
					loop
					autoplay
				></dotlottie-player>
			);
		} else {
			// do nothing
		}
	}

	return (
		<>
			{isLoading ? (
				<>
					<CircularProgress />
					<Typography
						sx={{
							marginTop: "5px",
							fontSize: "31px",
							color: "#999",
						}}
					>
						Loading...
					</Typography>
				</>
			) : (
				<div className="accordion">{resourceTemplate()}</div>
			)}

			{/* SnackBar */}
			<SnackBar getChildState={setChildState} />
		</>
	);
}
