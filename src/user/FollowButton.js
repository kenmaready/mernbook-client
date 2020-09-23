import React, { Component } from "react";
import { follow, unfollow } from "./actions";

export class FollowButton extends Component {
    handleFollow = () => {
        this.props.onButtonClick(follow);
    };

    handleUnfollow = () => {
        this.props.onButtonClick(unfollow);
    };

    render() {
        return (
            <div className="d-inline-block">
                {this.props.following ? (
                    <button
                        onClick={this.handleUnfollow}
                        className="btn btn-warning btn-raised btn-sm"
                    >
                        Unfollow
                    </button>
                ) : (
                    <button
                        onClick={this.handleFollow}
                        className="btn btn-success btn-raised btn-sm mr-2"
                    >
                        Follow
                    </button>
                )}
            </div>
        );
    }
}

export default FollowButton;
