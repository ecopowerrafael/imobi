import {
  FETCH_SETTINGS,
  FETCH_SETTINGS_SUCCESS,
  FETCH_SETTINGS_FAILED,
  EDIT_SETTINGS,
  CLEAR_SETTINGS_ERROR
} from "../store/types";

import store from '../store/store';
import { firebase } from '../config/configureFirebase';
import { onValue, set } from "firebase/database";

export const fetchSettings= () => (dispatch) => {

  const {
    settingsRef
  } = firebase;

  console.log("🔍 fetchSettings(): Iniciando...");

  dispatch({
    type: FETCH_SETTINGS,
    payload: null,
  });
  
  try {
    onValue(settingsRef, (snapshot) => {
      console.log("📊 fetchSettings(): onValue disparado", { exists: snapshot.exists(), val: snapshot.val() });
      if (snapshot.val()) {
        console.log("✅ fetchSettings(): Dados recebidos", snapshot.val());
        dispatch({
          type: FETCH_SETTINGS_SUCCESS,
          payload: snapshot.val(),
        });
      } else {
        console.warn("⚠️ fetchSettings(): snapshot.val() é vazio!");
        dispatch({
          type: FETCH_SETTINGS_FAILED,
          payload: "Unable to fetch database and settings.",
        });
      }
    }, (error) => {
      console.error("❌ fetchSettings(): Erro no onValue:", error);
      dispatch({
        type: FETCH_SETTINGS_FAILED,
        payload: error.message || "Unable to fetch database and settings.",
      });
    });
  } catch (error) {
    console.error("❌ fetchSettings(): Erro ao tentar conectar:", error);
    dispatch({
      type: FETCH_SETTINGS_FAILED,
      payload: error.message || "Unable to fetch database and settings.",
    });
  }
};

export const editSettings = (settings) => (dispatch) => {
  const {
    settingsRef
  } = firebase;
  dispatch({
    type: EDIT_SETTINGS,
    payload: settings
  });
  set(settingsRef, settings);
  alert(store.getState().languagedata.defaultLanguage.updated);
};

export const clearSettingsViewError = () => (dispatch) => {
  dispatch({
    type: CLEAR_SETTINGS_ERROR,
    payload: null
  });
};