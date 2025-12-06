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
          <div class="timeline-footer">
            <button
              class="download-btn"
              :disabled="!fileMap.has(log.version)"
              @click="handleDownload(fileMap.get(log.version), index === 0)"
            >
              下载
            </button>
          </div>
        </div>
      </div>
    </div>

    <transition name="dialog">
      <div v-if="isDialogVisible" class="dialog-overlay" @click.self="closeDialog">
        <div class="dialog-box">
          <h4 class="dialog-title">下载确认</h4>
          <p class="dialog-message">若无特殊原因，不建议使用旧版本。确定要下载吗？</p>
          <div class="dialog-actions">
            <button class="dialog-btn cancel" @click="closeDialog">取消</button>
            <button class="dialog-btn confirm" @click="confirmDownload">确定下载</button>
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 基础响应式变量
const changelogs = ref([]);
const fileMap = ref(new Map());
const isLoading = ref(true);
const error = ref(null);

// 新增：对话框状态管理
const isDialogVisible = ref(false);
const pendingDownload = ref(null); // 用于存储待下载的文件信息

const formatChanges = (changes) => {
  return changes.replace(/\n/g, '<br>');
};

// 更新：下载处理器
const handleDownload = (fileInfo, isLatest) => {
  if (!fileInfo) return;

  if (isLatest) {
    // 最新版本直接下载
    const downloadUrl = `https://files.mslmc.cn/d/MSL/${fileInfo.name}?sign=${fileInfo.sign}`;
    window.open(downloadUrl, '_blank');
  } else {
    // 旧版本，准备并显示对话框
    pendingDownload.value = fileInfo;
    isDialogVisible.value = true;
  }
};

// 新增：确认下载并关闭对话框
const confirmDownload = () => {
  if (pendingDownload.value) {
    const { name, sign } = pendingDownload.value;
    const downloadUrl = `https://files.mslmc.cn/d/MSL/${name}?sign=${sign}`;
    window.open(downloadUrl, '_blank');
  }
  closeDialog();
};

// 新增：关闭对话框
const closeDialog = () => {
  isDialogVisible.value = false;
  pendingDownload.value = null;
};


