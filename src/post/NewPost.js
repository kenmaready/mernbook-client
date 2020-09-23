import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import RotateLoader from "react-spinners/RotateLoader";
import { isAuthenticated, authenticate } from "../auth";
import { createPost } from "./actions";
import { MAX_IMAGE_FILESIZE } from "../CONSTANTS";

const baseUrl = process.env.REACT_APP_API_URL;

export class NewPost extends Component {
    constructor() {
        super();
        this.state = {
            title: "",
            body: "",
            photo: null,
            fileSize: 0,
            user: {},
            error: "",
            loading: false,
            redirectToLogin: false,
            redirectToProfile: false,
        };
    }

    componentDidMount() {
        this.postData = new FormData();
        this.setState({ user: isAuthenticated().user });
    }

    handleChange = (e) => {
        this.setState({ error: "" });

        let value;
        if (e.target.name === "photo") {
            value = e.target.files[0];
            const fileSize = value.size;
            this.setState({ fileSize });
            if (fileSize > MAX_IMAGE_FILESIZE) {
                console.log("fileSize:", this.state.fileSize);
                return this.setState({
                    error: `Image file size is too large. Maximum image size is 100MB. Please select another image`,
                });
            }
        } else {
            value = e.target.value;
        }

        this.postData.set(e.target.name, value);
        this.setState({ [e.target.name]: value });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.fileSize > MAX_IMAGE_FILESIZE) {
            console.log("fileSize:", this.state.fileSize);
            return this.setState({
                error: `Image file size is too large. Maximum image size is 100MB. Please select another image.`,
            });
        }

        this.setState({ loading: true });
        const { user, token } = isAuthenticated();
        createPost(this.postData, user._id, token)
            .then((response) => {
                if (response.error) {
                    this.setState({ error: response.error, loading: false });
                } else {
                    console.log("New post:", response);
                    this.setState({
                        redirectToProfile: true,
                        error: "",
                        loading: false,
                        redirectToProfile: true,
                    });
                }
            })
            .catch((err) => {
                this.setState({
                    error: err.response.data.error,
                    loading: false,
                });
            });
    };

    newPostForm = (title, body) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Title</label>
                <input
                    name="title"
                    onChange={this.handleChange}
                    type="text"
                    className="form-control"
                    placeholder="a cool title"
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Body</label>
                <textarea
                    name="body"
                    onChange={this.handleChange}
                    type="body"
                    className="form-control"
                    placeholder="your amazing post"
                    value={body}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Optional Photo</label>
                <input
                    name="photo"
                    onChange={this.handleChange}
                    type="file"
                    accept="image/*"
                    className="form-control"
                />
            </div>
            <button
                onClick={this.handleSubmit}
                className="btn btn-raised btn-primary"
            >
                Create Post
            </button>
        </form>
    );

    render() {
        const {
            title,
            body,
            photo,
            user,
            error,
            loading,
            redirectToLogin,
            redirectToProfile,
        } = this.state;

        // if (redirectToLogin) return <Redirect to="/login" />;
        if (redirectToProfile) return <Redirect to={`/user/${user._id}`} />;

        // const photoUrl = id ? `${baseUrl}/user/photo/${id}` : defaultAvatar;

        return (
            <>
                <div className="jumbotron">
                    <h2>Create New Post</h2>
                    <p className="lead">Share that hot take...</p>
                </div>
                <div className="container">
                    <div
                        className="alert alert-primary fade show text-muted"
                        role="alert"
                        style={{ display: error ? "" : "none" }}
                    >
                        {error}
                    </div>
                    <div>
                        <RotateLoader
                            size={12}
                            color={"#36D7B7"}
                            loading={loading}
                        />
                        {loading && <h5>Loading...</h5>}
                    </div>

                    {this.newPostForm(title, body)}
                </div>
            </>
        );
    }
}

export default NewPost;
