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
