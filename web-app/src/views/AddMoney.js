import React, { useState, useEffect } from 'react';
import { Grid, Typography, TextField, useMediaQuery } from '@mui/material';
import { useSelector, useDispatch } from "react-redux";
import AlertDialog from '../components/AlertDialog';
import { makeStyles } from '@mui/styles';
import UsersCombo from '../components/UsersCombo';
import { api } from 'common';
import { useTranslation } from "react-i18next";
import { colors } from '../components/Theme/WebTheme';
import Button from "components/CustomButtons/Button.js";
import { WEB_MAIN_COLOR, WEB_SECONDORY_COLOR, FONT_FAMILY } from "../common/sharedFunctions";


const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    container: props => ({
        maxWidth: "50vw",
        marginTop: theme.spacing(1),
        backgroundColor: WEB_MAIN_COLOR(props?.settings?.appCat),
        alignContent: 'center',
        borderRadius: "8px",
    }),
    container1: props => ({
        backgroundColor: colors.Header_Text,
        borderTopLeftRadius: "0px",
        borderTopRightRadius: "0px",
        borderBottomLeftRadius: "8px",
        borderBottomRightRadius: "8px",
        padding: '30px',
        width: '100%',
        top: "19px",
        boxShadow: `0px 2px 5px ${WEB_SECONDORY_COLOR(props?.settings?.appCat)}`,
    }),
    title: {
        color: colors.WHITE,
        padding: '10px',
        fontSize: 18,
        fontFamily: FONT_FAMILY
    },
    items: {
        margin: 0,
        width: '100%'
    },
    input: {
        fontSize: 18,
        color: colors.BLACK,
        fontFamily: FONT_FAMILY
    },
    inputdimmed: {
        fontSize: 18,
        color: colors.CARD_LABEL
    },
    carphoto: {
        height: '18px',
        marginRight: '10px'
    },
    buttonStyle: props => ({
        margin: 0,
        width: '100%',
        height: 40,
        borderRadius: "30px",
        backgroundColor: WEB_MAIN_COLOR(props?.settings?.appCat),
        marginTop: '15px',
        color: colors.WHITE,
        fontWeight: "bold",
        fontFamily: FONT_FAMILY
    }),
    label: {
        transformOrigin: "top right",
        right: 0,
        left: "auto"
    },
    inputRtl: props => ({
        "& label": {
            right: 20,
            left: "auto",
            fontFamily: FONT_FAMILY

        },
        "& legend": {
            textAlign: "right",
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
        },
        fontFamily: FONT_FAMILY
    }),
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
        },
        fontFamily: FONT_FAMILY
    }),
    selectField: props => ({
        color: colors.BLACK,
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: WEB_MAIN_COLOR(props?.settings?.appCat),
        },
    }),
}));

export default function AddMoney(props) {
    const { t, i18n } = useTranslation();
    const isRTL = i18n.dir();
    const {
        addToWallet
    } = api;
    const { parseNumberInput, formatNumberInput } = api;
    const settings = useSelector(state => state.settingsdata.settings);
    const dispatch = useDispatch();
    const classes = useStyles({settings});
    const userdata = useSelector(state => state.usersdata);
    const [users, setUsers] = useState(null);
    const [commonAlert, setCommonAlert] = useState({ open: false, msg: '' });
    const [userCombo, setUserCombo] = useState(null);
    const [amount, setAmount] = useState(0);
    const [displayAmount, setDisplayAmount] = useState('0');
    const isMidScreen = useMediaQuery('(max-width:800px)');

    useEffect(() => {
        if (userdata.users) {
            let arr = [];
            for (let i = 0; i < userdata.users.length; i++) {
                let user = userdata.users[i];
                arr.push({
                    'firstName': user.firstName,
                    'lastName': user.lastName,
                    'mobile': user.mobile,
                    'email': user.email,
                    'uid': user.id,
                    'desc': user.firstName + ' ' + user.lastName + ' (' + (settings.AllowCriticalEditsAdmin ? user.mobile : t("hidden_demo")) + ') ' + (settings.AllowCriticalEditsAdmin ? user.email : t("hidden_demo")),
                    'pushToken': user.pushToken ? user.pushToken : ''
                });
            }
            setUsers(arr);
        }
    }, [userdata.users, settings.AllowCriticalEditsAdmin, t]);

    const handleAddBalance = () => {
        if (userCombo && userCombo.uid && amount > 0) {
            dispatch(addToWallet(userCombo.uid, amount));
            setCommonAlert({ open: true, msg: t('success') });
        } else {
            setCommonAlert({ open: true, msg: t('no_details_error') });
        }
    }

    const handleAmountChange = (event) => {
        const { value } = event.target;
        const isVietnamese = settings && settings.country === "Vietnam";

        if (isVietnamese) {
            // Parse Vietnamese input and get actual numeric value
            const numericValue = parseNumberInput(value, true);
            // Format for display
            const displayValue = formatNumberInput(numericValue, true);

            setAmount(numericValue);
            setDisplayAmount(displayValue);
        } else {
            const numericValue = value === '' || value === null || value === undefined ? 0 : parseFloat(value);
            setAmount(numericValue);
            setDisplayAmount(value);
        }
    }

    const handleCommonAlertClose = (e) => {
        e.preventDefault();
        setCommonAlert({ open: false, msg: '' })
    };

    return (
        <div className={classes.container} style={{ direction: isRTL === 'rtl' ? 'rtl' : 'ltr', maxWidth: isMidScreen && "100%" }}>
            <Grid item xs={12} sm={12} md={8} lg={8}>
                <Grid item >
                    <Grid item xs={12}>
                        <Typography className={classes.title} style={{ textAlign: isRTL === 'rtl' ? 'right' : 'left' }}>
                            {t('add_to_wallet_title')}
                        </Typography>
                    </Grid>
                    <div className={classes.container1}>
                        <Grid container spacing={2} >
                            <Grid item xs={12}>
                                {users ?
                                    <UsersCombo
                                        className={classes.items}
                                        placeholder={t('select_user')}
                                        users={users}
                                        value={userCombo}
                                        onChange={(event, newValue) => {
                                            setUserCombo(newValue);
                                        }}

                                    />
                                    : null}
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={6} xl={6} >
                                <TextField
                                    id="datetime-local"
                                    label={t('amount')}
                                    type="text"
                                    variant={"outlined"}
                                    fullWidth
                                    className={isRTL === 'rtl' ? classes.inputRtl : classes.textField}
                                    InputProps={{
                                        className: classes.input
                                    }}
                                    value={displayAmount}
                                    onChange={handleAmountChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={6} xl={6} >
                                <Button
                                    size="lg"
                                    onClick={handleAddBalance}
                                    variant="contained"
                                    color="secondaryButton"
                                    className={classes.buttonStyle}
                                >
                                    {t('add_to_wallet')}
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
            </Grid>
            <AlertDialog open={commonAlert.open} onClose={handleCommonAlertClose}>{commonAlert.msg}</AlertDialog>
        </div>
    );
}