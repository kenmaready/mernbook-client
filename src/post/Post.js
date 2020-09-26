import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import RotateLoader from "react-spinners/RotateLoader";
import DeletePost from "./DeletePost";
import Comment from "./Comment";
import { isAuthenticated } from "../auth";
import { getPost, likePost, unlikePost } from "./actions";
import defaultPostImage from "../img/mountains.jpg";

const baseUrl = process.env.REACT_APP_API_URL;

export class Post extends Component {
    state = {
        post: "",
        like: false,
        likes: 0,
        comments: [],
        error: "",
        loading: false,
    };

    componentDidMount() {
        this.setState({ loading: true });
        const postId = this.props.match.params.postId;
        const token = isAuthenticated().token;

        getPost(postId, token)
            .then(({ data }) => {
                if (data.error) {
                    this.setState({ error: data.error });
                } else {
                    this.setState({
                        post: data.post,
                        likes: data.post.likes.length,
                        like: this.alreadyLiked(data.post.likes),
                        comments: data.post.comments,
                        error: false,
                        loading: false,
                    });
                }
            })
            .catch((err) => {
                this.setState({ error: err });
            });
    }

    alreadyLiked = (likes) => {
        const userId = isAuthenticated().user._id;
        let match = likes.indexOf(userId) !== -1;
        return match;
    };

    toggleLike = (e) => {
        let action = this.state.like ? unlikePost : likePost;
        const {
            user: { _id: userId },
            token,
        } = isAuthenticated();

        action(this.state.post._id, userId, token)
            .then(({ data }) => {
                if (data.error) {
                    this.setState({ error: data.error });
                } else {
                    this.setState({
                        post: data.post,
                        likes: data.post.likes.length,
                        error: false,
                        loading: false,
                        like: !this.state.like,
                    });
                }
            })
            .catch();
    };

    refreshComments = (comments) => {
        this.setState({ comments });
    };

    renderPost = (post) => {
        const posterProfile = post.owner ? `/user/${post.owner._id}` : "";
        const posterName = post.owner ? post.owner.name : " unknown ";

        const { like, likes } = this.state;

        return (
            <div className="mb-4">
                <img
                    //className="card-img-top"
                    src={`${baseUrl}/posts/image/${post._id}`}
                    alt={post.title}
                    onError={(i) => (i.target.src = `${defaultPostImage}`)}
                    style={{
                        maxHeight: "600px",
                        width: "100%",
                        objectFit: "cover",
                    }}
                />

                <p
                    className="btn btn-secondary btn-sm float-right mt-2"
                    onClick={this.toggleLike}
                    style={{ borderRadius: "10%" }}
                >
                    {" "}
                    <i
                        className={
                            like ? "fas fa-heart text-danger" : "far fa-heart"
                        }
                        style={{ padding: "4px", borderRadius: "50%" }}
                    ></i>{" "}
                    {likes}
                    {likes === 1 ? " like" : " likes"}
                </p>
                <div className="">
                    <p className="lead mt-2">{post.body}</p>
                    <br />
                    <p className="font-italic text-sm">
                        Posted by <Link to={posterProfile}>{posterName}</Link>{" "}
                        on {new Date(post.createdAt).toDateString()}
                    </p>
                    <div className="d-inline-block">
                        <Link
                            to={"/"}
                            className="btn btn-raised btn-primary btn-sm mr-2"
                        >
                            Back To Posts
                        </Link>
                        {isAuthenticated().user &&
                            post &&
                            isAuthenticated().user._id === post.owner._id && (
                                <>
                                    <Link
                                        className="btn btn-raised btn-info btn-sm mr-2"
                                        to={`/posts/edit/${post._id}`}
                                    >
                                        Edit Post
                                    </Link>
                                    <DeletePost
                                        postId={post._id}
                                        ownerId={post.owner._id}
                                    />
                                </>
                            )}
                        {isAuthenticated().user &&
                            post &&
                            isAuthenticated().user.role === "admin" && (
                                <div className="card mt-1 bg-light">
                                    <div className="card-body">
                                        <h5 className="card-title">
                                            admin controls
                                        </h5>

                                        <Link
                                            className="btn btn-raised btn-success mr-1"
                                            to={`/posts/edit/${post._id}`}
                                        >
                                            edit post
                                        </Link>
                                        <DeletePost
                                            postId={post._id}
                                            ownerId={post.owner._id}
                                        />
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        );
    };

    render() {
        const { post, comments, error, loading } = this.state;
        return (
            <>
                {/* <div className="jumbotron">
                    <h2>Post</h2>
                    <p className="lead">Here's that post you asked for...</p>
                </div> */}
                <div className="container">
                    <h2 className="mt-4 text-primary">{post.title}</h2>
                </div>
                <div className="container">
                    {loading ? (
                        <div className="jumbotron text-center">
                            <div>
                                <RotateLoader size={12} color={"#36D7B7"} />
                                <h3 className="text-primary">Loading...</h3>
                            </div>
                        </div>
                    ) : (
                        this.renderPost(post)
                    )}
                    <Comment
                        postId={post._id}
                        comments={comments}
                        refreshComments={this.refreshComments}
                    />
                </div>
            </>
        );
    }
}

export default Post;
