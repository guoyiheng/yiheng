<template>
  <div class="starfield" aria-hidden="true">
    <span class="starfield-layer starfield-layer-far" />
    <span class="starfield-layer starfield-layer-near" />
    <img class="ursa-major" src="/images/ursa-major-and-polaris.svg" alt="" />
  </div>
</template>

<style scoped>
.starfield {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background: var(--starfield-background);
  background-blend-mode: var(--starfield-blend-mode);
  pointer-events: none;
}

.starfield-layer {
  position: absolute;
  inset: -8rem;
  display: block;
}

.starfield-layer-far,
.starfield-layer-near,
.ursa-major {
  z-index: 1;
}

.ursa-major {
  position: absolute;
  top: clamp(7rem, 18vh, 11rem);
  right: max(1.25rem, env(safe-area-inset-right));
  width: clamp(160px, calc((100vw - 680px) / 2 - 1.25rem), 360px);
  height: auto;
  opacity: 0.7;
  filter: drop-shadow(0 0 0.55rem #e6b06b2b);
  animation: constellation-bloom 4.6s ease-in-out infinite;
}

.starfield-layer-far {
  background-image:
    radial-gradient(circle, #f2ead9 0 0.6px, transparent 0.9px),
    radial-gradient(circle, #d8cbb8 0 0.7px, transparent 1px),
    radial-gradient(circle, #d9b394 0 0.55px, transparent 0.85px),
    radial-gradient(circle, #e5dccd 0 0.5px, transparent 0.8px),
    radial-gradient(circle, #b9aa96 0 0.65px, transparent 0.95px),
    radial-gradient(circle, #d9c8ae 0 0.45px, transparent 0.75px);
  background-position: 17px 43px, 89px 19px, 37px 113px, 151px 71px, 109px 157px, 53px 197px;
  background-size: 173px 191px, 229px 211px, 283px 263px, 347px 317px, 419px 389px, 487px 457px;
  opacity: 0.78;
}

.starfield-layer-near {
  background-image:
    radial-gradient(circle, #f5e9d1 0 1.25px, #bca887 1.35px 1.55px, transparent 1.8px),
    radial-gradient(circle, #e8ded0 0 1.05px, #a4937d 1.15px 1.35px, transparent 1.65px),
    radial-gradient(circle, #dfaa82 0 0.9px, transparent 1.35px),
    radial-gradient(circle, #d8c9b7 0 0.85px, transparent 1.25px);
  background-position: 73px 127px, 257px 61px, 419px 233px, 149px 359px;
  background-size: 613px 557px, 757px 683px, 877px 773px, 997px 911px;
  opacity: 0.86;
}

@keyframes constellation-bloom {
  0%,
  100% {
    opacity: 0.6;
    filter: drop-shadow(0 0 0.4rem #e6b06b24);
  }

  48% {
    opacity: 0.84;
    filter: drop-shadow(0 0 0.75rem #e6b06b42);
  }
}

.starfield::after {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: var(--starfield-vignette);
  content: "";
}

@media (max-width: 640px) {
  .ursa-major {
    top: calc(7rem + env(safe-area-inset-top));
    right: 0.75rem;
    width: 150px;
    opacity: 0.66;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ursa-major {
    opacity: 0.82;
    animation: none;
  }
}
</style>
