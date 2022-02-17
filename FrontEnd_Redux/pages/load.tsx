import React, { useEffect } from "react";
import { useSystem, PublicMethod } from "../resource/index";
import { useRouter } from "next/router";
import "./load.scss";

export default function Loading() {
  const { System, SystemDispatch } = useSystem();
  const router = useRouter();

  useEffect(() => {
    if (
      PublicMethod.checkValue(System.authority) &&
      PublicMethod.checkValue(System.factory.ip) &&
      PublicMethod.checkValue(System.factory.name) &&
      PublicMethod.checkValue(System.factory.uid) &&
      PublicMethod.checkValue(System.lang) &&
      PublicMethod.checkValue(System.token) &&
      PublicMethod.checkValue(System.system_uid)
    ) {
      SystemDispatch({ type: "isLoaded", value: true });
      router.push(localStorage.getItem("Route"));
    }
  }, [JSON.stringify(System)]);

  return (
    <div className="loading">
      <div className="loading-text">
        <span className="loading-text-words">L</span>
        <span className="loading-text-words">O</span>
        <span className="loading-text-words">A</span>
        <span className="loading-text-words">D</span>
        <span className="loading-text-words">I</span>
        <span className="loading-text-words">N</span>
        <span className="loading-text-words">G</span>
      </div>
    </div>
  );
}
