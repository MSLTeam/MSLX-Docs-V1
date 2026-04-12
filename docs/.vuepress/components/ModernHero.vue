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

interface FloatingTag {
  text: string
  icon: string
}

interface HeroData {
  name: string
  tagline?: string
  text?: string
  floatingTags?: FloatingTag[]
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

function getIconClass(name: string): string {
  if (name.startsWith('b:')) return `fa-brands fa-${name.slice(2)}`
  const iconName = name.startsWith('fa-') ? name : `fa-${name}`
  return `fa-solid ${iconName}`
}
</script>

<template>
  <VPHomeBox
    :type="type"
    :full="full"
    :index="index || 0"
    class="split-hero-wrapper"
    :style="bgVars"
  >
    <div class="hero-inner">
      <div class="hero-text">
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
            <i v-if="action.icon" :class="[getIconClass(action.icon), 'btn-icon']"></i>
              <span>{{ action.text }}</span>
            </a>

            <RouterLink
              v-else
              :to="action.link"
              class="hero-btn"
              :class="action.theme === 'brand' ? 'btn-brand' : 'btn-alt'"
            >
              <i v-if="action.icon" :class="['fa-solid', getIconClass(action.icon), 'btn-icon']"></i>
              <span>{{ action.text }}</span>
            </RouterLink>
          </template>
        </div>

        <div class="hero-platforms">
          <span class="platform-label">支持平台</span>
          <div class="platform-icons">
            <i class="fa-brands fa-windows platform-icon"></i>
            <i class="fa-brands fa-linux platform-icon"></i>
            <i class="fa-brands fa-apple platform-icon"></i>
            <i class="fa-brands fa-docker platform-icon"></i>
          </div>
        </div>
      </div>

      <div class="hero-visual">
        <div class="cloud-container">
          
          <div class="modern-bg">
            <div class="ambient-glow glow-primary"></div>
            <div class="ambient-glow glow-secondary"></div>
            <div class="orbit-ring"></div>
          </div>

          <div 
            v-for="(tag, i) in hero.floatingTags" 
            :key="i"
            class="tag-wrapper"
          >
            <div class="cloud-tag">
              <i :class="getIconClass(tag.icon)"></i>
              <span>{{ tag.text }}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  </VPHomeBox>
</template>

<style scoped>
.split-hero-wrapper {
  position: relative;
  min-height: calc(100vh - var(--vp-nav-height, 64px));
  background-image: var(--hero-bg-light);
  background-size: cover;
  background-position: center;
  background-attachment: inherit;
  overflow: hidden;
}

.split-hero-wrapper :deep(.container) {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 0 1.5rem;
}

.hero-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  min-height: calc(100vh - var(--vp-nav-height, 64px));
  padding: 3rem 0;
}

.hero-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  animation: fadeSlideRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeSlideRight {
  from { opacity: 0; transform: translateX(-24px); }
  to   { opacity: 1; transform: translateX(0); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.hero-tagline-wrap {
  margin-bottom: 1.5rem;
  animation: fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
}

.hero-tagline {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.35rem 1rem;
  border-radius: 9999px;
  color: var(--vp-c-brand-1, #3b82f6);
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.15);
}

.hero-tagline::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--vp-c-brand-1, #3b82f6);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
  50% { opacity: 0.6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0); }
}

.hero-name {
  font-size: clamp(2.5rem, 5vw, 3.8rem);
  font-weight: 800;
  line-height: 1.1;
  margin: 0 0 1.25rem 0;
  letter-spacing: -0.03em;
  color: #1e1e2e;
  animation: fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
}

.hero-desc {
  font-size: clamp(1rem, 1.8vw, 1.15rem);
  color: #5c5c72;
  max-width: 480px;
  margin: 0 0 2rem 0;
  line-height: 1.7;
  font-weight: 400;
  animation: fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.875rem;
  animation: fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.7rem 1.5rem;
  border-radius: 10px;
  text-decoration: none !important;
  transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  white-space: nowrap;
}

.btn-icon {
  flex-shrink: 0;
  opacity: 0.85;
  font-size: 1rem;
}

