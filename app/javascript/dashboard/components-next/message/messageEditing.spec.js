import { describe, expect, it } from 'vitest';
import { canEditMessage } from './messageEditing';
import { MESSAGE_TYPES } from './constants';

const now = 1_000_000;
const eligibleMessage = {
  messageType: MESSAGE_TYPES.OUTGOING,
  private: false,
  contentType: 'text',
  content: 'Hello',
  attachments: [],
  sourceId: 'wa-id',
  senderId: 1,
  status: 'sent',
  createdAt: (now - 60_000) / 1000,
  contentAttributes: {},
  additionalAttributes: {},
};

describe('canEditMessage', () => {
  it('allows a recent outgoing Evolution text message from the current agent', () => {
    expect(
      canEditMessage(
        eligibleMessage,
        { supports_message_editing: true },
        1,
        now
      )
    ).toBe(true);
  });

  it.each([
    ['Cloud API inbox', { inbox: { supports_message_editing: false } }],
    [
      'expired message',
      { message: { createdAt: (now - 15 * 60 * 1000) / 1000 } },
    ],
    ['attachment', { message: { attachments: [{}] } }],
    ['another agent', { message: { senderId: 2 } }],
    ['missing source ID', { message: { sourceId: '' } }],
    ['template', { message: { additionalAttributes: { templateParams: {} } } }],
  ])('rejects %s', (_, overrides) => {
    const message = { ...eligibleMessage, ...overrides.message };
    const inbox = overrides.inbox ?? { supports_message_editing: true };

    expect(canEditMessage(message, inbox, 1, now)).toBe(false);
  });
});
