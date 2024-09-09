import React from 'react';
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider
} from "react-router-dom";
import { Provider } from 'react-redux'
import ErrorBoundary from './common/ErrorBoundary';
import { SnackbarProvider } from './hooks/SnackBarProvider';
import PageNotFound from './common/PageNotFound';
import LoginPage from './Login/LoginPage';
import HomePage from './Home/HomePage';
import ResourceMigration from './ResourceMigration/ResourceMigration';
import ResourceUpdation from './ResourceUpdation/ResourceUpdation';
import OsqueryAnalysis from './OsqueryLogAnalysis/OsqueryAnalysis';
import TokenGenerator from './UptycsAPIKeys/TokenGenerator';
import Users from './Users/Users';
import Layout from './Layout';
import store from './store';

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route>
			<Route path="/" element={<Layout />}>
				<Route index element={
					<ErrorBoundary>
						<HomePage />
					</ErrorBoundary>
				} />
				<Route path="resourceMigrations" element={
					<ErrorBoundary>
						<ResourceMigration />
					</ErrorBoundary>
				} />
				<Route path="resourceUpdations" element={
					<ErrorBoundary>
						<ResourceUpdation />
					</ErrorBoundary>
				} />
				<Route path="osqueryAnalysis" element={
					<ErrorBoundary>
						<OsqueryAnalysis />
					</ErrorBoundary>
				} />
				<Route path="tokenGenerator" element={
					<ErrorBoundary>
						<TokenGenerator />
					</ErrorBoundary>
				} />
				<Route path="users" element={
					<ErrorBoundary>
						<Users />
					</ErrorBoundary>
				} />
				<Route path='*' element={
					<ErrorBoundary>
						<PageNotFound />
					</ErrorBoundary>
				} />
			</Route>
			<Route path="login" element={
				<ErrorBoundary>
					<LoginPage />
				</ErrorBoundary>
			} />
		</Route>
	)
);

export default function App() {
	return (
		<Provider store={store}>
			<SnackbarProvider>
				<ErrorBoundary>
					<RouterProvider router={router} />
				</ErrorBoundary>
			</SnackbarProvider>
		</Provider>
	);
}