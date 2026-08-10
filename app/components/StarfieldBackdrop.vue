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
  background:
    linear-gradient(155deg, #0d1112 0%, #111313 42%, #151310 100%);
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
  opacity: 0.62;
  filter: drop-shadow(0 0 0.5rem #dfc7821f);
  animation: constellation-bloom 4.6s ease-in-out infinite;
}

.starfield-layer-far {
  background-image:
    radial-gradient(circle, #f0ead8 0 0.6px, transparent 0.9px),
    radial-gradient(circle, #cbd9db 0 0.7px, transparent 1px),
    radial-gradient(circle, #d9c99e 0 0.55px, transparent 0.85px),
    radial-gradient(circle, #e4e1d5 0 0.5px, transparent 0.8px),
    radial-gradient(circle, #bac7ca 0 0.65px, transparent 0.95px),
    radial-gradient(circle, #d8d0ba 0 0.45px, transparent 0.75px);
  background-position: 17px 43px, 89px 19px, 37px 113px, 151px 71px, 109px 157px, 53px 197px;
  background-size: 173px 191px, 229px 211px, 283px 263px, 347px 317px, 419px 389px, 487px 457px;
  opacity: 0.78;
}

.starfield-layer-near {
  background-image:
    radial-gradient(circle, #f4ecd2 0 1.25px, #b9ad8d 1.35px 1.55px, transparent 1.8px),
    radial-gradient(circle, #dbe6e5 0 1.05px, #92a3a5 1.15px 1.35px, transparent 1.65px),
    radial-gradient(circle, #e4d09c 0 0.9px, transparent 1.35px),
    radial-gradient(circle, #d4dedd 0 0.85px, transparent 1.25px);
  background-position: 73px 127px, 257px 61px, 419px 233px, 149px 359px;
  background-size: 613px 557px, 757px 683px, 877px 773px, 997px 911px;
  opacity: 0.86;
}

@keyframes constellation-bloom {
  0%,
  100% {
    opacity: 0.52;
    filter: drop-shadow(0 0 0.35rem #dfc78214);
  }

  48% {
    opacity: 0.76;
    filter: drop-shadow(0 0 0.7rem #dfc78233);
  }
}

.starfield::before {
  position: absolute;
  inset: -18%;
  z-index: 1;
  background: linear-gradient(
    154deg,
    transparent 28%,
    #d8cfb40a 39%,
    #d8cfb414 46%,
    #b9c9d00d 53%,
    transparent 67%
  );
  content: "";
  filter: blur(22px);
  opacity: 0.72;
  pointer-events: none;
  transform: rotate(-8deg) scale(1.08);
}

.starfield::after {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: radial-gradient(ellipse at center, transparent 36%, #080a0b99 100%);
  content: "";
}

@media (max-width: 640px) {
  .ursa-major {
    top: calc(7rem + env(safe-area-inset-top));
    right: 0.75rem;
    width: 150px;
    opacity: 0.56;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ursa-major {
    opacity: 0.68;
    animation: none;
  }
}
</style>
