import React from "react";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LoginPage from "./Login/LoginPage";
import HomePage from "./HomePage/HomePage";
import MigrateResources from "./Migrations/MigrateResources";
import Users from "./HomePage/Users/Users";
import ZohoToTotango from "./ZohoTotango/ZohoToTotango";
import UpdateResources from "./Updations/UpdateResources";
import OsqueryAnalysisPage from "./OsqueryLogAnalysis/OsqueryAnalysisPage";
import authValidater from "./authValidater";
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
				loader={authValidater}
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
			<Route
				path="osqueryLogAnalysis"
				element={<OsqueryAnalysisPage/>}
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
