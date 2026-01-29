import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, Dimensions } from 'react-native';
import { colors } from './theme';

import i18n from 'i18n-js';
import { api } from 'common';
import SingleBookingModal from '../components/SingleBookingModal';
import { Button, Tooltip, Icon } from 'react-native-elements';
import { fonts } from './font';

import { getLangKey } from 'common/src/other/getLangKey';

var { height, width } = Dimensions.get('window');

import appcat from '../../config/AppCat';

const { formatNumberInput, parseNumberInput, handleVietnameseNumberInput } = api;

export const APP_MAIN_COLOR = (appCat) =>
    appCat === "bidcab"
        ? colors.BIDTAXIPRIMARY
        : appCat === "delivery"
        ? colors.DELIVERYPRIMARY
        : colors.TAXIPRIMARY;

export const APP_MAIN_COLOR_DARK = (appCat) =>
    appCat === "bidcab"
        ? colors.BIDTAXIPRIMARYDARK
        : appCat === "delivery"
        ? colors.DELIVERYPRIMARYDARK
        : colors.TAXIPRIMARYDARK;

export const APP_SECONDORY_COLOR = (appCat) =>
    appCat === "bidcab"
        ? colors.BIDTAXISECONDORY
        : appCat === "delivery"
        ? colors.DELIVERYSECONDORY
        : colors.TAXISECONDORY;

export const appConstsObj = (appCat) => ({
    needEmergemcy: appCat === "delivery" ? false : true,
    hasMultiDrop: appCat === "bidcab" ? false : true,
    makePending: false,
    hasOptions: appCat === "delivery" ? true : false,
    checkWallet: appCat === "bidcab" ? false : true,
    acceptWithAmount: appCat === "bidcab" ? true : false,
    hasStartOtp: appCat === "delivery" ? false : true,
    canCall: appCat === "delivery" ? false : true,
    showBookingOptions: appCat === "delivery" ? true : false,
    captureBookingImage: appCat === "delivery" ? true : false,
});

export const checkSearchPhrase = (str, settings) => {
    return ( settings.appcat === "bidcab" ? str : "" );
}

