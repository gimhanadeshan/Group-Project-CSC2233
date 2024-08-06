import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

export default function CardBox({timeslot}) {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {timeslot.course.name||''}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {timeslot ? timeslot.lecturer.name: ''}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {timeslot.start_time||''} - {timeslot.end_time||''}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {timeslot.hall.name ||''}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
