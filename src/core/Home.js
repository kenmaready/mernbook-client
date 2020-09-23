import React from "react";
import Posts from "../post/Posts";
import { isAuthenticated } from "../auth";

function Home() {
    return (
        <>
            <div className="jumbotron">
                <h2>Home</h2>
                <p className="lead">Welcome to Gibble.</p>
            </div>
            {isAuthenticated() && (
                <div className="container">
                    <Posts />
                </div>
            )}
        </>
    );
}

export default Home;
