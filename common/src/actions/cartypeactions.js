import {
  FETCH_CAR_TYPES,
  FETCH_CAR_TYPES_SUCCESS,
  FETCH_CAR_TYPES_FAILED,
  EDIT_CAR_TYPE
} from "../store/types";
import store from '../store/store';
import { firebase } from '../config/configureFirebase';
import { onValue, set ,remove, push } from "firebase/database";
import { uploadBytesResumable, getDownloadURL } from "firebase/storage";

export const fetchCarTypes = () => (dispatch) => {

  const {
    carTypesRef
  } = firebase;

  dispatch({
    type: FETCH_CAR_TYPES,
    payload: null
  });
  onValue(carTypesRef, snapshot => {
    if (snapshot.val()) {
      let data = snapshot.val();
      const arr = Object.keys(data).map(i => {
        data[i].id = i;
        return data[i]
      });
      dispatch({
        type: FETCH_CAR_TYPES_SUCCESS,
        payload: arr
      });
    } else {
      const state = store.getState();
      const errorMsg = state?.languagedata?.defaultLanguage?.no_cars || "No cars available";
      dispatch({
        type: FETCH_CAR_TYPES_FAILED,
        payload: errorMsg
      });
    }
  });
};

export const editCarType = (cartype, method) => async (dispatch) => {
  const {
    carTypesRef, 
    carTypesEditRef,
    carDocImage
  } = firebase;
  dispatch({
    type: EDIT_CAR_TYPE,
    payload: { method, cartype }
  });
  if (method === 'Add') {
    push(carTypesRef, cartype);
  } else if (method === 'Delete') {
    remove(carTypesEditRef(cartype.id));
  } else if (method === 'UpdateImage') {
    await uploadBytesResumable(carDocImage(cartype.id), cartype.image);
    let image = await getDownloadURL(carDocImage(cartype.id));
      let data = cartype;
      data.image = image;
    set(carTypesEditRef(cartype.id), data);
  }
   else {
    set(carTypesEditRef(cartype.id), cartype);
  }
}