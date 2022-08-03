import 'bootstrap/dist/css/bootstrap.css'
import '../styles/globals.css'
import Head from "next/head";
import Layout from '../components/layout';
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";




function MyApp({ Component, pageProps }) {
  return (
    <>
    <Head>
       <meta name="viewport" content="width=device-width, initial-scale=1" />
       <link rel="preconnect" href="https://fonts.googleapis.com" />
       <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
       <link href="https://fonts.googleapis.com/css2?family=PT+Sans&display=swap" rel="stylesheet"/>
    </Head>
    <ThirdwebProvider desiredChainId={ChainId.BNBMainnet}>
    <Layout>
       <Component {...pageProps} />
    </Layout>
    </ThirdwebProvider>

    
    </>
    );
}

export default MyApp
