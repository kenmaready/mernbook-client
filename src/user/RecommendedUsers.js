import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth";
import { follow, getRecommendations } from "./actions";
import defaultAvatar from "../img/user.png";

const baseUrl = process.env.REACT_APP_API_URL;

export class RecommendedUsers extends Component {
    constructor() {
        super();
        this.state = { users: [], error: "", open: false, newFollow: "" };
    }

    componentDidMount() {
        if (isAuthenticated()) {
            const { token, user } = isAuthenticated();
            getRecommendations(user._id, token)
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

    handleFollow = (following, idx) => {
        const { token, user } = isAuthenticated();
        follow(following._id, user._id, token)
            .then(({ data }) => {
                if (data.error) {
                    this.setState({ error: data.error });
                } else {
                    let recommendations = this.state.users;
                    recommendations.splice(idx, 1);
                    this.setState({
                        users: recommendations,
                        open: true,
                        newFollow: following.name,
                    });
                }
            })
            .catch((err) => this.setState({ error: err }));
    };

    renderUsers = (users) => {
        console.log(users);
        return (
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
                            <button
                                onClick={() => this.handleFollow(u, idx)}
                                className="btn btn-raised btn-success btn-sm ml-2"
                            >
                                Follow
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    render() {
        const { users, open, newFollow, redirectToLogin } = this.state;

        return (
            <>
                <div className="jumbotron">
                    <h2>Recommended For You</h2>
                    <p className="lead">Some accounts you may want to follow</p>
                </div>
                <div>
                    {open && (
                        <p
                            className="alert alert-primary fade show text-muted"
                            role="alert"
                        >
                            You are now following {newFollow}
                        </p>
                    )}
                </div>
                <div className="container">{this.renderUsers(users)}</div>
            </>
        );
    }
}

export default RecommendedUsers;