.btn-brand {
  background: var(--vp-c-brand-1, #3b82f6);
  color: #ffffff !important;
  border: 1px solid var(--vp-c-brand-1, #3b82f6);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.btn-brand:hover {
  background: var(--vp-c-brand-2, #2563eb);
  border-color: var(--vp-c-brand-2, #2563eb);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
}

.btn-alt {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #2a2a3e !important;
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.btn-alt:hover {
  background: #ffffff;
  border-color: rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.hero-platforms {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 2.5rem;
  animation: fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
}

.platform-label {
  font-size: 0.75rem;
  color: #8a8a9a;
  font-weight: 500;
  letter-spacing: 0.05em;
}

.platform-icons { display: flex; gap: 0.75rem; }

.platform-icon {
  color: #8a8a9a;
  font-size: 1.2rem;
  transition: color 0.3s ease;
}

.platform-icon:hover { color: var(--vp-c-brand-1, #3b82f6); }

.hero-visual {
  position: relative;
  height: 560px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeSlideRight 1s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
  pointer-events: none;
}

.cloud-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  height: 100%;
}

.modern-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ambient-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.4;
  mix-blend-mode: multiply;
  animation: floatBackground 12s ease-in-out infinite alternate;
}

.glow-primary {
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, #ffcc33 0%, transparent 70%);
  top: 10%;
  left: 10%;
}

.glow-secondary {
  width: 240px;
  height: 240px;
  background: radial-gradient(circle, #ff6600 0%, transparent 70%);
  bottom: 15%;
  right: 15%;
  animation-delay: -5s;
}

html[data-theme="dark"] .glow-primary {
  background: var(--vp-c-brand-1, #3b82f6);
}

html[data-theme="dark"] .glow-secondary {
  background: #8b5cf6; 
}

@keyframes floatBackground {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(30px, -30px) scale(1.1); }
}

.orbit-ring {
  position: absolute;
  width: 360px;
  height: 360px;
  border-radius: 50%;
  border: 1px solid rgba(255, 204, 51, 0.15);
  animation: spin 40s linear infinite;
}

html[data-theme="dark"] .orbit-ring {
  border: 1px dashed rgba(59, 130, 246, 0.3); 
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}

.tag-wrapper {
  position: absolute;
  z-index: 1;
  pointer-events: auto;
  animation: floatVertical var(--dur, 6s) ease-in-out infinite alternate var(--delay, 0s);
}

@keyframes floatVertical {
  0%   { transform: translateY(0px); }
  100% { transform: translateY(-16px); }
}

.tag-wrapper:nth-child(1)  { top: 10%; left: 15%; --delay: 0s;    --dur: 5.5s; }
.tag-wrapper:nth-child(2)  { top: 15%; left: 65%; --delay: -2s;   --dur: 6.2s; }
.tag-wrapper:nth-child(3)  { top: 40%; left: 75%; --delay: -4s;   --dur: 5.8s; }
.tag-wrapper:nth-child(4)  { top: 70%; left: 70%; --delay: -1s;   --dur: 6.5s; }
.tag-wrapper:nth-child(5)  { top: 85%; left: 40%; --delay: -3s;   --dur: 7.0s; }
.tag-wrapper:nth-child(6)  { top: 75%; left: 10%; --delay: -5s;   --dur: 5.0s; }
.tag-wrapper:nth-child(7)  { top: 45%; left: -5%; --delay: -1.5s; --dur: 6.0s; }
.tag-wrapper:nth-child(8)  { top: 5%;  left: 40%; --delay: -3.5s; --dur: 6.8s; }
.tag-wrapper:nth-child(9)  { top: 28%; left: 42%; --delay: -2.5s; --dur: 5.2s; }
.tag-wrapper:nth-child(10) { top: 55%; left: 25%; --delay: -4.5s; --dur: 6.7s; }
.tag-wrapper:nth-child(11) { top: 60%; left: 52%; --delay: -0.5s; --dur: 5.9s; }
.tag-wrapper:nth-child(12) { top: 32%; left: 10%; --delay: -3.0s; --dur: 6.3s; }

.cloud-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.65rem 1.4rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #2a2a3e;
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 9999px; 
  box-shadow: 
    0 4px 16px -2px rgba(0, 0, 0, 0.05),
    inset 0 1px 1px rgba(255, 255, 255, 0.6);
  cursor: default;
  user-select: none;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  white-space: nowrap; 
}

.cloud-tag i {
  color: var(--vp-c-brand-1, #3b82f6);
  font-size: 1.1em;
  transition: transform 0.3s ease;
}

.tag-wrapper:hover {
  z-index: 10;
}

.tag-wrapper:hover .cloud-tag {
  transform: scale(1.08);
  background: rgba(255, 255, 255, 0.95);
  border-color: rgba(59, 130, 246, 0.4);
  box-shadow: 
    0 16px 32px -4px rgba(59, 130, 246, 0.15),
    0 4px 8px -2px rgba(0, 0, 0, 0.05);
}

.tag-wrapper:hover .cloud-tag i {
  transform: scale(1.1) rotate(-10deg);
}

.tag-wrapper:nth-child(odd) .cloud-tag { font-size: 1.05rem; padding: 0.75rem 1.6rem; }
.tag-wrapper:nth-child(even) .cloud-tag { font-size: 0.85rem; padding: 0.55rem 1.2rem; }

html[data-theme="dark"] .split-hero-wrapper,
html.dark .split-hero-wrapper {
  background-image: var(--hero-bg-dark) !important;
}

html[data-theme="dark"] .hero-name,
html.dark .hero-name { color: #f0f0f5 !important; }

html[data-theme="dark"] .hero-desc,
html.dark .hero-desc { color: rgba(255, 255, 255, 0.6) !important; }

html[data-theme="dark"] .btn-alt,
html.dark .btn-alt {
  background: rgba(30, 30, 46, 0.5) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
  color: rgba(255, 255, 255, 0.9) !important;
}

html[data-theme="dark"] .btn-alt:hover,
html.dark .btn-alt:hover {
  background: rgba(40, 40, 60, 0.8) !important;
  border-color: rgba(255, 255, 255, 0.2) !important;
}

html[data-theme="dark"] .ambient-glow,
html.dark .ambient-glow {
  mix-blend-mode: screen;
  opacity: 0.2;
}

html[data-theme="dark"] .orbit-ring,
html.dark .orbit-ring {
  border-color: rgba(255, 255, 255, 0.08);
}

html[data-theme="dark"] .cloud-tag,
html.dark .cloud-tag {
  background: rgba(20, 20, 30, 0.6) !important;
  border-color: rgba(255, 255, 255, 0.1) !important;
  color: rgba(255, 255, 255, 0.85) !important;
  box-shadow: 
    0 8px 24px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

html[data-theme="dark"] .tag-wrapper:hover .cloud-tag,
html.dark .tag-wrapper:hover .cloud-tag {
  background: rgba(30, 30, 46, 0.9) !important;
  border-color: rgba(59, 130, 246, 0.5) !important;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.5) !important;
}

html[data-theme="dark"] .cloud-tag i,
html.dark .cloud-tag i { color: #7aa2f7 !important; }

@media (max-width: 900px) {
  .hero-inner {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
    min-height: auto;
    padding: 2.5rem 0 4rem;
  }

  .hero-text { align-items: center; }
  .hero-desc { max-width: 100%; }
  .hero-actions { justify-content: center; }
  .hero-platforms { justify-content: center; margin-bottom: 2rem; }

  .hero-visual { 
    height: 400px; 
    transform: scale(0.9);
    margin-top: 2rem; 
  }
}

@media (max-width: 640px) {
  .hero-actions {
    flex-direction: column;
    width: 100%;
    max-width: 320px;
  }
  .hero-btn { width: 100%; }
  .hero-name { font-size: clamp(2rem, 8vw, 2.8rem); }
  
  .hero-visual { 
    transform: scale(0.75); 
    height: 320px; 
    margin-top: 1rem; 
  }
}
</style>