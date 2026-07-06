<template>
  <div class="msl-download-card">
    <div class="card-header">
      <h3 class="title">
        <i class="fa-solid fa-cloud-arrow-down header-icon"></i>
        <span>获取 MSLX</span>
      </h3>

      <div class="type-switcher">
        <div class="type-tab" :class="{ active: selectedType === 'daemon' }" @click="switchType('daemon')">
          <span class="tab-title"><i class="fa-solid fa-server"></i> Daemon 服务端 / Webpanel 网页控制台</span>
        </div>
        <div class="type-tab" :class="{ active: selectedType === 'desktop' }" @click="switchType('desktop')">
          <span class="tab-title"><i class="fa-solid fa-desktop"></i> Desktop 桌面版</span>
        </div>
      </div>

      <div class="info-alert" :class="selectedType">
        <template v-if="selectedType === 'daemon'">
          <i class="fa-solid fa-circle-info"></i>
          <span>可运行在纯命令行环境/桌面环境。<br>包含 <strong>Web 控制台</strong>，适合服务器或无人值守环境长期运行。</span>
        </template>
        <template v-else>
          <i class="fa-solid fa-flask"></i> <span>当前为
            <strong>早期开发预览版</strong>，功能尚未开发完成。<strong><u>请勿下载使用</u></strong>。<br> 目前MSLX可用的版本是旁边的 <strong>Daemon 服务端 /
              Webpanel 网页控制台</strong> 版本。</span>
        </template>
      </div>

      <p class="subtitle runtime-info">
        <i class="fa-brands fa-microsoft"></i> 运行环境：
        <a href="https://dotnet.microsoft.com/zh-cn/download/dotnet/10.0" target="_blank">
          .NET 10.0 <i class="fa-solid fa-arrow-up-right-from-square text-xs"></i>
        </a> (建议安装SDK版本)
      </p>
    </div>

    <div class="download-controls">
      <div class="os-selector-group">
        <div class="os-card" :class="{ active: selectedOS === 'Windows' }" @click="switchOS('Windows')">
          <i class="fa-brands fa-windows os-card-icon"></i>
          <span class="os-name">Windows</span>
        </div>

        <div class="os-card" :class="{ active: selectedOS === 'Linux' }" @click="switchOS('Linux')">
          <i class="fa-brands fa-linux os-card-icon"></i>
          <span class="os-name">Linux</span>
        </div>

        <div class="os-card" :class="{ active: selectedOS === 'macOS' }" @click="switchOS('macOS')">
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
            <select v-model="selectedArch">
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

        <div v-else-if="fileList.length > 0" class="download-list">
          <div v-for="(file, index) in fileList" :key="index" class="download-item">
            <div class="file-info-group">
              <div class="file-main">
                <i :class="getFileIcon(file.name)"></i>
                <span class="filename">{{ file.name }}</span>
                <span v-if="file.variant" class="variant-tag" :class="file.variantKey">
                  {{ file.variant }}
                </span>
              </div>
              <div class="file-meta">
                <span class="filesize">{{ formatSize(file.size) }}</span>
              </div>
            </div>

            <a :href="file.url" target="_blank" class="download-btn-sm" v-if="selectedType === 'daemon'">
              <i class="fa-solid fa-download"></i> 下载
            </a>
            <div class="download-btn-disabled" v-else>
              <i class="fa-solid fa-download"></i> 暂未开放下载
            </div>
          </div>
        </div>

        <div v-else class="status-msg warning">
          <i class="fa-solid fa-triangle-exclamation"></i>
          {{ selectedType === 'desktop' ? '该版本暂无桌面端构建' : '该版本暂无构建' }}
        </div>


      </div>

      <div class="linux-extra-methods" v-if="selectedOS === 'Linux' && selectedType === 'daemon'">
        <div class="method-list">
          <a href="/docs/install/linux/" class="method-item">
            <div class="method-info">
              <i class="fa-brands fa-linux method-icon linux"></i>
              <span>Linux 脚本一键安装</span>
            </div>
            <i class="fa-solid fa-arrow-right arrow-icon"></i>
          </a>
          <a href="/docs/install/docker/" class="method-item">
            <div class="method-info">
              <i class="fa-brands fa-docker method-icon docker"></i>
              <span>Docker 安装</span>
            </div>
            <i class="fa-solid fa-arrow-right arrow-icon"></i>
          </a>
          <a href="/docs/install/fnos/" class="method-item">
            <div class="method-info">
              <i class="fa-brands fa-debian method-icon debian"></i>
              <span>在 fnOS (飞牛系统) 应用商店安装</span>
            </div>
            <i class="fa-solid fa-arrow-right arrow-icon"></i>
          </a>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const selectedType = ref('daemon');
