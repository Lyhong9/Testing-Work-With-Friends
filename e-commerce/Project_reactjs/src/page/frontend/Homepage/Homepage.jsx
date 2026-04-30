import React from "react";
import "./Homepage.css";
import background from "../../../../public/pic_coffe/background.webp";
import menuTwo from "../../../../public/pic_coffe/menu-two.jpg";
import BodyHomepage from "../container/BodyHomepage";
const Homepage = () => {
  return (
    <section className="hero mt-3">
      <img className="hero-bg" src={background} alt="Coffee background" />

      <div className="hero-overlay"></div>

      <div className="hero-content">
        <div className="hero-left">
          <h1>
            beautifully plated <br />
            cafe moment.
          </h1>

          <p>
            BrewHaven blends small-batch beans, barista-style drinks, and warm
            editorial design into a storefront that feels premium from first
            glance to final checkout.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn">Shop Collection</button>
            <button className="outline-btn">Discover the Story</button>
          </div>

          <div className="tags">
            <span>Velvet crema</span>
            <span>Dark cherry finish</span>
            <span>Low-acid roast</span>
          </div>

          <div className="stats">
            <div>
              <h3>120+</h3>
              <p>Weekly orders</p>
            </div>
            <div>
              <h3>4.9/5</h3>
              <p>Happy coffee lovers</p>
            </div>
            <div>
              <h3>24h</h3>
              <p>Roast-to-ship window</p>
            </div>
          </div>
        </div>

        <div className="hero-right">
          {/* <img className="floating-img" src={menuTwo} alt="Coffee cups" /> */}

          <div className="product-card">
            <p className="small-title">SIGNATURE ROAST</p>
            <h2>Roaster&apos;s Reserve Beans</h2>
            <p className="desc">
              Dark cherry, cacao nib, and toasted almond in a roast made for
              slow, elegant mornings.
            </p>

            <div className="product-grid">
              <div>
                <span>ROAST PROFILE</span>
                <strong>Medium-dark</strong>
              </div>
              <div>
                <span>BEST FOR</span>
                <strong>Espresso + Pour-over</strong>
              </div>
              <div>
                <span>ORIGIN</span>
                <strong>Huehuetenango</strong>
              </div>
            </div>

            <button className="cream-btn">View featured roast</button>
          </div>
        </div>
      </div>
      <BodyHomepage />
    </section>

  );
};

export default Homepage;  