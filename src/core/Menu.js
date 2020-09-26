import React from "react";
import { Link, withRouter } from "react-router-dom";
import { isAuthenticated, logout } from "../auth";

const isActive = (history, path) => {
    if (history.location.pathname === path) {
        return { color: "#ff9900" };
    } else return { color: "#ffffff" };
};

const Menu = ({ history }) => (
    <div>
        <ul className="nav nav-tabs bg-primary">
            <li className="nav-item">
                <Link
                    className="nav-link"
                    style={isActive(history, "/")}
                    to="/"
                >
                    Home
                </Link>
            </li>
            {!isAuthenticated() && (
                <>
                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            style={isActive(history, `/posts/new`)}
                            to={`/posts/new`}
                        >
                            Create New Post
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            style={isActive(history, "/signup")}
                            to="/signup"
                        >
                            Sign Up
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            style={isActive(history, "/login")}
                            to="/login"
                        >
                            Log In
                        </Link>
                    </li>
                </>
            )}

            {isAuthenticated() && (
                <>
                    <li>
                        <Link
                            className="nav-link"
                            style={isActive(history, "/users")}
                            to={"/users"}
                        >
                            All Users
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            style={isActive(history, `/users/recommended`)}
                            to={`/users/recommended`}
                        >
                            Who to Follow
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            className="nav-link"
                            style={isActive(history, `/posts/new`)}
                            to={`/posts/new`}
                        >
                            Create New Post
                        </Link>
                    </li>
                    <li>
                        <Link
                            className="nav-link"
                            style={isActive(
                                history,
                                `/user/${isAuthenticated().user._id}`
                            )}
                            to={`/user/${isAuthenticated().user._id}`}
                        >
                            {`My Profile`}
                        </Link>
                    </li>
                    {isAuthenticated().user.role === "admin" && (
                        <li>
                            <Link
                                className="nav-link"
                                to={"/admin"}
                                style={isActive(history, "/admin")}
                            >
                                admin
                            </Link>
                        </li>
                    )}
                    <li className="nav-item">
                        <span
                            className="btn btn-primary nav-link"
                            style={
                                (isActive(history, "/logout"),
                                { cursor: "pointer" })
                            }
                            onClick={() =>
                                logout(() => {
                                    history.push("/");
                                })
                            }
                            href="/"
                        >
                            Log Out
                        </span>
                    </li>
                </>
            )}
        </ul>
    </div>
);

export default withRouter(Menu);
