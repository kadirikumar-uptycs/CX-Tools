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
import MigrateResources from "./MigrateResources";
import Users from "./Users";
import ZohoToTotango from "./ZohoToTotango";
import UpdateResources from "./UpdateResources";

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
				path="migrateResources"
				element={<MigrateResources />}
				loader={authValidater}
			/>
			<Route
				path="users"
				element={<Users />}
				loader={authValidater}
			/>
			<Route
				path="updateResources"
				element={<UpdateResources/>}
				loader={authValidater}
			/>
			<Route
				path="zohoToTotango"
				element={<ZohoToTotango />}
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
