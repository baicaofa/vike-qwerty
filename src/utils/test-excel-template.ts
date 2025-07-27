import { generateExcelTemplate } from "./excelParser";
import { utils, writeFileXLSX } from "xlsx";

/**
 * 测试新的Excel模板生成功能
 */
export function testExcelTemplate() {
  try {
    console.log("开始测试Excel模板生成...");

    // 生成模板
    const wb = generateExcelTemplate();

    // 检查工作簿结构
    console.log("工作表列表:", wb.SheetNames);

    // 检查单词数据工作表
    const wordSheet = wb.Sheets["单词数据"];
    if (wordSheet) {
      console.log("✅ 单词数据工作表创建成功");

      // 转换为JSON查看数据结构
      const wordData = utils.sheet_to_json(wordSheet);
      console.log("单词数据行数:", wordData.length);
      console.log("第一行数据:", wordData[0]);
    } else {
      console.log("❌ 单词数据工作表创建失败");
    }

    // 检查说明工作表
    const instructionSheet = wb.Sheets["使用说明"];
    if (instructionSheet) {
      console.log("✅ 使用说明工作表创建成功");

      const instructionData = utils.sheet_to_json(instructionSheet);
      console.log("说明数据行数:", instructionData.length);
    } else {
      console.log("❌ 使用说明工作表创建失败");
    }

    // 可选：保存到文件进行手动检查
    if (typeof window !== "undefined") {
      try {
        writeFileXLSX(wb, "测试模板.xlsx");
        console.log("✅ 模板文件保存成功");
      } catch (error) {
        console.log("⚠️ 模板文件保存失败（可能是环境限制）:", error);
      }
    }

    console.log("Excel模板测试完成");
    return true;
  } catch (error) {
    console.error("Excel模板测试失败:", error);
    return false;
  }
}

/**
 * 测试模板数据结构
 */
export function validateTemplateStructure() {
  try {
    const wb = generateExcelTemplate();
    const wordSheet = wb.Sheets["单词数据"];
    const wordData = utils.sheet_to_json(wordSheet);

    // 验证必要的字段
    const requiredFields = ["单词"];
    const optionalFields = [
      "美式音标",
      "英式音标",
      "词性1",
      "中文释义1",
      "英文释义1",
      "词性2",
      "中文释义2",
      "英文释义2",
      "例句1英文",
      "例句1中文",
      "例句2英文",
      "例句2中文",
    ];

    const firstDataRow = wordData.find(
      (row) =>
        row["单词"] &&
        typeof row["单词"] === "string" &&
        row["单词"] !== "单词" &&
        !row["单词"].includes("必填")
    );

    if (!firstDataRow) {
      console.log("❌ 未找到有效的数据行");
      return false;
    }

    // 检查必填字段
    for (const field of requiredFields) {
      if (!(field in firstDataRow)) {
        console.log(`❌ 缺少必填字段: ${field}`);
        return false;
      }
    }

    // 检查选填字段
    for (const field of optionalFields) {
      if (!(field in firstDataRow)) {
        console.log(`⚠️ 缺少选填字段: ${field}`);
      }
    }

    console.log("✅ 模板结构验证通过");
    console.log("示例数据:", firstDataRow);

    return true;
  } catch (error) {
    console.error("模板结构验证失败:", error);
    return false;
  }
}

// 如果在Node.js环境中直接运行
if (typeof require !== "undefined" && require.main === module) {
  testExcelTemplate();
  validateTemplateStructure();
}
