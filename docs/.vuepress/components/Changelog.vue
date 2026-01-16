<template>
  <div class="changelog-container">
    <div v-if="isLoading" class="loading">
      <span class="loader"></span>
      <span>正在加载更新日志...</span>
    </div>

    <div v-else-if="error" class="error">
      加载失败：{{ error.message }}
    </div>

    <div v-else class="timeline">
      <div v-for="(log, index) in changelogs" :key="log.version" class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="timeline-header">
            <h3 class="version">版本 {{ log.version }}</h3>
            <time class="time">{{ log.time }}</time>
          </div>
          <div class="changes" v-html="formatChanges(log.changes)"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 基础响应式变量
const changelogs = ref([]);
const isLoading = ref(true);
const error = ref(null);

const formatChanges = (changes) => {
  return changes.replace(/\n/g, '<br>');
};

onMounted(async () => {
  try {
    // 获取更新日志
    const response = await fetch('https://api.mslmc.cn/v3/query/changelogs?software=MSLX');

    if (!response.ok) throw new Error(`更新日志API错误! status: ${response.status}`);

    const data = await response.json();

    if (data.code === 200) {
      changelogs.value = data.data;
    } else {
      throw new Error(data.message || '更新日志API返回数据格式错误');
    }

  } catch (e) {
    error.value = e;
    console.error('加载数据失败:', e);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* --- 基础样式 --- */
.changelog-container { max-width: 800px; margin: 2rem auto; }

/* --- Loading Style --- */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: var(--vp-c-text-2);
}

.loader {
  width: 24px;
  height: 24px;
  border: 3px solid var(--vp-c-divider);
  border-top-color: var(--vp-c-accent, #299764);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error { color: var(--vp-c-danger); text-align: center; padding: 2rem; font-size: 1.2rem; }

/* --- Timeline 样式 --- */
.timeline { position: relative; padding-left: 30px; border-left: 2px solid var(--vp-c-divider); }
.timeline-item { position: relative; margin-bottom: 30px; }
.timeline-item:last-child { margin-bottom: 0; }
.timeline-dot { position: absolute; left: -40px; top: 5px; width: 14px; height: 14px; background-color: var(--vp-c-accent, #299764); border-radius: 50%; border: 2px solid var(--vp-c-bg); box-shadow: 0 0 0 2px var(--vp-c-accent, #299764); z-index: 1; animation: pulse-dot 2s infinite; }
.timeline-content { padding: 15px 20px; background-color: var(--vp-c-bg-soft); border-radius: 8px; border: 1px solid var(--vp-c-divider); transition: transform 0.3s ease, box-shadow 0.3s ease; }
.timeline-content:hover { transform: translateY(-5px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
.timeline-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; margin-bottom: 10px; }
.version { margin: 0; font-size: 1.4rem; color: var(--vp-c-text-1); font-weight: 600; }
.time { font-size: 0.9rem; color: var(--vp-c-text-2); }
.changes { font-size: 1rem; line-height: 1.7; color: var(--vp-c-text-1); padding-top: 5px; padding-bottom: 5px; /* 调整了底部padding，因为没有footer了 */ }

/* --- 呼吸动画 --- */
@keyframes pulse-dot { 0% { box-shadow: 0 0 0 0 var(--vp-c-accent, #299764); } 70% { box-shadow: 0 0 0 10px rgba(41, 151, 100, 0); } 100% { box-shadow: 0 0 0 0 rgba(41, 151, 100, 0); } }
</style>