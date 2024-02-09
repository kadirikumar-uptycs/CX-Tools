import React, {useEffect} from "react";


export default function GoogleLogin({handleLogin}) {
	function handleCredentialResponse(response){
		handleLogin(response.credential);
	}
	useEffect(() => {
        window.handleCredentialResponse = handleCredentialResponse;
    });
	return (
		<>
			<div
				id="g_id_onload"
				data-client_id="293145640210-9na2vgecvu45cc8do0411rg8nd000766.apps.googleusercontent.com"
				data-context="signin"
				data-ux_mode="popup"
				data-callback="handleCredentialResponse"
				data-auto_prompt="true"
			></div>
			<div className="mb-5 d-flex flex-column justify-content-center align-items-center">
				<h5 className="text-secondary">Login</h5>
				<div
					className="g_id_signin"
					data-type="standard"
					data-theme="filled_blue"
					data-shape="pill"
				></div>
			</div>
		</>
	);
}
