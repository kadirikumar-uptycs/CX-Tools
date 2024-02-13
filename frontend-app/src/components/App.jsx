import React from "react";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LoginPage from "./LoginPage";
import HomePage from "./HomePage";
import authValidater from "./authValidater";
import AccountMenu from "./AccountMenu";
import MigrateFlagProfiles from "./MigrateFlagProfiles";
import Users from "./Users";

const darkTheme = createTheme({
	palette: {
	  mode: 'dark',
	  
	},
  });
const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/">
			<Route
				path="login"
				element={<LoginPage />}
			/>
			<Route
				index
				element={<HomePage />}
				loader={authValidater}
			/>
			<Route
				path="menu"
				element={<AccountMenu />}
				loader={authValidater}
			/>
			<Route
				path="migrate-flag-profiles"
				element={<MigrateFlagProfiles />}
				loader={authValidater}
			/>
			<Route
				path="users"
				element={<Users />}
				loader={authValidater}
			/>
		</Route>
	)
);

export default function App() {

	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<RouterProvider router={router} />
		</ThemeProvider>
	)
}