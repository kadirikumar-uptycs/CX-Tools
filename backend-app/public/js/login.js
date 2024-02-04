async function handleCredentialResponse(response) {

        const loginResponse = await fetch('/api/validateLoginUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(response),
        });

        let status = loginResponse.status;

        if (status === 200) {

            setTimeout(() => {
                window.location.href = '/';
            }, 300);
        } else if(status === 403) {
            showModal('Hey!!!', await loginResponse.json().then((data)  => {
                return data.message;
            }));
        }
}


const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

function showModal(title, body){
    document.getElementById('modal-title').innerText = title;
    document.getElementById('modal-body').innerText = body;
    let modal = new bootstrap.Modal(document.getElementById('modal'));
    modal.show();
}


function handleUserRequest() {
    let email = document.getElementById('requestedEmail').value;
    if (!validateEmail(email)) {
        showModal("Invalid Email", 'Enter Valid Email \neg: abc@domain.com');
    }
    else {
        fetch('/api/userRequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'email': email }),
        }).then(
            res => {
                if (res.ok) {
                    return res.json()
                }
            }
        ).then(
            data => {
                showModal(`Hurray!!!`, data.message);
                document.getElementById('requestedEmail').value = "";
            }
        )
    }
}