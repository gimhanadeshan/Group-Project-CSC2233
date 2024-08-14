import * as React from 'react';
import Popover from '@mui/material/Popover';
import { Link } from '@inertiajs/react';
import Typography from '@mui/material/Typography';
import CardBox from './CardBox';

export default function PopOver({timeslot}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handlePopoverOpen = (event) => {
    if (timeslot) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <Typography
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        className={`text-sm text-gray-600 font-serif ${
            timeslot ? timeslot.course.name === 'Lunch Break' ? 'dark:text-yellow-400' :'dark:text-gray-100': 'dark:text-gray-100'
          }`}

      >
            {timeslot? timeslot.course.name:''}
      </Typography>
        <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <CardBox timeslot={timeslot}/>
      </Popover>
    </div>
  );
}
