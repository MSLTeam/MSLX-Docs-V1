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

      <h1 class="hero-name">
        {{ hero.name }}
      </h1>

      <p class="hero-desc" v-if="hero.text">{{ hero.text }}</p>

      <div class="hero-actions" v-if="hero.actions && hero.actions.length">
        <template v-for="(action, actIndex) in hero.actions" :key="actIndex">
          
          <a 
            v-if="action.link.startsWith('http')"
            :href="action.link"
            target="_blank"
            class="hero-btn"
            :class="action.theme === 'brand' ? 'btn-brand' : 'btn-alt'"
          >
            <i v-if="action.icon" :class="['fa-solid', 'fa-' + action.icon, 'btn-icon']"></i>
            <span>{{ action.text }}</span>
          </a>

          <RouterLink 
            v-else
            :to="action.link"
            class="hero-btn"
            :class="action.theme === 'brand' ? 'btn-brand' : 'btn-alt'"
          >
            <i v-if="action.icon" :class="['fa-solid', 'fa-' + action.icon, 'btn-icon']"></i>
            <span>{{ action.text }}</span>
          </RouterLink>

        </template>
      </div>
    </div>
  </VPHomeBox>
</template>

<style scoped>
/* ==================== 基础容器 ==================== */
.modern-hero-wrapper {
  color: var(--vp-c-text-1); 
  min-height: calc(100vh - var(--vp-nav-height, 64px));

  background-image: var(--hero-bg-light);
  background-size: cover;
  background-position: center;
  background-attachment: inherit;
}

.modern-hero-wrapper :deep(.container) {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 0 1.5rem;
}

.hero-content {
  text-align: center;
  width: 100%;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  animation: fadeUp 0.8s ease forwards;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero-tagline-wrap {
  margin-bottom: 1.5rem;
}

.hero-tagline {
  display: inline-block;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 0.5rem 1.5rem;
  border-radius: 50px;
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
  
  color: var(--vp-c-brand-1); 
  background: var(--vp-c-brand-soft);
  border: 1px solid transparent;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.hero-name {
  font-size: clamp(3rem, 7vw, 5.5rem); 
  font-weight: 800;
  line-height: 1.2;
  margin: 0 0 1.2rem 0;
  letter-spacing: -1px;

  background: var(--vp-bg-home-hero-name, linear-gradient(315deg, var(--vp-c-purple-1) 15%, var(--vp-c-brand-2) 65%, var(--vp-c-brand-2) 100%));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-desc {
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  color: var(--vp-c-text-2);
  max-width: 680px;
  margin: 0 0 2.5rem 0;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1.2rem;
  justify-content: center;
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.05rem;
  font-weight: 600;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  text-decoration: none !important;
  transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.btn-icon {
  font-size: 1.1rem;
}

.btn-brand {
  background-color: var(--vp-c-brand-1);
  color: #ffffff !important;
  border: 1px solid var(--vp-c-brand-1);
}

.btn-brand:hover {
  background-color: var(--vp-c-brand-2);
  border-color: var(--vp-c-brand-2);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.btn-alt {
  background-color: var(--vp-c-bg-soft);
  backdrop-filter: blur(8px);
  color: var(--vp-c-text-1) !important;
  border: 1px solid var(--vp-c-divider);
}

.btn-alt:hover {
  background-color: var(--vp-c-brand-soft);
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1) !important;
  transform: translateY(-2px);
}

@media (max-width: 640px) {
  .hero-actions {
    flex-direction: column;
    width: 100%;
  }
  .hero-btn {
    width: 100%;
    padding: 0.9rem;
  }
}
</style>

<style>
html[data-theme="dark"] .modern-hero-wrapper,
html.dark .modern-hero-wrapper {
  background-image: var(--hero-bg-dark) !important;
}

html[data-theme="dark"] .hero-tagline,
html.dark .hero-tagline {
  background: rgba(0, 0, 0, 0.4) !important;
  border: 1px solid var(--vp-c-brand-1) !important;
  box-shadow: 0 0 16px var(--vp-c-brand-1), inset 0 0 8px var(--vp-c-brand-1) !important;
  text-shadow: 0 0 10px var(--vp-c-brand-1) !important;
}
</style>