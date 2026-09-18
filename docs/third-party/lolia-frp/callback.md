---
title: Lolia FRP 授权返回
permalink: /third-party/lolia-frp/callback
sidebar: false
navbar: false
pageClass: custom-page
---

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const state = params.get('state');
      if (code && window.opener) {
          window.opener.postMessage({ type: 'LOLIA_OAUTH_CODE', code: code, state: state }, '*');
          setTimeout(() => {
              window.close();
          }, 300);
      }
  }
})
</script>

<div style="display: flex; justify-content: center; align-items: center; min-height: 50vh; flex-direction: column; text-align: center;">
  <h2>授权完成，正在返回控制台...</h2>
  <p style="color: #666; margin-top: 1rem;">如果此窗口没有自动关闭，请手动关闭它，稍后 MSLX 控制台会自动同步您的状态。</p>
</div>
