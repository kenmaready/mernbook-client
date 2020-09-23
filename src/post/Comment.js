import React, { Component } from "react";
import { Link } from "react-router-dom";
import RemoveComment from "./RemoveComment";
import { isAuthenticated } from "../auth";
import { addComment, removeComment } from "./actions";
import defaultAvatar from "../img/user.png";

const baseUrl = process.env.REACT_APP_API_URL;

export class Comment extends Component {
    constructor() {
        super();
        this.state = { text: "", error: "" };
    }

    handleChange = (e) => {
        this.setState({ text: e.target.value, error: "" });
    };

    handleSubmit = (e) => {
        e.preventDefault();

        if (this.isValid()) {
            const comment = { text: this.state.text };
            const postId = this.props.postId;
            const { user, token } = isAuthenticated();

            addComment(comment, postId, user._id, token)
                .then(({ data }) => {
                    if (data.error) {
                        this.setState({ error: data.error });
                    } else {
                        this.setState({ text: "", error: "", loading: false });
                        this.props.refreshComments(data.post.comments);
                    }
                })
                .catch((err) => this.setState({ error: err }));
        }
    };

    isValid = () => {
        const { text } = this.state;
        if (text.length < 1 || text.length > 150) {
            this.setState({
                error:
                    "Comments must be at least one character and no longer than 150 characters.",
            });
            return false;
        }
        return true;
    };

    render() {
        const { text, error } = this.state;
        const { comments, postId, refreshComments } = this.props;

        return (
            <div>
                <h3 className="mt-2 mb-2">Add a comment:</h3>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            onChange={this.handleChange}
                            className="form-control"
                            value={text}
                        ></input>
                        <button className="btn btn-raised btn-info btn-sm mt-1">
                            Post comment
                        </button>
                    </div>
                </form>
                <div className="">
                    <h5 className="text-primary">Comments</h5>
                    <hr />
                    {comments.map((c, idx) => (
                        <div key={`cmt-${idx}`}>
                            <div className="row">
                                <Link
                                    className="col-md-1 ml-3"
                                    to={`/user/${c.owner._id}`}
                                >
                                    <img
                                        className="profile-pic img-mini float-left mr-2"
                                        src={`${baseUrl}/user/photo/${c.owner._id}`}
                                        onError={(i) =>
                                            (i.target.src = `${defaultAvatar}`)
                                        }
                                        alt={c.owner.name}
                                    />
                                </Link>
                                <div className="col-md-9">
                                    <p
                                        style={{
                                            marginBottom: "0px",
                                            paddingBottom: "0px",
                                        }}
                                    >
                                        {c.text}
                                    </p>
                                    <p>
                                        <small
                                            className="text-secondary text-sm"
                                            style={{
                                                marginTop: "0px",
                                                paddingTop: "0px",
                                            }}
                                        >
                                            Posted by{" "}
                                            <Link to={`../user/${c.owner._id}`}>
                                                {c.owner.name}
                                            </Link>{" "}
                                            on{" "}
                                            {new Date(
                                                c.createdAt
                                            ).toDateString()}
                                        </small>
                                        {isAuthenticated().user &&
                                            isAuthenticated().user._id ===
                                                c.owner._id && (
                                                <>
                                                    <RemoveComment
                                                        comment={c}
                                                        postId={postId}
                                                        refreshComments={
                                                            refreshComments
                                                        }
                                                    />
                                                </>
                                            )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Comment;
