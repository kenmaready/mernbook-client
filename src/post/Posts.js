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
        this.state = { posts: [], page: 1, loading: false, error: "" };
    }

    componentDidMount() {
        this.loadPosts(this.state.page);
    }

    loadPosts = (page) => {
        if (isAuthenticated()) {
            this.setState({ loading: true });
            const token = isAuthenticated().token;
            getPosts(page, token)
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
    };

    loadNext = (n) => {
        const newPage = this.state.page + n;
        this.setState({ page: newPage });
        this.loadPosts(newPage);
    };

    loadPrevious = (n) => {
        const newPage = this.state.page - n;
        this.setState({ page: newPage });
        this.loadPosts(newPage);
    };

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
        const { posts, loading, page, redirectToLogin } = this.state;

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
                        <h3 className="text-primary">
                            {!posts.length ? "No more posts" : "Recent posts:"}
                        </h3>
                        <div className="container">
                            {this.renderPosts(posts)}
                        </div>
                    </>
                )}
                {page > 1 ? (
                    <button
                        className="btn btn-raised btn-primary btn-sm mr-1 mt-1 mb-1"
                        onClick={() => this.loadPrevious(1)}
                    >
                        previous
                    </button>
                ) : (
                    ""
                )}
                {posts.length ? (
                    <button
                        className="btn btn-raised btn-primary btn-sm mr-1 mt-1 mb-1"
                        onClick={() => this.loadNext(1)}
                    >
                        next
                    </button>
                ) : (
                    ""
                )}
            </div>
        );
    }
}

export default Posts;