onMounted(async () => {
  // ... (onMounted aync/await fetch logic remains the same) ...
  try {
    const [changelogsResponse, filesResponse] = await Promise.all([
      fetch('https://api.mslmc.cn/v3/query/changelogs'),
      fetch('https://files.mslmc.cn/api/fs/list?path=/MSL')
    ]);

    if (!changelogsResponse.ok) throw new Error(`更新日志API错误! status: ${changelogsResponse.status}`);
    if (!filesResponse.ok) throw new Error(`文件列表API错误! status: ${filesResponse.status}`);

    const changelogsData = await changelogsResponse.json();
    const filesData = await filesResponse.json();

    if (changelogsData.code === 200) {
      changelogs.value = changelogsData.data;
    } else {
      throw new Error(changelogsData.message || '更新日志API返回数据格式错误');
    }

    if (filesData.code === 200) {
      const newFileMap = new Map();
      const versionRegex = /(\d+(?:\.\d+){2,3})/;

      filesData.data.content.forEach(file => {
        if (!file.is_dir) {
          const match = file.name.match(versionRegex);
          if (match) {
            const version = match[0];
            newFileMap.set(version, { name: file.name, sign: file.sign });
          }
        }
      });
      fileMap.value = newFileMap;
    } else {
      console.warn('获取文件列表失败:', filesData.message);
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

/* --- Updated Loading Style --- */
.loading {
  display: flex; /* Use flexbox for alignment */
  justify-content: center; /* Center horizontally */
  align-items: center; /* Center vertically */
  gap: 12px; /* Add space between spinner and text */
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
.timeline { position: relative; padding-left: 30px; border-left: 2px solid var(--vp-c-divider); }
.timeline-item { position: relative; margin-bottom: 30px; }
.timeline-item:last-child { margin-bottom: 0; }
.timeline-dot { position: absolute; left: -40px; top: 5px; width: 14px; height: 14px; background-color: var(--vp-c-accent, #299764); border-radius: 50%; border: 2px solid var(--vp-c-bg); box-shadow: 0 0 0 2px var(--vp-c-accent, #299764); z-index: 1; animation: pulse-dot 2s infinite; }
.timeline-content { padding: 15px 20px; background-color: var(--vp-c-bg-soft); border-radius: 8px; border: 1px solid var(--vp-c-divider); transition: transform 0.3s ease, box-shadow 0.3s ease; }
.timeline-content:hover { transform: translateY(-5px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
.timeline-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; margin-bottom: 10px; }
.version { margin: 0; font-size: 1.4rem; color: var(--vp-c-text-1); font-weight: 600; }
.time { font-size: 0.9rem; color: var(--vp-c-text-2); }
.changes { font-size: 1rem; line-height: 1.7; color: var(--vp-c-text-1); padding-top: 5px; padding-bottom: 15px; }
.timeline-footer { text-align: right; margin-top: 10px; border-top: 1px solid var(--vp-c-divider); padding-top: 15px; }

/* --- 下载按钮样式优化 --- */
.download-btn { background-color: var(--vp-c-accent, #299764); color: var(--vp-c-white); border: 1px solid transparent; /* 添加透明边框防止禁用时跳动 */ padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: all 0.3s ease; }
.download-btn:hover:not(:disabled) { background-color: var(--vp-c-accent, #299764); }
.download-btn:disabled { background-color: var(--vp-c-bg-mute); color: var(--vp-c-text-3); cursor: not-allowed; border: 1px solid var(--vp-c-divider); /* 修正：为禁用按钮添加边框 */ opacity: 0.8; /* 修正：降低不透明度 */ }

/* --- 拟态对话框样式 --- */
.dialog-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.2); backdrop-filter: blur(8px); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.dialog-box { background: var(--vp-c-bg-soft); padding: 25px 30px; border-radius: 20px; box-shadow: 6px 6px 12px var(--vp-c-shadow-3), -6px -6px 12px var(--vp-c-shadow-1); width: 90%; max-width: 400px; text-align: center; }
.dialog-title { font-size: 1.3rem; font-weight: 600; color: var(--vp-c-text-1); margin: 0 0 10px; }
.dialog-message { font-size: 1rem; color: var(--vp-c-text-2); margin: 0 0 25px; line-height: 1.6; }
.dialog-actions { display: flex; justify-content: space-between; gap: 15px; }
.dialog-btn { flex-grow: 1; padding: 10px; border-radius: 10px; border: 1px solid var(--vp-c-divider); background: var(--vp-c-bg-soft); color: var(--vp-c-text-2); font-weight: 500; cursor: pointer; transition: all 0.2s ease-in-out; box-shadow: 3px 3px 6px var(--vp-c-shadow-2), -3px -3px 6px var(--vp-c-shadow-1); }
.dialog-btn:hover { color: var(--vp-c-brand-1); border-color: var(--vp-c-brand-1); }
.dialog-btn:active { box-shadow: inset 3px 3px 6px var(--vp-c-shadow-2), inset -3px -3px 6px var(--vp-c-shadow-1); }
.dialog-btn.confirm { background: var(--vp-c-accent, #299764);  border-color: var(--vp-c-accent, #299764); }
.dialog-btn.confirm:hover { background: var(--vp-c-brand-2); border-color: var(--vp-c-brand-2); }

/* --- 对话框进入/退出动画 --- */
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.3s ease;
}
.dialog-enter-active .dialog-box,
.dialog-leave-active .dialog-box {
  transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}
.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}
.dialog-enter-from .dialog-box,
.dialog-leave-to .dialog-box {
  opacity: 0;
  transform: scale(0.8);
}

/* --- 呼吸动画 --- */
@keyframes pulse-dot { 0% { box-shadow: 0 0 0 0 var(--vp-c-accent, #299764); } 70% { box-shadow: 0 0 0 10px rgba(41, 151, 100, 0); } 100% { box-shadow: 0 0 0 0 rgba(41, 151, 100, 0); } }
</style>