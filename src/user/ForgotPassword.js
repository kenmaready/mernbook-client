import React, { Component } from "react";
import { forgotPassword } from "../auth";

export class ForgotPassword extends Component {
    state = { email: "", message: "", error: "" };

    handleChange = (e) => {
        this.setState({ email: e.target.value, message: "", error: "" });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({ message: "", error: "" });

        forgotPassword(this.state.email)
            .then(({ data, error }) => {
                console.log(data);
                if (error) {
                    this.setState({ error: error });
                } else {
                    this.setState({ message: data.message, email: "" });
                }
            })
            .catch((err) => {
                if (
                    err.response &&
                    err.response.data &&
                    err.response.data.message
                ) {
                    this.setState({ error: err.response.data.message });
                } else {
                    this.setState({ error: err.message });
                }
            });
    };

    render() {
        const { email, message, error } = this.state;

        return (
            <>
                <div className="jumbotron">
                    <h2>Password Reset</h2>
                    <p className="lead">
                        Enter the email for your account below and submit to
                        reset your password
                    </p>
                </div>
                <div className="container">
                    {message && (
                        <div
                            className="alert alert-primary fade show text-muted"
                            role="alert"
                        >
                            <p>{message}</p>
                        </div>
                    )}
                    {error && (
                        <div
                            className="alert alert-danger fade show text-muted"
                            role="alert"
                        >
                            <p>{error}</p>
                        </div>
                    )}
                    <form>
                        <div className="form-group mt-1">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="your email address"
                                value={email}
                                name="email"
                                onChange={this.handleChange}
                                autoFocus
                            />
                            <button
                                className="btn btn-raised btn-primary mt-1"
                                onClick={this.handleSubmit}
                            >
                                Send Me the Reset Link
                            </button>
                        </div>
                    </form>
                </div>
            </>
        );
    }
}

export default ForgotPassword;
