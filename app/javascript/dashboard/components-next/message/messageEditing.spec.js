import { describe, expect, it } from 'vitest';
import {
  canShowEditMessage,
  editUnavailableReason,
  shouldSubmitEditOnEnter,
  splitMessageSignature,
} from './messageEditing';
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

describe('canShowEditMessage', () => {
  it('shows the action for a compatible message', () => {
    expect(
      canShowEditMessage(eligibleMessage, { supports_message_editing: true }, 1)
    ).toBe(true);
  });

  it('keeps the action visible while confirmation is pending or the window has expired', () => {
    expect(
      canShowEditMessage(
        { ...eligibleMessage, sourceId: '' },
        { supports_message_editing: true },
        1
      )
    ).toBe(true);
    expect(
      canShowEditMessage(
        { ...eligibleMessage, createdAt: 1 },
        { supports_message_editing: true },
        1
      )
    ).toBe(true);
  });

  it.each([
    ['Cloud API inbox', { inbox: { supports_message_editing: false } }],
    ['attachment', { message: { attachments: [{}] } }],
    ['another agent', { message: { senderId: 2 } }],
    ['private message', { message: { private: true } }],
    ['failed message', { message: { status: 'failed' } }],
    ['empty message', { message: { content: '' } }],
    ['deleted message', { message: { contentAttributes: { deleted: true } } }],
    ['template', { message: { additionalAttributes: { templateParams: {} } } }],
  ])('hides the action for %s', (_, overrides) => {
    expect(
      canShowEditMessage(
        { ...eligibleMessage, ...overrides.message },
        overrides.inbox ?? { supports_message_editing: true },
        1
      )
    ).toBe(false);
  });
});

describe('splitMessageSignature', () => {
  it('separates the original sender signature from the editable body', () => {
    expect(splitMessageSignature('**Ana:**\nOlá', 'Ana')).toEqual({
      signature: '**Ana:**\n',
      body: 'Olá',
    });
  });

  it('preserves content without a matching sender signature', () => {
    expect(splitMessageSignature('Olá', 'Ana')).toEqual({
      signature: '',
      body: 'Olá',
    });
    expect(splitMessageSignature('**Aviso:**\nOlá', 'Ana')).toEqual({
      signature: '',
      body: '**Aviso:**\nOlá',
    });
  });
});

describe('editUnavailableReason', () => {
  it('distinguishes pending confirmation and an expired edit window', () => {
    expect(
      editUnavailableReason({ ...eligibleMessage, sourceId: '' }, now)
    ).toBe('pending');
    expect(
      editUnavailableReason({ ...eligibleMessage, createdAt: 1 }, now)
    ).toBe('expired');
    expect(editUnavailableReason(eligibleMessage, now)).toBeNull();
  });
});

describe('shouldSubmitEditOnEnter', () => {
  const event = {
    isComposing: false,
    shiftKey: false,
    altKey: false,
    metaKey: false,
    ctrlKey: false,
  };

  it('uses the configured shortcut and leaves Shift+Enter for a line break', () => {
    expect(shouldSubmitEditOnEnter(event, key => key === 'enter')).toBe(true);
    expect(shouldSubmitEditOnEnter(event, key => key === 'cmd_enter')).toBe(
      false
    );
    expect(
      shouldSubmitEditOnEnter(
        { ...event, ctrlKey: true },
        key => key === 'cmd_enter'
      )
    ).toBe(true);
    expect(
      shouldSubmitEditOnEnter(
        { ...event, metaKey: true },
        key => key === 'cmd_enter'
      )
    ).toBe(true);
    expect(
      shouldSubmitEditOnEnter(
        { ...event, shiftKey: true },
        key => key === 'enter'
      )
    ).toBe(false);
  });
});
