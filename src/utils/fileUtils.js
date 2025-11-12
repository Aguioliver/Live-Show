// src/utils/fileUtils.js
export function getFileNameFromUrl(url) {
  if (!url) return "";
  try {
    return decodeURIComponent(url.split("/").pop());
  } catch {
    return url;
  }
}