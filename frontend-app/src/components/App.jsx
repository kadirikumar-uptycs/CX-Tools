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
			/>
			<Route
				path="migrateResources"
				element={<MigrateResources />}
			/>
			<Route
				path="users"
				element={<Users />}
			/>
			<Route
				path="updateResources"
				element={<UpdateResources/>}
			/>
			<Route
				path="zohoToTotango"
				element={<ZohoToTotango />}
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
