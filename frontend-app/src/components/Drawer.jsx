import React, { useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Tooltip from '@mui/material/Tooltip';
import './css/Drawer.css';

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
            <span className='drawer-heading'>Error Occurred while transfering some resources</span>

            <Tooltip title='Close'>
            <img className='close-btn' src="images/close-icon.png" alt='Click here to close ❌' onClick={closeDrawer}/>
            </Tooltip>
            {/* <TableComponent rows={drawer.content || []} /> */}
            <div className='table'>
              <div className="row row-heading">
                <div className="col">Resource Name</div>
                <div className="col">Error</div>
              </div>
              {drawer.content.map(row => (
                <div className="row">
                  <div className="col">{row.name}</div>
                  <div className="col col-2">{row.error}</div>
                </div>
              ))}
            </div>
          </Drawer>
        </React.Fragment>
    </div>
  );
}