// Shared by the server layout (inline script) and the client toggle.
export const THEME_STORAGE_KEY = "theme";

/**
 * Inline script for <head>: sets data-theme before first paint so there is
 * no flash. A saved choice wins; otherwise the system setting decides.
 */
export const themeScript = `(function(){var t;try{t=localStorage.getItem("${THEME_STORAGE_KEY}")}catch(e){}if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t})()`;
