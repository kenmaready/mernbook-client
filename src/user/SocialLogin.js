import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import GoogleLogin from "react-google-login";
import { socialLogin, authenticate } from "../auth";

export class SocialLogin extends Component {
    constructor() {
        super();
        this.state = {
            redirectToReferrer: false,
        };
    }

    responseGoogle = (response) => {
        console.log(response);
        const { googleId, name, email, imageUrl } = response.profileObj;
        const user = {
            password: googleId,
            name: name,
            email: email,
            imageUrl: imageUrl,
        };

        socialLogin(user)
            .then(({ data }) => {
                console.log("signin data:", data);
                if (data.error) {
                    alert("Error logging in. Please try again...");
                } else {
                    console.log("signin success - setting token");
                    authenticate(data, () => {
                        this.setState({ redirectToReferrer: true });
                    });
                }
            })
            .catch((err) => console.log(err));
    };

    render() {
        if (this.state.redirectToReferrer) {
            return <Redirect to="/" />;
        }

        return (
            <div className="container">
                <GoogleLogin
                    clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                    buttonText="Login with Google"
                    onSuccess={this.responseGoogle}
                    onFailure={this.responseGoogle}
                />
            </div>
        );
    }
}

export default SocialLogin;
