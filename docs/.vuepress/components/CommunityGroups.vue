<script setup lang="ts">
import type { ThemeHomeConfigBase } from 'vuepress-theme-plume'
import { VPHomeBox } from 'vuepress-theme-plume/client'

interface GroupItem {
  name: string
  number: string
  desc: string
  link: string
  tag?: string
  full?: boolean
}

defineProps<ThemeHomeConfigBase & {
  index?: number
  title?: string
  description?: string
  groups?: GroupItem[]
}>()

const tagColors = [
  { c: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' }, // 蓝
  { c: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.12)' }, // 紫
  { c: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' }, // 绿
  { c: '#f97316', bg: 'rgba(249, 115, 22, 0.12)' }, // 橙
  { c: '#ec4899', bg: 'rgba(236, 72, 153, 0.12)' }  // 粉
]

const getTagStyle = (tag: string) => {
  if (!tag) return {}
  let hash = 0
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % tagColors.length
  return {
    color: tagColors[index].c,
    backgroundColor: tagColors[index].bg
  }
}
</script>

<template>
  <VPHomeBox
    :type="type"
    :background-image="backgroundImage"
    :background-attachment="backgroundAttachment"
    :full="full"
    :index="index || 7"
    class="community-groups-wrapper"
  >
    <div class="community-container">
      
      <div class="section-header">
        <h2 class="section-title">{{ title || '加入社区' }}</h2>
        <p class="section-desc" v-if="description">{{ description }}</p>
      </div>

      <div class="groups-grid" v-if="groups && groups.length">
        <a 
          v-for="(group, idx) in groups" 
          :key="idx" 
          :href="group.link"
          target="_blank"
          class="simple-card"
        >
          <div class="card-icon">
            <i class="fa-brands fa-qq"></i>
          </div>

          <h3 class="group-name">{{ group.name }}</h3>

          <div class="group-meta">
            <span class="status-dot" :class="group.full ? 'is-yellow' : 'is-green'"></span>
            <span class="group-number">{{ group.number }}</span>
            
            <span v-if="group.full" class="group-tag is-full-tag">可能已满</span>
            <span v-else-if="group.tag" class="group-tag" :style="getTagStyle(group.tag)">{{ group.tag }}</span>
          </div>

          <p class="group-desc">{{ group.desc }}</p>
        </a>
      </div>

    </div>
  </VPHomeBox>
</template>

<style scoped>
.community-groups-wrapper {
  padding: 5rem 0;
}

.community-container {
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
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.section-desc {
  font-size: 1.1rem; 
  color: var(--vp-c-text-2);
  margin: 0 auto;
  max-width: 600px;
  line-height: 1.6;
}

.groups-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center; 
  gap: 1.5rem;
}

.simple-card {
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center; 
  text-align: center; 
  padding: 1.5rem 1.2rem;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  text-decoration: none !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.simple-card:hover {
  background-color: var(--vp-c-bg);
  border-color: var(--vp-c-brand-soft);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
  transform: translateY(-3px);
}

.card-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  margin-bottom: 0.8rem;
  transition: all 0.3s ease;
}

.simple-card:hover .card-icon {
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
}

.group-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 0.5rem 0;
}

.group-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  margin-bottom: 0.8rem;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.is-green { background-color: #10b981; }
.is-yellow { background-color: #f59e0b; }

.group-number {
  font-family: var(--vp-font-family-mono);
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}

.group-tag {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  background-color: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
}

.is-full-tag {
  color: #f59e0b;
  background-color: rgba(245, 158, 11, 0.12);
}

.group-desc {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
  margin: 0;
}

/* ==================== 移动端适配 ==================== */
@media (max-width: 640px) {
  .section-title {
    font-size: 1.8rem;
  }
  .simple-card {
    width: 100%;
    padding: 1.5rem;
  }
}
</style>