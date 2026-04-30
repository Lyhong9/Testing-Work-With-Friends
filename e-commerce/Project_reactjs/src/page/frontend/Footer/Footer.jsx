import React from "react";
import "./footer.css";
import { FaInstagram, FaFacebookF, FaXTwitter, FaPinterestP } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="background-footer">
      <div className="footer-card">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="brand-row">
              <div className="brand-icon">☕</div>
              <div>
                <h2>BrewHaven</h2>
                <span>SPECIALTY COFFEE MARKET</span>
              </div>
            </div>

            <h1>A warm coffee ritual, art-directed for modern shopping.</h1>

            <p>
              Shop small-batch roasts, cafe-inspired drinks, and seasonal
              favorites with a storefront designed to feel calm, tactile, and
              premium.
            </p>

            <div className="socials">
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaXTwitter /></a>
              <a href="#"><FaPinterestP /></a>
            </div>
          </div>

          <div className="footer-col">
            <h3>EXPLORE</h3>
            <a href="#">Home</a>
            <a href="#">Shop</a>
            <a href="#">About</a>
            <a href="#">Contact</a>
            <a href="#">Profile</a>
          </div>

          <div className="footer-col">
            <h3>CONTACT</h3>
            <p>88 Roast Street</p>
            <p>Bangkok, Thailand</p>
            <p>+66 555 0188</p>
            <p>hello@brewhaven.coffee</p>
          </div>

          <div className="newsletter">
            <h3>NEWSLETTER</h3>
            <p>Weekly drops, seasonal launches, and brewing inspiration.</p>

            <form>
              <input type="email" placeholder="Your email address" />
              <button type="submit">Join</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 BrewHaven Coffee. All rights reserved.</p>
          <p>Freshly roasted. Responsively crafted.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;