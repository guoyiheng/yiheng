<script setup lang="ts">
import { ref, computed } from 'vue'

useSeoMeta({
  title: '打字工坊 · 虚拟打印机工作室',
  description: '在虚拟打印机上自由敲击排版，实时体验机械打字、针打声音与撕纸归档。'
})

const { playPrintPin, playFeedPaper, playBell, playTearSound, playKeyClick } = usePrinterAudio()
const { paperTheme } = usePrinter()

const customTitle = ref('我的打字卡片')
const customAuthor = ref('一恒')
const customBody = ref(`好的工具不会抢走注意力。
它只是让想法更顺利地抵达纸面。

2026.08.06 / 记录于工作室`)

const selectedTemplate = ref<string>('custom')
const isTypingPrint = ref(false)
const typedLines = ref<string[]>([])
const currentTypingText = ref('')
const isStudioPaperTorn = ref(false)
const printedCount = ref(1)

const presets = [
  {
    id: 'receipt',
    name: '咖啡收据',
    icon: 'i-lucide-receipt',
    title: 'NIGHT OWL COFFEE',
    author: 'REC-0824',
    body: `--------------------------------
单品手冲咖啡 (埃塞俄比亚)   ￥35
静音机械轴打字测试        ￥0
--------------------------------
合计                     ￥35
支付方式                 代码与纸
--------------------------------
谢谢惠顾，欢迎再次光临`
  },
  {
    id: 'poem',
    name: '极简短诗',
    icon: 'i-lucide-feather',
    title: '纸上的呼吸',
    author: '一恒',
    body: `把字体调小一点，
留白留大一点。

当世界都在加速，
这里只保留打字机的克制。`
  },
  {
    id: 'card',
    name: '个人名片',
    icon: 'i-lucide-id-card',
    title: 'YIHENG / 一恒',
    author: 'DEVELOPER & DESIGNER',
    body: `领域：Web Dev / UI Architecture / Modern Typography
站点：yiheng.run
状态：正在向打印机压入新纸`
  }
]

function applyPreset(presetId: string) {
  playKeyClick()
  selectedTemplate.value = presetId
  const found = presets.find(p => p.id === presetId)
  if (found) {
    customTitle.value = found.title
    customAuthor.value = found.author
    customBody.value = found.body
  }
}

async function startPrintStudio() {
  if (isTypingPrint.value) return
  isStudioPaperTorn.value = false
  isTypingPrint.value = true
  typedLines.value = []
  currentTypingText.value = ''

  playFeedPaper()

  const rawLines = customBody.value.split('\n')
  
  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i]
    let lineBuffer = ''
    
    for (let j = 0; j < line.length; j++) {
      lineBuffer += line[j]
      currentTypingText.value = lineBuffer
      playPrintPin()
      await new Promise(r => setTimeout(r, 45))
    }
    
    typedLines.value.push(lineBuffer)
    currentTypingText.value = ''
    await new Promise(r => setTimeout(r, 120))
  }

  isTypingPrint.value = false
  printedCount.value += 1
  playBell()
}

function tearStudioPaper() {
  if (isTypingPrint.value) return
  isStudioPaperTorn.value = true
  playTearSound()
}

function resetStudioPaper() {
  isStudioPaperTorn.value = false
  playFeedPaper()
}
</script>

