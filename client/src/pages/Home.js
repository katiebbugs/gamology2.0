import React, { useState, useEffect } from "react";
import { Jumbotron, Container, Row, Col, InputGroup, FormControl, Form, ButtonGroup, Button, Card, CardColumns } from "react-bootstrap";

import Auth from "../utils/auth";
import { saveGame, searchGames } from "../utils/API";
import { saveGameIds, getSavedGameIds } from "../utils/localStorage";
import { useMutation } from "@apollo/react-hooks";
import { SAVE_GAME } from "../utils/mutations";

const Home = () => {
  const [searchedGames, setSearchedGames] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [saveGame, { error }] = useMutation(SAVE_GAME);
  const [savedGameIds, setSavedGameIds] = useState(getSavedGameIds());

  useEffect(() => {
    return () => saveGameIds(savedGameIds);
  });

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGames(searchInput);

      if (!response.ok) {
        throw new Error("Woops, something broke");
      }

      const { items } = await response.json();

      const gameData = items.map((game) => ({
        gameId: game.id,
        genres: game.volumeInfo.genres || ["No Genre Linked"],
        title: game.volumeInfo.title,
        description: game.volumeInfo.description,
        image: game.volumeInfo.imageLinks?.thumbnail || "",
      }));

      setSearchedGames(gameData);
      setSearchInput("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveGame = async (gameId) => {
    const gameToSave = searchedGames.find((game) => game.gameId === gameId);
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await saveGame({
        variables: { body: gameToSave },
      });

      setSavedGameIds([...savedGameIds, gameToSave.gameId]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Jumbotron className="jumbotron">
        <h1 className="header">Explore a New World</h1>
      </Jumbotron>

      <Container>
        <Row className="main-body">
          <Col xs={6} md={4} className="left-sidebar">
            <Row className="search-section">
              <Form onSubmit={handleFormSubmit}>
                <InputGroup className="mb-3">
                  <Form.Control name="searchInput" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} type="text" placeholder="Search Game Title"/>
                  <Button type="submit" variant="info">
                      Search
                  </Button>
                </InputGroup>
              </Form>
            </Row>

            <Row className="genre-section">
              <ButtonGroup vertical lassName="d-grid gap-2">
                <Button variant="outline-secondary">Action-Adventure</Button>
                <Button variant="outline-secondary">Strategy</Button>
                <Button variant="outline-secondary">Platformers</Button>
                <Button variant="outline-secondary">Party Games</Button>
                <Button variant="outline-secondary">Shooters (FPS and TPS)</Button>
                <Button variant="outline-secondary">Multiplayer Online Battle Arena (MOBA)</Button>
              </ButtonGroup>
            </Row>
          </Col>

          <Col xs={12} md={8} className="right-sidebar">
            <Row className="searched-games">
              <CardColumns>
                {searchedGames.map((game) => {
                  return (
                    <Card key={game.gameId} border="dark" className="game-card">
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
                        {Auth.loggedIn() && (
                          <Button disabled={savedGameIds?.some((savedGameId) => savedGameId === game.gameId)} className="btn-block btn-info" onClick={() => handleSaveGame(game.gameId)}>
                            {savedGameIds?.some((savedGameId) => savedGameId === game.gameId)
                              ? "This game has already been added"
                              : "Add Game to Library"}
                          </Button>
                        )}
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

export default Home;