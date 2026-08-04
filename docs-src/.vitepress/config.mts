import { defineConfig } from 'vitepress'
import attrs from 'markdown-it-attrs'
import deflist from 'markdown-it-deflist'
import footnote from 'markdown-it-footnote'
import mark from 'markdown-it-mark'
import taskLists from 'markdown-it-task-lists'

export default defineConfig({
  title: 'SoC and Embedded Linux',
  description: 'Course material for SoC and Embedded Linux',
  base: '/Embarcados-Avancados/',
  outDir: '../docs',
  ignoreDeadLinks: [
    '/Tutorial-Acelerando-HLS-reports/report',
    '/Tutorial-Acelerando-HLS-reports/report.html'
  ],
  vite: {
    assetsInclude: ['**/*.PNG', '**/*.JPG', '**/*.JPEG', '**/*.GIF']
  },
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['script', { src: 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js', async: '' }]
  ],
  themeConfig: {
    logo: undefined,
    repo: 'Insper/Embarcados-Avancados',
    search: {
      provider: 'local'
    },
    editLink: {
      pattern: 'https://github.com/Insper/Embarcados-Avancados/edit/master/docs-src/:path',
      text: 'Edit this page on GitHub'
    },
    footer: {
      message: 'Released under the project license.',
      copyright: 'Copyright (c) 2019 / Prof. Rafael Corsi / rafael.corsi@insper.edu.br'
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'FPGA', link: '/Tutorial-FPGA-RTL' },
      { text: 'HPS', link: '/Tutorial-HPS' },
      { text: 'HPS + FPGA', link: '/Tutorial-HPS-FPGA-BlinkLED' },
      { text: 'HLS', link: '/Tutorial-Acelerando-HLS' },
      { text: 'Useful', link: '/info-FPGA-e-Softwares' }
    ],
    sidebar: [
      { text: 'Home', link: '/' },
      {
        text: 'FPGA',
        collapsed: false,
        items: [
          { text: '1. RTL', link: '/Tutorial-FPGA-RTL' },
          { text: 'Assessment', link: '/Entrega-1' },
          { text: '2. NIOS', link: '/Tutorial-FPGA-NIOS' },
          { text: 'Assessment', link: '/Entrega-2' },
          { text: '3. NIOS IP', link: '/Tutorial-FPGA-NIOS-IP' },
          { text: 'Assessment', link: '/Entrega-3' }
        ]
      },
      {
        text: 'HPS',
        collapsed: false,
        items: [
          { text: '4. About', link: '/Tutorial-HPS' },
          { text: '5. Embedded Linux', link: '/Tutorial-HPS-Running' },
          { text: '6. Setup', link: '/Tutorial-HPS-BuildSystem' },
          { text: '7. Blink LED', link: '/Tutorial-HPS-BlinkLED' },
          { text: 'Extra - Network', link: '/info-HPS-ethernet' },
          { text: 'Assessment', link: '/Entrega-4' },
          { text: '8. Linux kernel', link: '/Tutorial-HPS-Kernel' },
          { text: '9. Buildroot', link: '/Tutorial-HPS-Buildroot' },
          { text: '10. Extra - HPS-buildroot-scripts', link: '/info-HPS-buildroot-scripts' },
          { text: 'Assessment', link: '/Entrega-5' },
          { text: '11. Device Driver', link: '/Tutorial-HPS-DeviceDriver' },
          { text: '12. Kernel Module', link: '/Tutorial-HPS-kernel-module' },
          { text: '13. Char Device Driver', link: '/Tutorial-HPS-kernel-chardriver' }
        ]
      },
      {
        text: 'HPS + FPGA',
        collapsed: false,
        items: [
          { text: '14. Blink FPGA LED from HPS', link: '/Tutorial-HPS-FPGA-BlinkLED' },
          { text: '15. VGA', link: '/Tutorial-HPS-FPGA-VGA' },
          { text: 'Assessment', link: '/Entrega-6' },
          { text: '16. Kernel driver', link: '/Tutorial-HPS-FPGA-kernel-char-led-driver' }
        ]
      },
      {
        text: 'High Level Synthesis',
        collapsed: true,
        items: [
          { text: '17. Accelerating', link: '/Tutorial-Acelerando-HLS' },
          { text: 'Assessment', link: '/Entrega-Extra-1' }
        ]
      },
      {
        text: 'Useful',
        collapsed: true,
        items: [
          { text: 'Softwares', link: '/info-FPGA-e-Softwares' },
          { text: 'SD card', link: '/info-SDcard' },
          { text: 'Serial port', link: '/info-HPS-Serial' },
          { text: 'Network', link: '/info-HPS-ethernet' },
          { text: 'References', link: '/info-VHDL' }
        ]
      },
      {
        text: 'Students tutorials',
        collapsed: true,
        items: [
          { text: 'Projeto Overview', link: '/Projeto-Overview' },
          { text: 'Projeto Rubrica', link: '/Projeto-Rubrica' },
          { text: 'Template markdown', link: 'https://github.com/Insper/Embarcados-Avancados-Template' },
          { text: '2022 - TFTP', link: '/2022/tftp/' },
          { text: '2022 - RISC V', link: '/2022/riscv/' },
          { text: '2022 - RaSpider', link: '/2022/RaSpider/' },
          { text: '2021 - Chisel', link: '/2021/Chisel/' },
          { text: '2021 - RISC V', link: '/2021/RISCV/' },
          { text: '2020 - PS3 HACK', link: '/2020/PS3-Linux-Tutorial/' },
          { text: '2020 - Android para Raspbery Pi 3', link: '/2020/Android/' },
          { text: '2020 - IP para fita de LED', link: '/2020/LED-HW/' },
          { text: '2020 - Driver linux fita de LED', link: '/2020/LED-Linux/' },
          { text: '2020 - Soc & Python', link: '/2020/python/' },
          { text: '2020 - SDAccel', link: '/2020/metropolis/' },
          { text: '2020 - Audio na DE10', link: '/2020/Audio/' },
          { text: '2020 - Criptografia em Hardware', link: '/2020/cripto/' },
          { text: '2019 - TensorFlow', link: '/2019/Gabriel-TensorFlow' },
          { text: '2019 - OpenCL', link: '/2019/Leo-OpenCL' },
          { text: '2019 - Yocto', link: '/2019/Elisa-Yocto' },
          { text: '2019 - OpenCV', link: '/2019/Pedro-OpenCV' },
          { text: '2019 - FPGA na AWS', link: '/2019/Martim-F1' },
          { text: '2019 - DeviceDriver', link: '/2019/Toranja-DevDriver' }
        ]
      }
    ]
  },
  markdown: {
    config(md) {
      md.use(attrs)
      md.use(deflist)
      md.use(footnote)
      md.use(mark)
      md.use(taskLists)
    }
  }
})
