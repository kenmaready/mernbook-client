import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import Users from "../user/Users";
import Posts from "../post/Posts";
import { isAuthenticated } from "../auth";

export class Admin extends Component {
    state = {
        redirectToHome: false,
    };

    componentDidMount() {
        if (isAuthenticated().user.role !== "admin") {
            this.setState({ redirectToHome: true });
        }
    }

    render() {
        if (this.state.redirectToHome) {
            return <Redirect to="/" />;
        }

        return (
            <>
                <div className="jumbotron">
                    <h2>Admin Dashboard</h2>
                    <p className="lead"></p>
                </div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-6">
                            <h5 className="text-primary">Users</h5>
                            <hr />
                            <Users />
                        </div>
                        <div className="col-md-6">
                            <h5 className="text-primary">Posts</h5>
                            <hr />
                            <Posts />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Admin;
