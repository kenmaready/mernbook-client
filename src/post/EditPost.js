import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import RotateLoader from "react-spinners/RotateLoader";
import { isAuthenticated } from "../auth";
import { getPost, updatePost } from "./actions";
import defaultPostImage from "../img/mountains.jpg";
import { MAX_IMAGE_FILESIZE } from "../CONSTANTS";

const baseUrl = process.env.REACT_APP_API_URL;

export class EditPost extends Component {
    constructor() {
        super();
        this.state = {
            id: "",
            title: "",
            body: "",
            fileSize: 0,
            user: {},
            error: "",
            loading: false,
            redirectToProfile: false,
        };
    }

    componentDidMount() {
        this.postData = new FormData();
        const postId = this.props.match.params.postId;
        this.init(postId);
    }

    init = (postId) => {
        this.setState({ loading: true });
        const { user, token } = isAuthenticated();
        getPost(postId, token)
            .then(({ data }) => {
                if (data.error) {
                    this.setState({ error: data.error });
                } else {
                    this.setState({
                        id: data.post._id,
                        title: data.post.title,
                        body: data.post.body,
                        user,
                        error: "",
                        loading: false,
                    });
                }
            })
            .catch((err) => this.setState({ error: err }));
    };

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
        updatePost(this.state.id, this.postData, token)
            .then((response) => {
                if (response.error) {
                    this.setState({ error: response.error, loading: false });
                } else {
                    console.log("New post:", response);
                    this.setState({
                        redirectToProfile: true,
                        error: "",
                        loading: false,
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

    editPostForm = (title, body) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Title</label>
                <input
                    name="title"
                    onChange={this.handleChange}
                    type="text"
                    className="form-control"
                    placeholder="a cool title"
                    value={title}
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
                <label className="text-muted">Change Photo</label>
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
                Update Post
            </button>
        </form>
    );

    render() {
        const {
            id,
            title,
            body,
            loading,
            error,
            user,
            redirectToProfile,
        } = this.state;

        if (redirectToProfile)
            return <Redirect to={`../../user/${user._id}`} />;

        const photoUrl = id ? `${baseUrl}/posts/image/${id}` : defaultPostImage;

        return (
            <>
                <div className="jumbotron">
                    <h2>Edit Post</h2>
                    <p className="lead">edit your post...</p>
                </div>
                <div
                    className="alert alert-primary fade show text-muted"
                    role="alert"
                    style={{ display: error ? "" : "none" }}
                >
                    {error}
                </div>
                {loading ? (
                    <div>
                        <RotateLoader size={12} color={"#36D7B7"} />
                        <h5>Loading...</h5>
                    </div>
                ) : (
                    <div className="container">
                        <figure>
                            <img
                                src={photoUrl}
                                alt="current post image"
                                className="edit-form-image"
                                onError={(i) =>
                                    (i.target.src = `${defaultPostImage}`)
                                }
                            />
                            <figcaption className="text-muted">
                                <small>current post image</small>
                            </figcaption>
                        </figure>

                        {this.editPostForm(title, body)}
                    </div>
                )}
            </>
        );
    }
}

export default EditPost;
