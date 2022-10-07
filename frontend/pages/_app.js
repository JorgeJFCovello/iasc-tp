import '../styles/globals.css';
import Layout from '../layouts/index.js';
import { useState } from 'react';
import { Context } from '../libs/context.js';

function MyApp({ Component, pageProps }) {
  const [context, setContext] = useState();
  return (
    <Context.Provider value={[context, setContext]}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Context.Provider>
  );
}

export default MyApp;
