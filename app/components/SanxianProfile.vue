<template>
  <div class="sanxian-profile">
    <FuzaoPsnGames />
    <BookArchive />
    <AlbumArchive />
  </div>
</template>

<style scoped>
.sanxian-profile {
  --profile-rule: color-mix(in srgb, var(--paper-rule) 72%, transparent);

  padding: 0.35rem 0.15rem 2rem;
  color: var(--ink);
  font-size: var(--content-font-size);
}

.sanxian-profile > .sanxian-section + .sanxian-section {
  margin-top: 4rem;
}

@media (max-width: 600px), (orientation: landscape) and (max-height: 600px) {
  .sanxian-profile {
    padding-inline: 0;
  }

  .sanxian-profile > .sanxian-section + .sanxian-section {
    margin-top: 3.25rem;
  }
}
</style>
