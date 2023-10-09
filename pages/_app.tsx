import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import 'bootstrap/dist/css/bootstrap.min.css';
import NAVBAR from '../components/navbar/navbar'
import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FOOTER from '../components/Footer/footer'


export default function App({ Component, pageProps }: AppProps) {
  return <>
 
  <NAVBAR/>
  <Component {...pageProps} />
  <ToastContainer/>
  <FOOTER/>
  </>
  
}
