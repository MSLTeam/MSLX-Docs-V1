<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { ThemeHomeConfigBase } from 'vuepress-theme-plume'
import { VPHomeBox } from 'vuepress-theme-plume/client'

// 接收配置参数
const props = defineProps<ThemeHomeConfigBase & {
  repo?: string // 允许在 md 中配置仓库名，默认 MSLTeam/MSLX
  index?: number // 必带的防白屏 index
}>()

const targetRepo = props.repo || 'MSLTeam/MSLX'
const starCount = ref<number | string>('...')
const loading = ref(true)

// 挂载后异步获取 GitHub Stars
onMounted(async () => {
  try {
    const res = await fetch(`https://api.github.com/repos/${targetRepo}`)
    if (!res.ok) throw new Error('Network response was not ok')
    const data = await res.json()
    if (data.stargazers_count !== undefined) {
      starCount.value = data.stargazers_count
    } else {
      starCount.value = 'Star'
    }
  } catch (error) {
    console.error('Failed to fetch GitHub stars:', error)
    starCount.value = 'Star' // 降级显示
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <VPHomeBox
    :type="type"
    :background-image="backgroundImage"
    :background-attachment="backgroundAttachment"
    :full="full"
    :index="index || 3"
    class="github-stars-wrapper"
  >
    <div class="stars-banner-container">
      <div class="banner-glow"></div>
      
      <div class="banner-content">
        <div class="text-section">
          <div class="icon-wrap">
            <i class="fa-brands fa-github"></i>
          </div>
          <div class="text-main">
            <h2 class="title">支持 MSLX 开源项目</h2>
            <p class="desc">
              开发不易，用爱发电 ⚡️ 如果 MSLX 对您的开服/联机之旅有所帮助，请在 GitHub 上为我们点亮一颗星，这是对我们最大的鼓励！
            </p>
          </div>
        </div>

        <div class="action-section">
          <a :href="`https://github.com/${targetRepo}`" target="_blank" class="modern-star-btn">
            <div class="btn-left">
              <i class="fa-brands fa-github btn-icon"></i>
              <span>Star on GitHub</span>
            </div>
            <div class="btn-right">
              <i v-if="loading" class="fa-solid fa-spinner fa-spin star-icon"></i>
              <i v-else class="fa-solid fa-star star-icon"></i>
              <span class="star-count">{{ starCount }}</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  </VPHomeBox>
</template>

<style scoped>
.github-stars-wrapper {
  padding: 3rem 0;
}

.stars-banner-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1.5rem;
  position: relative;
}

.banner-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, var(--vp-c-brand-soft), transparent, var(--vp-c-brand-soft));
  filter: blur(40px);
  opacity: 0.5;
  z-index: 0;
  border-radius: 30px;
  pointer-events: none;
}

.banner-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  padding: 2.5rem 3rem;
  border-radius: 24px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.banner-content:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.08);
  border-color: var(--vp-c-brand-1);
}

.text-section {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
}

.icon-wrap {
  flex-shrink: 0;
  font-size: 3.5rem;
  color: var(--vp-c-text-1);
}

.text-main {
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 1.5rem;
  font-weight: 800;
  margin: 0 0 0.5rem 0;
  color: var(--vp-c-text-1);
}

.desc {
  font-size: 0.95rem;
  color: var(--vp-c-text-2);
  margin: 0;
  line-height: 1.6;
  max-width: 500px;
}

.action-section {
  flex-shrink: 0;
}

.modern-star-btn {
  display: inline-flex;
  align-items: stretch;
  border-radius: 50px;
  overflow: hidden;
  text-decoration: none !important;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-mute);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.modern-star-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: var(--vp-c-brand-1);
}

.btn-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background-color: var(--vp-c-text-1);
  color: var(--vp-c-bg) !important;  
  font-weight: 700;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.btn-icon {
  font-size: 1.2rem;
}

.btn-right {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.8rem 1.5rem;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  font-weight: 700;
  font-size: 1rem;
}

.star-icon {
  color: #eab308;
}

.modern-star-btn:hover .btn-left {
  background-color: var(--vp-c-brand-1);
  color: #fff !important;
}

@media (max-width: 800px) {
  .banner-content {
    flex-direction: column;
    text-align: center;
    padding: 2rem 1.5rem;
  }
  .text-section {
    flex-direction: column;
    gap: 1rem;
  }
  .icon-wrap {
    font-size: 3rem;
  }
}

@media (max-width: 480px) {
  .modern-star-btn {
    flex-direction: column;
    border-radius: 16px;
  }
  .btn-left, .btn-right {
    justify-content: center;
    padding: 1rem 2rem;
  }
}
</style>