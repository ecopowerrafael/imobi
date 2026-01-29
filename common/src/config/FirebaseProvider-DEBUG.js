import React, { createContext } from 'react';
import { initializeApp, getApp, getApps } from "firebase/app";
import { getDatabase, ref, query, orderByChild, equalTo } from "firebase/database";
import { initializeAuth, getAuth, GoogleAuthProvider, OAuthProvider, signInWithPhoneNumber, PhoneAuthProvider, RecaptchaVerifier, unlink, updatePhoneNumber, linkWithPhoneNumber, browserLocalPersistence, browserPopupRedirectResolver } from "firebase/auth";
import { getStorage, ref as stRef } from "firebase/storage";

const FirebaseContext = createContext(null);

let firebase = {
    app: null,
    database: null,
    auth: null,
    storage: null,
}   

const createFullStructure = (app, db, auth, storage, config) => {
    return {
        app: app,
        config: config,
        database: db,
        auth: auth,
        storage: storage,
        authRef:getAuth,
        googleProvider:new GoogleAuthProvider(),
        appleProvider:new OAuthProvider('apple.com'),
        phoneProvider:new PhoneAuthProvider(auth),          
        RecaptchaVerifier: RecaptchaVerifier,
        signInWithPhoneNumber: signInWithPhoneNumber,   
        updatePhoneNumber:updatePhoneNumber,
        unlink: unlink,
        googleCredential: (idToken, accessToken)=> GoogleAuthProvider.credential(idToken, accessToken),    
        linkWithPhoneNumber: linkWithPhoneNumber,
        mobileAuthCredential: (verificationId,code) => PhoneAuthProvider.credential(verificationId, code),           
        usersRef: ref(db, 'users'),
        bookingRef: ref(db, 'bookings'),
        cancelreasonRef: ref(db, 'cancel_reason'),
        settingsRef: ref(db, 'settings'),
        smtpRef: ref(db, "smtpdata"),
        smsRef: ref(db, "smsConfig"),
        carTypesRef: ref(db, 'cartypes'),
        carTypesEditRef:(id) => ref(db, "cartypes/"+ id),
        carDocImage:(id) =>  stRef(storage, `cartypes/${id}`),     
        promoRef: ref(db, 'promos'),
        promoEditRef:(id) => ref(db, "promos/"+ id),
        notifyRef: ref(db,"notifications/"),
        notifyEditRef:(id) => ref(db, "notifications/"+ id),
        addressRef: (uid,id) =>  ref(db, "savedAddresses/"+ uid + "/" + id),
        addressEditRef:(uid) => ref(db, "savedAddresses/"+ uid),
        singleUserRef:(uid) => ref(db, "users/" + uid),
        profileImageRef:(uid) => stRef(storage,`users/${uid}/profileImage`),
        verifyIdImageRef:(uid) => stRef(storage,`users/${uid}/verifyIdImage`),
        bookingImageRef:(bookingId,imageType) => stRef(storage,`bookings/${bookingId}/${imageType}`),
        driversRef: query(ref(db, "users"), orderByChild("usertype"), equalTo("driver")),
        driverDocsRef:(uid) => stRef(storage,`users/${uid}/license`),       
        driverDocsRefBack:(uid) => stRef(storage,`users/${uid}/licenseBack`),         
        singleBookingRef:(bookingKey) => ref(db, "bookings/" + bookingKey),
        requestedDriversRef:(bookingKey ) => ref(db, "bookings/" + bookingKey  + "/requestedDrivers"),
        referralIdRef:(referralId) => query(ref(db, "users"), orderByChild("referralId"), equalTo(referralId)),
        trackingRef: (bookingId) => ref(db, 'tracking/' + bookingId),
        tasksRef:() => query(ref(db, 'bookings'), orderByChild('status'), equalTo('NEW')),
        singleTaskRef:(uid,bookingId) => ref(db, "bookings/" + bookingId  + "/requestedDrivers/" + uid),
        bookingListRef:(uid,role) => 
            role == 'customer'? query(ref(db, 'bookings'), orderByChild('customer'), equalTo(uid)):
                (role == 'driver'? 
                    query(ref(db, 'bookings'), orderByChild('driver'), equalTo(uid))
                    :
                    (role == 'fleetadmin'? 
                        query(ref(db, 'bookings'), orderByChild('fleetadmin'), equalTo(uid))
                        : ref(db, 'bookings')
                    )
                ),
        chatRef:(bookingId) => ref(db, 'chats/' + bookingId + '/messages'),
        withdrawRef: ref(db, 'withdraws/'),
        languagesRef: ref(db, "languages"),
        languagesEditRef:(id) => ref(db, "languages/"+ id),
        langEditRef:(id) => ref(db, `languages/${id}/keyValuePairs/`),
        walletHistoryRef:(uid) => ref(db, "walletHistory/" + uid),  
        userNotificationsRef:(uid) =>  ref(db, "userNotifications/"+ uid),
        userRatingsRef:(uid) =>  ref(db, "userRatings/"+ uid),
        carsRef:(uid,role) => role == 'driver'? 
            query(ref(db, 'cars'), orderByChild('driver'), equalTo(uid))
            :(role == 'fleetadmin'? 
                query(ref(db, 'cars'), orderByChild('fleetadmin'), equalTo(uid))
                : ref(db, 'cars')
            ),
        carAddRef: ref(db, "cars"),
        carEditRef:(id) => ref(db, "cars/"+ id),
        carImage:(id) => stRef(storage,`cars/${id}`),   
        allLocationsRef: ref(db, "locations"),
        userLocationRef:(uid) => ref(db, "locations/"+ uid),
        sosRef: ref(db, 'sos'),
        editSosRef:(id) => ref(db, "sos/" +id),
        complainRef: ref(db, 'complain'),
        editComplainRef:(id) => ref(db, "complain/" +id),
        paymentSettingsRef: ref(db, "payment_settings"),
        usedreferralRef:ref(db,'usedreferral'),
    }
}

