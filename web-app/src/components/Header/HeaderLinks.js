/*eslint-disable*/
import React, {useState, useEffect} from "react";
import { makeStyles } from "@mui/styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Tooltip from "@mui/material/Tooltip";
import { Info, AccountBox, House, Logout } from "@mui/icons-material";
import Button from "components/CustomButtons/Button.js";
import styles from '../../styles/headerLinksStyle.js';
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { Select, MenuItem  } from '@mui/material';
import moment from 'moment/min/moment-with-locales';
import EmailIcon from '@mui/icons-material/Email';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {Typography} from "@mui/material";
import { FONT_FAMILY } from "common/sharedFunctions.js";
import { colors } from "components/Theme/WebTheme.js";
const useStyles = makeStyles(styles);

export default function HeaderLinks(props) {
  const classes = useStyles();
  const auth = useSelector(state => state.auth);
  const settings = useSelector(state => state.settingsdata.settings);
  const languagedata = useSelector(state => state.languagedata);
  const { i18n,t } = useTranslation();
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      // Dispatch logout action para limpar Redux
      dispatch({ type: 'SIGN_OUT' });
      
      // Redirecionar
      navigate('/');
      
      // Recarregar página para limpar cache
      window.location.href = '/';
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const [langSelection, setLangSelection] = useState();
  const [multiLanguage,setMultiLanguage] = useState();

  const handleLanguageSelect = (event) => {
    // Função desabilitada - seletor de idiomas removido
    setIsActive(false);
  };

  useEffect(()=>{
    // Seletor de idiomas desabilitado - usando apenas lang1 (português)
    
  },[languagedata.langlist]);

  

  useEffect(()=>{
    if(auth.profile && auth.profile.uid){
      setLoggedIn(true);
    }else{
      setLoggedIn(false);
    }
  },[auth.profile]);
  
  const [isActive, setIsActive] = useState(false);

  const toggleDropdown = () => {
    setIsActive(!isActive);
  };

  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <Button
          color="transparent"
          className={classes.navLink}
          onClick={(e) => { e.preventDefault(); navigate('/') }}
        >
          <House className={classes.icons} />
          <Typography fontFamily = {FONT_FAMILY} >{t('home')}</Typography> 
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          color="transparent"
          className={classes.navLink}
          onClick={(e) => { e.preventDefault(); 
            if(loggedIn){
              navigate('/bookings') 
            } else{
              navigate('/login') 
            }
          }}
        >
          {loggedIn?
            <AccountBox className={classes.icons} /> 
            : 
            <AccountBox className={classes.icons} />  
          }         
         
          {loggedIn?
          <Typography fontFamily = {FONT_FAMILY} >{t('myaccount')}</Typography>
            : 
            <Typography fontFamily = {FONT_FAMILY} >{t('login_signup')}</Typography>
          }
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          color="transparent"
          className={classes.navLink}
          onClick={(e) => { e.preventDefault(); navigate('/about-us') }}
        >
          <Info className={classes.icons} />
          <Typography fontFamily = {FONT_FAMILY} >{t('about_us')}</Typography>
        </Button>
      </ListItem>
      <ListItem className={classes.listItem}>
        <Button
          color="transparent"
          className={classes.navLink}
          onClick={(e) => { e.preventDefault(); navigate('/contact-us') }}
        >
        <EmailIcon className={classes.icons} />
        <Typography fontFamily = {FONT_FAMILY} >{t('contact_us')}</Typography>
        </Button>
      </ListItem>
      {loggedIn && (
        <ListItem className={classes.listItem}>
          <Button
            color="transparent"
            className={classes.navLink}
            onClick={(e) => { e.preventDefault(); handleLogout(); }}
          >
            <Logout className={classes.icons} />
            <Typography fontFamily={FONT_FAMILY}>Logout</Typography>
          </Button>
        </ListItem>
      )}
      {settings && settings.FacebookHandle?
      <ListItem className={classes.listItem}>
        <Tooltip
          id="instagram-facebook"
          title={t('follow_facebook')}
          placement={window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            color="transparent"
            href={settings.FacebookHandle}
            target="_blank"
            className={classes.navLink}
          >
            <i className={classes.socialIcons + " fab fa-facebook"} />
          </Button>
        </Tooltip>
      </ListItem>
      :null}
      {settings && settings.TwitterHandle?
      <ListItem className={classes.listItem}>
        <Tooltip
          id="instagram-twitter"
          title={t('follow_twitter')}
          placement={window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            href={settings.TwitterHandle}
            target="_blank"
            color="transparent"
            className={classes.navLink}
          >
            <i className={classes.socialIcons + " fab fa-twitter"} />
          </Button>
        </Tooltip>
      </ListItem>
      :null}
      {settings && settings.InstagramHandle?
      <ListItem className={classes.listItem}>
        <Tooltip
          id="instagram-twitter"
          title={t('follow_instagram')}
          placement={window.innerWidth > 959 ? "top" : "left"}
          classes={{ tooltip: classes.tooltip }}
        >
          <Button
            href={settings.InstagramHandle}
            target="_blank"
            color="transparent"
            className={classes.navLink}
          >
            <i className={classes.socialIcons + " fab fa-instagram"} />
          </Button>
        </Tooltip>
      </ListItem>
      :null}
    </List>
  );
}
