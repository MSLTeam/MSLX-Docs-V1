<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { ThemeHomeConfigBase } from 'vuepress-theme-plume'
import { VPHomeBox } from 'vuepress-theme-plume/client'
import { withBase } from 'vuepress/client'

interface GoldSponsor {
  name: string
  avatar: string
  amount: number
  time: number
  source?: string
  slogan?: string
}

interface NormalSponsor {
  name: string
  avatar: string
  amount: number
  time: number
  source?: string
}

interface SponsorItem {
  name: string
  avatar: string
  amount: number
  time: number
  source?: string
  slogan?: string
  isGold: boolean
}

const props = withDefaults(
  defineProps<ThemeHomeConfigBase & {
    title?: string
    description?: string
    apiUrl?: string
    sponsorLink?: string
    sponsorText?: string
    index?: number
  }>(),
  {
    title: '特别赞助与鸣谢',
    description: '感谢所有支持 MSLX 开源项目发展的赞助者，每一份支持都是我们持续前行的动力。',
    apiUrl: 'https://user.mslmc.net/api/sponsor/public',
    sponsorLink: 'https://afdian.com/a/mslteam',
    sponsorText: '前往爱发电赞助',
    index: 8,
  }
)

const loading = ref(true)
const error = ref(false)
const goldSponsors = ref<GoldSponsor[]>([])
const normalSponsors = ref<NormalSponsor[]>([])

const allSponsors = computed<SponsorItem[]>(() => {
  return [
    ...goldSponsors.value.map(s => ({ ...s, isGold: true })),
    ...normalSponsors.value.map(s => ({ ...s, isGold: false })),
  ]
})

const defaultAvatar = 'https://pic1.afdiancdn.com/default/avatar.png'

function resolveAvatar(url: string) {
  if (!url) return defaultAvatar
  if (/^(https?:)?\/\//.test(url) || url.startsWith('data:')) {
    return url
  }
  return withBase(url)
}

function handleAvatarError(e: Event) {
  const target = e.target as HTMLImageElement
  if (target && target.src !== defaultAvatar) {
    target.src = defaultAvatar
  }
}

async function fetchSponsors() {
  loading.value = true
  error.value = false
  try {
    const res = await fetch(props.apiUrl)
    if (!res.ok) throw new Error(`HTTP error ${res.status}`)
    const json = await res.json()
    if (json.code === 200 && json.data) {
      goldSponsors.value = Array.isArray(json.data.goldSponsors) ? json.data.goldSponsors : []
      normalSponsors.value = Array.isArray(json.data.normalSponsors) ? json.data.normalSponsors : []
    } else {
      throw new Error(json.message || 'Invalid data')
    }
  } catch (err) {
    console.error('Failed to load sponsors:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSponsors()
})
</script>

<template>
  <VPHomeBox
    :type="type"
    :background-image="backgroundImage"
    :background-attachment="backgroundAttachment"
    :full="full"
    :index="index"
    class="sponsors-wrapper"
  >
    <div class="sponsors-container">
      <!-- 顶部标题与行动按钮 -->
      <div class="section-header">
        <h2 class="section-title">{{ title }}</h2>
        <p v-if="description" class="section-desc">{{ description }}</p>
        
        <div class="header-action">
          <a
            :href="sponsorLink"
            target="_blank"
            rel="noopener noreferrer"
            class="sponsor-btn"
          >
            <i class="fa-solid fa-mug-hot btn-icon"></i>
            <span>{{ sponsorText }}</span>
          </a>
        </div>
      </div>

      <!-- 加载中状态 -->
      <div v-if="loading" class="state-box">
        <i class="fa-solid fa-spinner fa-spin state-icon"></i>
        <span>加载赞助者名单中...</span>
      </div>

      <!-- 加载失败状态 -->
      <div v-else-if="error" class="state-box is-error">
        <span>未能成功获取赞助名单</span>
        <button class="retry-btn" @click="fetchSponsors">
          <i class="fa-solid fa-rotate-right"></i>
          <span>重新加载</span>
        </button>
      </div>

      <!-- 统一赞助展示卡片网格 -->
      <div v-else class="sponsors-content">
        <div v-if="allSponsors.length > 0" class="sponsors-grid">
          <div
            v-for="(sponsor, idx) in allSponsors"
            :key="idx"
            class="sponsor-card"
            :class="{ 'is-gold': sponsor.isGold }"
          >
            <!-- 头像区域 -->
            <div class="avatar-wrap">
              <img
                :src="resolveAvatar(sponsor.avatar)"
                :alt="sponsor.name"
                class="avatar-img"
                loading="lazy"
                @error="handleAvatarError"
              />
            </div>

            <!-- 信息区域 -->
            <div class="sponsor-info">
              <div class="name-row">
                <span class="sponsor-name" :title="sponsor.name">
                  <i v-if="sponsor.isGold" class="fa-solid fa-crown gold-crown-icon"></i>
                  {{ sponsor.name }}
                </span>
                <span class="sponsor-amount" :class="{ 'is-gold-amount': sponsor.isGold }">
                  ¥{{ sponsor.amount }}
                </span>
              </div>
              
              <div class="role-row">
                <span
                  class="sponsor-desc"
                  :class="{ 'is-slogan': sponsor.isGold && !!sponsor.slogan }"
                  :title="sponsor.slogan || (sponsor.isGold ? '金牌赞助者' : '赞助者')"
                >
                  <i v-if="sponsor.isGold && sponsor.slogan" class="fa-solid fa-quote-left quote-icon"></i>
                  {{ sponsor.slogan || (sponsor.isGold ? '金牌赞助者' : '赞助者') }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- 均为空状态提示 -->
        <div v-else class="state-box">
          <span>暂无赞助记录，欢迎成为第一位支持者</span>
        </div>
      </div>
    </div>
  </VPHomeBox>
</template>

<style scoped>
.sponsors-wrapper {
  padding: 4rem 0;
}

.sponsors-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* ================= 头部区域 ================= */
.section-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.section-desc {
  font-size: 1.05rem;
  color: var(--vp-c-text-2);
  margin: 0 auto;
  max-width: 680px;
  line-height: 1.6;
}

.header-action {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
}

.sponsor-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.75rem 1.6rem;
  border-radius: 50px;
  background-color: var(--vp-c-brand-1);
  color: #fff !important;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none !important;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.25);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid transparent;
}

.sponsor-btn:hover {
  background-color: var(--vp-c-brand-2);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.35);
}

