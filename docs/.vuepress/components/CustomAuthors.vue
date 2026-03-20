<script setup lang="ts">
import type { ThemeHomeConfigBase } from 'vuepress-theme-plume'
import { VPHomeBox } from 'vuepress-theme-plume/client'

interface Author {
  name: string
  role: string
  motto: string
  avatar: string
}

defineProps<ThemeHomeConfigBase & {
  authors?: Author[]
  index?: number
}>()
</script>

<template>
  <VPHomeBox
    :type="type"
    :background-image="backgroundImage"
    :background-attachment="backgroundAttachment"
    :full="full"
    :index="index"
    class="custom-authors-wrapper"
  >
    <div class="authors-container">
      <div v-for="(author, index) in authors" :key="index" class="author-card">
        <div class="avatar-wrap">
          <div class="avatar-glow"></div>
          <img :src="author.avatar" :alt="author.name" class="avatar-img" />
        </div>
        
        <div class="author-info">
          <h3 class="author-name">{{ author.name }}</h3>
          <div class="author-role" v-if="author.role">
            <span class="role-badge">🌟 {{ author.role }}</span>
          </div>
          <p class="author-motto" v-if="author.motto">{{ author.motto }}</p>
        </div>
      </div>
    </div>
  </VPHomeBox>
</template>

<style scoped>
.custom-authors-wrapper {
  padding: 1.5rem 0 3rem;
}

.authors-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.author-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  padding: 1.8rem;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  position: relative;
  overflow: hidden;
  text-align: left;
}

.author-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
  border-color: var(--vp-c-brand-1);
  background: linear-gradient(145deg, var(--vp-c-bg-soft), var(--vp-c-bg-alt));
}

.avatar-wrap {
  position: relative;
  width: 90px;
  height: 90px;
  flex-shrink: 0;
  border-radius: 50%;
  z-index: 1;
}

.avatar-glow {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-3), var(--vp-c-brand-2));
  background-size: 200% 200%;
  z-index: -1;
  transition: all 0.5s ease;
  opacity: 0.8;
}

.author-card:hover .avatar-glow {
  filter: blur(8px);
  opacity: 1;
  animation: glowMove 2s ease infinite;
}

@keyframes glowMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid var(--vp-c-bg-soft);
  background-color: var(--vp-c-bg-soft);
  transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.author-card:hover .avatar-img {
  transform: scale(1.08) rotate(3deg);
}

.author-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  min-width: 0;
}

.author-name {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 0 0 0.4rem 0;
  background: linear-gradient(120deg, var(--vp-c-brand-1), var(--vp-c-brand-3));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
}

.author-role {
  margin-bottom: 0.6rem;
}

.role-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  background-color: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  transition: all 0.3s ease;
}

.author-card:hover .role-badge {
  background-color: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-soft);
}

.author-motto {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.5;
  font-style: italic;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 800px) {
  .authors-container {
    grid-template-columns: 1fr;
    max-width: 500px;
  }
}

@media (max-width: 640px) {
  .authors-container {
    gap: 1.2rem;
  }
  .author-card {
    padding: 1.2rem;
    gap: 1rem;
  }
  .avatar-wrap {
    width: 70px;
    height: 70px;
  }
  .author-name {
    font-size: 1.2rem;
  }
  .author-motto {
    font-size: 0.85rem;
  }
}
</style>