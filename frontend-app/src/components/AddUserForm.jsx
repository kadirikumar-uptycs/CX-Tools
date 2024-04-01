import React, { useRef } from 'react';
import config from "../config";
import axios from 'axios';

let inputStyle = {
    width: '300px',
    outline: 'none',
    border: 'none',
    borderBottom: '1px solid #010101',
    fontSize: '17px',
    fontFamily: 'sans-serif',
    background: 'transparent',
    textAlign: 'center',
}

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

const AddUserForm = () => {
    let nameRef = useRef(null);
    let emailRef = useRef(null);
    let buttonRef = useRef(null);

    let handleFormSubmission = async () => {
        let name = nameRef.current.value;
        let email = emailRef.current.value;
        if (validateEmail(email)) {
            if (name) {
                buttonRef.current.value = 'adding...';
                let url = `${config.SERVER_BASE_ADDRESS}/addUser`;
                try{
                    await axios.post(url, {name, email});
                    buttonRef.current.value = 'Added';
                    alert('Added');
                    window.location.reload();
                }catch(error){
                    console.log(error);
                    alert('Error occurred while adding new user')
                }
            } else {
                alert('Name must be non-empty string');
            }
        } else {
            alert('Not a valid Email');
        }
    }
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            height: '200px',
        }}>
            <input type="text" placeholder='Name' style={inputStyle} ref={nameRef} />
            <input type="email" placeholder='Email' style={inputStyle} ref={emailRef} />
            <input type="button" value='Submit' style={{
                outline: 'none',
                borderColor: '#010101',
                width: '80px',
                aspectRatio: '3/1.9'
            }} onClick={handleFormSubmission} ref={buttonRef}/>
        </div>
    );
}

export default AddUserForm;
