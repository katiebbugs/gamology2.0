import React, { useState, useEffect } from "react";
import { Jumbotron, Container, Row, Col, Card, CardColumns, Button } from "react-bootstrap";
import { useQuery, useMutation } from "@apollo/react-hooks";

import Auth from "../utils/auth";
import { GET_ME } from "../utils/queries";
import { REMOVE_GAME } from "../utils/mutations";
import { getMe, deleteGame } from "../utils/API";
import { removeGameId } from "../utils/localStorage";

const Library = () => {
  const { loading, data } = useQuery(GET_ME);
  const [removeGame, { error }] = useMutation(REMOVE_GAME);
  const userData = data?.me || {};
  const userDataLength = Object.keys(userData).length;

  const handleDeleteGame = async (gameId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await removeGame({ variables: { gameId: gameId } });
      removeGameId(gameId);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <Jumbotron className="jumbotron">
        <h1 className="header">Explore Your World</h1>
      </Jumbotron>

      <Container>
        <Row className="main-body">
          <Col xs={6} md={4} className="left-sidebar">

          </Col>

          <Col xs={12} md={8} className="right-sidebar">
            <Row>
              <h2> {userData.savedGames.length
                  ? `Viewing ${userData.savedGames.length} saved ${
                      userData.savedGames.length === 1 ? "game" : "games"
                    }:`
                  : "Looks like your library is empty"}
              </h2>
            </Row>

            <Row>
              <CardColumns>
                {userData.savedGames.map((game) => {
                  return (
                    <Card key={game.gameId} border="dark">
                      {game.image ? (
                        <Card.Img
                          src={game.image}
                          alt={`The cover for ${game.title}`}
                          variant="top"
                        />
                      ) : null}
                      <Card.Body>
                        <Card.Title>{game.title}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                          Genre: {game.genres}
                        </Card.Subtitle>
                        <Card.Text className="small">{game.description}</Card.Text>
                        <Button className="btn-block btn-danger" onClick={() => handleDeleteGame(game.gameId)}>
                          Remove Game
                        </Button>
                      </Card.Body>
                    </Card>
                  );
                })}
              </CardColumns>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Library;