
# 在本地部署与使用 Qwen3 的完整指南

## 前置条件
1. 安装 [Ollama](https://ollama.com/)（支持 macOS/Linux/windows）
2. 安装 [Cherry Studio](https://www.cherry-ai.com/download)（要求 v1.2.10 以上版本）

> ⚠️ 我使用的都是当前最新版本，如有问题，可以评论区反馈

## 部署流程

### 第一步：通过 Ollama 部署 Qwen3:8b 模型
1. 打开终端，执行以下命令：
```bash
ollama run qwen3:8b
```
> ⚠️ 如果出现"model not found"提示，请执行 `ollama pull qwen3:8b` 先拉取模型

2. 观察部署过程：
- 一般只需进入和ai进行交流的页面就ok了

> ⚠️  如果有问题，可查看本地目录 `~/.ollama/models/manifests/registry.ollama.ai/library/` 是否生成 `qwen3:8b` 目录结构

![Ollama部署Qwen3模型](./img/ollama_qwen3:8b_download.png)

## 配置 Cherry Studio
### 第二步：添加模型配置
1. 启动 Cherry Studio，点击 "齿轮" 按钮，进入设置页面
2. 进入模型管理界面
3. 配置参数（关键步骤）：
   - 模型类型：选择 "Ollama 本地模型"
   - 开启模型启用开关
   - 点击 “添加”，添加模型
   - 模型名称：`qwen3:8b`（必须与部署名称完全一致）
![Cherry Studio模型配置](./img/cherry_studio_add_ollama.jpg)

![Cherry Studio模型配置-模型名称](./img/cherry_add_modal.jpg)

> ⚠️ 若未找到模型，检查：
> - Ollama 服务是否在运行（`ollama serve`）
> - 模型路径是否正确（可执行 `find ~/.ollama -name qwen3` 校验）
> - 网络权限是否开放（特别在 Linux 系统需要 `sudo` 权限）

### 第三步：验证模型状态
1. 在 Cherry Studio 主界面：
   - 切换模型
   - 输入框输入响应内容
   - 预期输出：Qwen3 的响应内容

![Cherry Studio模型切换](./img/cherry_studio_switch_modal.jpg)

![Cherry Studio模型使用](./img/cherry_studio_use.jpg)


## 注意事项
1. 模型占用约 8GB 显存，需确保 GPU 资源足够
2. 模型占用约 7GB 硬盘



ps:我使用的事mac pro mini