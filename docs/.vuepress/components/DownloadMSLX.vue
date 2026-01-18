<template>
  <div class="msl-download-card">
    <div class="card-header">
      <h3 class="title">
        <i class="fa-solid fa-cloud-arrow-down header-icon"></i>
        <span>下载 MSLX Daemon</span>
      </h3>
      <p class="subtitle">选择适合您设备的版本，下载后请阅读文档进行安装。</p>
      <p class="subtitle runtime-info">
        <i class="fa-brands fa-microsoft"></i> 运行环境：
        <a href="https://dotnet.microsoft.com/zh-cn/download/dotnet/10.0" target="_blank">
          .NET 10.0 <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
        </a>
      </p>
    </div>

    <div class="os-selector-group">
      <div 
        class="os-card" 
        :class="{ active: selectedOS === 'Windows' }"
        @click="switchOS('Windows')"
      >
        <i class="fa-brands fa-windows os-card-icon"></i>
        <span class="os-name">Windows</span>
      </div>
      
      <div 
        class="os-card" 
        :class="{ active: selectedOS === 'Linux' }"
        @click="switchOS('Linux')"
      >
        <i class="fa-brands fa-linux os-card-icon"></i>
        <span class="os-name">Linux</span>
      </div>

      <div 
        class="os-card" 
        :class="{ active: selectedOS === 'macOS' }"
        @click="switchOS('macOS')"
      >
        <i class="fa-brands fa-apple os-card-icon"></i>
        <span class="os-name">macOS</span>
      </div>
    </div>

    <div class="controls-grid">
      <div class="control-group">
        <label>
          <i class="fa-solid fa-microchip label-icon"></i> 系统架构
        </label>
        <div class="select-wrapper">
          <select v-model="selectedArch" @change="fetchFileInfo">
            <option value="x64">x64 (Intel/AMD)</option>
            <option value="arm64">arm64 (Apple Silicon/Pi)</option>
          </select>
          <i class="fa-solid fa-chevron-down arrow"></i>
        </div>
      </div>

      <div class="control-group">
        <label>
          <i class="fa-solid fa-code-branch label-icon"></i> 版本
        </label>
        <div class="select-wrapper">
          <select v-model="selectedVersion" :disabled="loadingVersions" @change="fetchFileInfo">
            <option v-for="ver in versionList" :key="ver" :value="ver">{{ ver }}</option>
          </select>
          <i v-if="!loadingVersions" class="fa-solid fa-chevron-down arrow"></i>
          <i v-else class="fa-solid fa-circle-notch fa-spin spinner"></i>
        </div>
      </div>
    </div>

    <div class="action-area">
      <div v-if="loadingFile" class="status-msg loading">
        <i class="fa-solid fa-spinner fa-spin"></i> 正在获取下载链接...
      </div>
      
      <div v-else-if="errorMsg" class="status-msg error">
        <i class="fa-solid fa-circle-exclamation"></i> {{ errorMsg }}
      </div>

      <div v-else-if="downloadUrl" class="download-container">
        <div class="file-info">
          <span class="filename">
            <i :class="fileIcon"></i> {{ fileName }}
          </span>
          <span class="filesize" v-if="fileSize">{{ formatSize(fileSize) }}</span>
        </div>
        <a :href="downloadUrl" target="_blank" class="download-btn">
          <i class="fa-solid fa-download"></i> 立即下载
        </a>
      </div>

      <div v-else class="status-msg warning">
        <i class="fa-solid fa-triangle-exclamation"></i> 未找到匹配该配置的文件
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

// --- 状态定义 ---
const loadingVersions = ref(true);
const loadingFile = ref(false);
const versionList = ref([]);
const errorMsg = ref('');

// 选中的项
const selectedOS = ref('Windows');
const selectedArch = ref('x64');
const selectedVersion = ref('');

// 下载相关信息
const downloadUrl = ref('');
const fileName = ref('');
const fileSize = ref(0);

const API_BASE = 'https://files.mslmc.cn/api/fs/list';
const DOWNLOAD_BASE_HOST = 'https://files.mslmc.cn';

// --- 计算属性 ---

// 动态文件图标 (Zip vs Tar.gz)
const fileIcon = computed(() => {
  switch (selectedOS.value) {
    case 'Windows': return 'fa-regular fa-file-zipper'; 
    default: return 'fa-regular fa-file-code'; 
  }
});

// --- 方法 ---

const switchOS = (os) => {
  selectedOS.value = os;
  fetchFileInfo();
};

const formatSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const detectEnv = () => {
  if (typeof navigator === 'undefined') return;
  const ua = navigator.userAgent;
  if (ua.indexOf('Win') !== -1) selectedOS.value = 'Windows';
  else if (ua.indexOf('Mac') !== -1) selectedOS.value = 'macOS';
  else if (ua.indexOf('Linux') !== -1) selectedOS.value = 'Linux';
  
  if (ua.indexOf('Mac') !== -1 && ua.indexOf('Intel') === -1) {
    // Mac M1/M2...
  }
};

