import React from "react";
import Hero from "../../components/Hero";
import HomeRecognition from "../../components/HomeRecognition";
import HomeWhoWeAre from "../../components/HomeWhoWeAre";

function Home() {
  return (
    <div className="home">
      <div className="homewrapper">
        <div className="heroSection">
          <Hero />
        </div>
        <div className="recognitionSection">
          <HomeRecognition />
        </div>
        <div className="whoWeAre">
          <HomeWhoWeAre />
        </div>
      </div>
    </div>
  );
}

export default Home;
