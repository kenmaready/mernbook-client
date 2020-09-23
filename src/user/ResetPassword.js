import React, { Component } from "react";
import { resetPassword } from "../auth";

export class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newPassword: "",
            message: "",
            error: "",
        };
    }

    handleChange = (e) => {
        this.setState({ newPassword: e.target.value, message: "", error: "" });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this.setState({ error: "", message: "" });
        const resetPasswordLink = this.props.match.params.token;
        const { newPassword } = this.state;

        if (newPassword.length < 6 || !/\d/.test(newPassword)) {
            this.setState({
                error:
                    "New password must be at least 6 characters long and must contain at least one number.",
            });
            return false;
        }

        resetPassword(resetPasswordLink, this.state.newPassword)
            .then(({ data }) => {
                if (data.error) {
                    this.setState({ error: data.error });
                } else {
                    this.setState({ message: data.message });
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
        const { newPassword, message, error } = this.state;

        return (
            <>
                <div className="jumbotron">
                    <h2>Password Reset</h2>
                    <p className="lead">Enter a new password below</p>
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
                                type="password"
                                className="form-control"
                                placeholder="your new password"
                                value={newPassword}
                                name="newPassword"
                                onChange={this.handleChange}
                                autoFocus
                            />
                        </div>
                        <button
                            className="btn btn-raised btn-primary mt-1"
                            onClick={this.handleSubmit}
                        >
                            Reset Password
                        </button>
                    </form>
                </div>
            </>
        );
    }
}

export default ResetPassword;
