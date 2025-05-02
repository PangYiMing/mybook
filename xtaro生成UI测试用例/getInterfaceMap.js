const fs = require('fs');
const path = require('path');
const getInterfaceNameArr = require('./getInterfaceNameArr');

const undefinedDocsList = [
    'useXTaroOnDestroy',
    'xClassNames',
    'xCreateVideoContext',
    'xGetAppInfo',
    'xGetClassName',
    'xGetCurrentInstanceStream',
    'xGetCurrentPagesStream',
    'xGetGlobalData',
    'xGetModuleClassName',
    'xInitNavigatorComponent',
    'xInitXTaroApp',
    'xMergeEleStyles',
    'xMergeStyles',
    'xNavigateBackStream',
    'xNavigateToStream',
    'xOcr',
    'xRedirectToStream',
    'xRegisterModalComponent',
    'xRegisterPreviewComponent',
    'xRegisterToastComponent',
    'xRouterStream',
    'xScalePx2dp',
    'xScaleVu2dp',
    'XBlock',
    'XDynamicStream',
    'XFragment',
    'XImageExposure',
    'XInputExposure',
    'XLinkStream',
    'XModal',
    'XSwiperExt',
    'XSwiperItemExt',
    'XTextExposure',
    'XViewExposure'
];
/**
 * 递归查找所有 .md 文件
 * @param {string} dirPath - 要搜索的目录路径
 * @returns {string[]} - 所有 .md 文件的绝对路径数组
 */
function findAllMarkdownFiles(dirPath) {
    let markdownFiles = [];
    const files = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const file of files) {
        const fullPath = path.join(dirPath, file.name);
        if (file.isDirectory()) {
            markdownFiles = markdownFiles.concat(findAllMarkdownFiles(fullPath));
        } else if (file.isFile() && file.name.endsWith('.md')) {
            markdownFiles.push(fullPath);
        }
    }

    return markdownFiles;
}

/**
 * 在文件中查找接口标题
 * @param {string} filePath - 文件路径
 * @param {string} interfaceName - 要查找的接口名
 * @returns {boolean} - 是否找到匹配的标题
 */
function findInterfaceTitle(filePath, interfaceName) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return content.includes(`# ${interfaceName}`);
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        return false;
    }
}

/**
 * 获取接口映射
 * @param {string} rootPath - 项目根路径
 * @param {string} docsPath - 文档目录路径
 * @returns {Object} - interfaceMap 对象
 */
function getInterfaceMap(rootPath, docsPath = 'docs/docs') {
    const interfaceNameArr = getInterfaceNameArr(rootPath);
    const docsFullPath = path.join(rootPath, docsPath);
    const markdownFiles = findAllMarkdownFiles(docsFullPath);
    const interfaceMap = {};

    for (const interfaceName of interfaceNameArr) {
        if (undefinedDocsList.includes(interfaceName)) {
            console.log(`忽略 ${interfaceName} ，未对外开放`);
            continue;
        }
        const matchingFiles = markdownFiles.filter(filePath => 
            findInterfaceTitle(filePath, interfaceName)
        );

        let selectedFile = null;
        if (matchingFiles.length > 0) {
            // 优先选择路径中包含 api 或 component 的文件
            const prioritizedFiles = matchingFiles.filter(filePath => 
                filePath.includes('/api/') || filePath.includes('/component/')
            );
            selectedFile = prioritizedFiles.length > 0 ? prioritizedFiles[0] : matchingFiles[0];
        }

        // 确定类型（api 或 component）
        const type = interfaceName.startsWith('x') ? 'apis' : 'components';

        if (!selectedFile) {
            console.log(`未找到 ${interfaceName} 的文档`);
        }
        interfaceMap[interfaceName] = {
            name: interfaceName,
            docFilePath: selectedFile,
            type: type
        };
    }

    return interfaceMap;
}

module.exports = getInterfaceMap;

// 测试代码
if (require.main === module) {
    const rootPath = "/Users/ympang/work/ctrip/xtaro/";
    const interfaceMap = getInterfaceMap(rootPath);
    console.log('interfaceMap:', JSON.stringify(interfaceMap, null, 2));
} 
