import React from "react";

export default function CreateAccount({ handleUserRequest, handleUserInput, requestedUserEmail }) {
    return (
        <div className="mt-5 d-flex flex-column justify-content-center align-items-center">
            <h5 className="text-secondary">Create Account</h5>
            <div className="input-group mb-3">
                <span className="input-group-text" id="basic-addon1">
                    @
                </span>
                <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your Email"
                    aria-label="Username"
                    aria-describedby="basic-addon1"
                    id="requestedEmail"
                    value={requestedUserEmail}
                    onChange={(event) => handleUserInput(event.target.value)}
                />
                <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleUserRequest}
                >
                    Create
                </button>
            </div>
        </div>
    )
}