const FirebaseProvider  = ({ config, children, AsyncStorage, token }) => {
    let app, auth, database, storage;

    // ✅ DEBUG: Verifica se config foi passado
    if (!config) {
        console.error("❌ ERRO CRÍTICO: FirebaseConfig não foi passado ao FirebaseProvider!");
        return (
            <div style={{ padding: '20px', color: 'red', fontFamily: 'monospace' }}>
                <h3>❌ ERRO DE CONFIGURAÇÃO</h3>
                <p>FirebaseConfig não foi passado ao FirebaseProvider.</p>
                <p>Verifique se App.js está passando o config corretamente:</p>
                <pre>&lt;FirebaseProvider config={FirebaseConfig}&gt;</pre>
            </div>
        );
    }

    // ✅ DEBUG: Log da inicialização
    console.log("🔥 Inicializando Firebase com config:", {
        projectId: config.projectId,
        authDomain: config.authDomain,
        databaseURL: config.databaseURL
    });

    if (!getApps().length) {
        try {
            console.log("📱 Inicializando App Firebase...");
            app = initializeApp(config);
            console.log("✅ App Firebase inicializado");

            if (typeof document !== 'undefined') {
                // Web environment
                console.log("🌐 Ambiente Web detectado");
                auth = initializeAuth(app, {
                    persistence: browserLocalPersistence,
                    popupRedirectResolver: browserPopupRedirectResolver,
                });
                console.log("✅ Auth Web inicializado");
            }
            else{
                // React Native environment
                console.log("📱 Ambiente React Native detectado");
                if (AsyncStorage) {
                    const { getReactNativePersistence } = require("firebase/auth");
                    auth = initializeAuth(app, {
                        persistence: getReactNativePersistence(AsyncStorage)
                    });
                    console.log("✅ Auth RN inicializado");
                } else {
                    console.warn("⚠️ AsyncStorage não fornecido, auth não persistirá");
                    auth = getAuth(app);
                }
            }
            
            console.log("📊 Inicializando Database...");
            database = getDatabase(app);
            console.log("✅ Database inicializado");
            
            console.log("💾 Inicializando Storage...");
            storage = getStorage(app);
            console.log("✅ Storage inicializado");
            
            console.log("🎉 FIREBASE COMPLETAMENTE INICIALIZADO!");
        } catch (error) {
            console.error("❌ ERRO ao inicializar Firebase:", error);
            console.error("Mensagem:", error.message);
            console.error("Código:", error.code);
            
            return (
                <div style={{ padding: '20px', color: 'red', fontFamily: 'monospace' }}>
                    <h3>❌ ERRO DE INICIALIZAÇÃO FIREBASE</h3>
                    <pre>{error.message}</pre>
                    <p>Verificar console para mais detalhes</p>
                </div>
            );
        }
    } else {
        console.log("♻️ Firebase já inicializado, usando instância existente");
        app = getApp();
        auth = getAuth(app);
        database = getDatabase(app);
        storage = getStorage(app);
    }

    firebase = createFullStructure(app, database, auth, storage, config);
    
    console.log("✅ Estrutura Firebase criada e pronta!");

    return (
        <FirebaseContext.Provider value={firebase}>
            {children}
        </FirebaseContext.Provider>
    )
}

export {
    firebase,
    FirebaseProvider,
    FirebaseContext
}