import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import RotateLoader from "react-spinners/RotateLoader";
import { isAuthenticated, authenticate } from "../auth";
import { getUser, updateProfile } from "./actions";
import defaultAvatar from "../img/user.png";
import { MAX_IMAGE_FILESIZE } from "../CONSTANTS";

const baseUrl = process.env.REACT_APP_API_URL;

export class EditProfile extends Component {
    constructor() {
        super();
        this.state = {
            id: "",
            name: "",
            defaultName: "",
            email: "",
            defaultEmail: "",
            about: "",
            defaultAbout: "",
            password: "",
            photo: null,
            fileSize: 0,
            error: "",
            loading: false,
            redirectToLogin: false,
            redirectToProfile: false,
        };
    }

    componentDidMount() {
        this.userData = new FormData();
        const userId = this.props.match.params.userId;
        this.userData.set("id", userId);
        this.init(userId);
    }

    init = (userId) => {
        const token = isAuthenticated().token;
        getUser(userId, token)
            .then(({ data }) => {
                if (data.error) {
                    console.log(data.error);
                    this.setState({ redirectToLogin: true });
                } else {
                    console.log(data.user);
                    const { _id, name, email, about } = data.user;
                    this.setState({
                        id: _id,
                        defaultName: name,
                        defaultEmail: email,
                        defaultAbout: about,
                    });
                }
            })
            .catch((err) => {
                console.error(err);
                this.setState({ redirectToLogin: true });
            });
    };

    handleChange = (e) => {
        this.setState({ error: "" });

        let value, fileSize;
        if (e.target.name === "photo") {
            value = e.target.files[0];
            fileSize = value.size;
            this.setState({ fileSize });
            if (fileSize > MAX_IMAGE_FILESIZE) {
                console.log("fileSize:", this.state.fileSize);
                return this.setState({
                    error: `Image file size is too large. Maximum image size is 100MB. Please select another image`,
                });
            }
        } else {
            value = e.target.value;
            fileSize = 0;
        }

        this.userData.set(e.target.name, value);
        this.setState({ [e.target.name]: value, fileSize });
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

        const token = isAuthenticated().token;
        updateProfile(this.userData, token)
            .then((response) => {
                if (response.error) {
                    this.setState({ error: response.error, loading: false });
                } else {
                    authenticate({ ...response.data, token }, () => {
                        this.setState({ redirectToProfile: true, error: "" });
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

    editProfileForm = (name, email, about, password) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input
                    name="name"
                    onChange={this.handleChange}
                    type="text"
                    className="form-control"
                    placeholder={this.state.defaultName}
                    value={name}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input
                    name="email"
                    onChange={this.handleChange}
                    type="email"
                    className="form-control"
                    placeholder={this.state.defaultEmail}
                    value={email}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">About</label>
                <textarea
                    name="about"
                    onChange={this.handleChange}
                    type="text"
                    className="form-control"
                    placeholder={this.state.defaultAbout}
                    value={about}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Change Password</label>
                <input
                    name="password"
                    onChange={this.handleChange}
                    type="password"
                    className="form-control"
                    value={password}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Upload New Profile Pic</label>
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
                submit
            </button>
        </form>
    );

    render() {
        const {
            id,
            name,
            email,
            about,
            password,
            error,
            loading,
            redirectToLogin,
            redirectToProfile,
        } = this.state;

        if (redirectToLogin) return <Redirect to="/login" />;
        if (redirectToProfile) return <Redirect to={`/user/${id}`} />;

        const photoUrl = id ? `${baseUrl}/user/photo/${id}` : defaultAvatar;

        return (
            <>
                <div className="jumbotron">
                    <h2>Edit Profile</h2>
                    <p className="lead">edit your Gibble profile...</p>
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
                    <figure>
                        <img
                            src={photoUrl}
                            alt={name}
                            className="edit-form-image"
                        />
                        <figcaption className="text-muted">
                            <small>current profile photo</small>
                        </figcaption>
                    </figure>

                    {this.editProfileForm(name, email, about, password)}
                </div>
            </>
        );
    }
}

export default EditProfile;
