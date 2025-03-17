import Navbar from "../componenets/Navbar";

export default function MyApp({ Component, pageProps }) {


startServer();
  return (
    <div>
      <Navbar />
      <Component {...pageProps} />
    </div>
  );
}