const fetchVersions = async () => {
  loadingVersions.value = true;
  try {
    const res = await fetch(`${API_BASE}?path=MSLX-Release`);
    const json = await res.json();
    if (json.code === 200 && json.data && json.data.content) {
      versionList.value = json.data.content
        .filter(item => item.is_dir)
        .map(item => item.name);

      if (versionList.value.length > 0) {
        selectedVersion.value = versionList.value[0];
        await fetchFileInfo();
      } else {
        errorMsg.value = '暂无可用版本';
      }
    } else {
      errorMsg.value = '无法加载版本列表';
    }
  } catch (e) {
    console.error(e);
    errorMsg.value = '网络请求失败';
  } finally {
    loadingVersions.value = false;
  }
};

const fetchFileInfo = async () => {
  if (!selectedVersion.value) return;
  loadingFile.value = true;
  errorMsg.value = '';
  downloadUrl.value = '';
  
  try {
    const versionPath = `MSLX-Release/${selectedVersion.value}`;
    const res = await fetch(`${API_BASE}?path=${versionPath}`);
    const json = await res.json();

    if (json.code === 200 && json.data && json.data.content) {
      let osKey = '';
      if (selectedOS.value === 'Windows') osKey = 'win';
      else if (selectedOS.value === 'Linux') osKey = 'linux';
      else if (selectedOS.value === 'macOS') osKey = 'osx';

      const targetKey = `${osKey}-${selectedArch.value}`;
      const file = json.data.content.find(item => 
        !item.is_dir && item.name.toLowerCase().includes(targetKey.toLowerCase())
      );

      if (file) {
        fileName.value = file.name;
        fileSize.value = file.size;
        downloadUrl.value = `${DOWNLOAD_BASE_HOST}/d/${versionPath}/${file.name}?sign=${file.sign}`;
      }
    } else {
      errorMsg.value = '无法获取文件详情';
    }
  } catch (e) {
    console.error(e);
    errorMsg.value = '获取文件失败';
  } finally {
    loadingFile.value = false;
  }
};

onMounted(() => {
  detectEnv();
  fetchVersions();
});
</script>

<style scoped>
/* 容器 */
.msl-download-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
  transition: box-shadow 0.3s ease;
  background-color: transparent;
}
.msl-download-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

/* 头部 */
.card-header {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 1rem;
}
.title {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.header-icon {
  color: var(--vp-c-accent, #299764);
  font-size: 1.1em;
}
.subtitle {
  margin: 0.5rem 0 0 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
}
.runtime-info {
  margin-top: 0.4rem;
  font-size: 0.85rem;
}
.runtime-info a {
  color: var(--vp-c-accent, #299764);
  text-decoration: none;
  font-weight: 500;
}

/* OS 卡片选择器 */
.os-selector-group {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.os-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.8rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  cursor: pointer;
  background-color: var(--vp-c-bg-soft);
  transition: all 0.2s ease;
  color: var(--vp-c-text-2);
}

.os-card:hover {
  background-color: var(--vp-c-bg-mute);
  border-color: var(--vp-c-text-3);
}

.os-card.active {
  border-color: var(--vp-c-accent, #299764);
  color: var(--vp-c-accent, #299764);
  font-weight: 600;
}

.os-card-icon {
  font-size: 1.8rem;
  margin-bottom: 0.4rem;
}

.os-name {
  font-size: 0.9rem;
}

@media (max-width: 480px) {
  .os-selector-group {
    gap: 0.5rem;
  }
  .os-card-icon {
    font-size: 1.4rem;
  }
}

/* 下拉框布局 */
.controls-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
@media (max-width: 640px) {
  .controls-grid {
    grid-template-columns: 1fr;
  }
}

.control-group label {
  display: block;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  margin-bottom: 0.5rem;
  font-weight: 500;
}
.label-icon { margin-right: 4px; }

.select-wrapper {
  position: relative;
  width: 100%;
}
.select-wrapper select {
  width: 100%;
  appearance: none;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 0.6rem 2rem 0.6rem 0.8rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-1);
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
  font-family: inherit;
}
.select-wrapper select:focus {
  border-color: var(--vp-c-accent, #299764);
  box-shadow: 0 0 0 2px rgba(41, 151, 100, 0.1);
}
.select-wrapper .arrow, .select-wrapper .spinner {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

/* 动作区域 */
.action-area {
  min-height: 84px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--vp-c-bg-alt);
  border-radius: 8px;
  padding: 1rem;
}
.status-msg {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.status-msg.error { color: var(--vp-c-danger, #dc2626); }

.download-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 1rem;
}
@media (min-width: 640px) {
  .download-container {
    flex-direction: row;
    justify-content: space-between;
  }
}
.file-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}
.filename {
  font-weight: 500;
  color: var(--vp-c-text-1);
  word-break: break-all;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.filesize {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  margin-left: 1.5rem;
}
.download-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: var(--vp-c-accent, #299764);
  color: white !important;
  padding: 0.7rem 1.8rem;
  border-radius: 24px;
  text-decoration: none !important;
  font-weight: 600;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.download-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}
.text-xs { font-size: 0.7em; margin-left: 2px; }
</style>