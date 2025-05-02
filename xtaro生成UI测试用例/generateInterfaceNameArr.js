const fs = require('fs');
const path = require('path');

/**
 * 获取指定目录下的一级子目录名称（过滤 'types' 文件夹）
 * @param {string} dirPath - 目标目录绝对路径
 * @returns {string[]} 子目录名称数组（如 ["XButton", "xShowToast"]）
 */
function getSubDirs(dirPath) {
    // 检查目录是否存在
    if (!fs.existsSync(dirPath)) {
        throw new Error(`目录不存在: ${dirPath}`);
    }

    // 读取一级目录项（withFileTypes 需为 true 以获取 Dirent 对象）
    const dirents = fs.readdirSync(dirPath, { withFileTypes: true });

    // 过滤出目录，并排除 'types' 文件夹
    return dirents
        .filter(dirent =>
            dirent.isDirectory() &&         // 是目录
            dirent.name !== 'types' &&       // 非 'types' 文件夹
            !dirent.name.startsWith('.')     // 排除隐藏文件夹（如 .DS_Store）
        )
        .map(dirent => dirent.name);       // 提取目录名
}

/**
 * 主函数：生成 interfaceNameArr
 * @returns {string[]} 合并去重后的接口/组件名称数组
 */
function generateInterfaceNameArr(rootPath) {
    try {
        // 定义 api 和 component 目录路径（根据实际项目结构调整）
        const apiDir = path.resolve(rootPath || __dirname, './packages/xtaro-h5/api');
        const componentDir = path.resolve(rootPath || __dirname, './packages/xtaro-h5/component');

        // 获取 api 和 component 下的子目录名称
        const apiDirs = getSubDirs(apiDir);
        const componentDirs = getSubDirs(componentDir);

        // 合并并去重（Set 自动去重，保留顺序）
        const interfaceNameArr = [...new Set([...apiDirs, ...componentDirs])];

        return interfaceNameArr;
    } catch (error) {
        console.error('生成 interfaceNameArr 失败:', error.message);
        return [];
    }
}

// 执行并输出结果（测试用）
const result = generateInterfaceNameArr("/Users/ympang/work/ctrip/xtaro/");
console.log('interfaceNameArr:', result);