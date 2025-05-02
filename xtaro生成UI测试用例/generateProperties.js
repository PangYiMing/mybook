const fs = require('fs');
const path = require('path');
const getInterfaceMap = require('./getInterfaceMap');
const { callAI } = require('./aiService');

/**
 * 生成 AI 提示词
 * @param {string} type - 类型（apis/components）
 * @param {string} name - 接口名
 * @param {string} docContent - 文档内容
 * @returns {string} - 提示词
 */
function generatePrompt(type, name, docContent) {
    return `请根据以下文档内容，提取 ${type} ${name} 的属性和方法，并区分 H5 和 CRN 的支持情况（示例：属性：color（H5支持，CRN不支持））。
文档内容：${docContent}`;
}
/**
 * 生成属性和方法描述
 * @param {Object} interfaceObj - 接口对象
 * @returns {Object} - 包含属性和方法的对象
 */
async function generateProperties(interfaceObj) {
    const { name, type, docFilePath } = interfaceObj;
    
    if (!docFilePath) {
        console.log(`跳过 ${name}，未找到文档`);
        return null;
    }

    try {
        const docContent = fs.readFileSync(docFilePath, 'utf8');
        const prompt = generatePrompt(type, name, docContent);
        
        // 调用 AI 服务
        // res 示例：
        // {
        //     "choices": [
        //         {
        //             "finish_reason": "stop",
        //             "index": 0,
        //             "logprobs": null,
        //             "message": {
        //                 "content": "\n属性：  \n- once（类型：Boolean，默认值：false",
        //                 "role": "assistant"
        //             }
        //         }
        //     ],
        //         "created": 1746185393,
        //             "id": "0217461853519346773b021bc722319529820bd350d494190d974",
        //                 "model": "doubao-1-5-thinking-pro-250415",
        //                     "service_tier": "default",
        //                         "object": "chat.completion",
        //                             "usage": {
        //         "completion_tokens": 1288,
        //             "prompt_tokens": 2113,
        //                 "total_tokens": 3401,
        //                     "prompt_tokens_details": {
        //             "cached_tokens": 0
        //         },
        //         "completion_tokens_details": {
        //             "reasoning_tokens": 1141
        //         }
        //     }
        // }
        const originRes = await callAI(prompt);
        const content = originRes.choices[0].message.content;
        
        // 验证和修复结果
        const validatedResult = validateAndFixResult(content, docContent);
        
        // 保存结果
        const outputPath = path.join(
            path.dirname(docFilePath),
            'generate',
            `${name}.md`
        );
        
        // 确保目录存在
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        
        // 写入文件
        fs.writeFileSync(outputPath, JSON.stringify(validatedResult, null, 2));
        
        return validatedResult;
    } catch (error) {
        console.error(`处理 ${name} 时出错:`, error);
        return null;
    }
}

/**
 * 验证和修复 AI 返回的结果
 * @param {Object} result - AI 返回的结果
 * @param {string} docContent - 原始文档内容
 * @returns {Object} - 验证后的结果
 */
function validateAndFixResult(result, docContent) {
    // 这里可以添加验证和修复逻辑
    // 例如：检查属性名是否在文档中出现
    // 检查格式是否符合要求
    // 修复可能的错误
    return result;
}
let count = 0;
/**
 * 主函数
 * @param {string} rootPath - 项目根路径
 */
async function main(rootPath) {
    const interfaceMap = getInterfaceMap(rootPath);
    
    for (const [name, interfaceObj] of Object.entries(interfaceMap)) {
        // 限制 1个
        if (count >= 1) {
            break;
        }
        count++;
        console.log(`正在处理 ${name}...`);
        const result = await generateProperties(interfaceObj);
        if (result) {
            console.log(`成功生成 ${name} 的属性和方法描述`);
        }
    }
}

module.exports = {
    generateProperties,
    main
};

// 测试代码
if (require.main === module) {
    const rootPath = "/Users/ympang/work/ctrip/xtaro/";
    main(rootPath).catch(console.error);
} 