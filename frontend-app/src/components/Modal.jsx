import React from 'react';
import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        aspectRatio: '1.9/1',
        background: '#191414',
        color: '#F3F3F3',
        borderRadius: '7px',
    },
};

export default function ModalComponenet({ show, title, body, closeModal, titleColor }) {
    return (
        <Modal
            isOpen={show}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Modal"
        >
            <div className="modal-wrapper">
                <div>
                    <span className="modal--title" style={{ color: titleColor }}>{title}</span>
                    <span onClick={closeModal} className="modal--close-btn">X</span>
                </div>
                <div>
                    <p className="modal--body">{body}</p>
                </div>
                <footer>
                    <button className="btn btn-primary modal--closeButton" onClick={closeModal}>OK</button>
                </footer>
            </div>
        </Modal>
    );
}
