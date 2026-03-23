# RuyiSDK Examples 前端

独立的「示例教程」站点，告诉开发者如何在 RISC-V 开发板上用 RuyiSDK 跑通示例程序。

与支持矩阵（[matrix.ruyisdk.org](https://matrix.ruyisdk.org/)）并列，数据上可互链，工程上不嵌套。

## 技术栈

Astro 6 + React + TypeScript + Tailwind CSS v4 + shadcn/ui — 与 support-matrix-frontend 同套技术栈。

## 快速开始

```bash
# 克隆（含 submodule）
git clone --recurse-submodules https://github.com/your-org/ruyisdk-examples-frontend.git
cd ruyisdk-examples-frontend
pnpm install

# 开发（localhost:3000）
pnpm dev

# 构建
pnpm build
```

## 目录结构

```text
docs/                     # 项目文档
  design.md               # 产品设计文档
  plan.md                 # Agent 开发计划
  learn.md                # 前端学习计划
src/
  components/             # React 组件（BoardCard、BoardSidebar 等）
  layouts/Layout.astro    # 页面外壳
  lib/data.ts             # 数据层：扫描 test-doc，解析板子和示例
  pages/                  # Astro 文件路由
    index.astro           # 首页：板子卡片网格 + 搜索
    boards/[board].astro  # 板子详情：示例列表
    boards/[board]/[example].astro  # 示例详情：Markdown 渲染
  styles/global.css       # 全局样式 + Tailwind 主题
test-doc/                 # 内容 submodule（板子 → 示例 Markdown）
support-matrix-frontend/  # submodule，只读参考
scripts/                  # 开发辅助脚本
```

## 内容模型

内容仓库 `test-doc/` 以板子为顶层目录，每块板子下有多个示例子目录：

```
test-doc/Duo_S/HelloWorld/example_HelloWorld_DuoS.md
test-doc/LicheePi4A/Coremark/example_Coremark_LPi4A.md
```

路由：`/` → `/boards/{board}/` → `/boards/{board}/{example}/`

详细设计见 [`docs/design.md`](docs/design.md)，开发计划见 [`docs/plan.md`](docs/plan.md)。
