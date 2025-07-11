import { ArticleContext } from "../store";
import { ArticleActionType } from "../store/type";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ARTICLE_CATEGORIES,
  DIFFICULTY_DESCRIPTIONS,
  OfficialArticle,
  getAllOfficialArticles,
  getOfficialArticlesByCategory,
} from "@/data/officialArticles";
import { useSaveArticle } from "@/utils/db/article";
import { useContext, useState } from "react";

interface RecommendedArticlesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function RecommendedArticlesDialog({
  open,
  onOpenChange,
}: RecommendedArticlesDialogProps) {
  const { dispatch } = useContext(ArticleContext);
  const [selectedCategory, setSelectedCategory] = useState<string>("全部");
  const [articles, setArticles] = useState<OfficialArticle[]>(
    getAllOfficialArticles()
  );

  const saveArticle = useSaveArticle();

  // 处理分类切换
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === "全部") {
      setArticles(getAllOfficialArticles());
    } else {
      setArticles(getOfficialArticlesByCategory(category));
    }
  };

  // 选择文章并自动保存
  const handleSelectArticle = async (article: OfficialArticle) => {
    try {
      // 自动保存文章到本地数据库
      await saveArticle({
        title: article.title,
        content: article.content,
        createdAt: Date.now(),
        isOfficial: true, // 标记为官方文章
      });

      // 先重置练习状态
      dispatch({ type: ArticleActionType.RESET_TYPING });

      // 设置文章内容
      dispatch({
        type: ArticleActionType.SET_ARTICLE_TEXT,
        payload: article.content,
      });

      // 设置文章标题
      dispatch({
        type: ArticleActionType.SET_ARTICLE_TITLE,
        payload: article.title,
      });

      // 关闭弹窗
      onOpenChange(false);

      // 处理文本
      dispatch({ type: ArticleActionType.PROCESS_TEXT });

      // 重置当前单词索引，确保从第一个单词开始
      dispatch({ type: ArticleActionType.SET_CURRENT_WORD_INDEX, payload: 0 });

      // 进入练习步骤
      dispatch({ type: ArticleActionType.SET_STEP, payload: 3 });
    } catch (error) {
      console.error("保存文章失败:", error);
      alert("保存文章失败，请重试");
    }
  };

  // 获取难度对应的样式
  const getDifficultyBadgeClass = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // 获取难度中文名称
  const getDifficultyName = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "简单";
      case "medium":
        return "中等";
      case "hard":
        return "困难";
      default:
        return difficulty;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>推荐文章</DialogTitle>
          <DialogDescription>
            选择一篇推荐文章开始练习，或者浏览不同类别的文章
          </DialogDescription>
        </DialogHeader>

        {/* 分类选择 */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => handleCategoryChange("全部")}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategory === "全部"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            全部
          </button>
          {ARTICLE_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 文章列表 */}
        <div className="grid gap-4">
          {articles.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              该分类下暂无推荐文章
            </p>
          ) : (
            articles.map((article) => (
              <div
                key={article.uuid}
                className="border rounded-lg p-4 hover:border-blue-400 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-lg">{article.title}</h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyBadgeClass(
                      article.difficulty
                    )}`}
                  >
                    {getDifficultyName(article.difficulty)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  {article.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>分类: {article.category}</span>
                  <span>单词数: {article.wordCount || "未知"}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {article.content.substring(0, 150)}
                    {article.content.length > 150 ? "..." : ""}
                  </p>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => handleSelectArticle(article)}
                    className="px-3 py-1 text-sm rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                  >
                    开始练习
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
