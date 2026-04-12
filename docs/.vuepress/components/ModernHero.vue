<script setup lang="ts">
import { computed } from 'vue'
import type { ThemeHomeConfigBase } from 'vuepress-theme-plume'
import { VPHomeBox } from 'vuepress-theme-plume/client'

interface HeroAction {
  theme?: 'brand' | 'alt'
  text: string
  link: string
  icon?: string
}

interface HeroData {
  name: string
  tagline?: string
  text?: string
  actions?: HeroAction[]
}

const props = defineProps<ThemeHomeConfigBase & {
  hero: HeroData
  index?: number
}>()

const bgVars = computed(() => {
  if (!props.backgroundImage) return {}
  if (typeof props.backgroundImage === 'string') {
    return {
      '--hero-bg-light': `url(${props.backgroundImage})`,
      '--hero-bg-dark': `url(${props.backgroundImage})`
    }
  }
  return {
    '--hero-bg-light': `url(${props.backgroundImage.light})`,
    '--hero-bg-dark': `url(${props.backgroundImage.dark})`
  }
})
</script>

<template>
  <VPHomeBox
    :type="type"
    :full="full"
    :index="index || 0"
    class="modern-hero-wrapper"
    :style="bgVars"
  >
    <div class="hero-content">
      <div class="hero-tagline-wrap" v-if="hero.tagline">
        <span class="hero-tagline">{{ hero.tagline }}</span>
      </div>

      <h1 class="hero-name">{{ hero.name }}</h1>

      <p class="hero-desc" v-if="hero.text">{{ hero.text }}</p>

      <div class="hero-actions" v-if="hero.actions && hero.actions.length">
        <template v-for="(action, actIndex) in hero.actions" :key="actIndex">
          <a
            v-if="action.link.startsWith('http')"
            :href="action.link"
            target="_blank"
            rel="noopener noreferrer"
            class="hero-btn"
            :class="action.theme === 'brand' ? 'btn-brand' : 'btn-alt'"
          >
            <svg v-if="action.icon === 'download'" class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            <svg v-else-if="action.icon === 'book'" class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
            <svg v-else-if="action.icon === 'user'" class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>{{ action.text }}</span>
          </a>

          <RouterLink
            v-else
            :to="action.link"
            class="hero-btn"
            :class="action.theme === 'brand' ? 'btn-brand' : 'btn-alt'"
          >
            <svg v-if="action.icon === 'download'" class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            <svg v-else-if="action.icon === 'book'" class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
            <svg v-else-if="action.icon === 'user'" class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>{{ action.text }}</span>
          </RouterLink>
        </template>
      </div>
    </div>
  </VPHomeBox>
</template>

<style scoped>
/* ==================== 容器 ==================== */
.modern-hero-wrapper {
  position: relative;
  min-height: calc(100vh - var(--vp-nav-height, 64px));
  background-image: var(--hero-bg-light);
  background-size: cover;
  background-position: center;
  background-attachment: inherit;
  overflow: hidden;

  /* 白天模式：柔和冷调深灰，和蓝天白云更协调 */
  color: #2a2a3e;
}

.modern-hero-wrapper :deep(.container) {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 0 1.5rem;
}