const loadingVersions = ref(true);
const loadingFile = ref(false);
const versionList = ref([]);
const errorMsg = ref('');
const recommendedVersion = ref('');

const selectedOS = ref('Windows');
const selectedArch = ref('x64');
const selectedVersion = ref('');

const rawFileContent = ref([]);
const fileList = ref([]);

const apiBase = ref('https://files.mslmc.cn/api/fs/list');
const downloadBaseHost = ref('https://files.mslmc.cn');
const rootPath = ref('MSLX-Release-CN');

const fetchApiConfig = async () => {
  try {
    const res = await fetch('https://api.mslmc.cn/v4/download/update?software=MSLX');
    const json = await res.json();
    if (json.code === 200 && json.data) {
      if (json.data.version) {
        recommendedVersion.value = `v${json.data.version}`;
      }

      if (json.data.file) {
        const fileUrl = new URL(json.data.file);
        downloadBaseHost.value = fileUrl.origin;
        apiBase.value = `${fileUrl.origin}/api/fs/list`;
      }
    }
  } catch (e) {
    console.error('获取动态域名配置失败', e);
  }
};

// 切换类型时，只进行本地筛选
const switchType = (type) => {
  selectedType.value = type;
  filterFiles();
};

// 切换系统时，只进行本地筛选
const switchOS = (os) => {
  selectedOS.value = os;
  filterFiles();
};

// 监听架构变化，只进行本地筛选
watch(selectedArch, () => {
  filterFiles();
});

const formatSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getVariantInfo = (filename, os) => {
  if (os !== 'Linux') return null;
  const lowerName = filename.toLowerCase();
  if (lowerName.includes('musl')) {
    return { label: 'Alpine / Musl', key: 'musl' };
  }
  return { label: 'Standard / Glibc', key: 'glibc' };
};

const getFileIcon = (name) => {
  const lower = name.toLowerCase();
  if (selectedType.value === 'desktop' && lower.includes('win')) {
    return 'fa-brands fa-windows';
  }
  if (lower.endsWith('.zip') || lower.endsWith('.tar.gz') || lower.endsWith('.7z')) {
    return 'fa-regular fa-file-zipper';
  }
  return 'fa-regular fa-file-code';
};

const detectEnv = () => {
  if (typeof navigator === 'undefined') return;
  const ua = navigator.userAgent;
  if (ua.indexOf('Win') !== -1) selectedOS.value = 'Windows';
  else if (ua.indexOf('Mac') !== -1) selectedOS.value = 'macOS';
  else if (ua.indexOf('Linux') !== -1) selectedOS.value = 'Linux';
};

