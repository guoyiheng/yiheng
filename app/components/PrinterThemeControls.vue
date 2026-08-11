<script setup lang="ts">
const { theme, toggleTheme } = useSiteTheme()
const isDarkTheme = computed(() => theme.value === 'dark')
const targetThemeLabel = computed(() => isDarkTheme.value ? '浅色' : '深色')
</script>

<template>
  <div class="printer-theme-control" role="group" aria-label="主题切换控制台">
    <span class="theme-control-label" aria-hidden="true">INK</span>
    <button
      class="ink-knob-button"
      :class="{ 'is-dark': isDarkTheme }"
      type="button"
      :aria-label="`使用墨盒旋钮切换到${targetThemeLabel}模式`"
      :aria-pressed="isDarkTheme"
      :title="`墨盒旋钮：切换到${targetThemeLabel}模式`"
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
  position: absolute;
  top: 25px;
  right: 40px;
  z-index: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  height: 38px;
  color: var(--menu-ink);
  transition: opacity 180ms cubic-bezier(0.25, 1, 0.5, 1), transform 180ms cubic-bezier(0.25, 1, 0.5, 1);
}

.theme-control-label {
  color: color-mix(in srgb, var(--menu-ink) 70%, transparent);
  font-family: var(--site-font);
  font-size: 6px;
  line-height: 1;
}

.ink-knob-button {
  position: relative;
  display: grid;
  width: 44px;
  min-width: 44px;
  height: 28px;
  padding: 0;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--paper-rule) 82%, var(--printer-color-2));
  border-radius: 3px;
  background: color-mix(in srgb, var(--printer-color) 68%, var(--printer-color-2));
  box-shadow: 0 1px 0 #fff5 inset, 0 2px 3px #0004;
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
    transform: translateY(-1px);
  }

  .ink-knob-button:active {
    transform: translateY(1px);
  }
}

@media (max-width: 600px) {
  .printer-theme-control {
    top: 32px;
    right: 12px;
    height: 52px;
  }

  :global(.site-menu.is-open) + .printer-theme-control {
    pointer-events: none;
    opacity: 0;
    transform: translateY(-4px);
  }
}

@media (pointer: coarse) {
  .ink-knob-button {
    height: 44px;
  }
}
</style>
