/**
 * 高性能数组去重函数
 * @param {Array} arr - 需要去重的数组
 * @param {String|Function} [key] - 对象数组时用于比较的key，或自定义比较函数
 * @returns {Array} 去重后的数组
 */
export function uniqueArray(arr, key) {
  if (!Array.isArray(arr)) return [];

  // 基本类型数组去重
  if (!key || typeof key === 'function') {
    if (typeof key === 'function') {
      const seen = new Set();
      const result = [];
      arr.forEach(item => {
        const value = key(item);
        if (!seen.has(value)) {
          seen.add(value);
          result.push(item);
        }
      });
      return result;
    } else {
      return [...new Set(arr)];
    }
  }

  // 对象数组按key去重
  if (typeof key === 'string') {
    const seen = new Map();
    const result = [];
    arr.forEach(item => {
      if (item && typeof item === 'object') {
        const value = item[key];
        if (!seen.has(value)) {
          seen.set(value, true);
          result.push(item);
        }
      } else {
        // eslint-disable-next-line no-console
        console.warn('[uniqueArray]: 非对象数组无法去重');
        result.push(item);
      }
    });
    return result;
  }

  return [...arr];
}

/**
 * 数组分页函数
 * @param {Array} arr - 需要分页的数组
 * @param {number} page - 当前页码（必须为正整数）
 * @param {number} pageSize - 每页大小（必须为正整数）
 * @returns {Array} 当前页的数据数组，如果参数无效或超出范围则返回空数组
 */
export function paginateArray(arr, page, pageSize) {
  // 参数校验：数组、正整数页码和页大小
  if (!Array.isArray(arr) || !Number.isInteger(page) || page <= 0 || !Number.isInteger(pageSize) || pageSize <= 0) {
    return [];
  }

  const startIndex = (page - 1) * pageSize;
  // 如果起始索引超出数组长度，直接返回空数组
  if (startIndex >= arr.length) {
    return [];
  }

  // 计算结束索引，避免超出数组长度
  const endIndex = Math.min(startIndex + pageSize, arr.length);
  return arr.slice(startIndex, endIndex);
}

/**
 * 性能优化的数组转树结构函数
 * @param {Array} arr - 扁平化的数组
 * @param {Object} options - 配置选项
 * @returns {Array} 树结构数组
 */
export function arrayToTree(arr, options = {}) {
  const { idField = 'id', parentField = 'parentId', childrenField = 'children', rootId = null } = options;

  if (!Array.isArray(arr)) return [];

  // 使用数组而不是Map，对于小数据集可能更快
  const nodes = [];
  const idMap = new Map();

  // 建立节点映射
  arr.forEach(item => {
    if (item && typeof item === 'object') {
      const id = item[idField];
      if (id !== undefined && id !== null) {
        const node = { ...item, [childrenField]: [] };
        idMap.set(id, node);
        nodes.push(node);
      }
    }
  });

  // 构建父子关系
  const roots = [];
  nodes.forEach(node => {
    const parentId = node[parentField];
    if (parentId === rootId || parentId === null || parentId === undefined) {
      roots.push(node);
    } else {
      const parent = idMap.get(parentId);
      if (parent) {
        parent[childrenField].push(node);
      }
    }
  });

  return roots;
}

/**
 * 树结构数组转扁平化数组
 * @param {Array} tree - 树结构数组
 * @param {string} childrenField - 子节点字段名，默认为'children'
 * @param {boolean} includeRoot - 是否包含根节点，默认为true
 * @returns {Array} 扁平化数组
 */
export function treeToArray(tree, childrenField = 'children', includeRoot = true) {
  if (!Array.isArray(tree)) return [];

  const result = [];

  const traverse = (nodes, level = 0) => {
    nodes.forEach(node => {
      // 如果不包含根节点且是第一层，则跳过
      if (!includeRoot && level === 0) {
        // 递归处理子节点
        if (node[childrenField] && Array.isArray(node[childrenField])) {
          traverse(node[childrenField], level + 1);
        }
        return;
      }

      // 添加当前节点到结果中
      result.push({ ...node, level });

      // 递归处理子节点
      if (node[childrenField] && Array.isArray(node[childrenField])) {
        traverse(node[childrenField], level + 1);
      }
    });
  };

  traverse(tree);
  return result;
}
