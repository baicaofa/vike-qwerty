// Word文档解析工具类
// 注意：需要在package.json中添加 mammoth 依赖

interface ParseResult {
  success: boolean;
  content: string;
  title?: string;
  error?: string;
}

// 从文件名生成标题
const generateTitleFromFilename = (filename: string): string => {
  // 移除文件扩展名
  const nameWithoutExt = filename.replace(/\.(docx|doc)$/i, "");

  // 将下划线和连字符替换为空格
  const cleanName = nameWithoutExt.replace(/[_-]/g, " ");

  // 首字母大写
  return cleanName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

// 清理HTML内容，提取纯文本
const cleanHtmlContent = (html: string): string => {
  // 创建临时DOM元素来解析HTML
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  // 获取纯文本内容
  let text = tempDiv.textContent || tempDiv.innerText || "";

  // 清理多余的空白字符
  text = text
    .replace(/\s+/g, " ") // 多个空白字符替换为单个空格
    .replace(/\n\s*\n/g, "\n") // 多个换行替换为单个换行
    .trim();

  return text;
};

// 解析Word文档
export const parseWordDocument = async (file: File): Promise<ParseResult> => {
  try {
    // 动态导入mammoth，避免在服务端渲染时出错
    const mammoth = await import("mammoth");

    // 检查文件类型
    if (!file.name.toLowerCase().endsWith(".docx")) {
      return {
        success: false,
        content: "",
        error: "不支持的文件格式，请上传.docx文件",
      };
    }

    // 检查文件大小（限制为10MB）
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return {
        success: false,
        content: "",
        error: "文件大小超过限制，请上传小于10MB的文件",
      };
    }

    // 读取文件内容
    const arrayBuffer = await file.arrayBuffer();

    // 使用mammoth解析文档
    const result = await mammoth.extractRawText({ arrayBuffer });

    if (result.messages.length > 0) {
      console.warn("Word文档解析警告:", result.messages);
    }

    // 提取文本内容
    const content = cleanHtmlContent(result.value);

    // 生成标题
    const title = generateTitleFromFilename(file.name);

    // 检查内容是否为空
    if (!content || content.trim().length === 0) {
      return {
        success: false,
        content: "",
        error: "文档内容为空，请检查文件是否正确",
      };
    }

    return {
      success: true,
      content: content,
      title: title,
    };
  } catch (error) {
    console.error("解析Word文档失败:", error);
    return {
      success: false,
      content: "",
      error: "解析文档失败，请检查文件格式是否正确",
    };
  }
};

// 验证文件类型
export const validateWordFile = (file: File): boolean => {
  const allowedTypes = [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    "application/msword", // .doc (旧格式，可能不支持)
  ];

  const allowedExtensions = [".docx", ".doc"];
  const fileExtension = file.name
    .toLowerCase()
    .substring(file.name.lastIndexOf("."));

  return (
    allowedTypes.includes(file.type) ||
    allowedExtensions.includes(fileExtension)
  );
};

// 获取文件大小描述
export const getFileSizeDescription = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
