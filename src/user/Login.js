import React, { Component, Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import RotateLoader from "react-spinners/RotateLoader";
import SocialLogin from "./SocialLogin";
import { authenticate, login } from "../auth";

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            error: "",
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
        const { email, password } = this.state;
        const user = { email, password };
        login(user)
            .then(({ data }) => {
                console.log(data);
                if (data.error) {
                    this.setState({ error: data.error, loading: false });
                } else {
                    // authenticate user
                    authenticate(data, () => {
                        this.setState({ redirectToReferrer: true });
                    });
                    // redirect user
                }
            })
            .catch((err) => {
                this.setState({
                    error: err.response.data.error,
                    loading: false,
                });
            });
    };

    loginForm = (email, password) => (
        <form>
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
            <div className="row">
                <button
                    onClick={this.handleSubmit}
                    className="md-col-3 btn btn-raised btn-primary"
                >
                    submit
                </button>
            </div>
        </form>
    );

    render() {
        const {
            email,
            password,
            error,
            redirectToReferrer,
            loading,
        } = this.state;

        if (redirectToReferrer) {
            return <Redirect to="/" />;
        }

        return (
            <Fragment>
                <div className="jumbotron">
                    <h2>Login</h2>
                    <p className="lead">Log into your Gibble account...</p>
                </div>
                <div className="container">
                    <div
                        className="alert alert-primary fade show text-muted"
                        role="alert"
                        style={{ display: error ? "" : "none" }}
                    >
                        {this.state.error}
                    </div>
                    <div>
                        <RotateLoader
                            size={12}
                            color={"#36D7B7"}
                            loading={loading}
                        />
                        {loading && <h5>Loading...</h5>}
                    </div>
                    {this.loginForm(email, password)}
                    <SocialLogin />
                    <br />
                    Don't have an account yet? Sign up{" "}
                    <Link to="/signup">here</Link>. <br />
                    <br></br>
                    <small>
                        Forgot password? Click <Link to="/reset">here</Link>.
                    </small>
                </div>
            </Fragment>
        );
    }
}

export default Login;
