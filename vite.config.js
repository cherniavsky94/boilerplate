import { defineConfig } from 'vite';
import posthtml from 'posthtml';

const posthtmlPlugin = () => ({
  name: 'vite-posthtml',
  enforce: 'pre',
  async transformIndexHtml(html) {
    let cfg = { plugins: [], options: {} };
    try {
      const mod = await import('./posthtml.config.js');
      cfg = mod.default || cfg;
    } catch (_) {
      // конфиг отсутствует — используем значения по умолчанию
    }
    const result = await posthtml(cfg.plugins).process(html, cfg.options);
    return result.html;
  },
});

export default defineConfig({
  plugins: [posthtmlPlugin()],
});
