import React, { Component, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import RotateLoader from "react-spinners/RotateLoader";
import { authenticate, signup } from "../auth";

class Signup extends Component {
    constructor() {
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            error: "",
            open: false,
            redirectToReferrer: false,
            loading: false,
        };
    }

    handleChange = (e) => {
        this.setState({ error: "" });
        this.setState({ [e.target.name]: e.target.value });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({ loading: true });
        const { name, email, password } = this.state;
        const user = { name, email, password };
        signup(user)
            .then(({ data }) => {
                console.log(data);
                if (data.error) {
                    this.setState({ error: data.error, loading: false });
                } else
                    authenticate(data, () => {
                        this.setState({ redirectToReferrer: true, error: "" });
                    });
            })
            .catch((err) => {
                this.setState({
                    error: err.response.data.error,
                    loading: false,
                });
            });
    };

    signupForm = (name, email, password) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input
                    name="name"
                    onChange={this.handleChange}
                    type="text"
                    className="form-control"
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
                    value={email}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Password</label>
                <input
                    name="password"
                    onChange={this.handleChange}
                    type="password"
                    className="form-control"
                    value={password}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">
                    Upload a Profile Pic (optional)
                </label>
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
            name,
            email,
            password,
            error,
            open,
            redirectToReferrer,
            loading,
        } = this.state;

        if (redirectToReferrer) {
            return <Redirect to="/" />;
        }

        return (
            <Fragment>
                <div className="jumbotron">
                    <h2>Signup</h2>
                    <p className="lead">Sign up for Gibble...</p>
                </div>
                <div className="container">
                    <div
                        className="alert alert-primary fade show text-muted"
                        role="alert"
                        style={{ display: error ? "" : "none" }}
                    >
                        {this.state.error}
                    </div>
                    <div
                        className="alert alert-info"
                        style={{ display: open ? "" : "none" }}
                    >
                        Welcome to Gibble! Your account has been successfully
                        created. You may login and start gibbling.
                    </div>
                    <div>
                        <RotateLoader
                            size={12}
                            color={"#36D7B7"}
                            loading={loading}
                        />
                        {loading && <h5>Loading...</h5>}
                    </div>
                    {this.signupForm(name, email, password)}
                    Already have an account? Log in{" "}
                    <Link to="/login">here</Link>.
                </div>
            </Fragment>
        );
    }
}

export default Signup;
