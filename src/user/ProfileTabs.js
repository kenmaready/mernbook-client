import React, { Component } from "react";
import { Link } from "react-router-dom";
import defaultAvatar from "../img/user.png";

const baseUrl = process.env.REACT_APP_API_URL;

export class ProfileTabs extends Component {
    render() {
        const { followers, following, posts } = this.props;

        return (
            <div>
                <div className="row">
                    <div className="col-md-4">
                        <h5 className="text-primary">Followers</h5>
                        <hr />
                        {followers.map((f, idx) => (
                            <div key={`follower-${idx}`}>
                                <div>
                                    <Link className="" to={`/user/${f._id}`}>
                                        <figure>
                                            <img
                                                className="profile-pic img-mini float-left mr-2 ml-3"
                                                src={`${baseUrl}/user/photo/${f._id}`}
                                                onError={(i) =>
                                                    (i.target.src = `${defaultAvatar}`)
                                                }
                                                alt={f.name}
                                            />
                                            <figcaption className="text-muted ml-3">
                                                <small>{f.name}</small>
                                            </figcaption>
                                        </figure>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="cold-md-2"></div>
                    <div className="col-md-4">
                        <h5 className="text-primary">Following</h5>
                        <hr />
                        {following.map((f, idx) => (
                            <div key={`following-${idx}`}>
                                <div>
                                    <Link
                                        className="ml-3"
                                        to={`/user/${f._id}`}
                                    >
                                        <img
                                            className="profile-pic img-mini float-left mr-2"
                                            src={`${baseUrl}/user/photo/${f._id}`}
                                            onError={(i) =>
                                                (i.target.src = `${defaultAvatar}`)
                                            }
                                            alt={f.name}
                                        />
                                        <p className="text-muted">{f.name}</p>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="col-md-4">
                        <h5 className="text-primary">Posts</h5>
                        <hr />
                        {posts.map((post, idx) => (
                            <div key={`post-${idx}`}>
                                <Link
                                    to={`../posts/${post._id}`}
                                    className="text-primary"
                                >
                                    {post.title}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default ProfileTabs;
