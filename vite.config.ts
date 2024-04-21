import { resolve } from 'path'

export default {
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        cgLab41: resolve(__dirname, 'src/cg-lab4-1/index.html'),
        cgLab42: resolve(__dirname, 'src/cg-lab4-2/index.html'),
        cgLab431: resolve(__dirname, 'src/cg-lab4-3-1/index.html'),
        cgLab432: resolve(__dirname, 'src/cg-lab4-3-2/index.html'),
      }
    }
  }
}