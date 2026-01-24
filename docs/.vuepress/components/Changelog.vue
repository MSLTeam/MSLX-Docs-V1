<template>
  <div class="changelog-container">
    
    <div class="type-switcher">
      <div 
        class="type-tab" 
        :class="{ active: selectedType === 'daemon' }"
        @click="switchType('daemon')"
      >
        <span class="tab-title">
          <i class="fa-solid fa-server"></i> Daemon 服务端 / Webpanel 网页控制台
        </span>
      </div>
      <div 
        class="type-tab" 
        :class="{ active: selectedType === 'desktop' }"
        @click="switchType('desktop')"
      >
        <span class="tab-title">
          <i class="fa-solid fa-desktop"></i> Desktop 桌面端
        </span>
      </div>
    </div>

    <div v-if="isLoading" class="loading">
      <span class="loader"></span>
      <span>正在加载 {{ selectedType === 'daemon' ? '服务端' : '桌面端' }} 更新日志...</span>
    </div>

    <div v-else-if="error" class="error">
      <i class="fa-solid fa-circle-exclamation"></i>
      加载失败：{{ error.message }}
      <button class="retry-btn" @click="fetchChangelogs">重试</button>
    </div>

    <div v-else class="timeline">
      <div v-if="changelogs.length === 0" class="empty-state">
        暂无更新日志
      </div>

      <div v-else v-for="(log, index) in changelogs" :key="log.version" class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="timeline-content">
          <div class="timeline-header">
            <h3 class="version">
              v{{ log.version }}
              <span class="badge" v-if="index === 0">最新</span>
            </h3>
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

// --- 状态定义 ---
const selectedType = ref('daemon'); // 'daemon' | 'desktop'
const changelogs = ref([]);
const isLoading = ref(false);
const error = ref(null);

// --- 方法 ---

const formatChanges = (changes) => {
  if (!changes) return '';
  // 将换行符转换为 <br>，并支持简单的 Markdown 列表样式优化（可选）
  return changes.replace(/\n/g, '<br>');
};

const switchType = (type) => {
  if (selectedType.value === type) return;
  selectedType.value = type;
  fetchChangelogs();
};

const fetchChangelogs = async () => {
  isLoading.value = true;
  error.value = null;
  changelogs.value = []; // 清空旧数据

  try {
    // 根据类型决定参数
    const softwareParam = selectedType.value === 'daemon' ? 'MSLX' : 'MSLX-Desktop';
    const response = await fetch(`https://api.mslmc.cn/v3/query/changelogs?software=${softwareParam}`);

    if (!response.ok) throw new Error(`API 请求失败: ${response.status}`);

    const data = await response.json();

    if (data.code === 200) {
      changelogs.value = data.data;
    } else {
      throw new Error(data.message || 'API 返回格式错误');
    }

  } catch (e) {
    error.value = e;
    console.error('加载数据失败:', e);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchChangelogs();
});
</script>

<style scoped>
/* --- 基础容器 --- */
.changelog-container { 
  max-width: 800px; 
  margin: 2rem auto; 
}

/* --- Switcher (Tabs) --- */
.type-switcher {
  display: flex;
  background-color: var(--vp-c-bg-mute); /* VitePress 灰色背景 */
  padding: 4px;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.type-tab {
  flex: 1;
  text-align: center;
  padding: 0.8rem;
  font-size: 0.95rem;
  cursor: pointer;
  border-radius: 6px;
  color: var(--vp-c-text-2);
  transition: all 0.2s ease;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
}

.type-tab:hover {
  color: var(--vp-c-text-1);
  background-color: rgba(128, 128, 128, 0.05);
}

.type-tab.active {
  background-color: var(--vp-c-bg);
  color: var(--vp-c-accent, #299764);
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  font-weight: 600;
}

.tab-title i {
  margin-right: 6px;
}

/* --- Loading Style --- */
.loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 15px;
  padding: 4rem 0;
  color: var(--vp-c-text-2);
}

.loader {
  width: 32px;
  height: 32px;
  border: 3px solid var(--vp-c-divider);
  border-top-color: var(--vp-c-accent, #299764);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* --- Error Style --- */
.error { 
  color: var(--vp-c-danger); 
  text-align: center; 
  padding: 3rem; 
  background: var(--vp-c-bg-soft);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.retry-btn {
  padding: 6px 16px;
  border: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}
.retry-btn:hover { border-color: var(--vp-c-text-2); }

/* --- Timeline 样式 --- */
.timeline { 
  position: relative; 
  padding-left: 30px; 
  border-left: 2px solid var(--vp-c-divider); 
  margin-top: 1rem;
}

.timeline-item { position: relative; margin-bottom: 30px; }
.timeline-item:last-child { margin-bottom: 0; }

/* 时间轴圆点 */
.timeline-dot { 
  position: absolute; 
  left: -39px; 
  top: 20px; 
  width: 16px; 
  height: 16px; 
  background-color: var(--vp-c-bg); 
  border-radius: 50%; 
  border: 3px solid var(--vp-c-accent, #299764); 
  z-index: 1; 
}
/* 第一个点加呼吸动画 */
.timeline-item:first-child .timeline-dot {
  animation: pulse-dot 2s infinite;
  background-color: var(--vp-c-accent, #299764); /* 实心 */
  border-color: var(--vp-c-bg); /* 外圈反色 */
  box-shadow: 0 0 0 2px var(--vp-c-accent, #299764);
}

.timeline-content { 
  padding: 1.2rem; 
  background-color: var(--vp-c-bg-soft); 
  border-radius: 12px; 
  border: 1px solid transparent; 
  transition: all 0.3s ease; 
}

.timeline-content:hover { 
  transform: translateY(-2px); 
  background-color: var(--vp-c-bg);
  border-color: var(--vp-c-divider);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); 
}

.timeline-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  flex-wrap: wrap; 
  margin-bottom: 12px; 
  padding-bottom: 8px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.version { 
  margin: 0; 
  font-size: 1.3rem; 
  color: var(--vp-c-text-1); 
  font-weight: 600; 
  display: flex;
  align-items: center;
  gap: 10px;
}

.badge {
  font-size: 0.75rem;
  background-color: var(--vp-c-accent, #299764);
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: normal;
  line-height: 1.2;
}

.time { 
  font-size: 0.9rem; 
  color: var(--vp-c-text-2); 
  font-family: var(--vp-font-family-mono);
}

.changes { 
  font-size: 0.95rem; 
  line-height: 1.8; 
  color: var(--vp-c-text-1); 
}

.empty-state {
  padding: 2rem;
  color: var(--vp-c-text-3);
  font-style: italic;
}

/* --- 呼吸动画 --- */
@keyframes pulse-dot { 
  0% { box-shadow: 0 0 0 0 var(--vp-c-accent, #299764); } 
  70% { box-shadow: 0 0 0 8px rgba(41, 151, 100, 0); } 
  100% { box-shadow: 0 0 0 0 rgba(41, 151, 100, 0); } 
}

@media (max-width: 600px) {
  .type-switcher { flex-direction: column; }
  .timeline { padding-left: 20px; }
  .timeline-dot { left: -29px; }
}
</style>