export const CarHorizontal = (props) => {
    const { t } = i18n;
    const isRTL = i18n.locale.indexOf('he') === 0 || i18n.locale.indexOf('ar') === 0;
    const { onPress, carData, settings, styles, mode, formatAmount } = props;
    const [open, setOpen] = useState(false);

    const truncateText = (text, maxLength) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    return (
        <TouchableOpacity onPress={onPress} style={{ height: '100%', backgroundColor: mode === 'dark' ? colors.PAGEBACK : colors.WHITE }}>
            <View style={styles.imageStyle}>
                <Image resizeMode="contain" source={carData.image ? { uri: carData.image } : require('../../assets/images/microBlackCar.png')} style={styles.imageStyle1} />
            </View>
            <View style={styles.textViewStyle}>
                <Text style={[styles.text1, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{t(getLangKey(carData.name.toUpperCase()))}</Text>
                {
                    carData.extra_info && carData.extra_info != '' ?
                        <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>
                            <View style={{ justifyContent: 'space-around', flexDirection: 'column', alignItems: 'center', marginTop: 5 }}>
                                {
                                    carData.extra_info.split(',').map((ln) => <Text style={[styles.text2, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]} key={ln} >{truncateText(ln, 12)}</Text>)
                                }
                            </View>
                            <Tooltip style={{ marginLeft: 3, marginRight: 3 }}
                                backgroundColor={mode === 'dark' ? colors.PAGEBACK : colors.WHITE}
                                visible={open}
                                overlayColor={'rgba(50, 50, 50, 0.70)'}
                                height={100 + 30 * (carData.extra_info.split(',').length)}
                                width={100 + 30 * (carData.extra_info.split(',').length)}
                                skipAndroidStatusBar={true}
                                containerStyle={{ height: "auto", maxWidth: width - 20 }}
                                onOpen={() => {
                                    setOpen(true);
                                }}
                                onClose={() => {
                                    setOpen(false);
                                }}
                                popover={
                                    <View style={{ flexDirection: 'column', gap: 20, width: "100%", height: "100%" }}>
                                        {
                                            carData.extra_info.split(',').map((ln) => <Text style={{ fontFamily: fonts.Regular, color: mode === 'dark' ? colors.WHITE : colors.BLACK }} key={ln} >{ln}</Text>)
                                        }
                                    </View>
                                }>
                                <Icon
                                    name='information-circle-outline'
                                    type='ionicon'
                                    color={colors.BLUE}
                                    size={20}
                                />
                            </Tooltip>
                        </View>

                        : null
                }
                { appcat === "bidcab" ?
                   <View style={{ marginTop: 10 }}>
                        <Text style={[styles.text2, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>({carData.minTime != '' ? carData.minTime : t('not_available')})</Text>
                    </View>
                :
                <>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10, marginTop:5 }}>
                        {isRTL ?
                            null :
                            settings.swipe_symbol === false ?
                                <Text style={[styles.text2, { fontFamily:fonts.Bold, color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{settings.symbol}{formatAmount(carData.rate_per_unit_distance, settings.decimal, settings.country)} / {settings.convert_to_mile ? t('mile') : t('km')} </Text>
                                :
                                <Text style={[styles.text2, { fontFamily:fonts.Bold, color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{formatAmount(carData.rate_per_unit_distance, settings.decimal, settings.country)}{settings.symbol} / {settings.convert_to_mile ? t('mile') : t('km')} </Text>

                        }
                        {isRTL ?
                            settings.swipe_symbol === false ?
                                <Text style={[styles.text2, { fontFamily:fonts.Bold, color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{settings.symbol}{formatAmount(carData.rate_per_unit_distance, settings.decimal, settings.country)} / {settings.convert_to_mile ? t('mile') : t('km')} </Text>
                                :
                                <Text style={[styles.text2, { fontFamily:fonts.Bold, color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{formatAmount(carData.rate_per_unit_distance, settings.decimal, settings.country)}{settings.symbol} / {settings.convert_to_mile ? t('mile') : t('km')} </Text>
                            : null}
                    </View>
                    <View>
                        <Text style={[styles.text2,{color: mode === 'dark' ? colors.WHITE : colors.BLACK}]}>({carData.minTime != '' ? carData.minTime : t('not_available')})</Text>
                    </View>
                </>             
                }
            </View>
        </TouchableOpacity>
    )
}

export const CarVertical = (props) => {
    const { t } = i18n;
    const isRTL = i18n.locale.indexOf('he') === 0 || i18n.locale.indexOf('ar') === 0;
    const { onPress, carData, settings, styles, mode, formatAmount } = props;
    return (
        <TouchableOpacity
            style={[styles.carContainer, { borderWidth: 2, borderColor: carData.active == true ? mode === 'dark' ? APP_MAIN_COLOR_DARK(settings.appCat) : APP_MAIN_COLOR(settings.appCat) : colors.SHADOW, flexDirection: isRTL ? 'row-reverse' : 'row', backgroundColor: mode === 'dark' ? colors.PAGEBACK : colors.WHITE }]}
            onPress={onPress}
        >
            <Image
                source={carData.image ? { uri: carData.image } : require('../../assets/images/microBlackCar.png')}
                resizeMode="contain"
                style={styles.cardItemImagePlace}
            ></Image>
            <View style={[styles.bodyContent, { flexDirection: 'column', }]}>
                <Text style={[styles.titleStyles, { textAlign: isRTL ? 'right' : 'left', color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{t(getLangKey(carData.name.toUpperCase()))}</Text>
                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'column' }}>
                    {settings.swipe_symbol === false && (appcat === "delivery" || appcat === "taxi")?
                        <Text style={[styles.text2, { fontFamily:fonts.Bold, color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{settings.symbol}{formatAmount(carData.rate_per_unit_distance, settings.decimal, settings.country)} / {settings.convert_to_mile ? t('mile') : t('km')} </Text>
                        :
                        <Text style={[styles.text2, { fontFamily:fonts.Bold, color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{formatAmount(carData.rate_per_unit_distance, settings.decimal, settings.country)}{settings.symbol} / {settings.convert_to_mile ? t('mile') : t('km')} </Text>
                    }
                    {carData.extra_info && carData.extra_info != '' ?
                        <View style={{ justifyContent: 'space-around', marginLeft: 3, width: width - 180, }}>
                            {
                                carData.extra_info.split().map((ln) => <Text key={ln} style={[styles.text2, { fontFamily: fonts.Bold, color: mode === 'dark' ? colors.WHITE : colors.BLACK, textAlign: isRTL ? 'right' : 'left' }]} >{ln}</Text>)
                            }
                        </View>
                        : null}
                </View>
                <Text style={[styles.text2, { textAlign: isRTL ? 'right' : 'left', color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>({carData.minTime != '' ? carData.minTime : t('not_available')})</Text>
            </View>
        </TouchableOpacity>
    )
}

export const validateBookingObj = async (t, addBookingObj, instructionData, settings, bookingType, roundTrip, tripInstructions, tripdata, drivers, otherPerson, offerFare) => {
    const {
        getDistanceMatrix,
        GetDistance,
    } = api;
    if(appcat === "delivery"){
        addBookingObj['instructionData'] = instructionData;
    }else if(appcat === "bidcab"){
        addBookingObj['roundTrip'] = roundTrip;
        if (otherPerson) addBookingObj['instructionData'] = instructionData;
        addBookingObj['tripInstructions'] = tripInstructions;
        addBookingObj['offerFare'] = offerFare;
    }else{
        if(otherPerson)addBookingObj['instructionData'] = instructionData;
    }
    if (settings.autoDispatch && bookingType == false) {
        let preRequestedDrivers = {};
        let requestedDrivers = {};
        let driverEstimates = {};
        let startLoc = tripdata.pickup.lat + ',' + tripdata.pickup.lng;
        let distArr = [];
        let allDrivers = [];
        if (drivers && drivers.length > 0) {
            for (let i = 0; i < drivers.length; i++) {
                let driver = { ...drivers[i] };
                let distance = GetDistance(tripdata.pickup.lat, tripdata.pickup.lng, driver.location.lat, driver.location.lng);
                if (settings.convert_to_mile) {
                    distance = distance / 1.609344;
                }
                if (distance < ((settings && settings.driverRadius) ? settings.driverRadius : 10) && driver.carType === tripdata.carType.name) {
                    driver["distance"] = distance;
                    allDrivers.push(driver);
                }
            }
            const sortedDrivers = settings.useDistanceMatrix ? allDrivers.slice(0, 25) : allDrivers;
            if (sortedDrivers.length > 0) {
                let driverDest = "";
                for (let i = 0; i < sortedDrivers.length; i++) {
                    let driver = { ...sortedDrivers[i] };
                    driverDest = driverDest + driver.location.lat + "," + driver.location.lng
                    if (i < (sortedDrivers.length - 1)) {
                        driverDest = driverDest + '|';
                    }
                }
                if (settings.useDistanceMatrix) {
                    distArr = await getDistanceMatrix(startLoc, driverDest);
                } else {
                    for (let i = 0; i < sortedDrivers.length; i++) {
                        distArr.push({ timein_text: ((sortedDrivers[i].distance * 2) + 1).toFixed(0) + ' min', found: true })
                    }
                }
                for (let i = 0; i < sortedDrivers.length; i++) {
                    if (distArr[i].found) {
                        let driver = {}
                        driver.id = sortedDrivers[i].id;
                        driver.distance = sortedDrivers[i].distance;
                        driver.timein_text = distArr[i].timein_text;
                        if((appcat === "delivery" && addBookingObj.deliveryWithBid) || (appcat === "taxi" && !settings.prepaid) || appcat === "bidcab"){
                            requestedDrivers[driver.id] = true;
                        }else{
                            preRequestedDrivers[driver.id] = true;
                        }
                        driverEstimates[driver.id] = {distance: driver.distance, timein_text :  driver.timein_text};
                    }
                }
                addBookingObj['preRequestedDrivers'] = preRequestedDrivers;
                addBookingObj['requestedDrivers'] = requestedDrivers;
                addBookingObj['driverEstimates'] = driverEstimates;
            }
        } else {
            return { error: true, msg: t('no_driver_found_alert_messege') }
        }
    }
    return { addBookingObj };
}

export default function BookingModal(props) {
    return (
        <SingleBookingModal {...props} />
    )
}

export const prepareEstimateObject = async (tripdata, instructionData) => {
    const { t } = i18n;
    const {
        getDirectionsApi
    } = api;
    try {
        const startLoc = tripdata.pickup.lat + ',' + tripdata.pickup.lng;
        const destLoc = tripdata.drop.lat + ',' + tripdata.drop.lng;
        let routeDetails = appcat === "delivery" ? await getDirectionsApi(startLoc, destLoc, null) : null;
        let waypoints = '';
        if (tripdata.drop && tripdata.drop.waypoints && tripdata.drop.waypoints.length > 0) {
            const origin = tripdata.pickup.lat + ',' + tripdata.pickup.lng;
            const arr = tripdata.drop.waypoints;
            for (let i = 0; i < arr.length; i++) {
                waypoints = waypoints + arr[i].lat + ',' + arr[i].lng;
                if (i < arr.length - 1) {
                    waypoints = waypoints + '|';
                }
            }
            const destination = tripdata.drop.lat + ',' + tripdata.drop.lng;
            routeDetails = await getDirectionsApi(origin, destination, waypoints);
        } else {
            routeDetails = await getDirectionsApi(startLoc, destLoc, null);
        }
        const estimateObject = {
            pickup: { coords: { lat: tripdata.pickup.lat, lng: tripdata.pickup.lng }, description: tripdata.pickup.add },
            drop: { coords: { lat: tripdata.drop.lat, lng: tripdata.drop.lng }, description: tripdata.drop.add, waypointsStr: waypoints != '' ? waypoints : null, waypoints: waypoints != '' ? tripdata.drop.waypoints : null },
            carDetails: tripdata.carType,
            routeDetails: routeDetails,
            instructionData: appcat === "delivery" ? instructionData : null
        };
        return { estimateObject };
    } catch (err) {
        return { error: true, msg: t('not_available') }
    }
}

export const ExtraInfo = (props) => {
    const { t } = i18n;
    const isRTL = i18n.locale.indexOf('he') === 0 || i18n.locale.indexOf('ar') === 0;
    const { estimate, item, uid, amount, setAmount, styles, onPressAccept, settings, mode, formatAmount } = props;
    const nextPrice = parseFloat((parseFloat(item.estimate) + parseFloat((item.estimate * 10) / 100)).toFixed(2));
    const prePrice = parseFloat((parseFloat(item.estimate) - parseFloat((item.estimate * 10) / 100)).toFixed(2));

    // Vietnamese number input support for bid amount
    const isVietnamese = settings?.country === "Vietnam";
    const displayAmount = isVietnamese && amount[item.id] ? formatNumberInput(amount[item.id], true) : (amount[item.id] && !isNaN(amount[item.id]) ? amount[item.id].toString() : null);

    const handleBidAmountChange = (value) => {
        if (isVietnamese) {
            handleVietnameseNumberInput(value, (numericValue, displayValue) => {
                let allAmts = { ...amount };
                allAmts[item.id] = numericValue.toString();
                setAmount(allAmts);
            });
        } else {
            let allAmts = { ...amount };
            allAmts[item.id] = value;
            setAmount(allAmts);
        }
    };
    return (
        <>
        { appcat === "delivery" ?
            <View style={[styles.textContainerStyle, {flexDirection: isRTL? 'row-reverse' : 'row'}]}>
                <Text style={[styles.textHeading,{color: mode === 'dark' ? colors.WHITE : colors.BLACK}]}>{t('payment_mode')}</Text>
                <Text style={[styles.textContent,{color: mode === 'dark' ? colors.WHITE : colors.BLACK}]}>
                {t(item.payment_mode)}
                </Text>
            </View>
        : appcat === "bidcab" ?
         <>
            <View style={[styles.textContainerStyle, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <View style={{ width: 'auto' }}>
                    <Text style={[styles.textHeading, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{t('tripInstructions')} - </Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.textContent, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>
                        {item ? (item.tripInstructions) : ''}
                    </Text>
                </View>
            </View>
            <View style={[styles.textContainerStyle, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={[styles.textHeading, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{t('roundTrip')} - </Text>
                <Text style={[styles.textContent, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>
                    {item.roundTrip ? t('yes') : t('no')}
                </Text>
            </View>
            <View style={[styles.textContainerStyle, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                <Text style={[styles.textHeading, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{t('payment_mode')}</Text>
                <Text style={[styles.textContent, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>
                    {t(item.payment_mode)}
                </Text>
            </View>

            {
                (item.driver === uid) ?
                    <View style={[styles.textContainerStyle, styles.priceView, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                        <Text style={[styles.priceViewHeading, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{t('trip_cost')} - </Text>
                        {settings.swipe_symbol === false ?
                            <Text style={[styles.priceViewContent, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{settings.symbol}{formatAmount(item.trip_cost, settings.decimal, settings.country)}</Text>
                            :
                            <Text style={[styles.priceViewContent, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{formatAmount(item.trip_cost, settings.decimal, settings.country)}{settings.symbol}</Text>
                        }
                    </View>
                    : <View style={styles.priceView}>
                        {
                            settings.disablesystemprice ?
                                (
                                    settings && !settings.coustomerBidPrice ?
                                        (
                                            item.customer_offer ?
                                                <View style={[styles.textContainerStyle, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                                    <Text style={[styles.priceViewHeading, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{t('customer_offer')} - </Text>
                                                    {settings.swipe_symbol === false ?
                                                        <Text style={[styles.priceViewContent, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{settings.symbol}{formatAmount(item.customer_offer, settings.decimal, settings.country)}</Text>
                                                        :
                                                        <Text style={[styles.priceViewContent, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{formatAmount(item.customer_offer, settings.decimal, settings.country)}{settings.symbol}</Text>
                                                    }
                                                </View>
                                                :
                                                <View style={[styles.textContainerStyle, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
                                                    <Text style={[styles.priceViewHeading, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{t('customer_offer')} - </Text>
                                                    {settings.swipe_symbol === false ?
                                                        <Text style={[styles.priceViewContent, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{settings.symbol}{formatAmount(item.trip_cost, settings.decimal, settings.country)}</Text>
                                                        :
                                                        <Text style={[styles.priceViewContent, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{formatAmount(item.trip_cost, settings.decimal, settings.country)}{settings.symbol}</Text>
                                                    }
                                                </View>
                                        )
                                        :
                                        null
                                )
                                : null
                        }
                    </View>
            }


            {settings && !settings.disablesystemprice ?
                <>
                    {item.status == 'NEW' && !(item.driverOffers && item.driverOffers[uid]) ?
                        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-evenly', alignItems: 'center', marginTop: 10 }}>
                            <Button
                                onPress={() => {
                                    let allAmts = { ...amount };
                                    allAmts[item.id] = prePrice;
                                    setAmount(allAmts);
                                    onPressAccept(item, prePrice);
                                }}
                                title={prePrice}
                                buttonStyle={{
                                    backgroundColor: mode === 'dark' ? MAIN_COLOR_DARK : MAIN_COLOR,
                                    minHeight: 45,
                                    padding: 2,
                                    borderColor: colors.TRANSPARENT,
                                    borderWidth: 0,
                                    borderRadius: 10,
                                }}
                                titleStyle={{
                                    alignSelf: 'center',
                                    padding: 10
                                }}
                            />
                            <Button
                                onPress={() => {
                                    let allAmts = { ...amount };
                                    allAmts[item.id] = item.estimate;
                                    setAmount(allAmts);
                                    onPressAccept(item, item.estimate);
                                }}
                                title={Math.round(item.estimate * 100) / 100}
                                buttonStyle={{
                                    backgroundColor: mode === 'dark' ? MAIN_COLOR_DARK : MAIN_COLOR,
                                    minHeight: 45,
                                    padding: 2,
                                    borderColor: colors.TRANSPARENT,
                                    borderWidth: 0,
                                    borderRadius: 10,
                                }}
                                titleStyle={{
                                    alignSelf: 'center',
                                    padding: 10
                                }}
                            />
                            <Button
                                onPress={() => {
                                    let allAmts = { ...amount };
                                    allAmts[item.id] = nextPrice;
                                    setAmount(allAmts);
                                    onPressAccept(item, nextPrice);
                                }}
                                title={nextPrice}
                                buttonStyle={{
                                    backgroundColor: mode === 'dark' ? MAIN_COLOR_DARK : MAIN_COLOR,
                                    minHeight: 45,
                                    padding: 2,
                                    borderColor: colors.TRANSPARENT,
                                    borderWidth: 0,
                                    borderRadius: 10,
                                }}
                                titleStyle={{
                                    alignSelf: 'center',
                                    padding: 10
                                }}
                            />
                        </View>
                        : null}
                </>
                : null}
            {item.status == 'NEW' && !(item.driverOffers && item.driverOffers[uid]) ?
                <View style={[styles.box, { backgroundColor: mode === 'dark' ? colors.PAGEBACK : colors.WHITE }]}>
                    <TextInput
                        style={[styles.dateTextStyle, { textAlign: isRTL ? "right" : "left", paddingHorizontal: 10, color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}
                        placeholder={t('amount')}
                        placeholderTextColor={colors.SHADOW}
                        onChangeText={handleBidAmountChange}
                        value={displayAmount}
                        keyboardType={isVietnamese ? "default" : "number-pad"}
                    />
                </View>
                : null}
        </>
        :
        <>

            <View style={styles.textContainerStyle}>
                <Text style={[styles.textHeading, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{t('pickUpInstructions')}</Text>
                <Text style={[styles.textContent, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>
                    {item ? item.pickUpInstructions : ''}
                </Text>
            </View>
            <View style={[styles.textContainerStyle]}>
                <Text style={[styles.textHeading, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{t('deliveryInstructions')}</Text>
                <Text style={[styles.textContent, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>
                    {item ? item.deliveryInstructions : ''}
                </Text>
            </View>
            <View style={[styles.deliveryOption, { flexDirection: isRTL ? 'row-reverse' : 'row', borderColor: colors.SHADOW }]}>
                {item?.parcelTypeSelected?.description && (
                    <View style={{ width: width / 3, alignItems: 'center', marginHorizontal: -10 }}>
                        <Text style={[styles.textHeading, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{t('parcel_type')}</Text>
                        <Text style={[styles.textContent, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>
                            {item && item.parcelTypeSelected ? t(getLangKey(item.parcelTypeSelected.description)) : ''}
                        </Text>
                    </View>
                )}
                {item?.optionSelected?.description && (
                    <View style={{ width: width / 3, alignItems: 'center' }}>
                        <Text style={[styles.textHeading, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{t('options').toUpperCase()}</Text>
                        <Text style={[styles.textContent, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>
                            {item && item.optionSelected ? t(getLangKey(item.optionSelected.description)) : ''}
                        </Text>
                    </View>
                )}
                <View style={{ width: width / 3, alignItems: 'center' }}>
                    <Text style={[styles.textHeading, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>{t('payment_mode')}</Text>
                    <Text style={[styles.textContent, { color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}>
                        {t(item.payment_mode)}
                    </Text>
                </View>
            </View>
            {item.deliveryWithBid ?
                <>
                    {item.status == 'NEW' && !(item.driverOffers && item.driverOffers[uid]) ?
                        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-evenly', alignItems: 'center', marginTop: 10 }}>
                            <Button
                                onPress={() => {
                                    let allAmts = { ...amount };
                                    allAmts[item.id] = prePrice;
                                    setAmount(allAmts);
                                    onPressAccept(item, prePrice);
                                }}
                                title={prePrice}
                                buttonStyle={{
                                    backgroundColor: mode === 'dark' ? MAIN_COLOR_DARK : MAIN_COLOR,
                                    minHeight: 45,
                                    padding: 2,
                                    borderColor: colors.TRANSPARENT,
                                    borderWidth: 0,
                                    borderRadius: 10,
                                }}
                                titleStyle={{
                                    alignSelf: 'center',
                                    padding: 10
                                }}
                            />
                            <Button
                                onPress={() => {
                                    let allAmts = { ...amount };
                                    allAmts[item.id] = item.estimate;
                                    setAmount(allAmts);
                                    onPressAccept(item, item.estimate);
                                }}
                                title={item.estimate}
                                buttonStyle={{
                                    backgroundColor: mode === 'dark' ? MAIN_COLOR_DARK : MAIN_COLOR,
                                    minHeight: 45,
                                    padding: 2,
                                    borderColor: colors.TRANSPARENT,
                                    borderWidth: 0,
                                    borderRadius: 10,
                                }}
                                titleStyle={{
                                    alignSelf: 'center',
                                    padding: 10
                                }}
                            />
                            <Button
                                onPress={() => {
                                    let allAmts = { ...amount };
                                    allAmts[item.id] = nextPrice;
                                    setAmount(allAmts);
                                    onPressAccept(item, nextPrice);
                                }}
                                title={nextPrice}
                                buttonStyle={{
                                    backgroundColor: mode === 'dark' ? MAIN_COLOR_DARK : MAIN_COLOR,
                                    minHeight: 45,
                                    padding: 2,
                                    borderColor: colors.TRANSPARENT,
                                    borderWidth: 0,
                                    borderRadius: 10,
                                }}
                                titleStyle={{
                                    alignSelf: 'center',
                                    padding: 10
                                }}
                            />
                        </View>
                        : null}


                    {item.status == 'NEW' && !(item.driverOffers && item.driverOffers[uid]) ?
                        <View style={[styles.box, { backgroundColor: mode === 'dark' ? colors.PAGEBACK : colors.WHITE }]}>
                            <TextInput
                                style={[styles.dateTextStyle, { textAlign: isRTL ? "right" : "left", color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}
                                placeholder={t('amount')}
                                placeholderTextColor={mode === 'dark' ? colors.WHITE : colors.BLACK}
                                onChangeText={handleBidAmountChange}
                                value={displayAmount}
                                keyboardType={isVietnamese ? "default" : "number-pad"}
                            />
                        </View>
                        : null}
                </>
                : null}
            </>
            }
        </>
    )
}

export const RateView = (props) => {
    const { settings, item, styles, uid, formatAmount } = props;
    return (
        appcat === "delivery" ?
        <View style={styles.rateViewStyle}>
            {settings.swipe_symbol === false ?
                <Text style={styles.rateViewTextStyle}>{settings.symbol}{item ? item.estimate > 0 ? formatAmount(item.estimate, settings.decimal, settings.country) : 0 : null}</Text>
                :
                <Text style={styles.rateViewTextStyle}>{item ? item.estimate > 0 ? formatAmount(item.estimate, settings.decimal, settings.country) : 0 : null}{settings.symbol}</Text>
            }
        </View>
        : appcat === "bidcab" ?
            item && item.driverOffers && item.driverOffers[uid] ?
            <View style={styles.rateViewStyle}>
                {settings.swipe_symbol === false ?
                    <Text style={styles.rateViewTextStyle}>{settings.symbol}{formatAmount(item.driverOffers[uid].trip_cost, settings.decimal, settings.country)}</Text>
                    :
                    <Text style={styles.rateViewTextStyle}>{formatAmount(item.driverOffers[uid].trip_cost, settings.decimal, settings.country)}{settings.symbol}</Text>
                }
            </View>

            : null
        :
        <View style={styles.rateViewStyle}>
            {item.deliveryWithBid ?
                item && item.driverOffers && item.driverOffers[uid] ?
                    <View style={styles.rateViewStyle}>
                        {settings.swipe_symbol === false ?
                            <Text style={styles.rateViewTextStyle}>{settings.symbol}{formatAmount(item.driverOffers[uid].trip_cost, settings.decimal, settings.country)}</Text>
                            :
                            <Text style={styles.rateViewTextStyle}>{formatAmount(item.driverOffers[uid].trip_cost, settings.decimal, settings.country)}{settings.symbol}</Text>
                        }
                    </View>

                    : null :
                settings.swipe_symbol === false ?
                    <Text style={styles.rateViewTextStyle}>{settings.symbol}{item ? item.estimate > 0 ? formatAmount(item.estimate, settings.decimal, settings.country) : 0 : null}</Text>
                    :
                    <Text style={styles.rateViewTextStyle}>{item ? item.estimate > 0 ? formatAmount(item.estimate, settings.decimal, settings.country) : 0 : null}{settings.symbol}</Text>
            }
        </View>
    )
}