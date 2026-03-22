// Vue2 指令 v-copy，支持入参（string/number 或 object）和回调
// 用法示例：
// <button v-copy="'静态文本'">复制</button>
// <button v-copy="someString">复制</button>
// <button v-copy="{ text: someVar, success: (t)=>{}, error: (err)=>{} }">复制</button>

function copyText(text) {
  if (!text && text !== 0) return Promise.reject(new Error('no text to copy'));
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(String(text));
  }
  return new Promise((resolve, reject) => {
    const ta = document.createElement('textarea');
    ta.value = String(text);
    ta.setAttribute('readonly', '');
    ta.style.position = 'absolute';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);

    const selection = document.getSelection();
    const range = document.createRange();
    range.selectNodeContents(ta);
    selection.removeAllRanges();
    selection.addRange(range);
    ta.select();

    try {
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      selection.removeAllRanges();
      ok ? resolve() : reject(new Error('execCommand failed'));
    } catch (err) {
      document.body.removeChild(ta);
      selection.removeAllRanges();
      reject(err);
    }
  });
}

function createHandler(binding, el) {
  return async function handler() {
    let text = '';
    let onSuccess = null;
    let onError = null;

    const val = binding && binding.value;

    if (typeof val === 'string' || typeof val === 'number') {
      text = String(val);
    } else if (val && typeof val === 'object') {
      if (val.text !== undefined) text = String(val.text);
      if (typeof val.success === 'function') onSuccess = val.success;
      if (typeof val.error === 'function') onError = val.error;
    }

    // fallback: data-copy attribute or element innerText
    if (!text) {
      text = el.getAttribute('data-copy') || el.innerText || '';
    }

    try {
      await copyText(text);
      if (onSuccess) {
        onSuccess();
      } else {
        alert('复制成功');
      }
    } catch (err) {
      if (onError) {
        onError();
      } else {
        alert('复制失败');
      }
    }
  };
}

export default {
  bind(el, binding) {
    // create and attach
    const handler = createHandler(binding, el);
    el.__vCopyHandler = handler;
    el.addEventListener('click', handler);
  },
  update(el, binding) {
    // replace handler so it uses latest binding.value
    if (el.__vCopyHandler) {
      el.removeEventListener('click', el.__vCopyHandler);
    }
    const handler = createHandler(binding, el);
    el.__vCopyHandler = handler;
    el.addEventListener('click', handler);
  },
  unbind(el) {
    if (el.__vCopyHandler) {
      el.removeEventListener('click', el.__vCopyHandler);
      delete el.__vCopyHandler;
    }
  }
};
