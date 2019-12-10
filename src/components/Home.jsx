import React, { useState } from "react";
import Nav from "./Nav";
import New from "./New"
import "./Home.css";

const TABS = [
    "New",
    "Trade"
]

function Home() {
  /* replace with router  */
  const [view, setView] = useState(TABS[0]);

  const getView = () => {
      switch(view){
          case TABS[0]: {
              return <New />
          }
      }
  }
    
  /*  */

  return (
    <div className="d-flex flex-column home mt-2 mx-auto">
      <Nav />
      {getView()}
    </div>
  );
}

export default Home;
