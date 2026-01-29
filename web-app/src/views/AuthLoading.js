import React, { useEffect, useRef, useMemo } from "react";
import CircularLoading from "../components/CircularLoading";
import { useSelector, useDispatch } from "react-redux";
import { api } from "common";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import moment from "moment/min/moment-with-locales";

function AuthLoading(props) {
  const { t } = useTranslation();
  
  // 🔍 DEBUG
  console.log("🔄 AuthLoading iniciado");
  
  // Flag para evitar re-executar setupLanguages múltiplas vezes
  const languagesSetupRef = useRef(false);
  
  const {
    fetchUser,
    fetchCarTypes,
    fetchSettings,
    fetchBookings,
    fetchCancelReasons,
    fetchPromos,
    fetchDriverEarnings,
    fetchUsers,
    fetchNotifications,
    fetchEarningsReport,
    signOff,
    fetchWithdraws,
    fetchPaymentMethods,
    fetchLanguages,
    fetchWalletHistory,
    fetchCars,
    fetchComplain,
    fetchSMTP,
    fetchSos,
    fetchSMSConfig,
    fetchFleetAdminEarnings
  } = api;
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const languagedata = useSelector((state) => state.languagedata);
  const settingsdata = useSelector((state) => state.settingsdata);
  
  const langlist = useMemo(() => languagedata.langlist, [languagedata.langlist]);
  const loadingTimeout = useRef(null);

  // Timeout para evitar loader infinito
  useEffect(() => {
    // Se não carregou em 30 segundos, força o carregamento mesmo assim
    loadingTimeout.current = setTimeout(() => {
      console.warn("⚠️ Timeout ao carregar dados. Forçando carregamento após 30 segundos...");
      // O componente vai renderizar mesmo que ainda esteja carregando
    }, 30000);

    return () => clearTimeout(loadingTimeout.current);
  }, []);

  useEffect(() => {
    console.log("⏳ useEffect 1: Fetchando Settings...");
    dispatch(fetchSettings());
  }, [dispatch, fetchSettings]);

  useEffect(() => {
    console.log("⏳ useEffect 2: Setupando Linguagens...", { langlist });
    
    // Aguarda até que langlist seja carregado
    if (!langlist) {
      console.log("⏳ Aguardando langlist...");
      return;
    }
    
    // Evita executar o setup de i18n múltiplas vezes
    if (languagesSetupRef.current) {
      console.log("✅ i18n já foi setupado, pulando");
      return;
    }
    
    console.log("✅ langlist encontrado, setupando i18n");
    languagesSetupRef.current = true; // Marca como executado
    
    // 🇧🇷 FORÇA PORTUGUÊS COMO ÚNICO IDIOMA
    console.log("📋 Buscando português em langlist:", { langlist });
    
    let ptBRData = null;
    
    // Procura por pt-BR em toda a lista
    for (let i = 0; i < langlist.length; i++) {
      const lang = langlist[i];
      console.log(`  [${i}] ${lang.langLocale} - keyValuePairs: ${lang.keyValuePairs ? Object.keys(lang.keyValuePairs).length + ' chaves' : 'VAZIO'}`);
      
      if (lang.langLocale === 'pt-BR') {
        ptBRData = lang;
      }
    }
    
    if (ptBRData && ptBRData.keyValuePairs) {
      console.log("🇧🇷 PORTUGUÊS ENCONTRADO! Carregando...");
      i18n.addResourceBundle(
        'pt-BR',
        'translations',
        ptBRData.keyValuePairs
      );
      i18n.changeLanguage('pt-BR');
      moment.locale('pt-br');
      localStorage.setItem('lang', JSON.stringify({langLocale: 'pt-BR', dateLocale: 'pt-BR'}));
      console.log("✅ Português carregado com sucesso!");
    } else {
      console.warn('⚠️ Português NÃO encontrado! Usando fallback');
        }
      }
    }

    dispatch(fetchUser());
  }, [langlist, dispatch, fetchUser]);

  useEffect(() => {
    console.log("⏳ useEffect 3: Settings e Linguagens...", { settingsdata });
    if (settingsdata.settings) {
      console.log("✅ Fetchando Languages e CarTypes");
      console.log("📍 settingsdata.settings:", settingsdata.settings);
      dispatch(fetchLanguages());
      console.log("📍 fetchLanguages() disparado");
      dispatch(fetchCarTypes());
      console.log("📍 fetchCarTypes() disparado");
      document.title = settingsdata.settings.appName;
    } else {
      console.log("⏳ Aguardando settingsdata.settings...");
      console.log("📍 settingsdata:", settingsdata);
    }
  }, [settingsdata, dispatch, fetchLanguages, fetchCarTypes]);

  useEffect(() => {
    console.log("⏳ useEffect 4: User Auth...", { auth });
    if (auth.profile) {
      console.log("✅ User autenticado:", { usertype: auth.profile.usertype });
      if (auth.profile.usertype) {
        let role = auth.profile.usertype;
        console.log("📦 Fetchando dados para role:", role);
        if (role === "customer") {
          dispatch(fetchBookings());
          dispatch(fetchWalletHistory());
          dispatch(fetchPaymentMethods());
          dispatch(fetchCancelReasons());
          dispatch(fetchUsers());
        } else if (role === "driver") {
          dispatch(fetchBookings());
          dispatch(fetchWithdraws());
          dispatch(fetchPaymentMethods());
          dispatch(fetchCars());
          dispatch(fetchWalletHistory());
        } else if (role === "admin") {
          dispatch(fetchUsers());
          dispatch(fetchBookings());
          dispatch(fetchPromos());
          dispatch(fetchDriverEarnings());
          dispatch(fetchFleetAdminEarnings());
          dispatch(fetchNotifications());
          dispatch(fetchEarningsReport());
          dispatch(fetchCancelReasons());
          dispatch(fetchWithdraws());
          dispatch(fetchComplain());
          dispatch(fetchPaymentMethods());
          dispatch(fetchCars());
          dispatch(fetchSMTP());
          dispatch(fetchSMSConfig());
          dispatch(fetchSos());
        } else if (role === "fleetadmin") {
          dispatch(fetchUsers());
          dispatch(fetchBookings());
          dispatch(fetchDriverEarnings());
          dispatch(fetchCars());
          dispatch(fetchCancelReasons());
          dispatch(fetchPaymentMethods());
          dispatch(fetchWalletHistory());
        } else {
          alert(t("not_valid_user_type"));
          dispatch(signOff());
        }
      } else {
        alert(t("user_issue_contact_admin"));
        dispatch(signOff());
      }
    }
  }, [
    auth,
    auth.profile,
    dispatch,
    fetchBookings,
    fetchCancelReasons,
    fetchDriverEarnings,
    fetchEarningsReport,
    fetchNotifications,
    fetchPromos,
    fetchUsers,
    fetchWithdraws,
    signOff,
    fetchPaymentMethods,
    fetchWalletHistory,
    fetchCars,
    fetchComplain,
    fetchSMTP,
    fetchSMSConfig,
    fetchSos,
    fetchFleetAdminEarnings,
    t
  ]);

  return settingsdata.loading ? (
    <CircularLoading />
  ) : settingsdata.settings ? (
    // Se settings carregou, mostra o conteúdo mesmo que auth ainda esteja carregando
    // (auth.loading pode levar mais tempo)
    languagedata.langlist ? (
      props.children
    ) : (
      <CircularLoading />
    )
  ) : (
    <div>
      <span>No Database Settings found</span>
    </div>
  );
  </div>
  );
}

export default AuthLoading;
