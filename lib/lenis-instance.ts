import type Lenis from "lenis";

declare global {
  interface Window {
    __coachchainLenis?: Lenis;
  }
}

/**
 * Round 3: the page scrolls with Lenis, but Back to Top used to call
 * native window.scrollTo, the one scroll path Lenis does not drive.
 * A native smooth scroll under an active Lenis instance can leave
 * ScrollTrigger's pinned Journey canvas desynced from the real
 * scroll position, so its frozen last frame stayed fixed over the
 * hero. Share the one Lenis instance so programmatic scrolls go
 * through the same scroll owner as wheel scrolling.
 */
export function setSharedLenis(instance: Lenis) {
  window.__coachchainLenis = instance;
}

export function clearSharedLenis(instance: Lenis) {
  if (window.__coachchainLenis === instance) {
    delete window.__coachchainLenis;
  }
}

export function getSharedLenis(): Lenis | undefined {
  return window.__coachchainLenis;
}
