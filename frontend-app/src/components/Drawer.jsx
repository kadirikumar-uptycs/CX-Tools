import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Tooltip from '@mui/material/Tooltip';
import TableComponent from "./TableComponent";


export default function DrawerComponent({getChildState}) {

    let [drawer, setDrawer] = useState({
        open: false,
        content: [],
    });

    getChildState(setDrawer);

    function closeDrawer(){
        setDrawer({
            open: false,
            content: [],
        })
    }

  return (
    <div>
      <React.Fragment>
          <Drawer
            anchor='bottom'
            open={drawer.open}
            onClose={closeDrawer}
          >
            <span style={{
              fontFamily: 'Protest Revolution',
              color : '#d32f2f',
             position: 'relative',
             left: '50%',
             transform: 'translateX(-330px)',
             fontSize: '31px',
             textDecoration: '1px double underline #AAA',
            }}>Error Occurred while transfering some resources</span>

            <Tooltip title='Close'>
            <img width="100" height="100" src="https://img.icons8.com/nolan/64/multiply.png" alt='Click here to close ❌' onClick={closeDrawer} style={{
                cursor: 'pointer',
                position: 'relative',
                top: '-50px',
            }}/>
            </Tooltip>
            <TableComponent rows={drawer.content || []} />
          </Drawer>
        </React.Fragment>
    </div>
  );
}