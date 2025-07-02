import React from "react";
import "../styles/About.css";
import Logo from "../images/Logo.png"; 
import LogoPT from "../images/logo-pt.png"; 

const About = () => {
  return (
    <div className="about-container">
      {/* Section 1 */}
      {/* Section 1 */}
      <div className="about-card blue-background">
        <div className="about-text">
          <h2 className="about-title">News portal website</h2>
          <p>
            <strong>News Portal</strong> is not just about delivering news but providing in-depth perspectives, sharp analysis, and reliable facts through a combination of cutting-edge technology and data-driven journalism, ensuring that every piece of information you read is relevant, accurate, and valuable because here, news is not just information, but the key to understanding the world.
          </p>
        </div>
        <div className="about-image">
          <img src={Logo} alt="News Portal Logo 1" className="logo-1" />
        </div>
      </div>

      {/* Section 2 */}
      <div className="about-card blue-background reverse-layout">
        <div className="about-image">
          <img src={LogoPT} alt="News Portal Logo 2" className="logo-2" />
        </div>
        <div className="about-text">
          <h2 className="about-title">PT. Winnicode Garuda Teknologi</h2>
          <p>
            <strong>PT. Winnicode Garuda Teknologi</strong> is a company engaged in media publication and digital services. Founded in 2020 in Bandung, the company focuses on providing news, articles, and innovative digital solutions. Committed to delivering high-quality information, Winnicode supports digital transformation and human resource development in the field of journalism.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
