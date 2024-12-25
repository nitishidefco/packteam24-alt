import {useEffect, useRef} from 'react';
import {useSelector} from 'react-redux';
// import {SOCKET_ENVIRONMENT} from '@env';

// Use socket to fetch request to data
// Socket server's url and topic in which data is sent
export const useSocket = () => {
  let socket = useRef().current;
  const {Auth} = useSelector(state => state);

  useEffect(() => {
    if (global.socket === undefined) {
      socket = require('socket.io-client')(SOCKET_ENVIRONMENT);
      const dataObj = {user_id: Auth?.userId};
      socket.emit('join_socket', dataObj);
      global.socket = socket;
    } else socket = global.socket;
  }, []);

  const connectToSocket = () => {
    if (global.socket === undefined) {
      socket = require('socket.io-client')(SOCKET_ENVIRONMENT);
      const dataObj = {user_id: Auth?.userId};
      socket.emit('join_socket', dataObj);
      global.socket = socket;
    } else socket = global.socket;
  };

  const fetch_initial_conversation = callback => {
    const dataObj = {user_id: Auth?.userId};
    socket.emit('fetch_initial_conversation', dataObj, callback);
  };

  const fetch_participants_conversation = (conversation_id, callback) => {
    const dataObj = {conversation_id: conversation_id};
    socket.emit('fetch_participants_conversation', dataObj, callback);
  };

  const fetch_message = (params, callback) => {
    global.socket.emit('fetch_message', params, callback);
  };

  const fetch_recipients = (message_id, callback) => {
    const dataObj = {message_id: message_id};
    socket.emit('fetch_recipients', dataObj, callback);
  };

  const check_message_status = (params, callback) => {
    const {id, status} = params;
    socket.emit('check_message_status', params, callback);
  };

  const update_message_status = (params, callback) => {
    const {status, message_id, user_id} = params;
    socket.emit('update_message_status', params, callback);
  };

  const update_message_statusON = callback => {
    socket.on('update_message_status', callback);
  };

  const send_new_message = (params, callback) => {
    global.socket.emit('send_new_message', params, callback);
  };

  const send_removed_message = (params, callback) => {
    const {
      conversation_id,
      sender_id,
      message,
      message_type,
      unique_message_id,
      is_edited,
      removed_user_id,
    } = params;
    socket.emit('send_removed_message', params, callback);
  };

  const send_new_group_message = (params, callback) => {
    const {
      conversation_id,
      sender_id,
      message,
      message_type,
      unique_message_id,
      is_edited,
    } = params;
    socket.emit('send_new_group_message', params, callback);
  };

  const create_new_group = (params, callback) => {
    const {
      conversation_id,
      sender_id,
      message,
      message_type,
      unique_message_id,
      is_edited,
    } = params;
    socket.emit('create_new_group', params, callback);
  };

  const new_group_invitation = callback => {
    socket.on('new_group_invitation', callback);
  };

  const user_status = callback => {
    socket.on('user_status', callback);
  };

  const add_new_member = (params, callback) => {
    const {
      conversation_id,
      sender_id,
      message,
      message_type,
      unique_message_id,
      is_edited,
      new_member_id,
    } = params;
    socket.emit('add_new_member', params, callback);
  };

  const get_new_message = callback => {
    // console.log("CALLLLLLED", global.socket);
    global.socket.on('get_new_message', callback);
  };

  const join_new_group = (conversation_id, callback) => {
    const dataIbj = {conversation_id: conversation_id};
    socket.emit('join_new_group', dataIbj, callback);
  };

  const leave_from_room = (conversation_id, callback) => {
    const dataIbj = {conversation_id: conversation_id};
    socket.emit('leave_from_room', dataIbj, callback);
  };

  const message_as_admin = (params, callback) => {
    const {
      conversation_id,
      sender_id,
      message,
      message_type,
      unique_message_id,
    } = params;
    socket.emit('message_as_admin', params, callback);
  };

  const disconnect_socket = () => {
    const dataObj = {user_id: Auth?.userId};
    console.log('disconnected', dataObj);
    global.socket.emit('disconnect_socket', dataObj);
    global.socket?.disconnect();
    global.socket = undefined;
  };

  return {
    socket,
    connectToSocket,
    fetch_initial_conversation,
    fetch_participants_conversation,
    fetch_message,
    fetch_recipients,
    check_message_status,
    update_message_status,
    update_message_statusON,
    send_new_message,
    send_removed_message,
    send_new_group_message,
    create_new_group,
    new_group_invitation,
    add_new_member,
    user_status,
    get_new_message,
    join_new_group,
    leave_from_room,
    message_as_admin,
    disconnect_socket,
  };
};