const fetchVersions = async () => {
  loadingVersions.value = true;
  try {
    const res = await fetch(`${apiBase.value}?path=${rootPath.value}`);
    const json = await res.json();
    if (json.code === 200 && json.data && json.data.content) {
      versionList.value = json.data.content
        .filter(item => item.is_dir)
        .map(item => item.name);

      if (versionList.value.length > 0) {
        if (recommendedVersion.value && versionList.value.includes(recommendedVersion.value)) {
          selectedVersion.value = recommendedVersion.value;
        } else {
          selectedVersion.value = versionList.value[0];
        }
        
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

// 从 API 拉取数据，存入 rawFileContent
const fetchFileInfo = async () => {
  if (!selectedVersion.value) return;

  loadingFile.value = true;
  errorMsg.value = '';
  fileList.value = [];
  rawFileContent.value = []; // 清空缓存

  try {
    const versionPath = `${rootPath.value}/${selectedVersion.value}`;
    const res = await fetch(`${apiBase.value}?path=${versionPath}`);
    const json = await res.json();

    if (json.code === 200 && json.data && json.data.content) {
      // 存储原始数据
      rawFileContent.value = json.data.content;
      // 拉取完后立即执行一次筛选
      filterFiles();
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

// 纯本地筛选
const filterFiles = () => {
  // 如果没有原始数据，直接返回
  if (!rawFileContent.value || rawFileContent.value.length === 0) {
    fileList.value = [];
    return;
  }

  let osKey = '';
  if (selectedOS.value === 'Windows') osKey = 'win';
  else if (selectedOS.value === 'Linux') osKey = 'linux';
  else if (selectedOS.value === 'macOS') osKey = 'osx';

  const typePrefix = selectedType.value === 'daemon' ? 'MSLX-Daemon' : 'MSLX-Desktop';
  const archKey = selectedArch.value;
  const versionPath = `MSLX-Release/${selectedVersion.value}`;

  // 使用 rawFileContent 进行筛选
  const matches = rawFileContent.value.filter(item => {
    if (item.is_dir) return false;
    const name = item.name.toLowerCase();

    return item.name.startsWith(typePrefix) &&
      name.includes(osKey) &&
      name.includes(archKey);
  });

  // 处理展示数据
  fileList.value = matches.map(file => {
    const variantInfo = getVariantInfo(file.name, selectedOS.value);
    return {
      name: file.name,
      size: file.size,
      // 使用动态的 downloadBaseHost
      url: `${downloadBaseHost.value}/d/${versionPath}/${file.name}?sign=${file.sign}`,
      variant: variantInfo?.label,
      variantKey: variantInfo?.key
    };
  });

  // 排序
  fileList.value.sort((a, b) => {
    if (a.variantKey === 'glibc' && b.variantKey === 'musl') return -1;
    if (a.variantKey === 'musl' && b.variantKey === 'glibc') return 1;
    return 0;
  });
};

onMounted(async () => {
  detectEnv();
  await fetchApiConfig();
  fetchVersions();
});
</script>

<style scoped>
.msl-download-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
  transition: box-shadow 0.3s ease;
  background-color: var(--vp-c-bg-soft);
}

.msl-download-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.card-header {
  margin-bottom: 1.5rem;
}

.title {
  margin: 0 0 1rem 0;
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.header-icon {
  color: var(--vp-c-accent, #299764);
}

.type-switcher {
  display: flex;
  background-color: var(--vp-c-bg-mute);
  padding: 4px;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.type-tab {
  flex: 1;
  text-align: center;
  padding: 0.6rem;
  font-size: 0.95rem;
  cursor: pointer;
  border-radius: 6px;
  color: var(--vp-c-text-2);
  transition: all 0.2s ease;
  font-weight: 500;
}

.type-tab:hover {
  color: var(--vp-c-text-1);
}

.type-tab.active {
  background-color: var(--vp-c-bg);
  color: var(--vp-c-accent, #299764);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  font-weight: 600;
}

.tab-title i {
  margin-right: 6px;
}

.info-alert {
  font-size: 0.9rem;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  background-color: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.info-alert.daemon {
  color: var(--vp-c-text-1);
}

.info-alert.desktop {
  background-color: rgba(234, 179, 8, 0.1);
  color: var(--vp-c-warning-text, #d97706);
}

.info-alert i {
  margin-top: 3px;
  color: var(--vp-c-accent, #299764);
}

.info-alert.desktop i {
  color: var(--vp-c-warning-1, #f59e0b);
}

.runtime-info {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
}

.runtime-info a {
  color: var(--vp-c-accent, #299764);
  text-decoration: none;
  font-weight: 500;
}

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
  background-color: var(--vp-c-bg);
  transition: all 0.2s ease;
  color: var(--vp-c-text-2);
}

.os-card:hover {
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

.label-icon {
  margin-right: 4px;
}

.select-wrapper {
  position: relative;
  width: 100%;
}

.select-wrapper select {
  width: 100%;
  appearance: none;
  background-color: var(--vp-c-bg);
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
}

.select-wrapper .arrow,
.select-wrapper .spinner {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
}

.action-area {
  min-height: 84px;
  background-color: var(--vp-c-bg-alt);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
}

.status-msg {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 84px;
  padding: 1rem;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  gap: 0.5rem;
}

.status-msg.error {
  color: var(--vp-c-danger, #dc2626);
}

.status-msg.warning {
  color: var(--vp-c-warning-1, #f59e0b);
}

.download-list {
  display: flex;
  flex-direction: column;
}

.download-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.2rem;
  border-bottom: 1px solid var(--vp-c-divider);
  gap: 1rem;
  transition: background-color 0.2s;
}

.download-item:last-child {
  border-bottom: none;
}

.download-item:hover {
  background-color: var(--vp-c-bg-soft);
}

.file-info-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  flex: 1;
  min-width: 0;
}

.file-main {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.file-main i {
  color: var(--vp-c-text-2);
  font-size: 1.1rem;
}

.filename {
  font-weight: 500;
  color: var(--vp-c-text-1);
  word-break: break-all;
  font-size: 0.95rem;
}

.file-meta {
  font-size: 0.8rem;
  color: var(--vp-c-text-3);
  margin-left: 1.7rem;
}

/* 标签样式调整 */
.variant-tag {
  font-size: 0.7rem;
  padding: 1px 6px;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.4;
}

/* Glibc (Standard) - 主题色 */
.variant-tag.glibc {
  background-color: var(--vp-c-accent, #10b981);
}

/* Musl - 现在是灰色 */
.variant-tag.musl {
  background-color: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
}

.download-btn-sm {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background-color: var(--vp-c-accent, #299764);
  /* 主题色背景 */
  color: white !important;
  /* 白字 */
  padding: 0.5rem 1rem;
  border-radius: 20px;
  text-decoration: none !important;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
  border: none;
}

.download-btn-disabled {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background-color: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  text-decoration: none !important;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
  border: none;
}

.download-btn-sm:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

@media (max-width: 640px) {
  .download-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
  }

  .download-btn-sm {
    width: 100%;
    justify-content: center;
    padding: 0.6rem;
  }
}

.text-xs {
  font-size: 0.7em;
  margin-left: 2px;
}


.linux-extra-methods {
  margin-top: 1rem;
  background-color: var(--vp-c-bg-alt);
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  overflow: hidden;
}

.method-list {
  display: flex;
  flex-direction: column;
}

.method-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.2rem;
  border-bottom: 1px solid var(--vp-c-divider);
  text-decoration: none !important;
  color: var(--vp-c-text-1);
  transition: background-color 0.2s;
}

.method-item:last-child {
  border-bottom: none;
}

.method-item:hover {
  background-color: var(--vp-c-bg-soft);
}

.method-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-weight: 500;
  font-size: 0.95rem;
}

.method-icon {
  font-size: 1.2rem;
}

/* 图标品牌色（可根据你的主题自由调整） */
.method-icon.docker {
  color: #2496ed;
}

.method-icon.debian {
  color: #d70a53;
}

.arrow-icon {
  color: var(--vp-c-text-3);
  font-size: 0.9rem;
  transition: transform 0.2s ease;
}

.method-item:hover .arrow-icon {
  transform: translateX(4px);
  color: var(--vp-c-text-2);
}
</style>