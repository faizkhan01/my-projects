export enum SocketEventEnum {
  CONNECT = 'connect',
  EXCEPTION = 'exception',
}

export enum ChatEventEnum {
  SUBSCRIBE_TO_CHAT = 'subscribeToChat',
  CREATE_CHAT = 'createChat',
  SEND_MESSAGE = 'sendMessage',
  READ_MESSAGE = 'readMessage',
  TYPING = 'typing',
}
