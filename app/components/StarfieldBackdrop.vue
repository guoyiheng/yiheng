<template>
  <div class="starfield" aria-hidden="true">
    <span class="starfield-layer starfield-layer-far" />
    <span class="starfield-layer starfield-layer-near" />
    <svg
      class="ursa-major"
      viewBox="0 0 1000 700"
      preserveAspectRatio="xMidYMid slice"
      role="presentation"
    >
      <g class="ursa-major-guide">
        <path d="M248 154 L226 301 L399 331 L425 183 Z" />
        <path d="M425 183 L546 267 L654 356 L776 470" />
        <path d="M248 154 L112 112 L70 214 L154 266 L226 301" />
      </g>
      <g class="ursa-major-minor-stars">
        <circle cx="112" cy="112" r="2.5" />
        <circle cx="70" cy="214" r="2" />
        <circle cx="154" cy="266" r="2.2" />
        <circle cx="340" cy="86" r="1.7" />
        <circle cx="498" cy="128" r="1.8" />
        <circle cx="624" cy="154" r="1.5" />
        <circle cx="731" cy="225" r="2" />
        <circle cx="840" cy="307" r="1.8" />
        <circle cx="938" cy="420" r="1.8" />
        <circle cx="947" cy="621" r="1.5" />
        <circle cx="802" cy="611" r="1.4" />
        <circle cx="579" cy="536" r="1.7" />
        <circle cx="386" cy="478" r="1.5" />
        <circle cx="205" cy="470" r="1.8" />
      </g>
      <g class="ursa-major-dipper-stars">
        <circle class="dipper-star dipper-star-dubhe" cx="248" cy="154" r="8" />
        <circle class="dipper-star dipper-star-merak" cx="226" cy="301" r="7" />
        <circle class="dipper-star dipper-star-phecda" cx="399" cy="331" r="6.5" />
        <circle class="dipper-star dipper-star-megrez" cx="425" cy="183" r="5.5" />
        <circle class="dipper-star dipper-star-alioth" cx="546" cy="267" r="7" />
        <circle class="dipper-star dipper-star-mizar" cx="654" cy="356" r="6" />
        <circle class="dipper-star dipper-star-alkaid" cx="776" cy="470" r="7.5" />
        <circle class="dipper-companion" cx="665" cy="347" r="2.6" />
      </g>
      <g class="ursa-major-haloes">
        <circle cx="248" cy="154" r="23" />
        <circle cx="226" cy="301" r="20" />
        <circle cx="399" cy="331" r="18" />
        <circle cx="425" cy="183" r="16" />
        <circle cx="546" cy="267" r="21" />
        <circle cx="654" cy="356" r="19" />
        <circle cx="776" cy="470" r="23" />
      </g>
    </svg>
    <span class="starfield-sparks">
      <i v-for="index in 9" :key="index" class="starfield-spark" />
    </span>
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
.ursa-major,
.starfield-sparks {
  z-index: 1;
}

.ursa-major {
  position: absolute;
  top: 1%;
  right: -8%;
  width: min(1040px, 112vw);
  height: min(760px, 82vh);
  overflow: visible;
  opacity: 0.9;
  transform: rotate(-5deg);
  transform-origin: 72% 38%;
}

.ursa-major-guide {
  fill: none;
  stroke: #d8c79f;
  stroke-dasharray: 2 7;
  stroke-linecap: round;
  stroke-width: 1.5;
  opacity: 0.42;
}

.ursa-major-minor-stars {
  fill: #d9e1dc;
  opacity: 0.5;
}

.ursa-major-dipper-stars {
  fill: #f1e8c9;
  filter: drop-shadow(0 0 4px #ead9a966);
}

.dipper-star {
  stroke: #fff4d4;
  stroke-width: 1.5;
}

.dipper-star-dubhe,
.dipper-star-alkaid {
  fill: #f8efd0;
}

.dipper-star-merak,
.dipper-star-alioth {
  fill: #e8e9d5;
}

.dipper-companion {
  fill: #d9e1dc;
  opacity: 0.9;
}

.ursa-major-haloes {
  fill: none;
  stroke: #e7d7ae;
  stroke-width: 1.5;
  opacity: 0.17;
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

.starfield-sparks {
  position: absolute;
  inset: 0;
  display: block;
}

.starfield-spark {
  --star-low: 0.25;
  --star-high: 0.8;
  --star-rotation: 0deg;

  position: absolute;
  display: block;
  width: 0.7rem;
  aspect-ratio: 1;
  background: currentColor;
  clip-path: polygon(
    50% 0,
    58% 41%,
    100% 50%,
    58% 59%,
    50% 100%,
    42% 59%,
    0 50%,
    42% 41%
  );
  color: #eee6ce;
  filter: drop-shadow(0 0 0.2rem currentColor);
  opacity: var(--star-low);
  transform: rotate(var(--star-rotation)) scale(0.72);
  animation: star-pulse 7s ease-in-out infinite;
}

.starfield-spark:nth-child(1) {
  top: 14%;
  left: 7%;
  width: 0.85rem;
  animation-delay: -1.7s;
}

.starfield-spark:nth-child(2) {
  top: 69%;
  left: 16%;
  width: 0.5rem;
  color: #cbd8d9;
  animation-delay: -4.1s;
  animation-duration: 8.6s;
}

.starfield-spark:nth-child(3) {
  --star-high: 0.92;
  --star-rotation: 12deg;

  top: 11%;
  right: 9%;
  width: 0.95rem;
  animation-delay: -2.8s;
  animation-duration: 6.4s;
}

.starfield-spark:nth-child(4) {
  --star-high: 0.68;
  --star-rotation: -9deg;

  top: 54%;
  right: 5%;
  width: 0.62rem;
  color: #d6c18e;
  animation-delay: -5.2s;
  animation-duration: 9.2s;
}

.starfield-spark:nth-child(5) {
  --star-high: 0.64;

  bottom: 7%;
  left: 7%;
  width: 0.48rem;
  animation-delay: -3.4s;
  animation-duration: 7.8s;
}

.starfield-spark:nth-child(6) {
  --star-high: 0.74;
  --star-rotation: 7deg;

  right: 19%;
  bottom: 12%;
  width: 0.72rem;
  color: #c5d3d4;
  animation-delay: -0.9s;
  animation-duration: 8.2s;
}

.starfield-spark:nth-child(7) {
  --star-high: 0.62;
  --star-rotation: -5deg;

  top: 27%;
  left: 27%;
  width: 0.42rem;
  animation-delay: -6.1s;
  animation-duration: 9.8s;
}

.starfield-spark:nth-child(8) {
  --star-high: 0.58;

  top: 34%;
  right: 24%;
  width: 0.46rem;
  color: #d8c79f;
  animation-delay: -2.2s;
  animation-duration: 8.9s;
}

.starfield-spark:nth-child(9) {
  --star-high: 0.72;
  --star-rotation: 10deg;

  right: 48%;
  bottom: 5%;
  width: 0.6rem;
  animation-delay: -4.7s;
  animation-duration: 7.3s;
}

@keyframes star-pulse {
  0%,
  100% {
    opacity: var(--star-low);
    transform: rotate(var(--star-rotation)) scale(0.72);
  }

  50% {
    opacity: var(--star-high);
    transform: rotate(var(--star-rotation)) scale(1);
  }
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
    top: 5%;
    right: -8%;
    width: min(760px, 125vw);
    height: auto;
    opacity: 0.82;
  }
}

@media (prefers-reduced-motion: reduce) {
  .starfield-spark {
    opacity: var(--star-high);
    transform: rotate(var(--star-rotation));
    animation: none;
  }
}
</style>
