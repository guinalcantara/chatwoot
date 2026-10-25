import { CONTENT_TYPES, MESSAGE_STATUS, MESSAGE_TYPES } from './constants';

export const canShowEditMessage = (message, inbox, currentUserId) => {
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
    senderId === currentUserId &&
    message.status !== MESSAGE_STATUS.FAILED &&
    !message.contentAttributes?.deleted &&
    !message.additionalAttributes?.templateParams &&
    !message.additionalAttributes?.campaignId
  );
};

export const editUnavailableReason = (message, now = Date.now()) => {
  if (now >= message.createdAt * 1000 + 15 * 60 * 1000) return 'expired';
  if (!message.sourceId) return 'pending';
  return null;
};

export const shouldSubmitEditOnEnter = (event, isHotKeyEnabled) => {
  if (event.isComposing || event.shiftKey || event.altKey) return false;

  const hasModifier = event.metaKey || event.ctrlKey;
  return (
    (hasModifier && isHotKeyEnabled('cmd_enter')) ||
    (!hasModifier && isHotKeyEnabled('enter'))
  );
};

export const splitMessageSignature = (content, senderName) => {
  const match = content.match(/^\*\*([^*\r\n]+):\*\*\r?\n/);
  if (!match || match[1] !== senderName) {
    return { signature: '', body: content };
  }

  return { signature: match[0], body: content.slice(match[0].length) };
};
