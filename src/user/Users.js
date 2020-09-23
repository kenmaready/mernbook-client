import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth";
import { getUsers } from "./actions";
import defaultAvatar from "../img/user.png";

const baseUrl = process.env.REACT_APP_API_URL;

export class Users extends Component {
    constructor() {
        super();
        this.state = { users: [], error: "" };
    }

    componentDidMount() {
        if (isAuthenticated()) {
            const token = isAuthenticated().token;
            getUsers(token)
                .then((response) => {
                    if (response.error) {
                        this.setState({ error: response.error });
                    } else {
                        this.setState({ users: response.data });
                    }
                })
                .catch((err) => console.log(err));
        }
    }

    renderUsers = (users) => (
        <div className="row">
            {users.map((u, idx) => (
                <div
                    className="card col-md-4 mb-4 user-card"
                    style={{ width: "18rem" }}
                    key={`user-${idx}`}
                >
                    <img
                        className="card-img-top mb-2 profile-pic"
                        src={`${baseUrl}/user/photo/${u._id}`}
                        onError={(i) => (i.target.src = `${defaultAvatar}`)}
                        alt={u.name}
                    />
                    <div className="card-body">
                        <h5 className="card-title">{u.name}</h5>
                        <p className="card-text">{u.email}</p>
                        <Link
                            className="btn btn-raised btn-info btn-sm"
                            to={`/user/${u._id}`}
                        >
                            View Profile
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );

    render() {
        const { users, redirectToLogin } = this.state;

        return (
            <>
                <div className="jumbotron">
                    <h2>Users</h2>
                    <p className="lead"></p>
                </div>
                <div className="container">{this.renderUsers(users)}</div>
            </>
        );
    }
}

export default Users;