<template>
  <PrinterPaper page-code="STUDIO—01" end-label="交互式打字工坊 · 虚拟打印机">
    <header class="paper-header print-line" style="--print-order: 1">
      <div class="masthead-row">
        <span class="edition">打字工坊 · STUDIO</span>
        <span class="press-mark">印</span>
      </div>
      <p class="eyebrow">INTERACTIVE TYPEWRITER & VIRTUAL PRINTER</p>
      <h1 id="page-title">虚拟打印工坊</h1>
      <p class="lead">在键盘上键入想法，体验机械击针、滚动进纸与实时出纸。</p>
    </header>

    <div class="rule print-line" style="--print-order: 2" aria-hidden="true">
      <span>TYPEWRITER MODE</span>
      <span class="rule-line" />
      <span>PRINT #0{{ printedCount }}</span>
    </div>

    <!-- 打字工坊编辑器面板 -->
    <section class="studio-editor-card print-line" style="--print-order: 3">
      <div class="preset-pills">
        <span class="text-xs font-mono text-stone-500 mr-2">快捷模版：</span>
        <button
          v-for="p in presets"
          :key="p.id"
          :class="['preset-btn', { 'is-active': selectedTemplate === p.id }]"
          @click="applyPreset(p.id)"
        >
          <UIcon :name="p.icon" class="mr-1 inline-block" />
          {{ p.name }}
        </button>
      </div>

      <div class="studio-form-grid">
        <div>
          <label class="studio-label">标题 / 抬头</label>
          <input v-model="customTitle" class="studio-input" placeholder="输入标题..." />
        </div>
        <div>
          <label class="studio-label">落款 / 日期</label>
          <input v-model="customAuthor" class="studio-input" placeholder="输入作者或时间..." />
        </div>
      </div>

      <div class="mt-4">
        <label class="studio-label">正文内容 (支持多行)</label>
        <textarea
          v-model="customBody"
          rows="5"
          class="studio-textarea"
          placeholder="敲击键盘，写下想打印的内容..."
        />
      </div>

      <div class="studio-actions mt-4">
        <UButton
          icon="i-lucide-printer"
          label="开始打字印刷"
          color="primary"
          size="lg"
          :loading="isTypingPrint"
          @click="startPrintStudio"
        />
        <UButton
          v-if="typedLines.length > 0 && !isStudioPaperTorn"
          icon="i-lucide-scissors"
          label="撕下打印卡"
          color="neutral"
          variant="outline"
          size="lg"
          @click="tearStudioPaper"
        />
      </div>
    </section>

    <!-- 实时打印输出的成品小卡片纸张 -->
    <section v-if="typedLines.length > 0 || isTypingPrint" class="print-preview-section print-line" style="--print-order: 4">
      <div v-if="isStudioPaperTorn" class="torn-paper-notice">
        <p class="font-mono text-sm">卡片已撕下并完成打印记录。</p>
        <UButton
          icon="i-lucide-rotate-ccw"
          label="重新压入新卡纸"
          color="primary"
          variant="solid"
          @click="resetStudioPaper"
        />
      </div>

      <div
        v-else
        :class="['studio-paper-ticket', `theme-${paperTheme}`, { 'is-printing': isTypingPrint }]"
      >
        <div class="ticket-header">
          <h2>{{ customTitle }}</h2>
          <span>{{ customAuthor }}</span>
        </div>
        <div class="ticket-divider" />
        <div class="ticket-body">
          <p v-for="(line, idx) in typedLines" :key="idx" class="font-mono leading-relaxed">
            {{ line }}
          </p>
          <p v-if="isTypingPrint" class="font-mono leading-relaxed text-amber-600 animate-pulse">
            {{ currentTypingText }}<span class="inline-block w-2 h-4 bg-amber-600 ml-1 animate-ping" />
          </p>
        </div>
        <div class="ticket-footer">
          <span>YIHENG PRESS · NO. {{ printedCount }}</span>
          <span>© 2026 yiheng</span>
        </div>
      </div>
    </section>
  </PrinterPaper>
</template>

<style scoped>
.studio-editor-card {
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.03);
  border: 1px dashed rgba(0, 0, 0, 0.15);
  border-radius: 0.5rem;
  margin-bottom: 2rem;
}

.preset-pills {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.preset-btn {
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.preset-btn.is-active,
.preset-btn:hover {
  background: var(--ink);
  color: var(--paper);
  border-color: var(--ink);
}

.studio-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 640px) {
  .studio-form-grid {
    grid-template-columns: 1fr;
  }
}

.studio-label {
  display: block;
  font-size: 0.75rem;
  font-family: "IBM Plex Mono", monospace;
  color: var(--ink-soft);
  margin-bottom: 0.35rem;
}

.studio-input,
.studio-textarea {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
  background: rgba(255, 255, 255, 0.7);
  font-family: inherit;
  font-size: 0.9rem;
  color: var(--ink);
  outline: none;
  transition: border-color 0.2s;
}

.studio-input:focus,
.studio-textarea:focus {
  border-color: var(--accent);
  background: #fff;
}

.studio-actions {
  display: flex;
  gap: 0.75rem;
}

/* 成品卡片样式 */
.studio-paper-ticket {
  position: relative;
  padding: 2rem;
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 0.25rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  margin-top: 1rem;
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1rem;
}

.ticket-header h2 {
  font-size: 1.4rem;
  margin: 0;
}

.ticket-header span {
  font-family: "IBM Plex Mono", monospace;
  font-size: 0.8rem;
  opacity: 0.7;
}

.ticket-divider {
  border-top: 1px dashed rgba(0, 0, 0, 0.2);
  margin-bottom: 1.25rem;
}

.ticket-body {
  min-height: 6rem;
  white-space: pre-wrap;
  font-size: 0.95rem;
}

.ticket-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  font-family: "IBM Plex Mono", monospace;
  font-size: 0.7rem;
  opacity: 0.6;
}
</style>
