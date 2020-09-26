import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import RotateLoader from "react-spinners/RotateLoader";
import ProfileTabs from "./ProfileTabs";
import DeleteUser from "./DeleteUser";
import FollowButon from "./FollowButton";
import { isAuthenticated } from "../auth";
import { getUser } from "./actions";
import { getPostsByUser } from "../post/actions";
import defaultAvatar from "../img/user.png";

const baseUrl = process.env.REACT_APP_API_URL;

export class Profile extends Component {
    constructor() {
        super();
        this.state = {
            user: "",
            posts: [],
            following: false,
            redirectToLogin: false,
        };
    }

    componentDidMount() {
        const userId = this.props.match.params.userId;
        this.init(userId);
    }

    componentDidUpdate() {
        const userId = this.props.match.params.userId;
        if (!this.state.user || this.state.user._id !== userId) {
            this.init(userId);
        }
    }

    init = (userId) => {
        const token = isAuthenticated().token;
        getUser(userId, token)
            .then(({ data }) => {
                if (data.error) {
                    console.log(data.error);
                    this.setState({ redirectToLogin: true });
                } else {
                    console.log(data.user);
                    let following = this.isFollowing(data.user);
                    this.setState({ user: data.user, following });
                    return getPostsByUser(userId, token);
                }
            })
            .then(({ data }) => {
                if (data && data.success) {
                    this.setState({ posts: data.posts });
                }
            })
            .catch((err) => {
                console.error(err);
                this.setState({ redirectToLogin: true });
            });
    };

    handleFollowButtonClick = (apiCall) => {
        const userId = this.props.match.params.userId;
        const activeUserId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        apiCall(userId, activeUserId, token)
            .then(({ data }) => {
                if (data.error) {
                    this.setState({ error: data.error });
                } else {
                    console.log(data.user);
                    let following = this.isFollowing(data.user);
                    this.setState({ user: data.user, following });
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({ error: err });
            });
    };

    isFollowing = (user) => {
        const activeUser = isAuthenticated().user;
        console.log(user.followers);
        const match = user.followers.find((follower) => {
            console.log(
                "follower._id, activeUser._id:",
                follower._id,
                activeUser._id
            );
            return follower._id === activeUser._id;
        });
        return match;
    };

    render() {
        const { user, posts, redirectToLogin } = this.state;

        if (redirectToLogin) return <Redirect to="/login" />;

        const photoUrl = user._id
            ? `${baseUrl}/user/photo/${user._id}`
            : defaultAvatar;

        return (
            <>
                <div className="jumbotron">
                    <h2>Profile</h2>
                    <p className="lead"></p>
                </div>
                <div className="container">
                    {user ? (
                        <>
                            <div className="row">
                                <div className="col-md-4">
                                    <img
                                        className="card-img-top mb-2 ml-3 profile-pic"
                                        src={photoUrl}
                                        onError={(i) =>
                                            (i.target.src = `${defaultAvatar}`)
                                        }
                                        alt={user.name}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <div className="">
                                        <h3 className="text-primary">
                                            {user.name}
                                        </h3>
                                        <p>{user.email}</p>
                                        <p>
                                            joined:{" "}
                                            {`${new Date(user.createdAt)
                                                .toDateString()
                                                .toLowerCase()}`}
                                        </p>
                                    </div>
                                    {isAuthenticated().user &&
                                    isAuthenticated().user._id === user._id ? (
                                        <div className="d-inline-block">
                                            <Link
                                                className="btn btn-raised btn-info mr-3"
                                                to={`/posts/new`}
                                                data-toggle="tooltip"
                                                data-placement="top"
                                                title="Create New Post"
                                            >
                                                +
                                            </Link>
                                            <Link
                                                className="btn btn-raised btn-primary mr-3"
                                                to={`/user/edit/${user._id}`}
                                            >
                                                Edit Profile
                                            </Link>
                                            <DeleteUser userId={user._id} />
                                        </div>
                                    ) : (
                                        <FollowButon
                                            following={this.state.following}
                                            onButtonClick={
                                                this.handleFollowButtonClick
                                            }
                                        ></FollowButon>
                                    )}
                                    {isAuthenticated().user &&
                                        isAuthenticated().user.role ===
                                            "admin" && (
                                            <div className="card mt-1 bg-light">
                                                <div className="card-body">
                                                    <h5 className="card-title">
                                                        admin controls
                                                    </h5>

                                                    <Link
                                                        className="btn btn-raised btn-success mr-1"
                                                        to={`/user/edit/${user._id}`}
                                                    >
                                                        edit profile
                                                    </Link>
                                                    <DeleteUser
                                                        userId={user._id}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                </div>
                            </div>
                            <div className="container">
                                <hr />
                                <p className="lead">{user.about}</p>
                                <hr />
                                <ProfileTabs
                                    followers={user.followers}
                                    following={user.following}
                                    posts={posts}
                                />
                            </div>
                        </>
                    ) : (
                        <div>
                            <RotateLoader size={12} color={"#36D7B7"} />
                            <h5>Loading...</h5>
                        </div>
                    )}
                </div>
            </>
        );
    }
}

export default Profile;
