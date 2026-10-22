# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Channel::Api do
  describe '#supports_message_editing?' do
    it 'recognizes the native Evolution webhook' do
      channel = build(:channel_api, webhook_url: 'https://evolution.example.com/chatwoot/webhook/instance-1')

      expect(channel.supports_message_editing?).to be true
    end

    it 'rejects a generic API webhook' do
      channel = build(:channel_api, webhook_url: 'https://example.com/webhook')

      expect(channel.supports_message_editing?).to be false
    end
  end

  # This validation happens in ApplicationRecord
  describe 'length validations' do
    let(:channel_api) { create(:channel_api) }

    context 'when it validates webhook_url length' do
      it 'valid when within limit' do
        channel_api.webhook_url = 'a' * Limits::URL_LENGTH_LIMIT
        expect(channel_api.valid?).to be true
      end

      it 'invalid when crossed the limit' do
        channel_api.webhook_url = 'a' * (Limits::URL_LENGTH_LIMIT + 1)
        channel_api.valid?
        expect(channel_api.errors[:webhook_url]).to include("is too long (maximum is #{Limits::URL_LENGTH_LIMIT} characters)")
      end
    end
  end
end
