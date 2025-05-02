

### **第一步：获取api和组件数组 interfaceNameArr**
**目标**：遍历 `packages/xtaro-h5/api` 和 `packages/xtaro-h5/component` 的一级子目录，过滤 `types` 文件夹，生成无重复的 `interfaceNameArr`。  

**具体实现**：  
1. **遍历目录**：使用 Node.js 的 `fs.readdirSync` 读取 `api` 和 `component` 文件夹的一级子目录（`withFileTypes: true`）。  
2. **过滤条件**：  
   - 仅保留 `dirent.isDirectory()` 为 `true` 的项（排除文件）。  
   - 过滤名称为 `types` 的文件夹（用户要求）。  
3. **合并与去重**：将 `api` 和 `component` 下的有效子目录名合并为数组，使用 `Set` 去重（避免同名冲突）。  
4. **示例结果**：`["XButton", "xShowToast"]`（假设 `api` 下有 `xShowToast`，`component` 下有 `XButton`）。  


### **第二步：获取文档路径并生成 interfaceMap**
**目标**：根据 `interfaceName` 匹配文档（内容包含 `# 接口名`），关联路径和类型（来源文件夹），生成 `interfaceMap`。  

#### **2.1 文档匹配逻辑**  
- **文档范围**：遍历 `docs/docs` 目录下的所有 `.md` 文件（包括子目录）。  
- **匹配规则**：读取每个 md 文件内容，检查是否包含 `# ${interfaceName}`（如 `# XButton`）的标题（精确匹配，区分大小写）。  
- **优先级处理**：若一个 `interfaceName` 匹配多个文档（如 `XButton.md` 和 `components/XButton.md` 都包含 `# XButton`），优先选择路径中包含 `api` 或 `component` 关键词的文件（与来源类型对应），否则取第一个匹配项。  

#### **2.2 生成 interfaceObj**  
每个 `interfaceName` 对应 `interfaceObj`，包含：  
- `name`: 接口名（如 `"XButton"`）。  
- `docFilePath`: 匹配到的文档绝对路径（如 `"docs/docs/components/XButton.md"`）。  
- `type`: 来源类型（`api` 文件夹下的为 `apis`，`component` 文件夹下的为 `components`）。  

#### **2.3 生成 interfaceMap**  
`interfaceMap` 是键值对对象，键为 `interfaceName`，值为 `interfaceObj`（示例）：  
```javascript
const interfaceMap = {
  "XButton": {
    name: "XButton",
    docFilePath: "/path/to/docs/components/XButton.md",
    type: "components"
  },
  "xShowToast": {
    name: "xShowToast",
    docFilePath: "/path/to/docs/apis/xShowToast.md",
    type: "apis"
  }
};
```  

**注意**：若 `interfaceName` 无匹配文档（`docFilePath` 不存在），`interfaceObj` 标记为 `docFilePath: null`，后续流程跳过或提示人工补全文档。  


### **第三步：AI生成属性和方法描述**  
**目标**：AI 根据文档内容，生成 H5 和 CRN 支持的属性、方法描述。  

**具体实现**：  
1. **输入准备**：对每个 `interfaceObj`，读取 `docFilePath` 的 md 内容，拼接提示词：  
   ```
   请根据以下文档内容，提取 [type]（apis/components）[name] 的属性和方法，并区分 H5 和 CRN 的支持情况（示例：属性：color（H5支持，CRN不支持））。
   文档内容：[文档内容片段]
   ```  
2. **输出要求**：结构化 JSON，包含 `properties`（属性列表）和 `methods`（方法列表），每项需标注 `h5Support`（布尔值）、`crnSupport`（布尔值）和 `description`（描述）。  
3. **示例输出**：  
   ```json
   {
     "name": "XButton",
     "type": "components",
     "properties": [
       { "name": "color", "h5Support": true, "crnSupport": false, "description": "按钮颜色，H5有效" }
     ],
     "methods": [
       { "name": "show", "h5Support": true, "crnSupport": true, "description": "显示按钮" }
     ]
   }
   ```  
4.调用ai的示例
```
curl https://ark.cn-beijing.volces.com/api/v3/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ARK_API_KEY" \
  -d '{
    "model": "doubao-1-5-thinking-pro-250415",
    "messages": [
      {"role": "system","content": "你是人工智能助手."},
      {"role": "user","content": "常见的十字花科植物有哪些？"}
    ]
  }'
```


### **第四步：生成测试用例**  
**目标**：AI 参考已有测试用例和文档，生成符合 Jest 规范的测试代码。  

**具体实现**：  
1. **测试用例来源**：收集 `packages/xtaro-h5/__tests__` 下与 `type` 同名的测试文件（如 `components` 类型的测试用例在 `__tests__/components` 目录）。  
2. **输入准备**：为 AI 提供目标 `interfaceObj` 的文档内容 + 同类型测试用例示例（如 `XButton` 组件的测试用例模板）。  
3. **提示词设计**：  
   ```
   请根据以下文档内容和同类型测试用例示例，生成 [name] 的测试用例，覆盖基础功能、边界条件和异常输入，使用 Jest 语法。
   文档内容：[文档内容]
   示例测试用例：[示例代码片段]
   ```  
4. **输出要求**：生成 `.test.js` 文件内容，包含 `describe` 块和 `test` 用例（示例）：  
   ```javascript
   import { XButton } from 'xtaro-h5';
   describe('XButton', () => {
     test('渲染时显示默认文本', () => {
       const button = render(<XButton />);
       expect(button.getByText('默认按钮')).toBeInTheDocument();
     });
   });
   ```  


### **第五步：写入目标文件**  
**目标**：将生成的属性/方法描述和测试用例写入指定路径。  

**具体实现**：  
1. **文件路径规则**：  
   - 属性/方法描述：路径为 `/Users/ympang/work/ctrip/xtaro-playground/src/pages/xtaro-playground/pages/[type]/[name].json`（如 `components/XButton.json`）。  
   - 测试用例：路径为 `/Users/ympang/work/ctrip/xtaro-playground/src/pages/xtaro-playground/pages/__tests__/[type]/[name].test.js`（如 `__tests__/components/XButton.test.js`）。  
2. **写入逻辑**：  
   - 使用 `fs-extra` 模块（支持递归创建目录），确保目标目录存在后写入文件。  
   - 覆盖策略：若文件已存在，默认覆盖（可配置为追加或跳过）。  
3. **备份机制**：重要文件写入前备份（如 `XButton.json.bak`），避免数据丢失。  


### **补充机制**  
- **日志记录**：使用 `winston` 记录每个步骤的状态（如 `[SUCCESS] XButton 文档匹配成功`、`[ERROR] xShowToast 无匹配文档`），输出到 `generate.log`。  
- **流程触发**：通过 `npm run generate` 脚本执行全流程，或集成到 CI 中（如 PR 合并时自动生成）。  


**总结**：通过明确遍历规则、文档匹配逻辑、类型来源判断、AI输入输出规范及文件写入路径，方案的可操作性和健壮性显著提升，同时日志和异常处理机制保障了问题可追溯。