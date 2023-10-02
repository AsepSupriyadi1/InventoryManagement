import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Link, useNavigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import { HeaderPic, Logo } from "../assets/images/_images";
import { Col, Dropdown, DropdownButton, Row } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth-context";
import { LogoutApi } from "../api/auth";

const Header = () => {
  const userCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutHandler = () => {
    LogoutApi(userCtx.token)
      .then(() => {
        userCtx.logout();
        navigate("/login");
      })
      .catch(() => {
        alert("Error Occured");
      });
  };

  return (
    <>
      <Navbar expand="lg" data-bs-theme="dark" className="bg-body-tertiary" style={{ backgroundColor: "#31322D" }}>
        <Container>
          <Navbar.Brand href="/dashboard">
            <img src={Logo.logoIconWhite} alt="" className="logo-head me-2" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link>
                <Link className="link-light text-secondary" to="/dashboard">
                  Dashboard
                </Link>
              </Nav.Link>

              {userCtx.currentUser.userRole === "SUPER_ADMIN" && (
                <>
                  <Nav.Link>
                    <Link to="/all-users" className="link-light text-secondary">
                      Users
                    </Link>
                  </Nav.Link>

                  <NavDropdown title="Product" data-bs-theme="light">
                    <NavDropdown.Item>
                      <Link to="/all-products" className="text-decoration-none text-secondary">
                        All Products
                      </Link>
                    </NavDropdown.Item>
                    <NavDropdown.Item>
                      <Link to="/all-categories" className="text-decoration-none  text-secondary">
                        All Category
                      </Link>
                    </NavDropdown.Item>
                    <NavDropdown.Item>
                      <Link to="/all-stocks" className="text-decoration-none  text-secondary">
                        Stocks
                      </Link>
                    </NavDropdown.Item>
                  </NavDropdown>
                  <Nav.Link>
                    <Link to="/all-suppliers" className="link-light text-secondary">
                      Supplier
                    </Link>
                  </Nav.Link>
                  <Nav.Link>
                    <Link to="/all-outlets" className="link-light text-secondary">
                      Outlets
                    </Link>
                  </Nav.Link>
                </>
              )}

              <Nav.Link>
                <Link to="/all-stocks" className="link-light text-secondary">
                  Stocks
                </Link>
              </Nav.Link>

              <Nav.Link>
                <Link to="/all-customers" className="link-light text-secondary">
                  Customer
                </Link>
              </Nav.Link>
              <NavDropdown title="Transactions" data-bs-theme="light">
                <NavDropdown.Item>
                  <Link to="/all-purchases" className="text-decoration-none text-secondary">
                    All Purchases
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <Link to="/all-transactions" className="text-decoration-none  text-secondary">
                    All Transactions
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <Link to="/all-stocks" className="text-decoration-none  text-secondary">
                    Stocks
                  </Link>
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Dropdown data-bs-theme="light">
              <Dropdown.Toggle className="navbar__dropdown-btn fw-normal">
                <img src={HeaderPic.defaultPicture} alt="" className="profile-picture me-2" /> {userCtx.currentUser.fullName.split(" ")[0]}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item>
                  <p className="p-0 m-0">{userCtx.currentUser.fullName}</p>
                </Dropdown.Item>
                <Dropdown.Item href="#/action-2">Profile</Dropdown.Item>
                <Dropdown.Item onClick={logoutHandler}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
