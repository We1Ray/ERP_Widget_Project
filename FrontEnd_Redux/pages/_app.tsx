import "../polyfills.js";
import { AppContext, AppInitialProps, AppProps } from "next/app";
import React from "react";
import { createWrapper } from "next-redux-wrapper";
import { Store } from "redux";
import Base from "../components/Layout/Base";
import { configureStore } from "../store/store";
import "whirl/dist/whirl.css";
import "@fortawesome/fontawesome-free/css/brands.css";
import "@fortawesome/fontawesome-free/css/regular.css";
import "@fortawesome/fontawesome-free/css/solid.css";
import "@fortawesome/fontawesome-free/css/fontawesome.css";
import "animate.css/animate.min.css";
import "simple-line-icons/css/simple-line-icons.css";
import "weather-icons/css/weather-icons.min.css";
import "weather-icons/css/weather-icons-wind.min.css";
import "../styles/bootstrap.scss";
import "../styles/app.scss";

type Props = { store: Store } & AppInitialProps & AppProps;

type AppPage<P = {}> = {
  (props: P): JSX.Element | null;
  getInitialProps: ({ Component, ctx }: AppContext) => Promise<AppInitialProps>;
};

const App: AppPage<Props> = ({ pageProps, Component }: any) => {
  const Layout = Component.Layout ? Component.Layout : Base;
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};

App.getInitialProps = async ({ Component, ctx }: AppContext) => {
  return {
    pageProps: {
      ...(Component.getInitialProps
        ? await Component.getInitialProps(ctx)
        : {}),
    },
  };
};
const wrapper = createWrapper(configureStore);
export default wrapper.withRedux(App);
