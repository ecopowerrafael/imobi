const admin = require('firebase-admin');

module.exports.UpdateBooking = (bookingData,order_id,transaction_id,gateway) => {
    admin.database().ref("settings").once("value", async settingsdata => {
        let settings = settingsdata.val();
        if(settings.appCat === 'delivery'){
            if(bookingData.deliveryWithBid){
                let curChanges = {
                    status: 'ACCEPTED',
                    prepaid: true,
                    transaction_id: transaction_id,
                    gateway: gateway
                }
                Object.assign(curChanges, bookingData.paymentPacket);
            
                curChanges.driver = bookingData.selectedBid.driver;
                curChanges.driver_image =  bookingData.selectedBid.driver_image; 
                curChanges.driver_name = bookingData.selectedBid.driver_name;
                curChanges.driver_contact = bookingData.selectedBid.driver_contact;
                curChanges.driver_token = bookingData.selectedBid.driver_token;
                curChanges.vehicle_number = bookingData.selectedBid.vehicle_number;
                curChanges.vehicleModel = bookingData.selectedBid.vehicleModel;
                curChanges.vehicleMake = bookingData.selectedBid.vehicleMake;
                curChanges.driverRating = bookingData.selectedBid.driverRating;
                curChanges.trip_cost =  bookingData.selectedBid.trip_cost;
                curChanges.convenience_fees =  bookingData.selectedBid.convenience_fees;
                curChanges.driver_share =  bookingData.selectedBid.driver_share;
                curChanges.driverOffers = {};
                curChanges.requestedDrivers = {};
                curChanges.driverEstimates = {};
                curChanges.selectedBid = {};
                curChanges.fleetadmin = bookingData.selectedBid.fleetadmin ? bookingData.selectedBid.fleetadmin : null;
                curChanges.fleetCommission= bookingData.selectedBid.fleetadmin ? ((parseFloat( bookingData.selectedBid.trip_cost) - parseFloat(bookingData.selectedBid.convenience_fees)) * parseFloat(bookingData.fleet_admin_comission) / 100).toFixed(2):null;
            
                admin.database().ref('bookings').child(order_id).update(curChanges);
                admin.database().ref('users').child(curChanges.driver).update({queue:true});
            }else{
                let curChanges = {
                    status: 'NEW',
                    prepaid: true,
                    transaction_id: transaction_id,
                    gateway: gateway
                }
                Object.assign(curChanges, bookingData.paymentPacket);
                admin.database().ref('bookings').child(order_id).update(curChanges);
            }
        }else if(settings.appCat === 'taxi'){
            let curChanges = {
                status: bookingData.booking_from_web && !settings.prepaid? 'COMPLETE': settings.prepaid ? 'NEW' :'PAID',
                prepaid: settings.prepaid,
                transaction_id: transaction_id,
                gateway: gateway
            }
            Object.assign(curChanges, bookingData.paymentPacket);
            admin.database().ref('bookings').child(order_id).update(curChanges);
            admin.database().ref('users').child(bookingData.driver).update({queue:false});
        }else{
            let curChanges = {
                status: 'ACCEPTED',
                prepaid: true,
                transaction_id: transaction_id,
                gateway: gateway
            }
            Object.assign(curChanges, bookingData.paymentPacket);
        
            curChanges.driver = bookingData.selectedBid.driver;
            curChanges.driver_image =  bookingData.selectedBid.driver_image; 
            curChanges.driver_name = bookingData.selectedBid.driver_name;
            curChanges.driver_contact = bookingData.selectedBid.driver_contact;
            curChanges.driver_token = bookingData.selectedBid.driver_token;
            curChanges.vehicle_number = bookingData.selectedBid.vehicle_number;
            curChanges.vehicleModel = bookingData.selectedBid.vehicleModel;
            curChanges.vehicleMake = bookingData.selectedBid.vehicleMake;
            curChanges.driverRating = bookingData.selectedBid.driverRating;
            curChanges.trip_cost =  bookingData.selectedBid.trip_cost;
            curChanges.convenience_fees =  bookingData.selectedBid.convenience_fees;
            curChanges.driver_share =  bookingData.selectedBid.driver_share;
            curChanges.driverOffers = {};
            curChanges.requestedDrivers = {};
            curChanges.driverEstimates = {};
            curChanges.selectedBid = {};
            curChanges.fleetadmin = bookingData.selectedBid.fleetadmin ? bookingData.selectedBid.fleetadmin : null;
            curChanges.fleetCommission= bookingData.selectedBid.fleetadmin ? ((parseFloat( bookingData.selectedBid.trip_cost) - parseFloat(bookingData.selectedBid.convenience_fees)) * parseFloat(bookingData.fleet_admin_comission) / 100).toFixed(2):null;
        
            admin.database().ref('bookings').child(order_id).update(curChanges);
            admin.database().ref('users').child(curChanges.driver).update({queue:true});
        }
    })
}

module.exports.addEstimate = (bookingId, driverId, distance, deliveryWithBid) => {
    admin.database().ref("settings").once("value", async settingsdata => {
        let settings = settingsdata.val();
        if(settings.appCat === 'delivery'){
            if(deliveryWithBid){
                const timein_text = ((distance * 2) + 1).toFixed(0) + ' min';
                admin.database().ref('bookings/' + bookingId + '/driverEstimates/' + driverId).set({distance: distance, timein_text :  timein_text});
            }
            return true;
        }else if(settings.appCat === 'taxi'){
            return true;
        }else{
            const timein_text = ((distance * 2) + 1).toFixed(0) + ' min';
            admin.database().ref('bookings/' + bookingId + '/driverEstimates/' + driverId).set({distance: distance, timein_text :  timein_text});
            return true;
        }
    })
}

