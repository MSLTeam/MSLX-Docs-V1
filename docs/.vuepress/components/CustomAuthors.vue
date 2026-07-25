<script setup lang="ts">
import type { ThemeHomeConfigBase } from 'vuepress-theme-plume'
import { VPHomeBox } from 'vuepress-theme-plume/client'
import { withBase } from 'vuepress/client'

interface Author {
  name: string
  role?: string
  motto?: string
  avatar: string
  link?: string
}

const props = withDefaults(
  defineProps<ThemeHomeConfigBase & {
    title?: string       // 标题（例如："核心团队" / "作者"）
    authors?: Author[]
    index?: number
  }>(),
  {
    title: '核心团队',   // 默认标题，传空字符串 '' 则不显示
  }
)

// 处理图片地址：兼容绝对路径、网络图片和 VuePress 本地静态资源 (public 目录)
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
    class="custom-authors-wrapper"
  >
    <div class="authors-container">
      <!-- 统一风格的区域标题 -->
      <div v-if="title" class="section-header">
        <span class="header-line"></span>
        <h2 class="section-title">
          <span v-if="icon" class="title-icon">{{ icon }}</span>
          <span class="title-text">{{ title }}</span>
        </h2>
        <span class="header-line"></span>
      </div>

      <div class="authors-grid">
        <component
          :is="author.link ? 'a' : 'div'"
          v-for="(author, idx) in authors"
          :key="idx"
          :href="author.link"
          :target="author.link ? '_blank' : undefined"
          :rel="author.link ? 'noopener noreferrer' : undefined"
          class="author-card"
          :class="{ 'is-link': !!author.link }"
        >
          <div class="avatar-wrap">
            <div class="avatar-glow"></div>
            <img 
              :src="resolveAvatar(author.avatar)" 
              :alt="author.name" 
              class="avatar-img" 
              loading="lazy"
            />
          </div>
          
          <div class="author-info">
            <h3 class="author-name">{{ author.name }}</h3>
            <div class="author-role" v-if="author.role">
              <span class="role-badge">🌟 {{ author.role }}</span>
            </div>
            <p class="author-motto" v-if="author.motto" :title="author.motto">
              {{ author.motto }}
            </p>
          </div>
        </component>
      </div>
    </div>
  </VPHomeBox>
</template>

<style scoped>
.custom-authors-wrapper {
  padding: 1.5rem 0 2.5rem;
}

.authors-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* --- 标题区域（相比贡献者组件，字号更大、线段更显眼） --- */
.section-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.2rem;
  margin-bottom: 2rem;
}

.header-line {
  flex: 1;
  max-width: 160px;
  height: 1px;
  background: linear-gradient(
    90deg, 
    transparent, 
    var(--vp-c-brand-1), 
    transparent
  );
  opacity: 0.6;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  letter-spacing: 0.5px;
  border: none; /* 清除 VuePress 默认标题边框 */
  padding: 0;
}

.title-icon {
  font-size: 1.2rem;
  line-height: 1;
}

/* --- 作者卡片 Grid 布局 --- */
.authors-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
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
  text-decoration: none !important;
  color: inherit;
}

.author-card.is-link {
  cursor: pointer;
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
  .authors-grid {
    grid-template-columns: 1fr;
    max-width: 500px;
    margin: 0 auto;
  }
}

@media (max-width: 640px) {
  .authors-grid {
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