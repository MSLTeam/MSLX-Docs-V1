<script setup lang="ts">
import { ref } from 'vue'
import type { ThemeHomeConfigBase } from 'vuepress-theme-plume'
import { VPHomeBox } from 'vuepress-theme-plume/client'

interface Testimonial {
  name: string
  role?: string
  avatar?: string
  content: string
}

const props = defineProps<ThemeHomeConfigBase & {
  index?: number
  title?: string
  description?: string
  items?: Testimonial[]
}>()

const currentIndex = ref(0)

const getOffset = (index: number, total: number) => {
  let offset = index - currentIndex.value
  const half = Math.floor(total / 2)
  if (offset > half) offset -= total
  if (offset < -half) offset += total
  return offset
}

const next = () => {
  if (props.items) {
    currentIndex.value = (currentIndex.value + 1) % props.items.length
  }
}

const prev = () => {
  if (props.items) {
    currentIndex.value = (currentIndex.value - 1 + props.items.length) % props.items.length
  }
}

const setIndex = (index: number) => {
  currentIndex.value = index
}

const touchStartX = ref(0)
const touchEndX = ref(0)

const onTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.changedTouches[0].screenX
}

const onTouchEnd = (e: TouchEvent) => {
  touchEndX.value = e.changedTouches[0].screenX
  handleSwipe()
}

const handleSwipe = () => {
  const swipeThreshold = 40
  if (touchStartX.value - touchEndX.value > swipeThreshold) {
    next()
  } else if (touchEndX.value - touchStartX.value > swipeThreshold) {
    prev()
  }
}
</script>

<template>
  <VPHomeBox
    :type="type"
    :background-image="backgroundImage"
    :background-attachment="backgroundAttachment"
    :full="full"
    :index="index || 4"
    class="testimonials-wrapper"
  >
    <div class="testimonials-container">
      
      <div class="section-header">
        <h2 class="section-title">{{ title || '他们都在使用 MSLX' }}</h2>
        <p class="section-desc" v-if="description">{{ description }}</p>
      </div>

      <template v-if="items && items.length">
        
        <div v-if="items.length < 3" class="grid-layout">
          <div 
            v-for="(item, idx) in items" 
            :key="idx" 
            class="testimonial-card is-static"
          >
            <div class="user-info">
              <img :src="item.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + item.name" :alt="item.name" class="user-avatar" />
              <div class="user-meta">
                <span class="user-name">{{ item.name }}</span>
                <span class="user-role" v-if="item.role">{{ item.role }}</span>
              </div>
              <div class="quote-icon"><i class="fa-solid fa-quote-right"></i></div>
            </div>
            <p class="quote-content">{{ item.content }}</p>
          </div>
        </div>

        <div v-else class="carousel-layout">
          <div 
            class="carousel-track"
            @touchstart="onTouchStart"
            @touchend="onTouchEnd"
          >
            <div 
              v-for="(item, idx) in items" 
              :key="idx" 
              class="testimonial-card is-3d"
              :class="{
                'is-active': getOffset(idx, items.length) === 0,
                'is-prev': getOffset(idx, items.length) === -1,
                'is-next': getOffset(idx, items.length) === 1,
                'is-hidden-left': getOffset(idx, items.length) < -1,
                'is-hidden-right': getOffset(idx, items.length) > 1
              }"
              @click="setIndex(idx)"
            >
              <div class="user-info">
                <img :src="item.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + item.name" :alt="item.name" class="user-avatar" />
                <div class="user-meta">
                  <span class="user-name">{{ item.name }}</span>
                  <span class="user-role" v-if="item.role">{{ item.role }}</span>
                </div>
                <div class="quote-icon"><i class="fa-solid fa-quote-right"></i></div>
              </div>
              <p class="quote-content">{{ item.content }}</p>
            </div>
          </div>

          <div class="carousel-controls">
            <button class="control-btn" @click="prev" aria-label="Previous">
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <div class="dots-wrapper">
              <span 
                v-for="(_, idx) in items" 
                :key="idx" 
                class="dot"
                :class="{ 'is-current': currentIndex === idx }"
                @click="setIndex(idx)"
              ></span>
            </div>
            <button class="control-btn" @click="next" aria-label="Next">
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>

        </div>

      </template>
    </div>
  </VPHomeBox>
</template>

<style scoped>
.testimonials-wrapper {
  padding: 5rem 0;
}
.testimonials-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3.5rem;
}
.section-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  background: linear-gradient(120deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.4;
  padding-bottom: 0.1em;
}
.section-desc {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  margin: 0 auto;
  max-width: 600px;
  line-height: 1.6;
}

.testimonial-card {
  background-color: var(--vp-c-bg); 
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.02);
  user-select: none;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  background-color: var(--vp-c-bg-mute);
  border: 1px solid var(--vp-c-divider);
}
.user-meta { display: flex; flex-direction: column; }
.user-name { font-weight: 700; font-size: 1.05rem; color: var(--vp-c-text-1); }
.user-role { font-size: 0.85rem; color: var(--vp-c-text-3); margin-top: 2px; }
.quote-icon {
  margin-left: auto;
  font-size: 1.4rem;
  color: var(--vp-c-brand-soft);
  opacity: 0.6;
}
.quote-content {
  font-size: 1rem;
  color: var(--vp-c-text-2);
  line-height: 1.6;
  margin: 0;
  flex: 1;
}

.grid-layout {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}
.is-static {
  flex: 1;
  max-width: 450px;
  min-width: 300px;
}

.carousel-layout {
  width: 100%;
  overflow-x: clip;
  padding: 1rem 0;
}
.carousel-track {
  display: grid;
  place-items: center;
  perspective: 1200px;
  touch-action: pan-y;
}

.is-3d {
  grid-area: 1 / 1;
  width: 100%;
  max-width: 480px;
  transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
  cursor: pointer;
}

.is-active {
  transform: translateX(0) scale(1) translateZ(0);
  opacity: 1;
  z-index: 3;
  cursor: default;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
  border-color: var(--vp-c-brand-soft);
}
.is-prev {
  transform: translateX(-105%) scale(0.85) translateZ(-100px);
  opacity: 0.4;
  z-index: 2;
  filter: grayscale(20%);
}
.is-next {
  transform: translateX(105%) scale(0.85) translateZ(-100px);
  opacity: 0.4;
  z-index: 2;
  filter: grayscale(20%);
}
.is-hidden-left { transform: translateX(-200%) scale(0.6); opacity: 0; z-index: 1; pointer-events: none; }
.is-hidden-right { transform: translateX(200%) scale(0.6); opacity: 0; z-index: 1; pointer-events: none; }

.carousel-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 3rem;
}
.control-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}
.control-btn:hover {
  background-color: var(--vp-c-brand-1);
  color: #fff;
  border-color: var(--vp-c-brand-1);
  transform: scale(1.1);
}
.dots-wrapper { display: flex; gap: 0.5rem; align-items: center; }
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--vp-c-divider);
  cursor: pointer;
  transition: all 0.3s ease;
}
.dot:hover { background-color: var(--vp-c-text-3); }
.dot.is-current {
  background-color: var(--vp-c-brand-1);
  width: 24px;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .carousel-track {
    perspective: none; 
  }
  
  .is-active {
    transform: translateX(0) scale(1);
    max-width: 100%; 
  }

  .is-prev {
    transform: translateX(-100%) scale(0.9);
    opacity: 0; 
    pointer-events: none;
  }
  .is-next {
    transform: translateX(100%) scale(0.9);
    opacity: 0; 
    pointer-events: none;
  }

  .carousel-controls {
    margin-top: 2rem;
  }
}
</style>