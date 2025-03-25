// DictionaryPage.tsx
import { DictChapterButton } from '../Typing/components/DictChapterButton'
import PronunciationSwitcher from '../Typing/components/PronunciationSwitcher'
import StartButton from '../Typing/components/StartButton'
import Switcher from '../Typing/components/Switcher'
// 引入 wordListFetcher
import bookCover from '@/assets/book-cover.png'
import Header from '@/components/Header'
import Layout from '@/components/Layout'
import Tooltip from '@/components/Tooltip'
import { WordPronunciationIcon } from '@/components/WordPronunciationIcon'
import type { WordPronunciationIconRef } from '@/components/WordPronunciationIcon'
import { dictionaries } from '@/resources/dictionary'
import {
  currentChapterAtom,
  currentDictInfoAtom,
  isIgnoreCaseAtom,
  isShowAnswerOnHoverAtom,
  isTextSelectableAtom,
  pronunciationIsOpenAtom,
  wordDictationConfigAtom,
} from '@/store'
import type { Dictionary } from '@/typings'
import { CTRL, getUtcStringForMixpanel, useMixPanelWordLogUploader } from '@/utils'
import { wordListFetcher } from '@/utils/wordListFetcher'
import { useAtomValue } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import IconBack from '~icons/ic/outline-arrow-back'

export default function DictionaryPage() {
  const { id } = useParams<{ id: string }>() // 获取 URL 中的 ID 参数
  const [dictionary, setDictionary] = useState<Dictionary | null>(null) // 当前词典
  const [words, setWords] = useState<any[]>([]) // 用于存储加载的单词数据
  const navigate = useNavigate() // 用于导航
  const [currentPage, setCurrentPage] = useState(1) // 当前页码
  const wordsPerPage = 100 // 每页显示的单词数量
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const currentLanguage = useAtomValue(currentDictInfoAtom).language
  const wordPronunciationIconRef = useRef<WordPronunciationIconRef>(null)
  useEffect(() => {
    if (id) {
      const dict = dictionaries.find((dict) => dict.id === id) // 根据 ID 查找词典
      if (dict) {
        setDictionary(dict) // 设置词典状态
        // 使用 wordListFetcher 加载词典的单词数据
        wordListFetcher(dict.url)
          .then((wordList) => {
            setWords(wordList) // 将加载的单词数据存储到状态中
          })
          .catch((error) => {
            console.error('Failed to load dictionary words:', error)
          })
      }
    }
  }, [id])

  const onBack = () => {
    navigate('/gallery') // 返回到 Gallery-N 页面
  }

  if (!dictionary) {
    return (
      <Layout>
        <div className="flex h-full items-center justify-center">
          <p className="text-2xl text-gray-500">词典未找到</p>
        </div>
      </Layout>
    )
  }

  // 计算当前页要显示的单词
  const indexOfLastWord = currentPage * wordsPerPage
  const indexOfFirstWord = indexOfLastWord - wordsPerPage
  const currentWords = words.slice(indexOfFirstWord, indexOfLastWord)

  // 计算总页数
  const totalPages = Math.ceil(words.length / wordsPerPage)

  // 处理分页按钮点击事件
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  return (
    <Layout>
      <Helmet>
        <title>{dictionary.name} 词典</title>
        <meta name="description" content={dictionary.description} />
      </Helmet>
      <Header>
        <DictChapterButton />
        <PronunciationSwitcher />
        <Switcher />
      </Header>
      <div className="relative mb-auto mt-auto flex w-full flex-1 flex-col overflow-y-auto pl-20">
        <IconBack className="absolute left-20 top-10 mr-2 h-7 w-7 cursor-pointer text-gray-400" onClick={onBack} />
        <div className="mt-20 flex w-full flex-1 flex-col items-center justify-center overflow-y-auto">
          <div className="flex h-full flex-col overflow-y-auto">
            <div className="flex h-20 w-full items-center justify-between pb-6">
              <div className="flex items-center space-x-4">
                <div className={`flex items-center border-b-2 border-indigo-500 px-2 pb-1`}>
                  <p className={`text-lg font-medium text-gray-700 dark:text-gray-200`}>{dictionary.name}</p>
                </div>
              </div>
            </div>
            <div className="mr-4 flex flex-1 flex-col items-start justify-start rounded-lg bg-slate-100 p-4">
              <div className="flex flex-col items-start justify-start gap-4 ">
                <p className="text-lg font-bold">词典描述</p>
                <p className="text-gray-600">{dictionary.description}</p>
                <p className="font-bold text-gray-600">共计{dictionary.length} 词</p>
              </div>
            </div>
            <div className="mr-4 flex flex-1 flex-col items-start justify-start  ">
              <div className="flex flex-col items-start justify-start gap-4">
                <p className="text-lg font-bold">词典内容</p>
                {currentWords.length > 0 ? (
                  <div className="grid grid-cols-4 gap-4">
                    {currentWords.map((word, index) => (
                      <div
                        key={index}
                        className="mb-2 cursor-pointer grid-cols-2 items-center justify-center overflow-hidden rounded-lg border-b border-gray-200 bg-zinc-50 p-4 pb-2 text-left shadow-lg hover:bg-white focus:outline-none group-hover:text-indigo-400 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                      >
                        <p className="font-bold">{word.name}</p>
                        <p className="text-gray-600">美式发音：/{word.usphone}/</p>
                        <p className="text-gray-600">英式发音：/{word.ukphone}/</p>
                        <p className="text-gray-600">释义：</p>
                        <ul className="list-inside list-disc text-gray-600">
                          {word.trans.map((translation, idx) => (
                            <li key={idx}>{translation}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">加载中...</p>
                )}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-y-4">
              {/* 分页按钮 */}
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`mx-1 px-3 py-1 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
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
  )
}
