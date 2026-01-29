import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { Grid } from '@mui/material';
import {WEB_MAIN_COLOR} from "../common/sharedFunctions";
import { useSelector } from "react-redux";

function CircularLoading() {
  const settings = useSelector(state => state.settingsdata.settings);
  const MAIN_COLOR = WEB_MAIN_COLOR(settings?.appCat);

  return (
    <Grid
      container
      spacing={0}
      alignItems="center"
      justifyContent={'center'}
      style={{ minHeight: '100vh' }}
    >
      <CircularProgress style={{color:MAIN_COLOR}} />
    </Grid>
  )
}

export default CircularLoading;