/* ==================== 内容区 ==================== */
.hero-content {
  text-align: center;
  width: 100%;
  max-width: 860px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: heroFadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes heroFadeUp {
  from {
    opacity: 0;
    transform: translateY(28px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ==================== Tagline ==================== */
.hero-tagline-wrap {
  margin-bottom: 1.75rem;
  animation: heroFadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
}

.hero-tagline {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 0.4rem 1.25rem;
  border-radius: 9999px;
  color: var(--vp-c-brand-1, #3b82f6);
  background: rgba(59, 130, 246, 0.06);
  border: 1px solid rgba(59, 130, 246, 0.12);
  transition: all 0.3s ease;
}

.hero-tagline:hover {
  background: rgba(59, 130, 246, 0.12);
  border-color: rgba(59, 130, 246, 0.25);
}

/* ==================== 标题 ==================== */
.hero-name {
  font-size: clamp(2.8rem, 7vw, 5rem);
  font-weight: 800;
  line-height: 1.1;
  margin: 0 0 1rem 0;
  letter-spacing: -0.03em;
  /* 柔和深蓝灰，不刺眼 */
  color: #2d2d44;
  animation: heroFadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
}

/* ==================== 描述 ==================== */
.hero-desc {
  font-size: clamp(1.05rem, 2.2vw, 1.3rem);
  /* 中灰蓝，柔和不突兀 */
  color: #5c5c72;
  max-width: 620px;
  margin: 0 0 2.5rem 0;
  line-height: 1.65;
  font-weight: 400;
  animation: heroFadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
}

/* ==================== 按钮组 ==================== */
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  animation: heroFadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  font-weight: 600;
  padding: 0.7rem 1.75rem;
  border-radius: 10px;
  text-decoration: none !important;
  transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  white-space: nowrap;
}

.btn-icon {
  flex-shrink: 0;
  opacity: 0.9;
}

/* 主按钮：品牌色实心 */
.btn-brand {
  background: var(--vp-c-brand-1, #3b82f6);
  color: #ffffff !important;
  border: 1px solid var(--vp-c-brand-1, #3b82f6);
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.06),
    0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-brand:hover {
  background: var(--vp-c-brand-2, #2563eb);
  border-color: var(--vp-c-brand-2, #2563eb);
  transform: translateY(-1px);
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.06),
    0 8px 20px rgba(0, 0, 0, 0.15);
}

.btn-brand:active {
  transform: translateY(0);
}

/* 次要按钮：白色半透明 */
.btn-alt {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #2a2a3e !important;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.btn-alt:hover {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 255, 255, 0.7);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-alt:active {
  transform: translateY(0);
}

/* ==================== 响应式 ==================== */
@media (max-width: 640px) {
  .hero-actions {
    flex-direction: column;
    width: 100%;
    max-width: 320px;
  }
  .hero-btn {
    width: 100%;
    padding: 0.85rem 1.5rem;
  }
  .hero-name {
    font-size: clamp(2.2rem, 10vw, 3.5rem);
  }
}
</style>

<style>
/* 暗色模式适配 */
html[data-theme="dark"] .modern-hero-wrapper,
html.dark .modern-hero-wrapper {
  background-image: var(--hero-bg-dark) !important;
  color: #f0f0f5 !important;
}

html[data-theme="dark"] .modern-hero-wrapper .hero-tagline,
html.dark .modern-hero-wrapper .hero-tagline {
  color: rgba(255, 255, 255, 0.85) !important;
  background: rgba(255, 255, 255, 0.08) !important;
  border-color: rgba(255, 255, 255, 0.12) !important;
}

html[data-theme="dark"] .modern-hero-wrapper .hero-tagline:hover,
html.dark .modern-hero-wrapper .hero-tagline:hover {
  background: rgba(255, 255, 255, 0.14) !important;
  border-color: rgba(255, 255, 255, 0.25) !important;
}

html[data-theme="dark"] .modern-hero-wrapper .hero-name,
html.dark .modern-hero-wrapper .hero-name {
  color: #ffffff !important;
}

html[data-theme="dark"] .modern-hero-wrapper .hero-desc,
html.dark .modern-hero-wrapper .hero-desc {
  color: rgba(255, 255, 255, 0.7) !important;
}

html[data-theme="dark"] .modern-hero-wrapper .btn-alt,
html.dark .modern-hero-wrapper .btn-alt {
  background: rgba(255, 255, 255, 0.08) !important;
  border-color: rgba(255, 255, 255, 0.15) !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

html[data-theme="dark"] .modern-hero-wrapper .btn-alt:hover,
html.dark .modern-hero-wrapper .btn-alt:hover {
  background: rgba(255, 255, 255, 0.14) !important;
  border-color: rgba(255, 255, 255, 0.3) !important;
  color: #ffffff !important;
}
</style>
