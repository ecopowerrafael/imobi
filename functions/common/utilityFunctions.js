const fetch = require("node-fetch");
const { validateBasicAuth } = require("regularusedfunctions");

const formatUserProfile = async (request, config, data) => {
    const user = await validateBasicAuth(request.headers.authorization, config);
    if(user){
        const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        const reference = [...Array(5)].map(_ => c[~~(Math.random()*c.length)]).join('');
        let userData = {
            uid: data.uid,
            createdAt: new Date().getTime(),
            firstName: data.firstName,
            lastName: data.lastName,
            mobile: data.mobile,
            email: data.email,
            usertype: 'customer',
            referralId: reference,
            approved: true,
            walletBalance: 0,
            verifyId: data.verifyId
        }

        if(data.countryDetail && data.countryDetail.country){
            userData.country = data.countryDetail.country;
        }

        if(data.countryDetail && data.countryDetail.country_code){
            userData.country_code = data.countryDetail.country_code;
        }

        if(data.countryDetail && data.countryDetail.currency_code){
            userData.currency_code = data.countryDetail.currency_code;
        }

        if(data.countryDetail && data.countryDetail.swipe_symbol){
            userData.swipe_symbol = data.countryDetail.swipe_symbol;
        }

        if(data.countryDetail && data.countryDetail.symbol){
            userData.symbol = data.countryDetail.symbol;
        }

        if(data.profile_image){
            userData['profile_image'] = data.profile_image;
        }
        return userData;
    } else{
        return({ error: 'Unauthorized api call' });
    }
}

const apiCallGoogle = async (request, settings, config) => {
    const user = await validateBasicAuth(request.headers.authorization, config);
    if (!user || !settings) {
        return { error: 'Unauthorized API call' };
    }
    
    let url = '';

    let postHeader = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': config.googleApiKeys.server,
    };

    let options = {};

    const { searchKeyword, place_id, latlng, start, dest, calltype, waypoints, sessiontoken } = request.body;

    if (searchKeyword) {
        url = `https://places.googleapis.com/v1/places:autocomplete`;
        postHeader['X-Goog-FieldMask'] = 'suggestions.placePrediction.text,suggestions.placePrediction.placeId';
        let body = {  
            "input": searchKeyword,
            "sessionToken": sessiontoken
        };
        
        if(settings.restrictCountry){
            body['includedRegionCodes'] = [settings.restrictCountry];
        }

        if(settings.mapLanguage){
            body['languageCode'] = settings.mapLanguage;
        }

        options = {
            method: 'POST',
            headers: postHeader,
            body: JSON.stringify(body)
        }
    }
    
    if (place_id) {
        url = `https://places.googleapis.com/v1/places/${place_id}${settings.mapLanguage ? `?languageCode=${settings.mapLanguage}` : ''}`;
        postHeader['X-Goog-FieldMask'] = 'id,displayName,location';
        options = {
            method: 'GET',
            headers: postHeader,
        };
    }
    
    if (latlng) {
        url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng}&key=${config.googleApiKeys.server}`;
        options = {
            method: 'GET'
        }
    }

    if (start && dest && calltype === 'direction') {
        url = `https://routes.googleapis.com/directions/v2:computeRoutes`;
        postHeader['X-Goog-FieldMask'] = 'routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.travelAdvisory.tollInfo,routes.legs.travelAdvisory.tollInfo';
        let body = {  
            "origin": { location: { latLng: { latitude: parseFloat(start.split(',')[0]), longitude: parseFloat(start.split(',')[1]) } } },
            "destination": { location: { latLng: { latitude: parseFloat(dest.split(',')[0]), longitude: parseFloat(dest.split(',')[1]) } } },
            "computeAlternativeRoutes": false,
            "routeModifiers": {
                "avoidTolls": false,
                "avoidHighways": false,
                "avoidFerries": false
            },
            "travelMode": "DRIVE"
        };
        
        if (waypoints) {
            body.intermediates = waypoints.split('|').map(wp => {
                const [lat, lng] = wp.split(',');
                return { location: { latLng: { latitude: parseFloat(lat), longitude: parseFloat(lng) } } };
            });
        }
        
        options = {
            method: 'POST',
            headers: postHeader,
            body: JSON.stringify(body)
        }
    }
    
    
    if (start && dest && calltype === 'matrix') {
        url = `https://routes.googleapis.com/distanceMatrix/v2:computeRouteMatrix`;
        postHeader['X-Goog-FieldMask'] = 'originIndex,destinationIndex,duration,distanceMeters,status,condition';
        const destinations = dest
            .split('|')
            .map(coord => {
                const [latitude, longitude] = coord.split(',').map(Number);
                return {
                "waypoint": {
                    "location": {
                        "latLng": { latitude, longitude }
                    }
                }
                };
            });
        let body = {  
            "origins": { "waypoint": {location: { latLng: { latitude: parseFloat(start.split(',')[0]), longitude: parseFloat(start.split(',')[1]) } } }},
            "destinations": destinations,
            "travelMode": "DRIVE",
            "routingPreference": "TRAFFIC_AWARE"
        };
        
        options = {
            method: 'POST',
            headers: postHeader,
            body: JSON.stringify(body)
        }
    }
    
    const res = await fetch(url, options);

    const json = await res.json();
    
    if (json.suggestions) {
        const oldFormat = json.suggestions.map(s => ({
            place_id: s.placePrediction.placeId,
            description: s.placePrediction.text.text
        }));

        const resBody = { searchResults: oldFormat };
        return resBody;
    }
    
    if (json.location) {
        const resBody = { 
            coords: {
                lat: json.location.latitude,
                lng: json.location.longitude
            }
        };
        return resBody;
    }
    
    if (json.results && json.results.length > 0 && json.results[0].formatted_address && request.body.latlng) {
        const resBody = {
            address: json.results[0].formatted_address
        };
        return resBody;
    }
    
    if (json.routes && json.routes.length > 0 && calltype === 'direction') {
        const route = json.routes[0];
        const resBody = {
            distance_in_km: route.distanceMeters / 1000,
            time_in_secs: route.duration.split('s')[0],
            polylinePoints: route.polyline.encodedPolyline
        };
        return resBody;
    }

    if (json && json.length > 0 && calltype === 'matrix') {
        const resBody = json.map(item => ({
            found: item.condition === "ROUTE_EXISTS",
            distance_in_km: item.distanceMeters? (item.distanceMeters / 1000) : 0,
            time_in_secs: parseInt(item.duration.split('s')[0]) || 0,
            timein_text: `${Math.round((parseInt(item.duration.split('s')[0]) || 0) / 60)} mins`
        }));
        return resBody;
    }
    
    return { error: 'No results found' };
};

