import '../styles/globals.css'
import Layout from '../layouts/index.js'

function MyApp({ Component, pageProps }) {
  return <Layout><Component {...pageProps} /></Layout>
}

export default MyApp
