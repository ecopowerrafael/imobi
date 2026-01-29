import React, { useState, useEffect, useCallback, useRef } from "react";
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  ActivityIndicator,
  Keyboard,
  TextInput,
  TouchableOpacity
} from "react-native";
import { colors } from "../common/theme";
import i18n from 'i18n-js';
import { useSelector, useDispatch } from 'react-redux';
import { api } from 'common';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import DeviceInfo from 'react-native-device-info';
import { APP_MAIN_COLOR, APP_MAIN_COLOR_DARK, APP_SECONDORY_COLOR } from '../common/sharedFunctions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

let hasNotch = DeviceInfo.hasNotch();

export default function OnlineChat(props) {
  const dispatch = useDispatch();
  const { bookingId, status } = props.route.params;
  const activeBookings = useSelector(state => state.bookinglistdata.active);
  const auth = useSelector(state => state.auth);
  const chats = useSelector(state => state.chatdata.messages);
  const settings = useSelector(state => state.settingsdata.settings);
  
  const [messages, setMessages] = useState([]);
  const deviceColorScheme = useColorScheme();
  const [mode, setMode] = useState(auth?.profile?.mode === 'system' ? deviceColorScheme : auth?.profile?.mode || 'light');
  const messageRef = useRef([]);
  const role = auth?.profile?.usertype;
  const insets = useSafeAreaInsets();
  const MAIN_COLOR = APP_MAIN_COLOR(settings?.appCat);
  const MAIN_COLOR_DARK = APP_MAIN_COLOR_DARK(settings?.appCat);
  const SECONDORY_COLOR = APP_SECONDORY_COLOR(settings?.appCat);

  const { t } = i18n;
  const isRTL = i18n.locale.indexOf('he') === 0 || i18n.locale.indexOf('ar') === 0;

  const [inputText, setInputText] = useState('');

  // Update mode when system theme or auth profile changes
  useEffect(() => {
    if (auth?.profile?.mode) {
      setMode(auth.profile.mode === 'system' ? deviceColorScheme : auth.profile.mode);
    }else {
      setMode('light');
    }
  }, [deviceColorScheme, auth?.profile?.mode]);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

// useEffect(() => {
//   const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
//     setKeyboardVisible(true);
//   });
//   const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
//     setKeyboardVisible(false);
//   });
  // Cleanup
//   return () => {
//     keyboardDidShowListener.remove();
//     keyboardDidHideListener.remove();
//   };
// }, []);

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
      setKeyboardVisible(true);
      setKeyboardHeight(event.endCoordinates.height); // store keyboard height
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
      setKeyboardHeight(0); // reset keyboard height
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);





  // Format and set messages when chats or role changes
  useEffect(() => {
    if (chats?.length >= 1 && role) {
      const formattedMessages = chats.map((chat) => ({
        _id: chat.smsId,
        text: chat.message,
        createdAt: chat.createdAt ? new Date(chat.createdAt) : new Date(),
        user: {
          _id: role === "driver" ? 
            (chat.source === "customer" ? 2 : 1) : 
            (chat.source === "customer" ? 1 : 2),
        }
      })).reverse();

      messageRef.current = formattedMessages;
      setMessages(formattedMessages);
    } else {
      messageRef.current = [];
      setMessages([]);
    }
  }, [chats, role]);

  // Handle navigation focus/blur
  useEffect(() => {
    let isMounted = true;
    
    const unsubscribeFocus = props.navigation.addListener('focus', () => {
      if (isMounted && bookingId) {
        dispatch(api.fetchChatMessages(bookingId));
      }
    });
    
    const unsubscribeBlur = props.navigation.addListener('blur', () => {
      if (isMounted && bookingId) {
        dispatch(api.stopFetchMessages(bookingId));
      }
    });

    // Initial fetch
    if (bookingId) {
      dispatch(api.fetchChatMessages(bookingId));
    }

    return () => {
      isMounted = false;
      unsubscribeFocus();
      unsubscribeBlur();
      if (bookingId) {
        dispatch(api.stopFetchMessages(bookingId));
      }
    };
  }, [bookingId]);

  const onSend = useCallback(async (newMessages = []) => {
    if (!bookingId || !role || !newMessages[0]?.text) return;

    const currentBooking = activeBookings?.find(b => b.id === bookingId);
    if (!currentBooking) return;

    try {
      await dispatch(api.sendMessage({
        booking: currentBooking,
        role: role,
        message: newMessages[0].text
      }));
      dispatch(api.fetchChatMessages(bookingId));
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }, [bookingId, role, activeBookings]);

  const renderBubble = useCallback((props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        left: {
          backgroundColor: SECONDORY_COLOR,
          marginLeft: -45,
        },
        right: {
          backgroundColor: mode === 'dark' ? MAIN_COLOR_DARK : MAIN_COLOR,
          marginLeft: -45,
        }
      }}
      textStyle={{
        left: {
          color: colors.BLACK
        }
      }}
    />
  ), [mode]);

  const renderSend = useCallback((props) => (
    <Send
      {...props}
      containerStyle={{
        height: 50,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <MaterialCommunityIcons name="send-circle" size={36} color={colors.BLUE} />
    </Send>
  ), []);

  const scrollToBottomComponent = useCallback(() => (
    <FontAwesome name="angle-double-down" size={30} color={colors.BLUE} />
  ), []);

  const chatProps = {
    messages,
    onSend,
    user: { _id: 1 },
    renderBubble,
    renderSend,
    scrollToBottom: true,
    scrollToBottomComponent,
    placeholder: status === "COMPLETE" ? `${t('booking_is')} ${status}. ${t('not_chat')}` : t('chat_input_title'),
    textInputProps: {
      editable: status !== "COMPLETE"
    }
  };

  return (
    <View style={{backgroundColor: mode === 'dark' ? colors.PAGEBACK : colors.WHITE, flex: 1}}>
    {Platform.OS === 'ios' ? (
      <>
        <View style={{height: isKeyboardVisible ? '98%' : '98%', paddingBottom: 45}}>
          <GiftedChat
            messages={messages}
            onSend={onSend}
            user={{ _id: 1 }}
            renderBubble={renderBubble}
            renderSend={renderSend}
            //renderLoading={() => <ActivityIndicator size="large" color={colors.BLUE} />}
            scrollToBottom
            scrollToBottomStyle={{
              backgroundColor: mode === 'dark' ? MAIN_COLOR_DARK : MAIN_COLOR,
              opacity: 0.8,
              padding: 8,
              borderRadius: 20
            }}
            textInputProps={{
              editable: status !== "COMPLETE",
              style: { display: 'none' } // Hide default input
            }}
          />
        </View>
        <View style={{
          position: 'absolute',
          bottom: isKeyboardVisible ? keyboardHeight : 0,
          left: 0,
          right: 0,
          flexDirection: isRTL ? 'row-reverse' : 'row',
          padding: 10,
          backgroundColor: mode === 'dark' ? colors.PAGEBACK : colors.WHITE,
          alignItems: 'center'
        }}>
          <TextInput
            style={{
              flex: 1,
              height: 40,
              borderColor: colors.SHADOW,
              borderWidth: 1,
              borderRadius: 20,
              paddingHorizontal: 15,
              color: mode === 'dark' ?colors.WHITE:colors.BLACK,
              backgroundColor: mode === 'dark' ? colors.PAGEBACK : colors.WHITE,
              textAlign: isRTL ? 'right' : 'left'
            }}
            value={inputText}
            onChangeText={setInputText}
            placeholder={t('chat_input_title')}
            editable={status !== "COMPLETE"}
            placeholderTextColor={colors.SHADOW}
          />
          {inputText.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                onSend([{ text: inputText }]);
                setInputText('');
              }}
              style={{ marginLeft: 10 }}
            >
              <MaterialCommunityIcons name="send-circle" size={36} color={colors.BLUE} />
            </TouchableOpacity>
          )}
        </View>
      </>
    ) : (
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        style={{flex: 1, paddingBottom: isKeyboardVisible ? null:insets.bottom}}
      >
        <GiftedChat {...chatProps} />
      </KeyboardAvoidingView>
    )}
  </View>
  );
}
