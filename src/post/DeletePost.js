import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { isAuthenticated, logout } from "../auth";
import { deletePost } from "./actions";

export class DeletePost extends Component {
    constructor() {
        super();
        this.state = {
            show: false,
            redirectToProfile: false,
        };
    }

    handleDelete = () => {
        const postId = this.props.postId;
        const token = isAuthenticated().token;
        deletePost(postId, token)
            .then((response) => {
                console.log(response);
                if (response.error) {
                    console.log(response.error);
                } else {
                    this.setState({ redirectToProfile: true });
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
        if (this.state.redirectToProfile) {
            return <Redirect to={`/user/${this.props.ownerId}`} />;
        }
        return (
            <>
                <button
                    className="btn btn-raised btn-warning btn-sm"
                    onClick={this.showModal}
                >
                    Delete Post
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
                                        Are you sure you want to delete this
                                        post? (This cannot be reversed.)
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
                                            onClick={this.handleDelete}
                                        >
                                            Yes, delete this post
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

export default DeletePost;
