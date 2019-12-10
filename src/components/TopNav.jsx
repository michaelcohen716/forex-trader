import React from "react";
import "./Nav.css";

function TopNav() {
  return (
    <div className="top-nav mx-auto mt-3 mb-2 d-flex justify-content-end">
      <div className="dropdown account">
        <button className="dropbtn"></button>
        <div className="dropdown-content">
          <div className="d-flex flex-column">
            <div>
                0x48nbf389h44
            </div>
        </div>  
        </div>
      </div>
    </div>
  );
}

export default TopNav;
