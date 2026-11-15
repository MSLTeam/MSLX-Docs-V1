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
  /* 将首屏背景延伸到导航栏下方，并保留原有内容位置。 */
  margin-top: calc(-1 * var(--vp-nav-height, 64px));
  padding-top: calc(24px + var(--vp-nav-height, 64px));
  min-height: calc(100vh - var(--vp-nav-height, 64px));
  background-image: var(--hero-bg-light);
  background-size: cover;
  background-position: center;
  background-attachment: inherit;
  overflow: hidden;
}

@media (min-width: 640px) {
  .split-hero-wrapper {
    padding-top: calc(32px + var(--vp-nav-height, 64px));
  }
}

@media (min-width: 960px) {
  .split-hero-wrapper {
    padding-top: calc(48px + var(--vp-nav-height, 64px));
  }
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
  gap: clamp(2rem, 5vw, 5rem);
  align-items: center;
  max-width: 1200px;
  width: 100%;
  min-height: calc(100vh - var(--vp-nav-height, 64px));
  padding: 2rem 0;
  box-sizing: border-box;
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
  color: #be185d;
  background: rgba(255, 245, 248, 0.76);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 12px rgba(36, 14, 24, 0.1);
}

@keyframes pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
  50% { opacity: 0.6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0); }
}

.hero-name {
  font-size: clamp(2.2rem, 4.2vw, 3.8rem);
  font-weight: 800;
  line-height: 1.1;
  margin: 0 0 1.25rem 0;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #fffaf5 0%, #fce7f3 48%, #f9a8d4 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 2px 10px rgba(36, 14, 24, 0.56));
  animation: fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
}

