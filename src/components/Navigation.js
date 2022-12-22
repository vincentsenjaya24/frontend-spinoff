import axios from "../axios";
import React, { useRef, useState, useEffect } from "react";
import { Navbar, Button, Nav, NavDropdown, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { logout, resetNotifications } from "../features/userSlice";
import "./Navigation.css";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from '../images/SPINO_WHITE.png';


function Navigation() {
    const user = useSelector((state) => state.user);
   
    const [name, setName] = useState(null);
    const [id, setId] = useState(null);
    const dispatch = useDispatch();
    const bellRef = useRef(null);
    const notificationRef = useRef(null);
    const [bellPos, setBellPos] = useState({});
    useEffect(() => {
        axios.get(`/users/`).then(({ data }) => {
            setName(data.user);
        });
    }, []);
    function handleLogout() {
        dispatch(logout());
    }
    const unreadNotifications = user?.notifications?.reduce((acc, current) => {
        if (current.status == "unread") return acc + 1;
        return acc;
    }, 0);

    function handleToggleNotifications() {
        const position = bellRef.current.getBoundingClientRect();
        setBellPos(position);
        notificationRef.current.style.display = notificationRef.current.style.display === "block" ? "none" : "block";
        dispatch(resetNotifications());
        if (unreadNotifications > 0) axios.post(`/users/${user._id}/updateNotifications`);
    }

    return (
        <Navbar bg="transparent" expand="lg">
            <Container>
                <LinkContainer to="/">
                    <Navbar.Brand><img src={logo} alt="logo/img" class ="logo1"/></Navbar.Brand>
                    
                </LinkContainer>
                
                
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {/* if no user */}
                        {!user && (
                            <LinkContainer to="/login">
                                <Nav.Link>Login</Nav.Link>
                            </LinkContainer>
                        )}
                         {user && !user.isAdmin && (
                            <LinkContainer to="/new-product">
                                <Nav.Link>
                                    <button>Sell Urs!</button>
                                </Nav.Link>
                            </LinkContainer>
                           
                        )}
                          {user && !user.isAdmin && (
                            <LinkContainer to="/auction">
                            <Nav.Link>
                                <button>Auction</button>
                            </Nav.Link>
                        </LinkContainer>
                        )}
                        {user && !user.isAdmin && (
                            <LinkContainer to={`/joinraffle`}>
                            <Nav.Link>
                                <button>Raffle</button>
                                
                            </Nav.Link>
                        </LinkContainer>
                        )}

                        {user && user.isAdmin && (
                             <LinkContainer to="/raffle">
                             <Nav.Link>
                                 <button>Raffle</button>
                             </Nav.Link>
                         </LinkContainer>
                        )}
                       
                        {/* if user */}
                        {user && (
                            <>
                                <Nav.Link style={{ position: "relative" }} onClick={handleToggleNotifications}>
                                    <i className="fas fa-bell" ref={bellRef} data-count={unreadNotifications || null}></i>
                                </Nav.Link>
                                <NavDropdown title={`${user.email}`} id="basic-nav-dropdown">
                                    {user.isAdmin && (
                                        <>
                                            <LinkContainer to="/admin">
                                                <NavDropdown.Item>Dashboard</NavDropdown.Item>
                                            </LinkContainer>
                                            <LinkContainer to="/new-product">
                                                <NavDropdown.Item>Create Product</NavDropdown.Item>
                                            </LinkContainer>
                                        </>
                                    )}
                                    {!user.isAdmin && (
                                        <>
                                            <LinkContainer to="/cart">
                                                <NavDropdown.Item>Cart</NavDropdown.Item>
                                            </LinkContainer>
                                            <LinkContainer to="/orders">
                                                <NavDropdown.Item>My orders</NavDropdown.Item>
                                            </LinkContainer>
                                        </>
                                    )}

                                    <NavDropdown.Divider />
                                    <Button variant="danger" onClick={handleLogout} className="logout-btn">
                                        Logout
                                    </Button>
                                </NavDropdown>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
            {/* notifications */}
            <div className="notifications-container" ref={notificationRef} style={{ position: "absolute", top: bellPos.top + 30, left: bellPos.left, display: "none" }}>
                {user?.notifications.length > 0 ? (
                    user?.notifications.map((notification) => (
                        <p className={`notification-${notification.status}`}>
                            {notification.message}
                            <br />
                            <span>{notification.time.split("T")[0] + " " + notification.time.split("T")[1]}</span>
                        </p>
                    ))
                ) : (
                    <p>No notifcations yet</p>
                )}
            </div>
        </Navbar>
    );
}

export default Navigation;
