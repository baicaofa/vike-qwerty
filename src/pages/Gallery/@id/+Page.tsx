// /gallery/@id/Page.tsx
import { DictChapterButton } from "../../Typing/components/DictChapterButton";
import Header from "@/components/Header";
import Layout from "@/components/Layout";
import type { WordPronunciationIconRef } from "@/components/WordPronunciationIcon";
import { dictionaries } from "@/resources/dictionary";
import { currentDictInfoAtom } from "@/store";
import type { Dictionary, Word } from "@/typings";
import { wordListFetcher } from "@/utils/wordListFetcher";
import { useEffect, useState } from "react";
import { navigate } from "vike/client/router";
import type { PageContext } from "vike/types";
import IconBack from "~icons/ic/outline-arrow-back";

interface PageProps {
  dictionary: Dictionary;
  words: Word[];
  error?: string;
}

interface Props {
  pageContext: PageContext & {
    pageProps: PageProps;
  };
}

export default function Page({ pageContext }: Props) {
  const routeParams = pageContext?.routeParams || {};
  const { dictionary: initialDictionary, words: initialWords } =
    pageContext?.pageProps || {};
  const [dictionary, setDictionary] = useState<Dictionary | null>(
    initialDictionary || null
  );
  const [words, setWords] = useState<Word[]>(initialWords || []);
  const [currentPage, setCurrentPage] = useState(1);
  const wordsPerPage = 100;
  const [isLoading, setIsLoading] = useState<boolean>(!initialWords);

  useEffect(() => {
    if (!routeParams?.id) {
      setIsLoading(false);
      return;
    }

    console.log("Looking for dictionary with ID:", routeParams.id);
    console.log("Available dictionaries:", dictionaries);
    const dict = dictionaries.find((dict) => dict.id === routeParams.id);
    console.log("Found dictionary:", dict);

    if (dict) {
      setDictionary(dict);
      setIsLoading(true);
      wordListFetcher(dict.url)
        .then((wordList) => {
          setWords(wordList);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Failed to load dictionary words:", error);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [routeParams?.id]);

  const onBack = () => {
    navigate("/gallery");
  };

  if (!dictionary) {
    return (
      <Layout>
        <div className="flex h-full items-center justify-center">
          <p className="text-2xl text-gray-500">词典未找到</p>
          <p className="text-sm text-gray-400 mt-2">
            ID: {routeParams?.id || "未提供"}
          </p>
        </div>
      </Layout>
    );
  }

  // 计算当前页要显示的单词
  const indexOfLastWord = currentPage * wordsPerPage;
  const indexOfFirstWord = indexOfLastWord - wordsPerPage;
  const currentWords = words.slice(indexOfFirstWord, indexOfLastWord);

  // 计算总页数
  const totalPages = Math.ceil(words.length / wordsPerPage);

  // 处理分页按钮点击事件
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // 获取翻译内容的辅助函数
  const getTranslations = (word: Word): string[] => {
    if (word.detailed_translations && word.detailed_translations.length > 0) {
      return word.detailed_translations
        .map((item) => item.chinese)
        .filter((item): item is string => Boolean(item));
    }
    return word.trans || [];
  };

  return (
    <Layout>
      <Header></Header>
      <div className="relative mb-auto mt-auto flex w-full flex-1 flex-col overflow-y-auto pl-20">
        <IconBack
          className="absolute left-20 top-10 mr-2 h-7 w-7 cursor-pointer text-gray-400"
          onClick={onBack}
        />
        <div className="mt-20 flex w-full flex-1 flex-col items-center justify-center overflow-y-auto">
          <div className="flex h-full flex-col overflow-y-auto">
            <div className="flex h-20 w-full items-center justify-between pb-6">
              <div className="flex items-center space-x-4">
                <div
                  className={`flex items-center border-b-2 border-indigo-500 px-2 pb-1`}
                >
                  <p
                    className={`text-lg font-medium text-gray-700 dark:text-gray-200`}
                  >
                    {dictionary.name}
                  </p>
                </div>
              </div>
            </div>
            <div className="mr-4 flex flex-1 flex-col items-start justify-start rounded-lg bg-slate-100 p-4">
              <div className="flex flex-col items-start justify-start gap-4 ">
                <p className="text-lg font-bold">词典描述</p>
                <p className="text-gray-600">{dictionary.description}</p>
                <p className="font-bold text-gray-600">
                  共计{dictionary.length} 词
                </p>
              </div>
            </div>
            <div className="mr-4 flex flex-1 flex-col items-start justify-start">
              <div className="flex flex-col items-start justify-start gap-4">
                <p className="text-lg font-bold">词典内容</p>
                {isLoading ? (
                  <p className="text-gray-600">加载中...</p>
                ) : currentWords.length > 0 ? (
                  <div className="grid grid-cols-4 gap-4">
                    {currentWords.map((word: Word, index: number) => (
                      <div
                        key={index}
                        className="mb-2 cursor-pointer grid-cols-2 items-center justify-center overflow-hidden rounded-lg border-b border-gray-200 bg-zinc-50 p-4 pb-2 text-left shadow-lg hover:bg-white focus:outline-none group-hover:text-indigo-400 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        <p className="font-bold">{word.name}</p>
                        <p className="text-gray-600">
                          美式发音：/{word.usphone}/
                        </p>
                        <p className="text-gray-600">
                          英式发音：/{word.ukphone}/
                        </p>
                        <p className="text-gray-600">释义：</p>
                        <ul className="list-inside list-disc text-gray-600">
                          {getTranslations(word).map(
                            (translation: string, idx: number) => (
                              <li key={idx}>{translation}</li>
                            )
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">暂无数据</p>
                )}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-y-4">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  className={`mx-1 px-3 py-1 ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
