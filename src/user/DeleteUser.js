import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated, logout } from "../auth";
import { deleteUser } from "./actions";

export class DeleteUser extends Component {
    constructor() {
        super();
        this.state = {
            show: false,
            redirectToHome: false,
        };
    }

    handleDelete = () => {
        const userId = this.props.userId;
        const token = isAuthenticated().token;
        deleteUser(userId, token)
            .then((response) => {
                console.log(response);
                if (response.error) {
                    console.log(response.error);
                } else {
                    logout(() => true);
                    this.setState({ redirectToHome: true });
                }
            })
            .catch((err) => console.log(err));
    };

    dismissModal = (e) => {
        this.setState({ show: false });
    };

    showModal = (e) => {
        this.setState({ show: true });
    };

    render() {
        if (this.state.redirectToHome) {
            return <Redirect to="/" />;
        }
        return (
            <>
                <button
                    className="btn btn-raised btn-warning"
                    onClick={this.showModal}
                >
                    Delete Profile
                </button>

                {this.state.show && (
                    <div className="overlay">
                        <div
                            className="custom-modal"
                            id="confirmDeleteModal"
                            tabIndex="-1"
                            role="dialog"
                            aria-labelledby="myModalLabel"
                            aria-hidden="true"
                            data-backdrop="false"
                            //show="false"
                        >
                            <div className="modal-dialog" role="document">
                                <div className="modal-content">
                                    <div className="modal-header bg-primary">
                                        <h5
                                            className="modal-title text-white"
                                            id="confirmDeleteModalLabel"
                                        >
                                            Confirmation
                                        </h5>
                                        <button
                                            type="button"
                                            className="close"
                                            onClick={this.dismissModal}
                                            aria-label="Close"
                                        >
                                            <span aria-hidden="true">
                                                &times;
                                            </span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        Are you sure you want to delete your
                                        Gibble account? (This cannot be
                                        reversed.)
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-raised btn-secondary mr-2"
                                            onClick={this.dismissModal}
                                        >
                                            No, I'll stick around
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-raised btn-warning"
                                            onClick={this.handleDelete}
                                        >
                                            Yes, delete my account
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }
}

export default DeleteUser;
