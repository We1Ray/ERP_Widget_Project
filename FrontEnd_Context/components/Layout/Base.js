import React, { useContext, useState, useEffect } from "react";
import Head from "./Head";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Offsidebar from "./Offsidebar";
import Footer from "./Footer";
import SettingsProvider from "./SettingsProvider";
import ThemesProvider from "./ThemesProvider";
import "sweetalert2/src/sweetalert2.scss";
import { System_Login } from "../../resource/index";

export default function Base({ ...props }) {
  return (
    <System_Login system_uid="SYS_00001">
      <ThemesProvider>
        <SettingsProvider>
          <BaseContent props={props} />
        </SettingsProvider>
      </ThemesProvider>
    </System_Login>
  );
}

function BaseContent({ ...props }) {
  // const { System } = useContext(SystemContext);

  return (
    <div className="wrapper">
      <Head />
      <Header />
      <Sidebar />
      <Offsidebar />
      {/* <section className="section-container">
        {System.userstate === "NoAccount" ? (
          <div className="content-wrapper">
            <div className="content-heading">
              <b style={{ margin: "0 auto" }}>
                {System.getLocalization("Public","ContactRelevantPersonnel")}
              </b>
            </div>
          </div>
        ) : (
          props.props.children
        )}
      </section> */}
      <section style={{ zIndex: 0 }} className="section-container">
        {props.props.children}
      </section>
      <Footer />
    </div>
  );
}
