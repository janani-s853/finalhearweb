import React from "react";
import Timeline from "./timeline";
import TeamSection from "./teams";
import "./about.css";
import Footer from "../components/footer";

const AboutUs = () => {
  return (
    <div className="about-us-page">
      {/* Only timeline, team, and footer remain */}
      <Timeline />
      <TeamSection />
      <Footer />
    </div>
  );
};

export default AboutUs;
