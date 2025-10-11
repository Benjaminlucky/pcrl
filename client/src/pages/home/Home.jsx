import React from "react";
import Hero from "../../components/Hero";
import HomeRecognition from "../../components/HomeRecognition";
import HomeWhoWeAre from "../../components/HomeWhoWeAre";
import HomefoundersNote from "../../components/HomefoundersNote";
import HomeServices from "../../components/HomeServices";
import HomeChoose from "../../components/HomeChoose";
import Homereviews from "../../components/Homereviews";
import HomeConsultancy from "../../components/Homeconsultancy";
import HomeContact from "../../components/HomeContact";

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
        <div className="foundersNoteSection">
          <HomefoundersNote />
        </div>
        <div className="homeServicesSection">
          <HomeServices />
        </div>
        <div className="homeChooseSection">
          <HomeChoose />
        </div>
        <div className="homeReviewSection">
          <Homereviews />
        </div>
        <div className="homeConsultancySection">
          <HomeConsultancy />
        </div>
        <div className="homeContactSection">
          <HomeContact />
        </div>
      </div>
    </div>
  );
}

export default Home;
