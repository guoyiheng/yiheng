<script setup lang="ts">
const { theme, toggleTheme } = useSiteTheme()
const isDarkTheme = computed(() => theme.value === 'dark')
const targetThemeLabel = computed(() => isDarkTheme.value ? '浅色' : '深色')
</script>

<template>
  <div class="printer-theme-control" role="group" aria-label="主题切换控制台">
    <button
      class="ink-knob-button"
      :class="{ 'is-dark': isDarkTheme }"
      type="button"
      :aria-label="`使用墨盒旋钮切换到${targetThemeLabel}模式`"
      :aria-pressed="isDarkTheme"
      @click="toggleTheme"
    >
      <span class="ink-knob" aria-hidden="true">
        <span class="ink-knob-mark" />
      </span>
    </button>
  </div>
</template>

<style scoped>
.printer-theme-control {
  display: grid;
  width: 44px;
  min-width: 44px;
  height: 100%;
  padding: 2px;
  align-items: center;
  place-items: center;
  border: 1px solid var(--printer-color-2);
  border-radius: 6px;
  background-color: var(--printer-color);
  background-image: linear-gradient(to bottom, #fff3, transparent 40%, #0001);
  box-shadow: 0 7px 14px #0002, 0 1px 0 #fff8 inset;
  color: var(--menu-ink);
}

.ink-knob-button {
  position: relative;
  display: grid;
  width: 100%;
  min-width: 0;
  height: 100%;
  padding: 0;
  place-items: center;
  border: 1px solid var(--paper-rule);
  border-radius: 3px;
  background: color-mix(in srgb, var(--printer-color) 76%, var(--printer-color-2));
  box-shadow: 0 1px 0 #fff4 inset;
  color: var(--menu-ink);
  cursor: pointer;
  transition: transform 120ms cubic-bezier(0.25, 1, 0.5, 1);
}

.ink-knob-button:active {
  transform: translateY(1px);
}

.ink-knob {
  position: relative;
  display: block;
  width: 22px;
  height: 22px;
  border: 1px solid color-mix(in srgb, var(--paper-rule) 78%, var(--printer-color-2));
  border-radius: 50%;
  background:
    radial-gradient(circle at 38% 32%, color-mix(in srgb, var(--printer-color) 65%, #fff) 0 12%, transparent 13%),
    color-mix(in srgb, var(--printer-color) 58%, var(--printer-color-2));
  box-shadow: 0 1px 2px #0005, 0 1px 1px #fff4 inset;
  transform: rotate(-120deg);
  transition: transform 260ms cubic-bezier(0.65, 0, 0.35, 1);
}

.ink-knob-button.is-dark .ink-knob {
  transform: rotate(120deg);
}

.ink-knob-mark {
  position: absolute;
  top: 2px;
  left: 50%;
  width: 2px;
  height: 6px;
  border-radius: 1px;
  background: var(--ink-link);
  transform: translateX(-50%);
}

@media (hover: hover) {
  .ink-knob-button:hover {
    background: var(--printer-color-2);
    transform: translateY(-1px);
  }

  .ink-knob-button:active {
    transform: translateY(1px);
  }
}

@media (max-width: 600px) {
  .printer-theme-control {
    border-radius: 6px;
    box-shadow: 0 5px 10px #0002, 0 1px 0 #fff8 inset;
  }
}
</style>
