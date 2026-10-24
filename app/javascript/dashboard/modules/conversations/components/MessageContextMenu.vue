<script>
import { useAlert } from 'dashboard/composables';
import { mapGetters } from 'vuex';
import { useMessageFormatter } from 'shared/composables/useMessageFormatter';
import ContextMenu from 'dashboard/components/ui/ContextMenu.vue';
import AddCannedModal from 'dashboard/routes/dashboard/settings/canned/AddCanned.vue';
import { useSnakeCase } from 'dashboard/composables/useTransformKeys';
import { copyTextToClipboard } from 'shared/helpers/clipboard';
import { parseAPIErrorResponse } from 'dashboard/store/utils/api';
import { conversationUrl, frontendURL } from '../../../helper/URLHelper';
import {
  ACCOUNT_EVENTS,
  CONVERSATION_EVENTS,
} from '../../../helper/AnalyticsHelper/events';
import MenuItem from '../../../components/widgets/conversation/contextMenu/menuItem.vue';
import { useTrack } from 'dashboard/composables';
import NextButton from 'dashboard/components-next/button/Button.vue';
import ReportCaptainMessageDialog from './ReportCaptainMessageDialog.vue';
import MessageApi from 'dashboard/api/inbox/message';
import { useUISettings } from 'dashboard/composables/useUISettings';

