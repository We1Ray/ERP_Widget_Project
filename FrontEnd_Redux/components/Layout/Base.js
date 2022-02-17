import React from "react";
import Head from "./Head";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Offsidebar from "./Offsidebar";
import Footer from "./Footer";
import SettingsProvider from "./SettingsProvider";
import ThemesProvider from "./ThemesProvider";
import "sweetalert2/src/sweetalert2.scss";
import { System } from "../../resource/index";

export default function Base({ ...props }) {
  return (
    <System system_uid="SYS_00001">
      <ThemesProvider>
        <SettingsProvider>
          <div className="wrapper">
            <Head />
            <Header />
            <Sidebar />
            <Offsidebar />
            <section className="section-container">{props.children}</section>
            <Footer />
          </div>
        </SettingsProvider>
      </ThemesProvider>
    </System>
  );
}
