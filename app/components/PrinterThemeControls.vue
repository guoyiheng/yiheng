<script setup lang="ts">
import type { ThemeControlSource } from '~/composables/useSiteTheme'

const { theme, toggleTheme } = useSiteTheme()
const isDarkTheme = computed(() => theme.value === 'dark')
const targetThemeLabel = computed(() => isDarkTheme.value ? '浅色' : '深色')

const switchTheme = (source: ThemeControlSource) => {
  toggleTheme(source)
}
</script>

<template>
  <div class="printer-theme-controls" role="group" aria-label="主题切换控制台">
    <div class="theme-control paper-control">
      <span class="theme-control-label" aria-hidden="true">PAPER</span>
      <button
        class="paper-switch"
        :class="{ 'is-dark': isDarkTheme }"
        type="button"
        :aria-label="`使用纸张拨杆切换到${targetThemeLabel}模式`"
        :aria-pressed="isDarkTheme"
        :title="`纸张拨杆：切换到${targetThemeLabel}模式`"
        @click="switchTheme('paper')"
      >
        <span class="paper-swatch paper-swatch-light" aria-hidden="true" />
        <span class="paper-swatch paper-swatch-dark" aria-hidden="true" />
        <span class="paper-switch-indicator" aria-hidden="true" />
      </button>
    </div>

    <div class="theme-control ink-control">
      <span class="theme-control-label" aria-hidden="true">INK</span>
      <button
        class="ink-knob-button"
        :class="{ 'is-dark': isDarkTheme }"
        type="button"
        :aria-label="`使用墨盒旋钮切换到${targetThemeLabel}模式`"
        :aria-pressed="isDarkTheme"
        :title="`墨盒旋钮：切换到${targetThemeLabel}模式`"
        @click="switchTheme('ink')"
      >
        <span class="ink-knob" aria-hidden="true">
          <span class="ink-knob-mark" />
        </span>
      </button>
    </div>

    <div class="theme-control mode-control">
      <span class="theme-control-label" aria-hidden="true">MODE</span>
      <button
        class="mode-key"
        :class="{ 'is-dark': isDarkTheme }"
        type="button"
        :aria-label="`使用模式按键切换到${targetThemeLabel}模式`"
        :aria-pressed="isDarkTheme"
        :title="`模式按键：切换到${targetThemeLabel}模式`"
        @click="switchTheme('mode')"
      >
        <span class="mode-key-face" aria-hidden="true">M</span>
        <span class="mode-key-light" aria-hidden="true" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.printer-theme-controls {
  position: absolute;
  top: 25px;
  right: 42px;
  z-index: 4;
  display: flex;
  height: 38px;
  align-items: flex-end;
  gap: 5px;
  color: var(--menu-ink);
  transition: opacity 180ms cubic-bezier(0.25, 1, 0.5, 1), transform 180ms cubic-bezier(0.25, 1, 0.5, 1);
}

.theme-control {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.theme-control-label {
  color: color-mix(in srgb, var(--menu-ink) 70%, transparent);
  font-family: var(--site-font);
  font-size: 6px;
  line-height: 1;
}

.theme-control button {
  position: relative;
  display: grid;
  height: 28px;
  min-width: 44px;
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

.theme-control button:active {
  transform: translateY(1px);
}

.paper-switch {
  width: 56px;
  grid-template-columns: 1fr 1fr;
  padding-inline: 6px !important;
}

.paper-swatch {
  position: relative;
  z-index: 1;
  width: 12px;
  height: 16px;
  border-radius: 1px 1px 2px 2px;
  box-shadow: 0 1px 2px #0004;
}

.paper-swatch-light {
  border: 1px solid #d8d1c4;
  background: #f4f0e6;
}

.paper-swatch-dark {
  border: 1px solid #282624;
  background: #121110;
}

.paper-switch-indicator {
  position: absolute;
  top: 50%;
  left: 3px;
  width: 24px;
  height: 22px;
  border: 1px solid var(--ink-link);
  border-radius: 2px;
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--ink-link) 20%, transparent);
  transform: translate(0, -50%);
  transition: transform 220ms cubic-bezier(0.65, 0, 0.35, 1);
}

.paper-switch.is-dark .paper-switch-indicator {
  transform: translate(25px, -50%);
}

.ink-knob-button {
  width: 44px;
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

.mode-key {
  width: 44px;
}

.mode-key-face {
  display: grid;
  width: 24px;
  height: 16px;
  place-items: center;
  border-radius: 2px;
  background: color-mix(in srgb, var(--printer-color-2) 70%, #000);
  box-shadow: 0 1px 0 #fff3 inset, 0 2px 2px #0005;
  font-size: 8px;
  line-height: 1;
  transform: translateY(-1px);
  transition: transform 120ms cubic-bezier(0.25, 1, 0.5, 1);
}

.mode-key:active .mode-key-face {
  transform: translateY(1px);
}

.mode-key-light {
  position: absolute;
  top: 3px;
  right: 3px;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--ink-link);
  opacity: 0.55;
}

.mode-key.is-dark .mode-key-light {
  background: var(--display-text);
  box-shadow: 0 0 3px var(--display-text);
  opacity: 1;
}

@media (hover: hover) {
  .theme-control button:hover {
    transform: translateY(-1px);
  }

  .theme-control button:active {
    transform: translateY(1px);
  }
}

@media (max-width: 600px) {
  .printer-theme-controls {
    top: 32px;
    right: 12px;
    left: 124px;
    height: 52px;
    justify-content: space-between;
    gap: 2px;
  }

  :global(.site-menu.is-open) + .printer-theme-controls {
    pointer-events: none;
    opacity: 0;
    transform: translateY(-4px);
  }
}

@media (pointer: coarse) {
  .theme-control button {
    height: 44px;
  }
}
</style>
