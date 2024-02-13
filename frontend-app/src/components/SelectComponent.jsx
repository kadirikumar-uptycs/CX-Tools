import React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


export default function SelectComponent() {

    const [resource, setResource] = React.useState('');

    const handleChange = (event) => {
        setResource(event.target.value);
    };

    return (
        <FormControl sx={{ m: 1, minWidth: 120, marginTop: '20px' }}>
            <InputLabel id="helperLabel">Resource</InputLabel>
            <Select
                labelId="helperLabel"
                id="select-helper"
                value={resource}
                label="Resource"
                onChange={handleChange}
            >
                <MenuItem value='FlagProfiles'>Flag Profiles</MenuItem>
                <MenuItem value='Alerts'>Alerts</MenuItem>
                <MenuItem value='Exceptions'>Exceptions</MenuItem>
            </Select>
            <FormHelperText>Type of migrating resource</FormHelperText>
        </FormControl>
    )
}