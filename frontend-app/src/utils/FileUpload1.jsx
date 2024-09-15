import React from 'react';
import Box from '@mui/joy/Box';
import { useSnackbar } from '../hooks/SnackBarProvider';
import parseInputFileData from '../utils/parseJsonFileInput';


const FileUpload1 = ({ label, uploadHandler }) => {

    const openSnackbar = useSnackbar();

    const handleInput = async (event) => {
        try {
            let response = await parseInputFileData(event);
            let { data, fileName } = response;
            uploadHandler(data, fileName);
        } catch (err) {
            console.log(err);
            openSnackbar(err?.message || `${err}`, 'danger');
        } finally {
            event.target.value = null;
        }
    }

    return (
        <Box sx={styles.container}>
            <Box sx={styles.uploadBox}>
                <label htmlFor="fileUpload" style={styles.label}>
                    <span style={styles.label}>{label}</span>
                </label>
                <input
                    type="file"
                    id="fileUpload"
                    accept=".json"
                    onChange={handleInput}
                    style={styles.input}
                />
            </Box>
        </Box>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '30px',
        borderRadius: '8px',
        backgroundColor: 'var( --secondary-color)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px',
        margin: '0 auto',
    },
    uploadBox: {
        width: '100%',
        padding: '20px',
        border: '2px dashed var(--primary-color-light)',
        borderRadius: '8px',
        backgroundColor: 'rgb(247 247 255)',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
            borderColor: 'var(--primary-color)',
        }
    },
    label: {
        fontSize: '16px',
        color: '#333',
        cursor: 'pointer',
        margin: '12px'
    },
    input: {
        display: 'none',
    },
    fileName: {
        color: 'var(--primary-color)',
        fontWeight: 'bold',
    }
};

export default FileUpload1;
