<script setup lang="ts">
import { VPLink } from 'vuepress-theme-plume/client'

</script>

<template>
  <div class="aside-nav-wrapper">
    <VPLink class="link" no-icon href="https://user.mslmc.net">
      <i class="fa-solid fa-user"></i>
      <span class="link-text">MSLFrp/MSL用户中心</span>
      <span class="vpi-arrow-right" />
    </VPLink>
    <VPLink class="link" href="/article/qq/">
      <i class="fa-brands fa-qq"></i>
      <span class="link-text">加入交流群</span>
      <span class="vpi-arrow-right" />
    </VPLink>
    <VPLink class="link" no-icon href="https://github.com/MSLTeam/MSL">
      <i class="fa-regular fa-star"></i>
      <span class="link-text">在 GitHub 上 Star</span>
      <span class="vpi-arrow-right" />
    </VPLink>
    <VPLink class="link" no-icon href="https://github.com/MSLTeam/MSL/issues/new/choose">
      <i class="fa-solid fa-circle-question"></i>
      <span class="link-text">遇到问题 ?</span>
      <span class="vpi-arrow-right" />
    </VPLink>
    <VPLink class="link" href="/sponsor/">
      <i class="fa-solid fa-mug-saucer"></i>
      <span class="link-text">赞助一下 !</span>
      <span class="vpi-arrow-right" />
    </VPLink>
  </div>
</template>

<style scoped>
.aside-nav-wrapper {
  display: flex;
  flex-direction: column;
  padding: 8px 0;
  margin: 16px 16px 0;
  border-top: solid 1px var(--vp-c-divider);
}

.aside-nav-wrapper .link {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 14px;
  color: var(--vp-c-text-2);
  transition: color var(--vp-t-color);
}

.aside-nav-wrapper .link:hover {
  color: var(--vp-c-brand-1);
}

.aside-nav-wrapper .link .link-text {
  flex: 1 2;
  font-size: 12px;
}
</style>