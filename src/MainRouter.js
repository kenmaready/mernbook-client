import React from "react";
import { Route, Switch } from "react-router-dom";
import PrivateRoute from "./auth/PrivateRoute";
import Menu from "./core/Menu";
import Home from "./core/Home";
import Signup from "./user/Signup";
import Login from "./user/Login";
import Profile from "./user/Profile";
import Users from "./user/Users";
import RecommendedUsers from "./user/RecommendedUsers";
import EditProfile from "./user/EditProfile";
import NewPost from "./post/NewPost";
import Post from "./post/Post";
import EditPost from "./post/EditPost";
import ForgotPassword from "./user/ForgotPassword";
import ResetPassword from "./user/ResetPassword";
import Admin from "./admin/Admin";

function MainRouter() {
    return (
        <div>
            <Menu />
            <Switch>
                <Route exact path="/" component={Home} />
                <PrivateRoute exact path="/users" component={Users} />
                <PrivateRoute
                    exact
                    path="/users/recommended"
                    component={RecommendedUsers}
                />
                <Route exact path="/signup" component={Signup} />
                <Route exact path="/login" component={Login} />
                <PrivateRoute exact path="/user/:userId" component={Profile} />
                <PrivateRoute
                    exact
                    path="/user/edit/:userId"
                    component={EditProfile}
                />
                <PrivateRoute exact path="/posts/new" component={NewPost} />
                <PrivateRoute exact path="/posts/:postId" component={Post} />
                <PrivateRoute
                    exact
                    path="/posts/edit/:postId"
                    component={EditPost}
                />
                <PrivateRoute exact path="/admin" component={Admin} />
                <Route exact path="/reset" component={ForgotPassword} />
                <Route exact path="/reset/:token" component={ResetPassword} />
            </Switch>
        </div>
    );
}

export default MainRouter;
