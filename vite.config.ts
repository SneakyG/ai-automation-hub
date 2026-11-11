import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Đường dẫn tương đối: chạy được ở https://<user>.github.io/<tên-repo>/ với bất kỳ tên repo nào
  // (app dùng điều hướng bằng #hash nên không cần cấu hình 404 cho GitHub Pages).
  base: './',
});
