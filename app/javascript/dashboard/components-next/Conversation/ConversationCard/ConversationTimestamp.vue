<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import {
  differenceInCalendarDays,
  formatDistance,
  fromUnixTime,
} from 'date-fns';
import { shortTimestamp } from 'shared/helpers/timeHelper';
import { useExactTimestamp } from 'shared/composables/useExactTimestamp';
import { useLocale } from 'shared/composables/useLocale';
import UnreadBadge from './UnreadBadge.vue';

const props = defineProps({
  conversationId: { type: [String, Number], default: '' },
  createdAtTimestamp: { type: [String, Number], default: '' },
  lastMessageTimestamp: { type: [String, Number], default: '' },
  unreadCount: { type: Number, default: 0 },
});

const MINUTE_IN_MILLISECONDS = 60000;
const HOUR_IN_MILLISECONDS = MINUTE_IN_MILLISECONDS * 60;
const DAY_IN_MILLISECONDS = HOUR_IN_MILLISECONDS * 24;

const { resolvedLocale } = useLocale();
const exactTimestamp = useExactTimestamp();
const currentTime = ref(Date.now());
let timer;

const createdAtTime = computed(() => {
  return props.createdAtTimestamp
    ? shortTimestamp(
        formatDistance(
          fromUnixTime(props.createdAtTimestamp),
          new Date(currentTime.value),
          { addSuffix: true }
        )
      )
    : '';
});

const lastMessageTime = computed(() => {
  if (!props.lastMessageTimestamp) return '';

  const date = fromUnixTime(props.lastMessageTimestamp);
  const daysAgo = differenceInCalendarDays(new Date(currentTime.value), date);

  if (daysAgo <= 0) {
    return new Intl.DateTimeFormat(resolvedLocale.value, {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }

  if (daysAgo === 1) {
    return new Intl.RelativeTimeFormat(resolvedLocale.value, {
      numeric: 'auto',
    }).format(-1, 'day');
  }

  if (daysAgo < 7) {
    return new Intl.DateTimeFormat(resolvedLocale.value, {
      weekday: 'long',
    }).format(date);
  }

  return new Intl.DateTimeFormat(resolvedLocale.value, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    calendar: 'gregory',
  }).format(date);
});

const millisecondsUntilMidnight = () => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setHours(24, 0, 0, 0);
  return tomorrow.getTime() - now.getTime();
};

const refreshInterval = () => {
  const elapsed = Date.now() - Number(props.createdAtTimestamp) * 1000;
  let interval = MINUTE_IN_MILLISECONDS;

  if (elapsed > DAY_IN_MILLISECONDS) {
    interval = DAY_IN_MILLISECONDS;
  } else if (elapsed > HOUR_IN_MILLISECONDS) {
    interval = HOUR_IN_MILLISECONDS;
  }

  return Math.min(interval, millisecondsUntilMidnight() + 100);
};

const createTimer = () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    currentTime.value = Date.now();
    createTimer();
  }, refreshInterval());
};

watch(
  () => [
    props.conversationId,
    props.createdAtTimestamp,
    props.lastMessageTimestamp,
  ],
  () => {
    currentTime.value = Date.now();
    createTimer();
  }
);

onMounted(createTimer);
onUnmounted(() => clearTimeout(timer));
</script>

<template>
  <div class="flex min-w-0 flex-col items-end">
    <span
      v-tooltip.top="{
        content: exactTimestamp(createdAtTimestamp),
        delay: { show: 1000, hide: 0 },
      }"
      class="whitespace-nowrap font-normal text-xxs leading-4 text-n-slate-10 hover:text-n-slate-11"
    >
      {{ createdAtTime }}
    </span>
    <div class="flex min-h-5 items-center justify-end gap-1.5">
      <span
        v-if="lastMessageTime"
        v-tooltip.top="{
          content: exactTimestamp(lastMessageTimestamp),
          delay: { show: 1000, hide: 0 },
        }"
        class="whitespace-nowrap text-sm font-medium leading-5 text-n-slate-11"
      >
        {{ lastMessageTime }}
      </span>
      <UnreadBadge v-if="unreadCount > 0" :count="unreadCount" />
    </div>
  </div>
</template>
