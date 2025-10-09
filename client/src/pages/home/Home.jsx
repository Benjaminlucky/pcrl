import React from "react";
import Hero from "../../components/Hero";
import HomeRecognition from "../../components/HomeRecognition";

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
      </div>
    </div>
  );
}

export default Home;
