import React from "react";

export default function NavBar() {
    return (
        <div className="col-md-9 align-items-center">
            <ul className="nav justify-content-end" style={{ fontSize: "23px" }}>
                <li className="nav-item">
                    <a className="nav-link" aria-current="page" href='#home'>
                        Home
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#migrate">
                        Migration
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#diff-checker">
                        Diff Checker
                    </a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="/users">
                        Users
                    </a>
                </li>
            </ul>
        </div>
    );
}