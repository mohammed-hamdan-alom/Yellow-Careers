import React from "react";
import { Hero } from "./Hero/Hero";
import { Navbar } from "../Navbar/Navbar";

/**
 * Renders the landing page of the application.
 */
const LandingPage = () => {
  return (
    <>
      <Navbar />
      <Hero />
    </>
  );
};

export default LandingPage;
