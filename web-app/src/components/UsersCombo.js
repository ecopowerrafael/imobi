/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@mui/material/TextField';
import { Autocomplete } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useTranslation } from "react-i18next";
import {WEB_MAIN_COLOR, FONT_FAMILY} from "../common/sharedFunctions";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  option1: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
      fontFamily: FONT_FAMILY 
    },
   fontFamily: FONT_FAMILY 
  },
  option2: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
      fontFamily: FONT_FAMILY 
    },
    direction:'rtl',
    fontFamily: FONT_FAMILY 
  },
  inputRtl: {
    "& label": {
      right: 75,
      left: "auto",
      fontFamily: FONT_FAMILY 
    },
    "& legend": {
      textAlign: "right",
      marginRight:65,
      fontFamily: FONT_FAMILY 
    }
  },
  textField: props => ({
    "& label": {
      fontFamily: FONT_FAMILY 
    },
    "& label.Mui-focused": {
      color: WEB_MAIN_COLOR(props?.settings?.appCat),
      fontFamily: FONT_FAMILY 
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: WEB_MAIN_COLOR(props?.settings?.appCat),
    },
    "& .MuiFilledInput-underline:after": {
      borderBottomColor: WEB_MAIN_COLOR(props?.settings?.appCat),
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: WEB_MAIN_COLOR(props?.settings?.appCat),
      },
      fontFamily: FONT_FAMILY 
    },
  }),
}));

export default function UsersCombo(props) {
  const { i18n  } = useTranslation();
  const isRTL = i18n.dir();
  const settings = useSelector(state => state.settingsdata.settings);
  const classes = useStyles({settings});
  return (
    <Autocomplete
      value={props.value}
      id="user-select"
      style={props.style}
      options={props.users}
      classes={isRTL === 'rtl'?{option: classes.option2}:{option: classes.option1}}
      onChange={props.onChange}
      autoHighlight
      getOptionLabel={(option) => option.desc}
      isOptionEqualToValue={(option, value) => option.desc === value.desc}
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.placeholder}
          variant="outlined"
          className={[isRTL==='rtl'? classes.inputRtl:classes.commonInputStyle, classes.textField].join(" ")}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'off' 
          }}
        />
      )}
    />
  );
}