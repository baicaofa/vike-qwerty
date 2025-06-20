/**
 * 设备指纹识别工具
 * 用于为匿名用户生成唯一的设备标识符
 */

// 简单的djb2哈希算法实现
function djb2Hash(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
  }
  return Math.abs(hash).toString(36);
}

// 收集浏览器特征
function collectBrowserFeatures(): Record<string, string | number> {
  const features: Record<string, string | number> = {};

  try {
    // 基本浏览器信息
    features.userAgent = navigator.userAgent || "unknown";
    features.language = navigator.language || "unknown";
    features.platform = navigator.platform || "unknown";

    // 屏幕信息
    features.screenResolution = `${screen.width}x${screen.height}`;
    features.colorDepth = screen.colorDepth || 24;
    features.pixelDepth = screen.pixelDepth || 24;

    // 时区信息
    try {
      features.timezone =
        Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown";
    } catch {
      features.timezone = "unknown";
    }

    // 时区偏移
    features.timezoneOffset = new Date().getTimezoneOffset();

    // 浏览器特性检测
    features.cookieEnabled = navigator.cookieEnabled ? 1 : 0;
    features.doNotTrack = navigator.doNotTrack || "unknown";

    // Canvas指纹（简化版）
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.textBaseline = "top";
        ctx.font = "14px Arial";
        ctx.fillText("Device fingerprint test 🔒", 2, 2);
        features.canvasFingerprint = djb2Hash(canvas.toDataURL());
      }
    } catch {
      features.canvasFingerprint = "unavailable";
    }

    // WebGL指纹（简化版）
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (gl) {
        const renderer = gl.getParameter(gl.RENDERER);
        const vendor = gl.getParameter(gl.VENDOR);
        features.webglRenderer = renderer || "unknown";
        features.webglVendor = vendor || "unknown";
      }
    } catch {
      features.webglRenderer = "unavailable";
      features.webglVendor = "unavailable";
    }

    // 硬件信息
    features.hardwareConcurrency = navigator.hardwareConcurrency || 1;
    features.maxTouchPoints = navigator.maxTouchPoints || 0;

    // 内存信息（如果可用）
    const memory = (navigator as any).deviceMemory;
    features.deviceMemory = memory || "unknown";
  } catch (error) {
    console.warn("Error collecting browser features:", error);
  }

  return features;
}

// 生成设备指纹
function generateDeviceFingerprint(): string {
  try {
    const features = collectBrowserFeatures();
    const featuresString = JSON.stringify(
      features,
      Object.keys(features).sort()
    );
    const fingerprint = djb2Hash(featuresString);

    // 缓存到localStorage
    localStorage.setItem("deviceFingerprint", fingerprint);
    localStorage.setItem("deviceFingerprintTimestamp", Date.now().toString());

    return fingerprint;
  } catch (error) {
    console.warn("Error generating device fingerprint:", error);
    // 如果生成失败，返回一个基于时间戳的备用ID
    const fallbackId = djb2Hash(`fallback_${Date.now()}_${Math.random()}`);
    try {
      localStorage.setItem("deviceFingerprint", fallbackId);
    } catch {
      // localStorage也不可用的情况
    }
    return fallbackId;
  }
}

// 获取设备指纹
export function getDeviceFingerprint(): string {
  try {
    // 先从缓存获取
    const cached = localStorage.getItem("deviceFingerprint");
    const timestamp = localStorage.getItem("deviceFingerprintTimestamp");

    // 检查缓存是否有效（7天内）
    if (cached && timestamp) {
      const cacheAge = Date.now() - parseInt(timestamp);
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7天

      if (cacheAge < maxAge) {
        return cached;
      }
    }

    // 缓存无效或不存在，生成新的指纹
    return generateDeviceFingerprint();
  } catch (error) {
    console.warn("Error getting device fingerprint:", error);
    // 如果localStorage不可用，每次都生成新的指纹
    return generateDeviceFingerprint();
  }
}

// 清除设备指纹缓存（用于测试或重置）
export function clearDeviceFingerprint(): void {
  try {
    localStorage.removeItem("deviceFingerprint");
    localStorage.removeItem("deviceFingerprintTimestamp");
  } catch (error) {
    console.warn("Error clearing device fingerprint:", error);
  }
}

// 获取设备指纹详细信息（用于调试）
export function getDeviceFingerprintDetails(): {
  fingerprint: string;
  features: Record<string, string | number>;
  cached: boolean;
} {
  const cached = localStorage.getItem("deviceFingerprint");
  const features = collectBrowserFeatures();
  const fingerprint = getDeviceFingerprint();

  return {
    fingerprint,
    features,
    cached: !!cached,
  };
}
