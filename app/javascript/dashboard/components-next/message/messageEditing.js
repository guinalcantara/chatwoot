import { CONTENT_TYPES, MESSAGE_STATUS, MESSAGE_TYPES } from './constants';

export const canEditMessage = (
  message,
  inbox,
  currentUserId,
  now = Date.now()
) => {
  const senderId = message.senderId ?? message.sender?.id;
  const supportsEditing =
    inbox.supportsMessageEditing ?? inbox.supports_message_editing;

  return !!(
    supportsEditing &&
    message.messageType === MESSAGE_TYPES.OUTGOING &&
    !message.private &&
    message.contentType === CONTENT_TYPES.TEXT &&
    message.content?.trim() &&
    !message.attachments?.length &&
    message.sourceId &&
    senderId === currentUserId &&
    message.status !== MESSAGE_STATUS.FAILED &&
    now < message.createdAt * 1000 + 15 * 60 * 1000 &&
    !message.contentAttributes?.deleted &&
    !message.additionalAttributes?.templateParams &&
    !message.additionalAttributes?.campaignId
  );
};
