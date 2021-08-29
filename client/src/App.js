import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import './App.css';
import Home from "./pages/Home";
import Library from "./pages/Library";
import Navbar from "./components/Navbar/Navbar";

const client = new ApolloClient({
  request: (operation) => {
    const token = localStorage.getItem("id_token");

    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : "",
      },
    });
  },
  uri: "/graphql",
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/saved" component={Library} />
            <Route render={() => <h1 className="display-2 wrong-page">Woops, Wrong Page</h1>} />
          </Switch>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;