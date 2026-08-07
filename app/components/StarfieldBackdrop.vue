<template>
  <div class="starfield" aria-hidden="true">
    <span class="starfield-milky-way" />
    <span class="starfield-layer starfield-layer-far" />
    <span class="starfield-layer starfield-layer-near" />
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

.starfield-milky-way {
  position: absolute;
  top: 4%;
  left: -28%;
  width: 156%;
  height: 44%;
  background:
    linear-gradient(
      to bottom,
      transparent 0%,
      #bfc7c508 18%,
      #d9cfb512 42%,
      #e4dcc01b 53%,
      #adb9b813 64%,
      transparent 100%
    );
  filter: blur(18px);
  opacity: 0.82;
  transform: rotate(-13deg);
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

.starfield::after {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 36%, #080a0b99 100%);
  content: "";
}
</style>
