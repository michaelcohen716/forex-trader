import React, { useState } from "react";
import Nav from "./Nav";
import New from "./New/New";
import Trade from "./Trade/Trade";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { Route } from "react-router";
import "./Home.css";

function RouterComponent() {
  return (
    <Router>
      <Nav />
      <Switch>
        <Route exact path="/" component={New} />
        <Route exact path="/trade" component={Trade} />
      </Switch>
    </Router>
  );
}

function Home() {
  return (
    <div className="d-flex flex-column home mt-2 mx-auto">
      <RouterComponent />
    </div>
  );
}

export default Home;
