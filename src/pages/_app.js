import * as React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider } from '@emotion/react'
import createEmotionCache from '../utils/createEmotionCache'
import "@/styles/globals.css"
import { Merienda } from '@next/font/google'
import { Provider } from 'react-redux';
import store from '../Reducers/store';

// If loading a variable font, you don't need to specify the font weight
const merienda = Merienda({
  variable: '--font-merienda',
  weight: ['400', '700'],
  subsets: ['latin']
})

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

export default function MyApp(props) {
	const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

	return (
		<CacheProvider value={emotionCache}>
			<Head>
				<meta name='viewport' content='initial-scale=1, width=device-width' />
			</Head>
			
			{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
			<CssBaseline />
			 <main className={merienda.className}>
			 <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
    </main>
		</CacheProvider>
	)
}

MyApp.propTypes = {
	Component: PropTypes.elementType.isRequired,
	emotionCache: PropTypes.object,
	pageProps: PropTypes.object.isRequired,
}