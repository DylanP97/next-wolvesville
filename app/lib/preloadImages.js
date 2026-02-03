export function preloadImages(urls) {
  if (typeof window === "undefined") return Promise.resolve();

  return Promise.all(
    urls.filter(Boolean).map(
      (url) =>
        new Promise((resolve) => {
          const img = new window.Image();
          img.onload = resolve;
          img.onerror = resolve;
          img.src = url;
        })
    )
  );
}
