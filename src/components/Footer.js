import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";

function Footer() {
  return (
    <footer className="bg-dark text-light py-3">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <p className="copy">
              &copy; {new Date().getFullYear()} Designed and Developed By
              Mahmudul Islam.
            </p>
          </div>
          <div className="col-md-6 text-end">
            <ul className="footer-social">
              <li>
                <a href="£" className="text-light me-3">
                  Connect With Me:
                </a>
              </li>
              <li>
                <a
                  href="https://www.upwork.com/freelancers/~01f6ff1acd0f51d567"
                  className="text-light me-3"
                >
                  Upwork
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/mohammad-mahmudul/"
                  className="text-light me-3"
                >
                  linkedin
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
