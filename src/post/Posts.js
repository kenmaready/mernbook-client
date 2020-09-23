import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import RotateLoader from "react-spinners/RotateLoader";
import { isAuthenticated } from "../auth";
import { getPosts } from "./actions";
import defaultPostImage from "../img/mountains.jpg";

const baseUrl = process.env.REACT_APP_API_URL;

export class Posts extends Component {
    constructor() {
        super();
        this.state = { posts: [], loading: false, error: "" };
    }

    componentDidMount() {
        if (isAuthenticated()) {
            this.setState({ loading: true });
            const token = isAuthenticated().token;
            getPosts(token)
                .then((response) => {
                    if (response.error) {
                        this.setState({ error: response.error });
                    } else {
                        this.setState({
                            posts: response.data.posts,
                            loading: false,
                            error: false,
                        });
                    }
                })
                .catch((err) => console.log(err));
        }
    }

    renderPosts = (posts) => (
        <div className="row">
            {posts.map((p, idx) => {
                const posterProfile = p.owner ? `/user/${p.owner._id}` : "";
                const posterName = p.owner ? p.owner.name : "unknown";
                return (
                    <div
                        className="card col-md-4 mb-4 user-card"
                        style={{ width: "18rem" }}
                        key={`post-${idx}`}
                    >
                        <img
                            className="card-img-top"
                            src={`${baseUrl}/posts/image/${p._id}`}
                            alt={p.title}
                            onError={(i) =>
                                (i.target.src = `${defaultPostImage}`)
                            }
                        />
                        <div className="card-body">
                            <h5 className="card-title">{p.title}</h5>
                            <p className="card-text">
                                {p.body.substring(0, 60)}...
                            </p>
                            <br />
                            <p className="font-italic text-sm">
                                Posted by{" "}
                                <Link to={posterProfile}>{posterName}</Link> on{" "}
                                {new Date(p.createdAt).toDateString()}
                            </p>
                            <Link
                                className="btn btn-raised btn-info btn-sm"
                                to={`/posts/${p._id}`}
                            >
                                View Post
                            </Link>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    render() {
        const { posts, loading, redirectToLogin } = this.state;

        return (
            <div className="container">
                {loading ? (
                    <div className="jumbotron text-center">
                        <div>
                            <RotateLoader size={12} color={"#36D7B7"} />
                            <h3 className="text-primary">Loading...</h3>
                        </div>
                    </div>
                ) : (
                    <>
                        <h3 className="text-primary">Posts:</h3>
                        <div className="container">
                            {this.renderPosts(posts)}
                        </div>
                    </>
                )}
            </div>
        );
    }
}

export default Posts;