const valSignupData = async (userDetails, settings) => {
    const c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const reference = [...Array(5)].map(_ => c[~~(Math.random()*c.length)]).join('');
    let regData = {
        createdAt: new Date().getTime(),
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        mobile: userDetails.mobile,
        email: userDetails.email,
        usertype: userDetails.usertype,
        referralId: reference,
        approved: true,
        walletBalance: 0,
        pushToken: 'init',
        signupViaReferral: userDetails.signupViaReferral? userDetails.signupViaReferral: " "
    };
    if(userDetails.country){
        regData.country = userDetails.country;
    }
    if(userDetails.country_code){
        regData.country_code = userDetails.country_code;
    }
    if(userDetails.currency_code){
        regData.currency_code = userDetails.currency_code;
    }
    if(userDetails.swipe_symbol){
        regData.swipe_symbol = userDetails.swipe_symbol;
    }
    if(userDetails.symbol){
        regData.symbol = userDetails.symbol;
    }
    if(regData.usertype === "driver" || regData.usertype === "customer" || regData.usertype === "fleetadmin"){
        if (userDetails.usertype === 'driver') {
            regData.queue = false;
            regData.driverActiveStatus = false;
            if (settings.driver_approval) {
                regData.approved = false;
            }
        } 
        return regData;
    } else{
        return { error: "Usertype not valid" };
    }
}

const otpCheck = async (mobile,listData) => {
  let data = {};
  let key = null;
  let errorStr = null;
  const info = Object.keys(listData? listData: {});
  for( let i=0;i<info.length; i++){
      if(listData[info[i]].mobile === mobile){
          data = listData[info[i]];
          key = info[i];
          if(data.count && data.count === 2 && otp!==data.otp){
              errorStr = "Maximum tries exceeded";
              return { errorStr: errorStr };
          }
          let date1 = new Date();
          let date2 = new Date(data.dated);
          let diffTime = date1 - date2;
          let diffMins = diffTime / (1000 * 60);
          if(diffMins>5){
              errorStr = "OTP is valid for 5 mins only"
              return { errorStr: errorStr };
          }
          return { data: data, key: key };
      }
  }
  return { errorStr: "No db match for OTP" };
}

const callMsgApi = async (smsConfig, data) => {
    if(smsConfig.apiUrl && smsConfig.apiUrl.length>0){
        let headers = {
            'Content-Type': smsConfig.contentType
        };
        if(smsConfig.authorization && smsConfig.authorization.length> 0) {
            headers['Authorization'] = smsConfig.authorization
        }

        let apiUrl = smsConfig.apiUrl && smsConfig.apiUrl.length>1? smsConfig.apiUrl.replace(/{mobile}/gi, data.mobile).replace(/{otp}/gi, data.otp): null;
        let method = smsConfig.method && smsConfig.method.length> 1?  smsConfig.method: "POST";
        let body = smsConfig.body && smsConfig.body.length>1? smsConfig.body.replace(/{mobile}/gi, data.mobile).replace(/{otp}/gi, data.otp).replace(/\+/gi,"%2B"): null;

        try{
            const res = await fetch(apiUrl, {
                method: method,
                headers: headers,
                body: body
            });
            return({ success: true });
        } catch (error){
            return({ error: "SMS Gateway Error" });
        }
    } else{
        return({ error: "SMS Settings not found" });
    }
}
  
module.exports = { apiCallGoogle, valSignupData, otpCheck, callMsgApi, formatUserProfile }