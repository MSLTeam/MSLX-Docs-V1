<script setup lang="ts">
import { ref } from 'vue'
import type { ThemeHomeConfigBase } from 'vuepress-theme-plume'
import { VPHomeBox } from 'vuepress-theme-plume/client'

interface FAQItem {
  question: string
  answer: string
}

defineProps<ThemeHomeConfigBase & {
  index?: number
  title?: string
  description?: string
  items?: FAQItem[]
}>()

const activeIndex = ref<number | null>(null)

const toggle = (index: number) => {
  activeIndex.value = activeIndex.value === index ? null : index
}
</script>

<template>
  <VPHomeBox
    :type="type"
    :background-image="backgroundImage"
    :background-attachment="backgroundAttachment"
    :full="full"
    :index="index || 6"
    class="modern-faq-wrapper"
  >
    <div class="faq-container">
      
      <div class="section-header">
        <h2 class="section-title">{{ title || '常见问题' }}</h2>
        <p class="section-desc" v-if="description">{{ description }}</p>
      </div>

      <div class="faq-list" v-if="items && items.length">
        <div 
          v-for="(item, idx) in items" 
          :key="idx" 
          class="faq-item"
          :class="{ 'is-active': activeIndex === idx }"
        >
          <button class="faq-question" @click="toggle(idx)">
            <span class="question-text">{{ item.question }}</span>
            <span class="icon-wrap">
              <i class="fa-solid fa-plus plus-icon"></i>
            </span>
          </button>
          
          <div class="faq-answer-wrapper">
            <div class="faq-answer-inner">
              <p class="answer-text" v-html="item.answer"></p>
            </div>
          </div>
        </div>
      </div>

    </div>
  </VPHomeBox>
</template>

<style scoped>
.modern-faq-wrapper {
  padding: 5rem 0;
}

.faq-container {
  max-width: 800px;
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
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.section-desc {
  font-size: 1.1rem;
  color: var(--vp-c-text-2);
  margin: 0 auto;
  line-height: 1.6;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-item:hover, .faq-item.is-active {
  border-color: var(--vp-c-brand-soft);
  background-color: var(--vp-c-bg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

.faq-question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  gap: 1.5rem;
}

.question-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  transition: color 0.3s ease;
}

.faq-item.is-active .question-text {
  color: var(--vp-c-brand-1);
}

.icon-wrap {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--vp-c-text-3);
  transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.faq-item.is-active .icon-wrap {
  color: var(--vp-c-brand-1);
  transform: rotate(135deg);
}

.faq-answer-wrapper {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.faq-item.is-active .faq-answer-wrapper {
  grid-template-rows: 1fr;
}

.faq-answer-inner {
  overflow: hidden;
}

.answer-text {
  padding: 0 1.5rem 1.5rem 1.5rem;
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}

.answer-text :deep(a) {
  color: var(--vp-c-brand-1);
  text-decoration: none;
}
.answer-text :deep(a:hover) {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .section-title {
    font-size: 1.8rem;
  }
  .faq-question {
    padding: 1.2rem;
  }
  .answer-text {
    padding: 0 1.2rem 1.2rem 1.2rem;
  }
}
</style>