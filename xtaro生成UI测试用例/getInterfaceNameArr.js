const fs = require('fs');
const path = require('path');

function getInterfaceNameArr(rootPath) {
    const apiPath = path.join(rootPath||__dirname, 'packages', 'xtaro-h5', 'api');
    const componentPath = path.join(rootPath||__dirname, 'packages', 'xtaro-h5', 'component');
    
    // 获取api目录下的子目录
    const apiDirs = fs.readdirSync(apiPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && dirent.name !== 'types')
        .map(dirent => dirent.name);
    
    // 获取component目录下的子目录
    const componentDirs = fs.readdirSync(componentPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && dirent.name !== 'types')
        .map(dirent => dirent.name);
    
    // 合并并去重
    const interfaceNameArr = [...new Set([...apiDirs, ...componentDirs])];
    
    return interfaceNameArr;
}

module.exports = getInterfaceNameArr;

// 执行并输出结果（测试用）
const result = getInterfaceNameArr("/Users/ympang/work/ctrip/xtaro/");
console.log('interfaceNameArr:', result);
// ### ** 第一步：获取api和组件数组 interfaceNameArr **
// ** 目标 **：遍历 `packages/xtaro-h5/api` 和 `packages/xtaro-h5/component` 的一级子目录，过滤 `types` 文件夹，生成无重复的 `interfaceNameArr`。  

// ** 具体实现 **：
// 1. ** 遍历目录 **：使用 Node.js 的 `fs.readdirSync` 读取 `api` 和 `component` 文件夹的一级子目录（`withFileTypes: true`）。
// 2. ** 过滤条件 **：
// - 仅保留`dirent.isDirectory()` 为 `true` 的项（排除文件）。
// - 过滤名称为`types` 的文件夹（用户要求）。
// 3. ** 合并与去重 **：将 `api` 和 `component` 下的有效子目录名合并为数组，使用 `Set` 去重（避免同名冲突）。
// 4. ** 示例结果 **：`["XButton", "xShowToast"]`（假设 `api` 下有 `xShowToast`，`component` 下有 `XButton`）。  
