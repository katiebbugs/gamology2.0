import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import SearchGames from "./pages/SearchGames";
import SavedGames from "./pages/SavedGames";
import Navbar from "./components/Navbar";

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
            <Route exact path="/" component={SearchGames} />
            <Route exact path="/saved" component={SavedGames} />
            <Route render={() => <h1 className="display-2">Woops, Wrong Page</h1>} />
          </Switch>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;