import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import CssBaseline from '@mui/material/CssBaseline';

import './styles/index.scss';
import { ThemeProvider } from '@mui/material';
import { theme } from './theme';
import store, { persistor } from './store/store';
import { PersistGate } from 'redux-persist/integration/react';

// initiate all posts to use EntityAdapter features like select by id, select by all posts...
// store.dispatch(normalizedPostApi.endpoints.getAllPosts.initiate());

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);
root.render(
	<React.StrictMode>
		<CssBaseline />
		<ThemeProvider theme={theme}>
			<BrowserRouter>
				<Provider store={store}>
					<PersistGate loading={null} persistor={persistor}>
						<App />
					</PersistGate>
				</Provider>
			</BrowserRouter>
		</ThemeProvider>
	</React.StrictMode>
);
