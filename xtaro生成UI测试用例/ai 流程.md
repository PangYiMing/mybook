### 整理自己的思路

// 第一步，获取api和组件数组 interfaceNameArr 。从packages/xtaro-h5中遍历packages/xtaro-h5/api和packages/xtaro-h5/component文件夹，将文件夹名字放入一个数组


// 第二步，获取ap和组件数组对应的doc文档。

// 2.1 遍历 interfaceNameArr 的值，生成 interfaceNam 变量，根据 interfaceNam 的值，在 docs/docs文件夹中 搜索 md 文档，如果有匹配的，返回 docFilePath 。

// 2.2 将 docFilePath 和 interfaceNam 放入对象 interfaceObj 中

// 2.3 根据 interfaceNam 的首字母大小写， 设置 interfaceObj 的 type字段， 小写的是 apis ，大写的 components。

// 2.4 新建 interfaceMap ，将 interfaceNam 和 interfaceObj 对应起来


// 第三步，遍历 interfaceMap 让 AI 根据文档内容，去生成对应的 h5 和 crn， api 支持的属性 和 方法。

// 第四步，让 AI 参考已有的测试用例，和文档去生成对应的


// 第五步。让 ai 把内容写入到文件以


// /Users/ympang/work/ctrip/xtaro-playground/src/pages/xtaro-playground/pages


### ai问答去完善

你不需要先写代码， 请帮我完善以下思路，并针对我的思路提出你疑问，让方案完善起来 // 第一步，获取api和组件数组 interfaceNameArr 。从packages/xtaro-h5中遍历packages/xtaro-h5/api和packages/xtaro-h5/component文件夹，将文件夹名字放入一个数组 // 第二步，获取ap和组件数组对应的doc文档。 // 2.1 遍历 interfaceNameArr 的值，生成 interfaceNam 变量，根据 interfaceNam 的值，在 docs/docs文件夹中 搜索 md 文档，如果有匹配的，返回 docFilePath 。 // 2.2 将 docFilePath 和 interfaceNam 放入对象 interfaceObj 中 // 2.3 根据 interfaceNam 的首字母大小写， 设置 interfaceObj 的 type字段， 小写的是 apis ，大写的 components。 // 2.4 新建 interfaceMap ，将 interfaceNam 和 interfaceObj 对应起来 // 第三步，遍历 interfaceMap 让 AI 根据文档内容，去生成对应的 h5 和 crn， api 支持的属性 和 方法。 // 第四步，让 AI 参考已有的测试用例，和文档去生成对应的 // 第五步。让 ai 把内容写入到文件以 // /Users/ympang/work/ctrip/xtaro-playground/src/pages/xtaro-playground/pages


### 交互式完善

我现在答疑一下，请你根据上下文，完善思路 第一步答疑： 遍历深度为1，不需要递归，需要过滤 types文件夹，第一步获取的数组示例为 const interfaceNameArr=["XButton","xShowToast"] 第二步答疑： 文档匹配规则，是遍历文档，读取文档内容,比如XButton，需要在文档内容中找 “# XButton”，找到就算匹配成功。 类型判断不存在，小写的组件。


### 开始实现

请按照第一步，实现nodejs代码，有什么问题的话，可以先向我确认再实现

