import { ChakraProvider } from '@chakra-ui/react';
import { MoralisProvider } from 'react-moralis';
import { NotificationProvider } from 'web3uikit';

import Head from '@components/Head';
import Navbar from '@components/Navbar';

import DefaultTheme from '@styles/theme';
import '@styles/globals.css';

import config from 'react-reveal/globals';

config({ ssrFadeout: true });

export default function App({ Component, pageProps }) {
  return (
    <MoralisProvider initializeOnMount={false}>
      <NotificationProvider>
        <ChakraProvider theme={DefaultTheme}>
          <Head />
          <Navbar />
          <Component {...pageProps} />
        </ChakraProvider>
      </NotificationProvider>
    </MoralisProvider>
  );
}
