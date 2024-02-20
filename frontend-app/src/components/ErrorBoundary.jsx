import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

export default function ErrorBoundary() {
    return (
        <Dialog
            aria-describedby="error-handling-dialog"
            aria-labelledby="error-dialog"
            classes={{
                root: classes.dialogContainer,
                paper: classes.dialogPaper,
            }}
            disableEscapeKeyDown
            onClose={this.handleClose}
            open={hasError}
        >
            <DialogTitle classes={{ root: classes.dialogTitleContainer }}>
                <Typography
                    classes={{
                        root: classes.dialogTitle,
                    }}
                >
                    <PanToolIcon classes={{ root: classes.dialogTitleIcon }} />
                    Oops, You have some bad code somewhere!
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Typography classes={{ root: classes.errorTitle }} component="p">
                    Error Thrown
                </Typography>
                <Typography component="p">{error?.toString()}</Typography>
                <Typography classes={{ root: classes.errorTitle }} component="p">
                    Where the error occured
                </Typography>
                <Typography component="p">{errorInfo?.componentStack}</Typography>
            </DialogContent>
        </Dialog>
    )
}