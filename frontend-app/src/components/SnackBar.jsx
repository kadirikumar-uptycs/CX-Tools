import React from "react";
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import { Alert } from "@mui/material";

export default function SnackBar({getChildState}) {


    let [snackBar, setSnackBar] = React.useState({
        open: false,
        message: '',
        severity: ''
    });

    getChildState(setSnackBar);

    let closeSnackBar = () => {
        setSnackBar({
            message: '',
            open: false,
            severity: '',
            duration : 4500,
        })
    }

    return (
        <Snackbar
            open={snackBar.open}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            TransitionComponent={Slide}
            autoHideDuration={snackBar.duration}
            onClose={closeSnackBar}
        >
            <Alert
                severity={snackBar.severity}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {snackBar.message}
            </Alert>
        </Snackbar>
    )
}