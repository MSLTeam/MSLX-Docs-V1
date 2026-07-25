<script setup lang="ts">
import type { ThemeHomeConfigBase } from 'vuepress-theme-plume'
import { VPHomeBox } from 'vuepress-theme-plume/client'
import { withBase } from 'vuepress/client'

interface Contributor {
  name: string
  avatar: string
  role?: string
  link?: string
}

defineProps<ThemeHomeConfigBase & {
  title?: string
  icon?: string
  contributors?: Contributor[]
  index?: number
}>()

function resolveAvatar(url: string) {
  if (!url) return ''
  if (/^(https?:)?\/\//.test(url) || url.startsWith('data:')) {
    return url
  }
  return withBase(url)
}
</script>

<template>
  <VPHomeBox
    :type="type"
    :background-image="backgroundImage"
    :background-attachment="backgroundAttachment"
    :full="full"
    :index="index"
    class="custom-contributors-wrapper"
  >
    <div class="contributors-container">
      <h3 v-if="title" class="section-title">
        <span v-if="icon" class="title-icon">{{ icon }}</span>
        <span class="title-text">{{ title }}</span>
      </h3>

      <div class="contributors-grid">
        <component
          :is="contributor.link ? 'a' : 'div'"
          v-for="(contributor, idx) in contributors"
          :key="idx"
          :href="contributor.link"
          :target="contributor.link ? '_blank' : undefined"
          :rel="contributor.link ? 'noopener noreferrer' : undefined"
          class="contributor-card"
          :class="{ 'is-link': !!contributor.link }"
        >
          <div class="avatar-wrap">
            <img 
              :src="resolveAvatar(contributor.avatar)" 
              :alt="contributor.name" 
              class="avatar-img" 
              loading="lazy"
            />
          </div>

          <div class="contributor-info">
            <div class="name-row">
              <span class="contributor-name" :title="contributor.name">{{ contributor.name }}</span>
            </div>
            <span v-if="contributor.role" class="contributor-role" :title="contributor.role">
              {{ contributor.role }}
            </span>
          </div>
        </component>
      </div>
    </div>
  </VPHomeBox>
</template>

<style scoped>
.custom-contributors-wrapper {
  padding: 1rem 0 2.5rem;
}

/* 提高最大宽度，给大屏容纳更多卡片的空间 */
.contributors-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-align: center;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.title-icon {
  font-size: 1rem;
  line-height: 1;
}

/* 自动弹性布局 + 居中对齐 */
.contributors-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.85rem;
}

/* 卡片基础宽度调整为 175px：大屏（1100px容器）一行可以轻松塞下 5~6 个人 */
.contributor-card {
  width: 175px;
  flex-grow: 0;
  flex-shrink: 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 0.6rem 0.75rem;
  transition: all 0.25s ease;
  text-decoration: none !important;
  color: inherit;
  position: relative;
  overflow: hidden;
}

.contributor-card.is-link {
  cursor: pointer;
}

.contributor-card:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
  background-color: var(--vp-c-bg-alt);
}

.avatar-wrap {
  position: relative;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  border-radius: 50%;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 1.5px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-alt);
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.contributor-card:hover .avatar-img {
  transform: scale(1.05);
  border-color: var(--vp-c-brand-1);
}

.contributor-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  flex: 1;
}

.name-row {
  display: flex;
  align-items: center;
}

.contributor-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  line-height: 1.25;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s ease;
}

.contributor-card:hover .contributor-name {
  color: var(--vp-c-brand-1);
}

.contributor-role {
  font-size: 0.72rem;
  color: var(--vp-c-text-3);
  margin-top: 0.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 适配中屏和平板：一行放 3-4 个 */
@media (max-width: 900px) {
  .contributor-card {
    width: 165px;
  }
}

/* 适配手机端：固定 2 列，并保持居中 */
@media (max-width: 640px) {
  .contributors-grid {
    gap: 0.6rem;
  }
  
  .contributor-card {
    width: calc(50% - 0.3rem);
    min-width: 135px;
    padding: 0.5rem 0.65rem;
    gap: 0.5rem;
  }
  
  .avatar-wrap {
    width: 32px;
    height: 32px;
  }

  .contributor-name {
    font-size: 0.82rem;
  }

  .contributor-role {
    font-size: 0.68rem;
  }
}
</style>