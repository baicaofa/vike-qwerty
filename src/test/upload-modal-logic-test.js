/**
 * 测试词库上传模态框的核心逻辑
 */

// 测试数据
const testWords = [
  { name: "hello" },
  { name: "world" },
  { name: "Hello" }, // 重复（大小写不同）
  { name: "test" },
  { name: "hello" }, // 重复
  { name: "example" },
  { name: "WORLD" }, // 重复（大小写不同）
  { name: "unique" },
];

// 去重逻辑测试
function testDeduplication() {
  console.log("=== 测试去重逻辑 ===");
  console.log("原始单词数量:", testWords.length);
  console.log(
    "原始单词列表:",
    testWords.map((w) => w.name)
  );

  // 模拟上传模态框中的去重逻辑
  const seen = new Set();
  const uniqueData = testWords.filter((word) => {
    const name = word.name.toLowerCase();
    if (seen.has(name)) {
      return false;
    }
    seen.add(name);
    return true;
  });

  const removedCount = testWords.length - uniqueData.length;

  console.log("去重后单词数量:", uniqueData.length);
  console.log(
    "去重后单词列表:",
    uniqueData.map((w) => w.name)
  );
  console.log("移除的重复单词数量:", removedCount);

  // 验证结果
  const expectedUnique = ["hello", "world", "test", "example", "unique"];
  const actualUnique = uniqueData.map((w) => w.name.toLowerCase());

  console.log("期望结果:", expectedUnique);
  console.log("实际结果:", actualUnique);

  const isCorrect =
    expectedUnique.every((word) => actualUnique.includes(word)) &&
    actualUnique.length === expectedUnique.length;

  console.log("去重逻辑测试:", isCorrect ? "✅ 通过" : "❌ 失败");
  return isCorrect;
}

// 分页逻辑测试
function testPagination() {
  console.log("\n=== 测试分页逻辑 ===");

  const wordsPerPage = 50;
  const totalWords = 123; // 模拟123个单词

  // 计算分页
  const totalPages = Math.ceil(totalWords / wordsPerPage);
  console.log("总单词数:", totalWords);
  console.log("每页显示:", wordsPerPage);
  console.log("总页数:", totalPages);

  // 测试各页的单词范围
  for (let page = 1; page <= totalPages; page++) {
    const startIndex = (page - 1) * wordsPerPage;
    const endIndex = startIndex + wordsPerPage;
    const actualEndIndex = Math.min(endIndex, totalWords);
    const wordsInPage = actualEndIndex - startIndex;

    console.log(
      `第${page}页: 索引 ${startIndex}-${
        actualEndIndex - 1
      }, 共 ${wordsInPage} 个单词`
    );
  }

  // 验证最后一页
  const lastPageStart = (totalPages - 1) * wordsPerPage;
  const lastPageWords = totalWords - lastPageStart;
  const expectedLastPageWords = totalWords % wordsPerPage || wordsPerPage;

  console.log("最后一页单词数:", lastPageWords);
  console.log("期望最后一页单词数:", expectedLastPageWords);

  const isPaginationCorrect = lastPageWords === expectedLastPageWords;
  console.log("分页逻辑测试:", isPaginationCorrect ? "✅ 通过" : "❌ 失败");
  return isPaginationCorrect;
}

// 单词编辑逻辑测试
function testWordEditing() {
  console.log("\n=== 测试单词编辑逻辑 ===");

  const originalWord = {
    name: "test",
    sourceType: "empty",
    isUserModified: false,
    isEmpty: true,
  };

  console.log("原始单词:", originalWord);

  // 模拟编辑操作
  const editedData = {
    userData: {
      usphone: "/test/",
      ukphone: "/test/",
      sentences: [],
      detailed_translations: [{ pos: "n", chinese: "测试", english: "" }],
    },
    sourceType: "user_custom",
    isUserModified: true,
    isEmpty: false,
  };

  const editedWord = { ...originalWord, ...editedData };
  console.log("编辑后单词:", editedWord);

  // 验证编辑结果
  const isEditCorrect =
    editedWord.sourceType === "user_custom" &&
    editedWord.isUserModified === true &&
    editedWord.isEmpty === false &&
    editedWord.userData?.detailed_translations.length === 1;

  console.log("单词编辑逻辑测试:", isEditCorrect ? "✅ 通过" : "❌ 失败");
  return isEditCorrect;
}

// 批量操作逻辑测试
function testBatchOperations() {
  console.log("\n=== 测试批量操作逻辑 ===");

  const words = [
    { name: "word1" },
    { name: "word2" },
    { name: "word3" },
    { name: "word4" },
    { name: "word5" },
  ];

  const selectedIndices = new Set([1, 3, 4]); // 选中第2、4、5个单词

  console.log(
    "原始单词:",
    words.map((w) => w.name)
  );
  console.log("选中的索引:", Array.from(selectedIndices));

  // 模拟删除选中的单词
  const remainingWords = words.filter(
    (_, index) => !selectedIndices.has(index)
  );

  console.log(
    "删除后剩余单词:",
    remainingWords.map((w) => w.name)
  );

  // 验证结果
  const expectedRemaining = ["word1", "word3"];
  const actualRemaining = remainingWords.map((w) => w.name);

  const isBatchCorrect =
    expectedRemaining.length === actualRemaining.length &&
    expectedRemaining.every((word) => actualRemaining.includes(word));

  console.log("批量操作逻辑测试:", isBatchCorrect ? "✅ 通过" : "❌ 失败");
  return isBatchCorrect;
}

// 运行所有测试
function runAllTests() {
  console.log("开始测试词库上传模态框的核心逻辑...\n");

  const results = [
    testDeduplication(),
    testPagination(),
    testWordEditing(),
    testBatchOperations(),
  ];

  const passedTests = results.filter((result) => result).length;
  const totalTests = results.length;

  console.log(`\n=== 测试结果汇总 ===`);
  console.log(`通过测试: ${passedTests}/${totalTests}`);
  console.log(
    `测试状态: ${passedTests === totalTests ? "✅ 全部通过" : "❌ 部分失败"}`
  );

  return passedTests === totalTests;
}

// 如果直接运行此文件，执行所有测试
runAllTests();
