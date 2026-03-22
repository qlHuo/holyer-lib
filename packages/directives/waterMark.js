// Vue2 自定义指令：v-watermark="{ text, angle, font, color, gapX, gapY, width, height }"
// 支持控制台删除后自动恢复水印，支持设置水印内容和角度
const DEFAULTS = {
  text: '水印',
  angle: -20,
  font: '16px Microsoft Yahei',
  color: 'rgba(0,0,0,0.12)',
  gapX: 80,
  gapY: 80,
  width: 120,
  height: 64,
  zIndex: 9999
};

function createCanvasDataUrl(text, cfg) {
  const canvas = document.createElement('canvas');
  canvas.width = cfg.width + cfg.gapX;
  canvas.height = cfg.height + cfg.gapY;
  const ctx = canvas.getContext('2d');

  // 透明底
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 旋转参考点移动到中心
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((Math.PI / 180) * cfg.angle);
  ctx.fillStyle = cfg.color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = cfg.font;
  ctx.fillText(text, 0, 0);

  return canvas.toDataURL('image/png');
}

function createWatermarkNode(container, text, cfg) {
  const wm = document.createElement('div');
  wm.setAttribute('data-v-watermark', 'true');
  // 样式
  const isBody = container === document.body || container === document.documentElement;
  const pos = isBody ? 'fixed' : 'absolute';
  wm.style.position = pos;
  wm.style.left = '0';
  wm.style.top = '0';
  wm.style.width = '100%';
  wm.style.height = '100%';
  wm.style.pointerEvents = 'none';
  wm.style.backgroundRepeat = 'repeat';
  wm.style.zIndex = String(cfg.zIndex);
  wm.style.opacity = '1';
  wm.style.userSelect = 'none';
  wm.style.backgroundImage = `url("${createCanvasDataUrl(text, cfg)}")`;

  // 如果不是 body，保证容器为相对定位或绝对/固定定位
  if (!isBody) {
    const curPos = getComputedStyle(container).position;
    if (curPos === '' || curPos === 'static') {
      container.style.position = 'relative';
    }
  } else {
    // body 使用固定定位，确保宽高覆盖
    wm.style.pointerEvents = 'none';
  }

  return wm;
}

function mergeOptions(value) {
  const cfg = Object.assign({}, DEFAULTS, value || {});
  // 保证角度为 Number
  cfg.angle = Number(cfg.angle) || DEFAULTS.angle;
  return cfg;
}

function setupWatermark(el, binding) {
  const cfg = mergeOptions(binding.value);
  const text = cfg.text;

  // 清理旧的
  if (el._watermark && el._watermark.destroy) {
    el._watermark.destroy();
  }

  const container = el;
  let wm = createWatermarkNode(container, text, cfg);
  container.appendChild(wm);

  // 恢复/重建函数
  function recreate() {
    try {
      if (el._watermark && el._watermark.recreating) return;
      el._watermark && (el._watermark.recreating = true);

      // remove old if exists
      if (wm && wm.parentNode === container) {
        container.removeChild(wm);
      }
      wm = createWatermarkNode(container, text, cfg);
      container.appendChild(wm);
    } finally {
      el._watermark && (el._watermark.recreating = false);
    }
  }

  // 监听容器子节点变化（防止用户在控制台删除）
  const mo = new MutationObserver(mutations => {
    // eslint-disable-next-line no-console
    console.log('水印监测到变更，尝试恢复水印', mutations);
    let exists = container.querySelector('[data-v-watermark="true"]');
    if (!exists) {
      recreate();
    } else {
      // 如果样式或 background 被清空，也重建
      const bg = exists.style.backgroundImage;
      if (!bg || bg === 'none') {
        recreate();
      }
    }
  });
  mo.observe(container, { childList: true, subtree: false, attributes: true, attributeFilter: ['style'] });

  // 监听窗口 resize（可能需要重建 canvas 尺寸）
  const onResize = () => {
    recreate();
  };
  window.addEventListener('resize', onResize);

  // 兼容：定时检查（防止 MutationObserver 被断开）
  const interval = setInterval(() => {
    if (!container || !container.parentNode) return;
    const exists = container.querySelector('[data-v-watermark="true"]');
    if (!exists) {
      recreate();
    }
  }, 1500);

  // 暴露销毁方法
  el._watermark = {
    wm,
    mo,
    interval,
    onResize,
    recreate,
    destroy() {
      try {
        if (this.mo) this.mo.disconnect();
        window.removeEventListener('resize', this.onResize);
        if (this.interval) clearInterval(this.interval);
        const node = container.querySelector('[data-v-watermark="true"]');
        if (node && node.parentNode === container) {
          container.removeChild(node);
        }
      } catch (e) {
        // ignore
      } finally {
        delete el._watermark;
      }
    }
  };
}

export default {
  // 绑定/插入时初始化
  inserted(el, binding) {
    setupWatermark(el, binding);
  },

  // 当绑定值变化时，重新生成
  update(el, binding) {
    // 简单比较，若引用不同或内容不同则重建
    const oldVal = binding.oldValue || {};
    const newVal = binding.value || {};
    const changed = JSON.stringify(oldVal) !== JSON.stringify(newVal);
    if (changed) {
      setupWatermark(el, binding);
    }
  },

  // 指令解绑时清理
  unbind(el) {
    if (el._watermark && el._watermark.destroy) {
      el._watermark.destroy();
    }
  }
};
