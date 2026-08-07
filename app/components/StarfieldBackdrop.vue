<template>
  <div class="starfield" aria-hidden="true">
    <span class="starfield-layer starfield-layer-near" />
  </div>
</template>

<style scoped>
.starfield {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background: linear-gradient(160deg, #101315 0%, #171616 58%, #14120f 100%);
  pointer-events: none;
}

.starfield::before,
.starfield::after,
.starfield-layer {
  position: absolute;
  inset: -2rem;
  display: block;
  content: "";
}

.starfield::before {
  background-image:
    radial-gradient(circle, #e9e5d7 0 0.7px, transparent 1px),
    radial-gradient(circle, #c9d5d8 0 0.8px, transparent 1.1px),
    radial-gradient(circle, #d8c79f 0 0.7px, transparent 1px),
    radial-gradient(circle, #dedbd0 0 0.6px, transparent 0.9px),
    radial-gradient(circle, #c5ced1 0 0.7px, transparent 1px);
  background-position: 19px 31px, 73px 47px, 41px 97px, 127px 23px, 89px 131px;
  background-size: 137px 149px, 181px 163px, 223px 197px, 271px 251px, 319px 293px;
  opacity: 0.72;
  animation: far-stars 9s ease-in-out infinite alternate;
}

.starfield::after {
  background-image:
    radial-gradient(circle, #f0ead5 0 1.2px, transparent 1.6px),
    radial-gradient(circle, #d5e0e1 0 1px, transparent 1.5px),
    radial-gradient(circle, #dbc28e 0 1.1px, transparent 1.5px);
  background-position: 37px 61px, 149px 109px, 211px 29px;
  background-size: 331px 307px, 419px 367px, 503px 431px;
  opacity: 0.8;
  animation: bright-stars 6s ease-in-out infinite alternate-reverse;
}

.starfield-layer-near {
  background-image:
    radial-gradient(circle, #f2ebd3 0 1.6px, #bcae8c 1.7px 2px, transparent 2.2px),
    radial-gradient(circle, #d7e0df 0 1.4px, #9ca9ac 1.5px 1.8px, transparent 2px);
  background-position: 83px 137px, 269px 79px;
  background-size: 617px 547px, 733px 661px;
  opacity: 0.82;
  animation: near-stars 4.8s ease-in-out infinite alternate;
}

@keyframes far-stars {
  to { opacity: 0.92; }
}

@keyframes bright-stars {
  to { opacity: 0.56; }
}

@keyframes near-stars {
  to { opacity: 0.62; }
}

@media (prefers-reduced-motion: reduce) {
  .starfield::before,
  .starfield::after,
  .starfield-layer-near {
    animation: none;
  }
}
</style>
