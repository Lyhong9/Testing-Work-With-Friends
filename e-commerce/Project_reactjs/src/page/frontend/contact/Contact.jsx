import React from "react";
import "./contact.css";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const Contact = () => {
  return (
    <section className="contact-page">
      <div className="contact-container">
        {/* LEFT SIDE */}
        <div className="contact-left">
          <span className="contact-label">CONTACT</span>

          <h1>We would love to hear about your next coffee order</h1>

          <p>
            Reach out about orders, gifting, wholesale ideas, or brewing
            questions.
          </p>

          <div className="contact-info-list">
            {/* EMAIL */}
            <div className="contact-card">
              <div className="contact-icon">
                <Mail size={16} />
              </div>

              <div>
                <h4>Email</h4>
                <span>Vothanarern@gmail.com</span>
              </div>
            </div>

            {/* PHONE */}
            <div className="contact-card">
              <div className="contact-icon">
                <Phone size={16} />
              </div>

              <div>
                <h4>Phone</h4>
                <span>+855 16 555 637</span>
              </div>
            </div>

            {/* ADDRESS */}
            <div className="contact-card">
              <div className="contact-icon">
                <MapPin size={16} />
              </div>

              <div>
                <h4>Visit</h4>
                <span>Phnom Penh</span>
              </div>
            </div>

            {/* HOURS */}
            <div className="contact-card">
              <div className="contact-icon">
                <Clock size={16} />
              </div>

              <div>
                <h4>Hours</h4>
                <span>Daily, 7:00 AM to 7:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="contact-form-card">
          <h2>Send a message</h2>

          <p>
            This frontend keeps the form on the client side, so it is ready for
            your backend or API hookup later.
          </p>

          <form className="contact-form">
            <div className="input-row">
              <div className="input-group">
                <label>Name</label>

                <input type="text" placeholder="Your name" />
              </div>

              <div className="input-group">
                <label>Email</label>

                <input type="email" placeholder="Your email" />
              </div>
            </div>

            <div className="input-group">
              <label>Message</label>

              <textarea rows="5" placeholder="Write your message..."></textarea>
            </div>

            <button type="submit">Send Message</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
