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

    // Удаляем пустые папки src и scripts
    try {
      const srcPath = path_module.default.join(options.dir, 'src');
      await fs.rm(srcPath, { recursive: true, force: true });
    } catch (_) {}

    try {
      const scriptsPath = path_module.default.join(options.dir, 'scripts');
      await fs.rm(scriptsPath, { recursive: true, force: true });
    } catch (_) {}

    // Копируем common.js
    try {
      const commonSrc = path_module.default.join(process.cwd(), 'public/scripts/common.js');
      const commonDest = path_module.default.join(options.dir, 'assets/js/common.js');
      await fs.mkdir(path_module.default.dirname(commonDest), { recursive: true });
      await fs.copyFile(commonSrc, commonDest);
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

  // Добавляем main.js как отдельный entry point
  const dirname = path.dirname(new URL(import.meta.url).pathname);
  input['main'] = path.resolve(dirname, 'src/scripts/main.js');

  return input;
};

const copyAssetsPlugin = () => ({
  name: 'vite-copy-assets',
  apply: 'build',
  async writeBundle(options) {
    const fs = (await import('fs')).promises;
    const path_module = await import('path');

    // Копируем fonts
    try {
      const fontsSrc = path_module.default.join(process.cwd(), 'src/assets/fonts');
      const fontsDest = path_module.default.join(options.dir, 'assets/fonts');
      await copyDir(fontsSrc, fontsDest, fs, path_module.default);
    } catch (_) {}

    // Копируем images
    try {
      const imagesSrc = path_module.default.join(process.cwd(), 'src/assets/images');
      const imagesDest = path_module.default.join(options.dir, 'assets/images');
      await copyDir(imagesSrc, imagesDest, fs, path_module.default);
    } catch (_) {}
  },
});

const copyDir = async (src, dest, fs, path_module) => {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path_module.join(src, entry.name);
    const destPath = path_module.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath, fs, path_module);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
};

export default defineConfig({
  build: {
    rollupOptions: {
      input: await getInput(),
      output: {
        entryFileNames: 'assets/js/[name].min.js',
        chunkFileNames: 'assets/js/[name]-[hash].min.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'assets/css/[name].min[extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
  plugins: [
    multiPagePlugin(),
    copyAssetsPlugin(),
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
