const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

/**
 * AI 服务配置
 */
const AI_CONFIG = {
    baseUrl: 'https://ark.cn-beijing.volces.com/api/v3/chat/completions',
    model: 'doubao-1-5-thinking-pro-250415',
    systemMessage: '你是人工智能助手，擅长分析文档和提取信息。'
};
const limit = 1;// 限制调用次数，如果是0 不限制
let count = 0;

// 确保日志目录存在
const logDir = path.join(__dirname, 'log');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

/**
 * 记录单次请求的日志
 * @param {string} prompt - 输入提示词
 * @param {Object} response - AI 返回结果
 */
function logRequest(prompt, response) {
    const timestamp = new Date().toISOString();
    const random = Math.random().toString(36).substring(2, 8);
    const logFileName = `${timestamp}_${random}.json`;
    const logPath = path.join(logDir, logFileName);

    const logData = {
        timestamp,
        prompt,
        response
    };

    fs.writeFileSync(logPath, JSON.stringify(logData, null, 2));
}

/**
 * 更新 token 使用统计
 * @param {Object} usage - token 使用情况
 */
function updateTokenUsage(usage) {
    const logAITokenUsePath = path.join(logDir, 'logAITokenUse.txt');
    const timestamp = new Date().toISOString();
    
    // 准备要写入的记录
    const record = {
        timestamp,
        prompt_tokens: usage.prompt_tokens,
        completion_tokens: usage.completion_tokens,
        total_tokens: usage.total_tokens,
        model: AI_CONFIG.model
    };

    // 追加写入一行记录
    fs.appendFileSync(logAITokenUsePath, JSON.stringify(record) + '\n');
}

/**
 * 记录总使用量
 * @param {Object} usage - token 使用情况
 */
function logTotalUsage(usage) {
    const logAITotalTokenPath = path.join(logDir, 'logAITotalToken.json');
    let totalUsage = {
        timestamp: new Date().toISOString(),
        total_usage: {
            prompt_tokens: 0,
            completion_tokens: 0,
            total_tokens: 0,
            requests: 0
        },
        current_usage: usage
    };

    // 如果文件存在，读取并累加
    if (fs.existsSync(logAITotalTokenPath)) {
        const existingData = JSON.parse(fs.readFileSync(logAITotalTokenPath, 'utf8'));
        totalUsage.total_usage = {
            prompt_tokens: existingData.total_usage.prompt_tokens + usage.prompt_tokens,
            completion_tokens: existingData.total_usage.completion_tokens + usage.completion_tokens,
            total_tokens: existingData.total_usage.total_tokens + usage.total_tokens,
            requests: existingData.total_usage.requests + 1
        };
    } else {
        // 首次使用，直接设置当前值
        totalUsage.total_usage = {
            prompt_tokens: usage.prompt_tokens,
            completion_tokens: usage.completion_tokens,
            total_tokens: usage.total_tokens,
            requests: 1
        };
    }

    // 写入更新后的总使用量
    fs.writeFileSync(logAITotalTokenPath, JSON.stringify(totalUsage, null, 2));
}

/**
 * 调用 AI 服务
 * @param {string} prompt - 提示词
 * @param {Object} options - 可选参数
 * @returns {Promise<Object>} - AI 返回的结果
 */
async function callAI(prompt, options = {}) {
    if (limit) {
        count++;
        if (count > limit) {
            throw new Error('达到调用次数限制');
        }
    }

    const apiKey = process.env.ARK_API_KEY;
    if (!apiKey) {
        throw new Error('ARK_API_KEY 环境变量未设置');
    }

    try {
        const response = await fetch(AI_CONFIG.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: AI_CONFIG.model,
                messages: [
                    { role: 'system', content: AI_CONFIG.systemMessage },
                    { role: 'user', content: prompt }
                ],
                ...options
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`AI API 调用失败: ${response.status} ${errorText}`);
        }

        const result = await response.json();
        
        // 记录日志
        logRequest(prompt, result);
        updateTokenUsage(result.usage);
        logTotalUsage(result.usage);

        return result;
    } catch (error) {
        console.error('AI 服务调用失败:', error);
        throw error;
    }
}

/**
 * 测试函数
 */
async function testAI() {
    try {
        const prompt = '常见的十字花科植物有哪些？';
        console.log('发送提示词:', prompt);
        
        const result = await callAI(prompt);
        console.log('AI 返回结果:', JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('测试失败:', error);
    }
}

module.exports = {
    callAI,
    testAI
};

// 如果直接运行此文件，执行测试
if (require.main === module) {
    testAI();
} 