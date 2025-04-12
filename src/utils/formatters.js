/**
 * 时间格式化工具函数
 */

/**
 * 格式化歌曲时长（秒数转为分:秒格式）
 * @param {number} seconds - 时长（秒）
 * @returns {string} 格式化后的时长字符串 (mm:ss)
 */
export const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * 格式化日期字符串显示格式
 * @param {string} dateString - ISO格式的日期字符串
 * @param {string} format - 可选，指定格式 (默认: 'YYYY-MM-DD')
 * @returns {string} 格式化后的日期字符串
 */

export function formatDate(dateString, format = 'YYYY-MM-DD') {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      
      // 检查日期是否有效
      if (isNaN(date.getTime())) {
        return '';
      }
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      
      // 根据指定格式返回格式化后的日期
      return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
    } catch (error) {
      console.error('日期格式化错误:', error);
      return '';
    }
  }