.hero-desc {
  font-size: clamp(1rem, 1.8vw, 1.15rem);
  color: #fff5f8;
  max-width: 480px;
  margin: 0 0 2rem 0;
  line-height: 1.7;
  font-weight: 500;
  text-shadow:
    0 2px 10px rgba(36, 14, 24, 0.65),
    0 1px 2px rgba(24, 10, 18, 0.55);
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
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #1e293b !important;
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.btn-alt:hover {
  background: #ffffff;
  border-color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
}

.hero-platforms {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 2.5rem;
  animation: fadeIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
}

.platform-label {
  font-size: 0.8rem;
  color: #fce7f3;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-shadow: 0 1px 6px rgba(36, 14, 24, 0.65);
}

.platform-icons { display: flex; gap: 0.75rem; }

.platform-icon {
  color: #fce7f3;
  font-size: 1.2rem;
  filter: drop-shadow(0 1px 4px rgba(36, 14, 24, 0.6));
  transition: color 0.3s ease;
}

.platform-icon:hover { color: var(--vp-c-brand-1, #3b82f6); }

.hero-visual {
  position: relative;
  height: min(520px, calc(100vh - 140px));
  min-height: 380px;
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

html[data-theme="dark"] .glow-primary,
html.dark .glow-primary {
  background: radial-gradient(circle, rgba(244, 114, 182, 0.85) 0%, transparent 70%);
}

html[data-theme="dark"] .glow-secondary,
html.dark .glow-secondary {
  background: radial-gradient(circle, rgba(251, 146, 60, 0.8) 0%, transparent 70%);
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

html[data-theme="dark"] .orbit-ring,
html.dark .orbit-ring {
  border: 1px dashed rgba(249, 168, 212, 0.16);
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
.tag-wrapper:nth-child(2)  { top: 15%; left: 62%; --delay: -2s;   --dur: 6.2s; }
.tag-wrapper:nth-child(3)  { top: 40%; left: 68%; --delay: -4s;   --dur: 5.8s; }
.tag-wrapper:nth-child(4)  { top: 68%; left: 64%; --delay: -1s;   --dur: 6.5s; }
.tag-wrapper:nth-child(5)  { top: 80%; left: 38%; --delay: -3s;   --dur: 7.0s; }
.tag-wrapper:nth-child(6)  { top: 73%; left: 8%;  --delay: -5s;   --dur: 5.0s; }
.tag-wrapper:nth-child(7)  { top: 45%; left: 0%;  --delay: -1.5s; --dur: 6.0s; }
.tag-wrapper:nth-child(8)  { top: 8%;  left: 36%; --delay: -3.5s; --dur: 6.8s; }
.tag-wrapper:nth-child(9)  { top: 28%; left: 38%; --delay: -2.5s; --dur: 5.2s; }
.tag-wrapper:nth-child(10) { top: 55%; left: 22%; --delay: -4.5s; --dur: 6.7s; }
.tag-wrapper:nth-child(11) { top: 60%; left: 50%; --delay: -0.5s; --dur: 5.9s; }
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

html[data-theme="dark"] .hero-tagline,
html.dark .hero-tagline {
  color: #93c5fd !important;
  background: rgba(15, 23, 42, 0.65) !important;
  border-color: rgba(147, 197, 253, 0.3) !important;
}

html[data-theme="dark"] .hero-name,
html.dark .hero-name {
  background: none !important;
  -webkit-background-clip: border-box !important;
  background-clip: border-box !important;
  color: #f8fafc !important;
  filter: none !important;
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.65);
}

html[data-theme="dark"] .hero-desc,
html.dark .hero-desc {
  color: rgba(241, 245, 249, 0.9) !important;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.65);
}

html[data-theme="dark"] .platform-label,
html.dark .platform-label {
  color: rgba(226, 232, 240, 0.85);
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.65);
}

html[data-theme="dark"] .platform-icon,
html.dark .platform-icon {
  color: rgba(226, 232, 240, 0.85);
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.65));
}

html[data-theme="dark"] .btn-alt,
html.dark .btn-alt {
  background: rgba(30, 30, 46, 0.65) !important;
  border-color: rgba(255, 255, 255, 0.16) !important;
  color: rgba(255, 255, 255, 0.94) !important;
}

html[data-theme="dark"] .btn-alt:hover,
html.dark .btn-alt:hover {
  background: rgba(40, 40, 60, 0.88) !important;
  border-color: rgba(255, 255, 255, 0.28) !important;
}

html[data-theme="dark"] .ambient-glow,
html.dark .ambient-glow {
  mix-blend-mode: screen;
  opacity: 0.24;
}

html[data-theme="dark"] .cloud-tag,
html.dark .cloud-tag {
  background: rgba(24, 18, 26, 0.58) !important;
  border-color: rgba(249, 168, 212, 0.14) !important;
  color: rgba(255, 255, 255, 0.88) !important;
  box-shadow: 
    0 8px 24px rgba(0, 0, 0, 0.32),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

html[data-theme="dark"] .tag-wrapper:hover .cloud-tag,
html.dark .tag-wrapper:hover .cloud-tag {
  background: rgba(38, 26, 38, 0.88) !important;
  border-color: rgba(244, 114, 182, 0.5) !important;
  box-shadow: 0 16px 32px rgba(20, 10, 18, 0.55) !important;
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
  .hero-name { font-size: clamp(1.8rem, 8vw, 2.4rem); } 
  
  .hero-visual { 
    height: 450px;
    transform: scale(0.9); 
    margin-top: 0.5rem; 
  }

  .tag-wrapper:nth-child(2)  { top: 4%;  left: 6%; }
  .tag-wrapper:nth-child(3)  { top: 12%; left: auto; right: 6%; }
  .tag-wrapper:nth-child(4)  { top: 24%; left: 4%; }
  .tag-wrapper:nth-child(5)  { top: 32%; left: auto; right: 4%; }
  .tag-wrapper:nth-child(6)  { top: 44%; left: 8%; }
  .tag-wrapper:nth-child(7)  { top: 52%; left: auto; right: 6%; }
  .tag-wrapper:nth-child(8)  { top: 64%; left: 4%; }
  .tag-wrapper:nth-child(9)  { top: 72%; left: auto; right: 4%; }
  .tag-wrapper:nth-child(10) { top: 84%; left: 26%; }

  .cloud-tag {
    padding: 0.45rem 0.9rem !important;
  }

  .tag-wrapper:nth-child(odd) .cloud-tag { 
    font-size: 0.85rem; 
  }
  .tag-wrapper:nth-child(even) .cloud-tag { 
    font-size: 0.75rem; 
    opacity: 0.9;
  }

  .ambient-glow {
    width: 150px;
    height: 150px;
    filter: blur(40px);
  }
}

@media (forced-colors: active) {
  .hero-name {
    background: none !important;
    filter: none !important;
    color: CanvasText !important;
  }

  .hero-text,
  .hero-tagline,
  .hero-desc,
  .hero-platforms,
  .cloud-tag,
  .btn-alt {
    background: Canvas !important;
    color: CanvasText !important;
    border: 1px solid CanvasText !important;
  }
}
</style>