.btn-icon {
  font-size: 1rem;
}

/* ================= 状态提示 ================= */
.state-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem 1.5rem;
  color: var(--vp-c-text-3);
  font-size: 0.95rem;
}

.state-icon {
  font-size: 1.2rem;
}

.is-error {
  flex-direction: column;
  gap: 1rem;
}

.retry-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 1rem;
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

/* ================= 统一赞助网格 ================= */
.sponsors-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

/* 基础卡片样式 */
.sponsor-card {
  width: 210px;
  flex-grow: 0;
  flex-shrink: 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  padding: 0.65rem 0.85rem;
  transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
  position: relative;
}

.sponsor-card:hover {
  transform: translateY(-2px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  background-color: var(--vp-c-bg);
}

/* 金牌赞助者高亮微调：尊贵且克制 */
.sponsor-card.is-gold {
  border: 1.5px solid rgba(245, 158, 11, 0.5);
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.08), var(--vp-c-bg-soft));
  box-shadow: 0 2px 10px rgba(245, 158, 11, 0.08);
}

[data-theme="dark"] .sponsor-card.is-gold {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), var(--vp-c-bg-soft));
  border-color: rgba(245, 158, 11, 0.45);
}

.sponsor-card.is-gold:hover {
  border-color: #f59e0b;
  box-shadow: 0 6px 20px rgba(245, 158, 11, 0.2);
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.12), var(--vp-c-bg));
}

/* 头像 */
.avatar-wrap {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 50%;
  position: relative;
}

.is-gold .avatar-wrap {
  padding: 2px;
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-alt);
}

.is-gold .avatar-img {
  border: 1.5px solid var(--vp-c-bg);
}

/* 文本信息 */
.sponsor-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
  flex: 1;
}

.name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
}

.sponsor-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.25;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.gold-crown-icon {
  font-size: 0.75rem;
  color: #f59e0b;
  flex-shrink: 0;
}

.sponsor-amount {
  font-family: var(--vp-font-family-mono);
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  white-space: nowrap;
}

.is-gold-amount {
  color: #d97706;
}

[data-theme="dark"] .is-gold-amount {
  color: #fbbf24;
}

.role-row {
  margin-top: 0.2rem;
  display: flex;
  align-items: center;
}

.sponsor-desc {
  font-size: 0.73rem;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}

.sponsor-desc.is-slogan {
  color: var(--vp-c-text-2);
  font-style: italic;
}

.quote-icon {
  font-size: 0.65rem;
  color: #f59e0b;
  margin-right: 0.2rem;
}

/* ================= 移动端适配 ================= */
@media (max-width: 640px) {
  .sponsors-grid {
    gap: 0.6rem;
  }

  .sponsor-card {
    width: calc(50% - 0.3rem);
    min-width: 140px;
    padding: 0.55rem 0.65rem;
    gap: 0.5rem;
  }

  .avatar-wrap {
    width: 34px;
    height: 34px;
  }

  .sponsor-name {
    font-size: 0.84rem;
  }

  .sponsor-desc {
    font-size: 0.68rem;
  }
}
</style>
