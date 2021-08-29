import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useMutation } from "@apollo/react-hooks";

import { ADD_USER } from "../../utils/mutations";

import Auth from "../../utils/auth";

const SignupForm = () => {
  const [userFormData, setUserFormData] = useState({ username: "", email: "", password: "" });
  const [addUser, { error }] = useMutation(ADD_USER);
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const { data } = await addUser({
        variables: { ...userFormData },
      });

      Auth.login(data.addUser.token);
    } catch (err) {
      console.error(err);
      setShowAlert(true);
    }

    setUserFormData({
      username: "",
      email: "",
      password: "",
    });
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert}variant="warning">
          Unable to Sign Up, Try Again
        </Alert>

        <Form.Group>
          <Form.Label htmlFor="username">
            Username
          </Form.Label>
          <Form.Control type="text" placeholder="Your username" name="username" onChange={handleInputChange} value={userFormData.username} required/>
          <Form.Control.Feedback type="invalid">
            Please provide a username
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="email">Email</Form.Label>
          <Form.Control type="email" placeholder="Your email" name="email" onChange={handleInputChange} value={userFormData.email} required/>
          <Form.Control.Feedback type="invalid">
            Please provide an email
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="password">
            Password
          </Form.Label>
          <Form.Control type="password" placeholder="Your password" name="password" onChange={handleInputChange} value={userFormData.password} required/>
          <Form.Control.Feedback type="invalid">
            Please provide an password
          </Form.Control.Feedback>
        </Form.Group>
        
        <Button disabled={!( userFormData.username && userFormData.email && userFormData.password )} type="submit" variant="info">
          Submit
        </Button>
      </Form>
    </>
  );
};

export default SignupForm;