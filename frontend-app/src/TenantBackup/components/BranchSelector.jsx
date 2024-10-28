import React from 'react';
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    // Button,
    Box,
    // TextField,
    // Dialog,
    // DialogTitle,
    // DialogContent,
    // DialogActions,
} from '@mui/material';

const BranchSelector = ({ branches, selectedBranch, onBranchChange, onCreateBranch }) => {
    // const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    // const [newBranchName, setNewBranchName] = React.useState('');

    // const handleCreateBranch = () => {
    //     onCreateBranch(newBranchName);
    //     setIsDialogOpen(false);
    //     setNewBranchName('');
    // };

    return (
        <>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <FormControl fullWidth>
                    <InputLabel>Branch</InputLabel>
                    <Select
                        value={selectedBranch}
                        label="Branch"
                        onChange={(e) => onBranchChange(e.target.value)}
                    >
                        {branches.map((branch) => (
                            <MenuItem key={branch.name} value={branch.name}>
                                {branch.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {/* <Button
                    variant="outlined"
                    onClick={() => setIsDialogOpen(true)}
                    sx={{ mt: 1 }}
                >
                    New Branch
                </Button> */}
            </Box>

            {/* <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogTitle>Create New Branch</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Branch Name"
                        fullWidth
                        value={newBranchName}
                        onChange={(e) => setNewBranchName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleCreateBranch} variant="contained">
                        Create
                    </Button>
                </DialogActions>
            </Dialog> */}
        </>
    );
};

export default BranchSelector;