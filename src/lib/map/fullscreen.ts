/** Cross-browser helpers for Element.requestFullscreen (incl. legacy WebKit). */

export function getFullscreenElement(): Element | null {
  return (
    document.fullscreenElement ??
    (document as Document & { webkitFullscreenElement?: Element | null }).webkitFullscreenElement ??
    null
  );
}

export function requestElFullscreen(el: HTMLElement): Promise<void> {
  if (el.requestFullscreen) return el.requestFullscreen();
  const legacy = (el as HTMLElement & { webkitRequestFullscreen?: () => void }).webkitRequestFullscreen;
  if (legacy) {
    legacy();
    return Promise.resolve();
  }
  return Promise.reject(new Error("Fullscreen not supported"));
}

export function exitElFullscreen(): Promise<void> {
  if (document.exitFullscreen) return document.exitFullscreen();
  const legacy = (document as Document & { webkitExitFullscreen?: () => void }).webkitExitFullscreen;
  if (legacy) {
    legacy();
    return Promise.resolve();
  }
  return Promise.reject(new Error("Fullscreen not supported"));
}
