import React, { useCallback, useState } from 'react';
import Button from '@mui/material/Button';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import ModalComponent from './Modal';
import AddUserForm from './AddUserForm';

const AddUser = () => {
    let [isModalOpen, setIsModalOpen] = useState(false);
    let closeModal = useCallback(() => {
        setIsModalOpen(false);
    }, [isModalOpen]);

    let openModal = useCallback(() => {
        setIsModalOpen(true);
    }, [isModalOpen]);

    

    return (
        <>
            <Button variant="outlined" startIcon={<PersonAddAlt1Icon />} sx={{
                marginRight: '30px',
            }} onClick={openModal}>
                User
            </Button>
            <ModalComponent show={isModalOpen} title="New User" body={(<AddUserForm/>)} closeModal={closeModal} titleColor='#000' />
        </>
    );
}

export default AddUser;
