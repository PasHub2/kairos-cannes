"use client";

import React from "react";
import type { NextPage } from "next";
import { KairosApp } from "~~/components/kairos/KairosApp";

const Home: NextPage = () => {
  return (
    <div className="flex items-center justify-center flex-grow p-4">
      <KairosApp />
    </div>
  );
};

export default Home;
