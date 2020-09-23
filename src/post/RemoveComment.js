import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated, logout } from "../auth";
import { removeComment } from "./actions";

export class RemoveComment extends Component {
    constructor() {
        super();
        this.state = {
            show: false,
        };
    }

    handleRemove = () => {
        const { comment, postId } = this.props;
        const { user, token } = isAuthenticated();
        removeComment(comment, postId, user._id, token)
            .then(({ data }) => {
                console.log(data);
                if (data.error) {
                    console.log(data.error);
                } else {
                    this.setState({ show: false });
                    this.props.refreshComments(data.post.comments);
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
        return (
            <>
                <button
                    className="btn btn-raised btn-warning btn-sm float-right"
                    onClick={this.showModal}
                >
                    Delete Comment
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
                                        Are you sure you want to remove this
                                        comment? (This cannot be reversed.)
                                    </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn btn-raised btn-secondary mr-2"
                                            onClick={this.dismissModal}
                                        >
                                            No, Let's Leave It
                                        </button>
                                        <button
                                            type="button"
                                            className="btn btn-raised btn-warning"
                                            onClick={this.handleRemove}
                                        >
                                            Yes, remove this comment
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

export default RemoveComment;
