import React from "react";
import "./AboutCss.css";
import { Heart, Coffee, Sparkles } from "lucide-react";

const AboutPage = () => {
  return (
    <section className="about-page">
      <div className="about-container">
        <div className="about-top">
          <div className="about-text">
            <span className="about-label">ABOUT BREWHAVEN</span>

            <h1>
              We built this store around the feeling of a great coffee moment
            </h1>

            <p>
              BrewHaven is a concept storefront for people who love warm design,
              strong coffee, and a smooth shopping flow.
            </p>

            <p>
              The experience combines specialty coffee energy with modern
              eCommerce patterns: helpful search, simple filtering, polished
              product cards, and a cozy visual language built around cream,
              espresso, and charcoal tones.
            </p>
          </div>

          <div className="about-image-card">
            <img
              src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=900&q=80"
              alt="Coffee table"
            />
          </div>
        </div>

        <div className="about-cards">
          <div className="about-card">
            <div className="about-icon">
              <Sparkles size={18} />
            </div>

            <h3>Morning-ready blends</h3>

            <p>
              Each roast is selected to feel balanced, comforting, and easy to
              brew at home.
            </p>
          </div>

          <div className="about-card">
            <div className="about-icon">
              <Coffee size={18} />
            </div>

            <h3>Thoughtful sourcing</h3>

            <p>
              We spotlight beans and flavor profiles that celebrate origin and
              seasonality.
            </p>
          </div>

          <div className="about-card">
            <div className="about-icon">
              <Heart size={18} />
            </div>

            <h3>Cafe-level comfort</h3>

            <p>
              From silky lattes to espresso staples, every product is chosen for
              delight.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
