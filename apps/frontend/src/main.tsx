import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import "./index.css";
import App from "./App.tsx";
import Admin from "./admin.tsx";
import Login from "./login.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<BrowserRouter>
				<Routes>
					<Route path="/admin" element={<Admin />} />
					<Route path="/login" element={<Login />} />
					<Route path="/:user" element={<App />} />
					<Route
						path="/"
						element={<Navigate to="/login" replace />}
					/>
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	</StrictMode>
);
