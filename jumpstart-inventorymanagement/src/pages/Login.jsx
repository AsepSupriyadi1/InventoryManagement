import { useContext, useEffect, useState } from "react";
import { Form, InputGroup, Row, Col, Button } from "react-bootstrap";
import "../style/login.css";
import { Logo } from "../assets/images/_images";
import { redirect, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import { loginAPI } from "../api/auth";

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoggedIn } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // -=-=-= ALERT -=-=-=-=
  const [error, setError] = useState({
    status: false,
    message: null,
  });

  // -=-=-= MODALS -=-=-=-=
  const [modalShow, setModalShow] = useState({
    status: false,
    message: null,
  });

  const handleLogin = (event) => {
    event.preventDefault();

    console.log(email, password);

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      const credentials = {
        email: email,
        password: password,
      };

      loginAPI(credentials, login, navigate, setError, setModalShow);
    }

    setValidated(true);
  };

  const [validated, setValidated] = useState(false);
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
  };

  useEffect(() => {
    if (isLoggedIn) navigate("/dashboard");
  }, []);

  return (
    <>
      <div className="login-form-container">
        <img src={Logo.logoIconDark} alt="contohLogo" />
        <div className="login-form">
          <h2 className="my-h2">Sign in to account</h2>
          <p>Enter your email & password to login</p>

          <Form noValidate validated={validated} onSubmit={handleLogin}>
            <Form.Group controlId="validationCustom01" className="mt-2">
              <Form.Label>Email Address</Form.Label>
              <Form.Control required type="email" placeholder="test@gmail.com" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="validationCustom02" className="mt-2">
              <Form.Label>Password</Form.Label>
              <Form.Control required type="password" placeholder="*******" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>

            <div className="text-end my-3 mb-0">
              <a href="">Forgot password ?</a>
            </div>

            <button type="submit" className="btn btn-primary mt-3 bg-01 w-100">
              Login
            </button>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
