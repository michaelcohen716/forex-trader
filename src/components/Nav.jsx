import React from "react";
import "./Nav.css";

function Nav() {
  return (
    <nav className="d-flex justify-content-around nav px-4 py-3">
      <div className="nav-item">New</div>
      <div className="nav-item nav-item-inactive">Trade</div>
    </nav>
  );
}

export default Nav;
