"use client";

import React from "react";
// import type { NextPage } from "next"; // Typ ist nicht notwendig, wenn nicht direkt verwendet
import { KairosApp } from "~~/components/kairos/KairosApp";

// <--- DIES IST DER KORREKTE PFAD!

const Home = () => {
  // Geändert von NextPage zu simpler Funktion
  return (
    <>
      <KairosApp />
    </>
  );
};

export default Home;
