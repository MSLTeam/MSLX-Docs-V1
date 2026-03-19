<script setup lang="ts">
import type { ThemeHomeConfigBase } from 'vuepress-theme-plume'
import { VPHomeBox } from 'vuepress-theme-plume/client'

interface FeatureDetail {
  title: string
  description: string
}

type ShowcaseImage = string | { light: string; dark: string }

const props = defineProps<ThemeHomeConfigBase & {
  index?: number
  title?: string
  description?: string
  image?: ShowcaseImage
  list?: FeatureDetail[]
  reverse?: boolean
}>()
</script>

<template>
  <VPHomeBox
    :type="type"
    :background-image="backgroundImage"
    :background-attachment="backgroundAttachment"
    :full="full"
    :index="index || 0"
    class="modern-showcase-wrapper"
  >
    <div class="showcase-container">
      <div class="showcase-row" :class="{ 'reverse': reverse }">
        
        <div class="showcase-image-section">
          <div class="image-glow"></div>
          
          <div class="mac-window">
            <div class="mac-header">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
            <div class="mac-body">
              <img 
                v-if="typeof image === 'string'" 
                :src="image" 
                :alt="title" 
                class="showcase-img" 
              />
              <template v-else-if="image">
                <img :src="image.light" :alt="title" class="showcase-img img-light-only" />
                <img :src="image.dark" :alt="title" class="showcase-img img-dark-only" />
              </template>
            </div>
          </div>
        </div>

        <div class="showcase-text-section">
          <div class="text-header">
            <h2 class="showcase-title">{{ title }}</h2>
            <p class="showcase-desc">{{ description }}</p>
          </div>

          <div class="details-list" v-if="list && list.length">
            <div v-for="(detail, dIndex) in list" :key="dIndex" class="detail-item">
              <div class="detail-icon-wrap">
                <i class="detail-icon"></i>
              </div>
              <div class="detail-content">
                <h4 class="detail-title">{{ detail.title }}</h4>
                <p class="detail-desc">{{ detail.description }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </VPHomeBox>
</template>

<style scoped>
.modern-showcase-wrapper {
  padding: 5rem 0;
  overflow: hidden;
}

.showcase-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.showcase-row {
  display: flex;
  align-items: center;
  gap: 5rem;
  opacity: 0;
  animation: fadeInUp 0.8s ease forwards;
}

.showcase-row.reverse {
  flex-direction: row-reverse;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.showcase-image-section {
  flex: 1;
  min-width: 0;
  position: relative;
  perspective: 1000px;
}

.image-glow {
  position: absolute;
  top: 10%;
  left: 10%;
  width: 80%;
  height: 80%;
  background: radial-gradient(circle at 50% 50%, var(--vp-c-brand-1), var(--vp-c-brand-3));
  filter: blur(80px);
  opacity: 0.15;
  z-index: 0;
  transition: opacity 0.5s ease;
  border-radius: 50%;
}

.showcase-image-section:hover .image-glow {
  opacity: 0.25;
}

.mac-window {
  position: relative;
  z-index: 1;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.04);
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.4s ease;
}

.showcase-image-section:hover .mac-window {
  transform: translateY(-8px);
  box-shadow: 0 32px 64px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(0, 0, 0, 0.06);
  border-color: var(--vp-c-brand-soft);
}

.mac-header {
  height: 32px;
  background-color: var(--vp-c-bg-alt);
  border-bottom: 1px solid var(--vp-c-divider);
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.dot.red { background-color: #ff5f56; }
.dot.yellow { background-color: #ffbd2e; }
.dot.green { background-color: #27c93f; }

.mac-body {
  width: 100%;
  display: block;
  background-color: var(--vp-c-bg);
}

.showcase-img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

.showcase-text-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.text-header {
  margin-bottom: 2.5rem;
}

.showcase-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  line-height: 1.3;
  color: var(--vp-c-text-1);
}

.showcase-desc {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0;
}

.details-list {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 1.2rem;
}

.detail-icon-wrap {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background-color: var(--vp-c-brand-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
}

.detail-icon {
  width: 12px;
  height: 12px;
  background-color: var(--vp-c-brand-1);
  border-radius: 3px;
  transform: rotate(45deg);
}

.detail-content {
  flex: 1;
}

.detail-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 0 0 0.4rem 0;
}

.detail-desc {
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  margin: 0;
}

@media (max-width: 960px) {
  .showcase-row,
  .showcase-row.reverse {
    flex-direction: column;
    gap: 3rem;
  }
  .showcase-image-section,
  .showcase-text-section {
    width: 100%;
  }
  .text-header {
    text-align: center;
  }
  .showcase-title {
    font-size: 1.8rem;
  }
  .details-list {
    background-color: var(--vp-c-bg-soft);
    padding: 2rem;
    border-radius: 16px;
    border: 1px solid var(--vp-c-divider);
  }
}

@media (max-width: 640px) {
  .mac-header {
    height: 24px;
    padding: 0 12px;
    gap: 6px;
  }
  .dot {
    width: 8px;
    height: 8px;
  }
  .details-list {
    padding: 1.5rem;
  }
}
</style>

<style>
.img-dark-only { display: none !important; }
[data-theme="dark"] .img-dark-only { display: block !important; }
[data-theme="dark"] .img-light-only { display: none !important; }
</style>