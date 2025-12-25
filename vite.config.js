import { defineConfig } from 'vite';
import posthtml from 'posthtml';
import viteImagemin from 'vite-plugin-imagemin';
import path from 'path';

const posthtmlPlugin = () => ({
  name: 'vite-posthtml',
  enforce: 'pre',
  async transformIndexHtml(html, ctx) {
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

const multiPagePlugin = () => ({
  name: 'vite-multi-page-output',
  apply: 'build',
  async writeBundle(options, bundle) {
    const fs = (await import('fs')).promises;
    const path_module = await import('path');

    for (const fileName of Object.keys(bundle)) {
      if (fileName.includes('src/pages/')) {
        const oldPath = path_module.default.join(options.dir, fileName);
        const newFileName = fileName.replace('src/pages/', '');
        const newPath = path_module.default.join(options.dir, newFileName);

        try {
          await fs.mkdir(path_module.default.dirname(newPath), { recursive: true });
          await fs.rename(oldPath, newPath);
        } catch (_) {}
      }
    }

    // Удаляем пустую папку src
    try {
      const srcPath = path_module.default.join(options.dir, 'src');
      await fs.rm(srcPath, { recursive: true, force: true });
    } catch (_) {}
  },
});

const getInput = async () => {
  const fg = (await import('fast-glob')).default;
  const files = await fg('src/pages/**/*.html', {
    absolute: false,
  });

  const input = {};
  files.forEach((file) => {
    const dirname = path.dirname(new URL(import.meta.url).pathname);
    const key = path.relative('src/pages', file).replace(/\.html$/, '');
    input[key] = path.resolve(dirname, file);
  });

  return input;
};

export default defineConfig({
  build: {
    rollupOptions: {
      input: await getInput(),
      output: {
        entryFileNames: (chunkInfo) => {
          const name = chunkInfo.name;
          return name.includes('/') ? name.replace(/\//g, '-') + '.html' : name + '.html';
        },
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
  plugins: [
    multiPagePlugin(),
    posthtmlPlugin(),
    viteImagemin({
      gifsicle: {
        optimizationLevel: 3,
        interlaced: false,
      },
      mozjpeg: {
        quality: 80,
      },
      pngquant: {
        quality: [0.65, 0.9],
        speed: 4,
      },
      svgo: {
        plugins: [
          {
            name: 'removeViewBox',
            active: false,
          },
          {
            name: 'removeEmptyAttrs',
            active: true,
          },
        ],
      },
    }),
  ],
});