export default {
  components: {
    AddCannedModal,
    MenuItem,
    ContextMenu,
    NextButton,
    ReportCaptainMessageDialog,
  },
  props: {
    message: {
      type: Object,
      required: true,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    enabledOptions: {
      type: Object,
      default: () => ({}),
    },
    contextMenuPosition: {
      type: Object,
      default: () => ({}),
    },
    hideButton: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['open', 'close', 'replyTo'],
  setup() {
    const { getPlainText } = useMessageFormatter();
    const { isEditorHotKeyEnabled } = useUISettings();

    return {
      getPlainText,
      isEditorHotKeyEnabled,
    };
  },
  data() {
    return {
      isCannedResponseModalOpen: false,
      showDeleteModal: false,
      showEditModal: false,
      editedContent: '',
      isSavingEdit: false,
    };
  },
  computed: {
    ...mapGetters({
      getAccount: 'accounts/getAccount',
      currentAccountId: 'getCurrentAccountId',
      getUISettings: 'getUISettings',
    }),
    plainTextContent() {
      return this.getPlainText(this.messageContent);
    },
    conversationId() {
      return this.message.conversation_id ?? this.message.conversationId;
    },
    messageId() {
      return this.message.id;
    },
    messageContent() {
      return this.message.content;
    },
    contentAttributes() {
      return useSnakeCase(
        this.message.content_attributes ?? this.message.contentAttributes
      );
    },
  },
  methods: {
    async copyLinkToMessage() {
      const fullConversationURL =
        window.chatwootConfig.hostURL +
        frontendURL(
          conversationUrl({
            id: this.conversationId,
            accountId: this.currentAccountId,
          })
        );
      await copyTextToClipboard(
        `${fullConversationURL}?messageId=${this.messageId}`
      );
      useAlert(this.$t('CONVERSATION.CONTEXT_MENU.LINK_COPIED'));
      this.handleClose();
    },
    async handleCopy() {
      await copyTextToClipboard(this.plainTextContent);
      useAlert(this.$t('CONTACT_PANEL.COPY_SUCCESSFUL'));
      this.handleClose();
    },
    showCannedResponseModal() {
      useTrack(ACCOUNT_EVENTS.ADDED_TO_CANNED_RESPONSE);
      this.isCannedResponseModalOpen = true;
    },
    hideCannedResponseModal() {
      this.isCannedResponseModalOpen = false;
      this.handleClose();
    },
    handleOpen(e) {
      this.$emit('open', e);
    },
    handleClose(e) {
      this.$emit('close', e);
    },
    async handleTranslate() {
      const { locale: accountLocale } = this.getAccount(this.currentAccountId);
      const agentLocale = this.getUISettings?.locale;
      const targetLanguage = agentLocale || accountLocale || 'en';
      try {
        await this.$store.dispatch('translateMessage', {
          conversationId: this.conversationId,
          messageId: this.messageId,
          targetLanguage,
        });
        useTrack(CONVERSATION_EVENTS.TRANSLATE_A_MESSAGE);
      } catch (error) {
        useAlert(parseAPIErrorResponse(error));
      }
      this.handleClose();
    },
    handleReplyTo() {
      this.$emit('replyTo', this.message);
      this.handleClose();
    },
    openDeleteModal() {
      this.handleClose();
      this.showDeleteModal = true;
    },
    openEditModal() {
      this.editedContent = this.message.content;
      this.handleClose();
      this.showEditModal = true;
    },
    handleEditKeydown(event) {
      if (event.isComposing || event.shiftKey || event.altKey) return;

      const hasModifier = event.metaKey || event.ctrlKey;
      if (
        (hasModifier && this.isEditorHotKeyEnabled('cmd_enter')) ||
        (!hasModifier && this.isEditorHotKeyEnabled('enter'))
      ) {
        event.preventDefault();
        this.saveEdit();
      }
    },
    async saveEdit() {
      if (
        !this.editedContent.trim() ||
        this.editedContent === this.message.content ||
        this.isSavingEdit
      )
        return;

      this.isSavingEdit = true;
      try {
        const { data } = await MessageApi.edit(
          this.conversationId,
          this.messageId,
          this.editedContent
        );
        this.$store.dispatch('updateMessage', data);
        this.showEditModal = false;
      } catch (error) {
        useAlert(parseAPIErrorResponse(error));
      } finally {
        this.isSavingEdit = false;
      }
    },
    async confirmDeletion() {
      try {
        await this.$store.dispatch('deleteMessage', {
          conversationId: this.conversationId,
          messageId: this.messageId,
        });
        useAlert(this.$t('CONVERSATION.SUCCESS_DELETE_MESSAGE'));
        this.handleClose();
      } catch (error) {
        useAlert(this.$t('CONVERSATION.FAIL_DELETE_MESSSAGE'));
      }
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
    },
    openReportDialog() {
      this.handleClose();
      this.$refs.reportDialog?.open();
    },
  },
};
</script>

<template>
  <div class="context-menu">
    <!-- Add To Canned Responses -->
    <woot-modal
      v-if="isCannedResponseModalOpen && enabledOptions['cannedResponse']"
      v-model:show="isCannedResponseModalOpen"
      :on-close="hideCannedResponseModal"
    >
      <AddCannedModal
        :response-content="plainTextContent"
        :on-close="hideCannedResponseModal"
      />
    </woot-modal>
    <!-- Confirm Deletion -->
    <woot-modal v-model:show="showEditModal">
      <div class="p-6 flex flex-col gap-4">
        <h2 class="text-lg font-semibold">
          {{ $t('CONVERSATION.CONTEXT_MENU.EDIT') }}
        </h2>
        <textarea
          v-model="editedContent"
          class="w-full rounded-md border border-n-strong bg-n-background p-3"
          rows="4"
          :aria-label="$t('CONVERSATION.CONTEXT_MENU.EDIT')"
          @keydown.enter.stop="handleEditKeydown"
        />
        <div class="flex justify-end gap-2">
          <NextButton
            slate
            :label="$t('CONVERSATION.CONTEXT_MENU.DELETE_CONFIRMATION.CANCEL')"
            @click="showEditModal = false"
          />
          <NextButton
            :disabled="
              !editedContent.trim() ||
              editedContent === message.content ||
              isSavingEdit
            "
            :label="$t('CONVERSATION.CONTEXT_MENU.SAVE_EDIT')"
            @click="saveEdit"
          />
        </div>
      </div>
    </woot-modal>
    <woot-delete-modal
      v-if="showDeleteModal && enabledOptions['delete']"
      v-model:show="showDeleteModal"
      class="context-menu--delete-modal"
      :on-close="closeDeleteModal"
      :on-confirm="confirmDeletion"
      :title="$t('CONVERSATION.CONTEXT_MENU.DELETE_CONFIRMATION.TITLE')"
      :message="$t('CONVERSATION.CONTEXT_MENU.DELETE_CONFIRMATION.MESSAGE')"
      :confirm-text="$t('CONVERSATION.CONTEXT_MENU.DELETE_CONFIRMATION.DELETE')"
      :reject-text="$t('CONVERSATION.CONTEXT_MENU.DELETE_CONFIRMATION.CANCEL')"
    />
    <NextButton
      v-if="!hideButton"
      ghost
      slate
      sm
      icon="i-lucide-ellipsis-vertical"
      class="invisible group-hover/context-menu:visible"
      @click="handleOpen"
    />
    <ContextMenu
      v-if="isOpen && !isCannedResponseModalOpen"
      :x="contextMenuPosition.x"
      :y="contextMenuPosition.y"
      @close="handleClose"
    >
      <div class="menu-container">
        <MenuItem
          v-if="enabledOptions['replyTo']"
          :option="{
            icon: 'arrow-reply',
            label: $t('CONVERSATION.CONTEXT_MENU.REPLY_TO'),
          }"
          variant="icon"
          @click.stop="handleReplyTo"
        />
        <MenuItem
          v-if="enabledOptions['edit']"
          :option="{
            icon: 'edit',
            label: $t('CONVERSATION.CONTEXT_MENU.EDIT'),
          }"
          variant="icon"
          @click.stop="openEditModal"
        />
        <MenuItem
          v-if="enabledOptions['copy']"
          :option="{
            icon: 'clipboard',
            label: $t('CONVERSATION.CONTEXT_MENU.COPY'),
          }"
          variant="icon"
          @click.stop="handleCopy"
        />
        <MenuItem
          v-if="enabledOptions['translate']"
          :option="{
            icon: 'translate',
            label: $t('CONVERSATION.CONTEXT_MENU.TRANSLATE'),
          }"
          variant="icon"
          @click.stop="handleTranslate"
        />
        <hr />
        <MenuItem
          v-if="enabledOptions['copyLink']"
          :option="{
            icon: 'link',
            label: $t('CONVERSATION.CONTEXT_MENU.COPY_PERMALINK'),
          }"
          variant="icon"
          @click.stop="copyLinkToMessage"
        />
        <MenuItem
          v-if="enabledOptions['cannedResponse']"
          :option="{
            icon: 'comment-add',
            label: $t('CONVERSATION.CONTEXT_MENU.CREATE_A_CANNED_RESPONSE'),
          }"
          variant="icon"
          @click.stop="showCannedResponseModal"
        />
        <hr v-if="enabledOptions['report']" />
        <MenuItem
          v-if="enabledOptions['report']"
          :option="{
            icon: 'warning',
            label: $t('CONVERSATION.CONTEXT_MENU.REPORT_MESSAGE.LABEL'),
          }"
          variant="icon"
          @click.stop="openReportDialog"
        />
        <hr v-if="enabledOptions['delete']" />
        <MenuItem
          v-if="enabledOptions['delete']"
          :option="{
            icon: 'delete',
            label: $t('CONVERSATION.CONTEXT_MENU.DELETE'),
          }"
          variant="icon"
          @click.stop="openDeleteModal"
        />
      </div>
    </ContextMenu>
    <ReportCaptainMessageDialog
      v-if="enabledOptions['report']"
      ref="reportDialog"
      :message-id="messageId"
    />
  </div>
</template>

<style lang="scss" scoped>
.menu-container {
  @apply p-1 bg-n-background shadow-xl rounded-md;

  hr:first-child {
    @apply hidden;
  }

  hr {
    @apply m-1 border-b border-solid border-n-strong;
  }
}

.context-menu--delete-modal {
  :deep(.modal-container) {
    @apply max-w-[30rem];

    h2 {
      @apply font-medium text-base;
    }
  }
}
</style>
