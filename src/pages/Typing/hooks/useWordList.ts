import { CHAPTER_LENGTH } from "@/constants";
import {
  currentChapterAtom,
  currentDictInfoAtom,
  reviewModeInfoAtom,
} from "@/store";
import type { Word, WordWithIndex } from "@/typings/index";
import { wordListFetcher } from "@/utils/wordListFetcher";
import { useAtom, useAtomValue } from "jotai";
import { useMemo } from "react";
import useSWR from "swr";

export type UseWordListResult = {
  words: WordWithIndex[];
  isLoading: boolean;
  error: Error | undefined;
};

/**
 * Use word lists from the current selected dictionary.
 */
export function useWordList(): UseWordListResult {
  const currentDictInfo = useAtomValue(currentDictInfoAtom);
  const [currentChapter, setCurrentChapter] = useAtom(currentChapterAtom);
  const { isReviewMode, reviewRecord } = useAtomValue(reviewModeInfoAtom);

  // Reset current chapter to 0, when currentChapter is greater than chapterCount.
  if (currentChapter >= currentDictInfo.chapterCount) {
    setCurrentChapter(0);
  }

  const isFirstChapter =
    !isReviewMode && currentDictInfo.id === "cet4" && currentChapter === 0;
  const {
    data: wordList,
    error,
    isLoading,
  } = useSWR(currentDictInfo.url, wordListFetcher);

  const words: WordWithIndex[] = useMemo(() => {
    let newWords: Word[];
    if (isFirstChapter) {
      newWords = firstChapter;
    } else if (isReviewMode) {
      newWords = reviewRecord?.words ?? [];
    } else if (wordList) {
      newWords = wordList.slice(
        currentChapter * CHAPTER_LENGTH,
        (currentChapter + 1) * CHAPTER_LENGTH
      );
    } else {
      newWords = [];
    }

    // 记录原始 index, 并对 word.trans 做兜底处理
    return newWords.map((word, index) => {
      let trans: string[];

      // 处理翻译数据：优先使用 detailed_translations，如果没有则使用 trans
      if (word.detailed_translations && word.detailed_translations.length > 0) {
        trans = word.detailed_translations
          .map((trans) => trans.chinese)
          .filter(Boolean) as string[];
      } else if (Array.isArray(word.trans)) {
        trans = word.trans.filter((item) => typeof item === "string");
      } else if (
        word.trans === null ||
        word.trans === undefined ||
        typeof word.trans === "object"
      ) {
        trans = [];
      } else {
        trans = [String(word.trans)];
      }

      return {
        ...word,
        index,
        trans,
      };
    });
  }, [
    isFirstChapter,
    isReviewMode,
    wordList,
    reviewRecord?.words,
    currentChapter,
  ]);

  return { words, isLoading, error };
}

const firstChapter = [
  {
    name: "cancel",
    trans: ["取消， 撤销； 删去"],
    usphone: "'kænsl",
    ukphone: "'kænsl",
    sentences: [
      {
        english: "Our flight was cancelled.",
        chinese: "我们的航班取消了。",
      },
      {
        english: "I’m afraid I’ll have to cancel our meeting tomorrow.",
        chinese: "恐怕我得取消我们明天的会议。",
      },
      {
        english: "You’ll just have to ring John and cancel.",
        chinese: "你只能打电话给约翰取消了。",
      },
    ],

    detailed_translations: [
      {
        pos: "vt",
        chinese: " 取消， 撤销； 删去",
        english:
          "to decide that something that was officially planned will not happen",
      },
    ],
  },
  {
    name: "explosive",
    trans: ["爆炸的； 极易引起争论的", "炸药"],
    usphone: "ɪk'splosɪv; ɪk'splozɪv",
    ukphone: "ɪk'spləusɪv",
    sentences: [
      {
        english:
          "Because the gas is highly explosive, it needs to be kept in high-pressure containers.",
        chinese: "由于这种气体极易爆炸，因此需要保存在高压容器内。",
      },
      {
        english:
          "A small explosive device (= bomb ) was set off outside the UN headquarters today.",
        chinese: "今天有一枚小型炸弹在联合国总部外爆炸。",
      },
    ],

    detailed_translations: [
      {
        pos: "adj",
        chinese: " 爆炸的； 极易引起争论的",
        english: "able or likely to explode",
      },
      {
        pos: "n",
        chinese: "炸药",
        english: "a substance that can cause an explosion",
      },
    ],
  },
  {
    name: "numerous",
    trans: ["众多的"],
    usphone: "'numərəs",
    ukphone: "'njuːmərəs",
    sentences: [
      {
        english: "Numerous attempts have been made to hide the truth.",
        chinese: "为掩盖事实作了很多尝试。",
      },
      {
        english: "The two leaders have worked together on numerous occasions.",
        chinese: "那两位领导人已经多次合作。",
      },
    ],

    detailed_translations: [
      {
        pos: "adj",
        chinese: " 众多的",
        english: "many",
      },
    ],
  },
  {
    name: "govern",
    trans: ["居支配地位， 占优势", "统治，治理，支配"],
    usphone: "'ɡʌvɚn",
    ukphone: "'gʌvn",
    sentences: [
      {
        english: "the leaders who govern the country",
        chinese: "治理这个国家的领导人",
      },
      {
        english: "The party had been governing for seven months.",
        chinese: "该党执政已经有七个月了。",
      },
    ],

    detailed_translations: [
      {
        pos: "vi",
        chinese: " 居支配地位， 占优势",
        english: "",
      },
      {
        pos: "vt",
        chinese: "统治，治理，支配",
        english:
          "to officially and legally control a country and make all the decisions about taxes, laws, public services etc",
      },
    ],
  },
  {
    name: "analyse",
    trans: ["分析； 分解； 解析"],
    usphone: "'æn(ə)laɪz",
    ukphone: "'ænəlaɪz",
    sentences: [
      {
        english: "She still needs to analyse the data.",
        chinese: "她仍需要分析这些数据。",
      },
      {
        english: "You need to sit down and analyse why you feel so upset.",
        chinese: "你得坐下来想一想自己为什么会那么生气。",
      },
      {
        english: "Joe had never tried to analyze their relationship.",
        chinese: "乔从未试图去理清他们的关系。",
      },
    ],

    detailed_translations: [
      {
        pos: "vt",
        chinese: " 分析； 分解； 解析",
        english:
          "to examine or think about something carefully, in order to understand it",
      },
    ],
  },
  {
    name: "discourage",
    trans: ["使泄气， 使灰心； 阻止， 劝阻"],
    usphone: "dɪs'kɝɪdʒ",
    ukphone: "dɪs'kʌrɪdʒ",
    sentences: [
      {
        english: "You should not let one failure discourage you.",
        chinese: "你不该失败一次就灰心丧气。",
      },
    ],

    detailed_translations: [
      {
        pos: "vt",
        chinese: " 使泄气， 使灰心； 阻止， 劝阻",
        english:
          "to make someone less confident or less willing to do something",
      },
    ],
  },
  {
    name: "resemble",
    trans: ["像， 类似于"],
    usphone: "rɪ'zɛmbl",
    ukphone: "rɪ'zembl",
    sentences: [
      {
        english:
          "It’s amazing how closely Brian and Steve resemble each other.",
        chinese: "布赖恩和史蒂夫真是惊人地相像。",
      },
      {
        english: "He grew up to resemble his father.",
        chinese: "他长大了，很像他父亲。",
      },
    ],

    detailed_translations: [
      {
        pos: "vt",
        chinese: " 像， 类似于",
        english: "to look like or be similar to someone or something",
      },
    ],
  },
  {
    name: "remote",
    trans: [
      "遥远的； 偏僻的； 关系疏远的； 脱离的； 微乎其微的； 孤高的， 冷淡的； 遥控的",
    ],
    usphone: "rɪ'mot",
    ukphone: "rɪ'məut",
    sentences: [
      {
        english: "a remote border town",
        chinese: "一个偏远的边境小镇",
      },
      {
        english: "a fire in a remote mountain area",
        chinese: "偏远山区的火灾",
      },
    ],

    detailed_translations: [
      {
        pos: "adj",
        chinese:
          " 遥远的； 偏僻的； 关系疏远的； 脱离的； 微乎其微的； 孤高的， 冷淡的； 遥控的",
        english: "far from towns or other places where people live",
      },
    ],
  },
  {
    name: "salary",
    trans: ["薪金， 薪水"],
    usphone: "'sæləri",
    ukphone: "'sæləri",
    sentences: [
      {
        english: "The average salary for a teacher is $39,000 a year.",
        chinese: "教师的平均工资是39,000美元一年。",
      },
    ],

    detailed_translations: [
      {
        pos: "n",
        chinese: " 薪金， 薪水",
        english:
          "money that you receive as payment from the organization you work for, usually paid to you every month",
      },
    ],
  },
  {
    name: "pollution",
    trans: ["污染， 污染物"],
    usphone: "pə'luʃən",
    ukphone: "pə'luːʃn",
    sentences: [
      {
        english: "California’s tough anti-pollution laws",
        chinese: "加利福尼亚州严厉的反污染法",
      },
    ],

    detailed_translations: [
      {
        pos: "n",
        chinese: " 污染， 污染物",
        english:
          "the process of making air, water, soil etc dangerously dirty and not suitable for people to use, or the state of being dangerously dirty",
      },
    ],
  },
  {
    name: "pretend",
    trans: ["装作， 假装"],
    usphone: "prɪ'tɛnd",
    ukphone: "prɪ'tend",
    sentences: [
      {
        english: "Let’s pretend we’re on the moon.",
        chinese: "我们假装自己是在月球上吧。",
      },
      {
        english: "He’s not asleep – he’s just pretending.",
        chinese: "他并没睡着，不过是装睡而已。",
      },
      {
        english:
          "To pretend ignorance of the situation would be irresponsible.",
        chinese: "装作不知情是不负责任的做法。",
      },
      {
        english: "I can’t marry her and to pretend otherwise would be wrong.",
        chinese: "我不可以娶她，装作娶她无妨是不对的。",
      },
    ],
    detailed_translations: [
      {
        pos: "vt",
        chinese: " 装作， 假装",
        english:
          "to behave as if something is true when in fact you know it is not, in order to deceive people or for fun",
      },
    ],
  },
  {
    name: "kettle",
    trans: ["水壶"],
    usphone: "'kɛtl",
    ukphone: "'ketl",
    sentences: [
      {
        english: "She filled the kettle and switched it on.",
        chinese: "她把水壶灌满，打开了开关。",
      },
      {
        english: "The kettle’s boiling (= the water in it is boiling ).",
        chinese: "水壶里的水开了。",
      },
      {
        english: "(= start boiling water in a kettle ), will you?",
        chinese: "烧壶水，好吗？",
      },
    ],

    detailed_translations: [
      {
        pos: "n",
        chinese: " 水壶",
        english:
          "a container with a lid, a handle, and a spout,used for boiling and pouring water",
      },
    ],
  },
  {
    name: "wreck",
    trans: ["失事；残骸；精神或身体已垮的人", "破坏"],
    usphone: "rɛk",
    ukphone: "rek",
    sentences: [
      {
        english: "He was still alive when they pulled him from the wreck.",
        chinese: "他们把他从失事的车辆中拖出来时，他还活着。",
      },
    ],

    detailed_translations: [
      {
        pos: "n",
        chinese: "失事；残骸；精神或身体已垮的人",
        english: "a ship that has sunk",
      },
      {
        pos: "vt",
        chinese: " 破坏",
        english:
          "to completely spoil something so that it cannot continue in a successful way",
      },
    ],
  },
  {
    name: "drunk",
    trans: ["醉的； 陶醉的"],
    usphone: "drʌŋk",
    ukphone: "drʌŋk",
    sentences: [
      {
        english: "You’re drunk.",
        chinese: "你喝醉了。",
      },
      {
        english:
          "David would get drunk and I would have to take him home and put him to bed.",
        chinese: "戴维常会喝醉，我就得把他弄回家放到床上。",
      },
    ],

    detailed_translations: [
      {
        pos: "adj",
        chinese: " 醉的； 陶醉的",
        english:
          "unable to control your behaviour, speech etc because you have drunk too much alcohol",
      },
    ],
  },
  {
    name: "calculate",
    trans: ["计算； 估计； 计划"],
    usphone: "'kælkjulet",
    ukphone: "'kælkjuleɪt",
    sentences: [
      {
        english: "These instruments calculate distances precisely.",
        chinese: "这些仪器计算距离非常精确。",
      },
    ],

    detailed_translations: [
      {
        pos: "vt",
        chinese: " 计算； 估计； 计划",
        english:
          "to find out how much something will cost, how long something will take etc, by using numbers",
      },
    ],
  },
  {
    name: "persistent",
    trans: ["坚持的， 不屈不挠的； 持续不断的； 反复出现的"],
    usphone: "pə'zɪstənt",
    ukphone: "pə'sɪstənt",
    sentences: [
      {
        english: "persistent rumours",
        chinese: "持续流传的谣言",
      },
      {
        english: "persistent headaches",
        chinese: "持续头疼",
      },
      {
        english: "a persistent problem",
        chinese: "长期问题",
      },
      {
        english: "persistent rain",
        chinese: "连绵的雨",
      },
    ],

    detailed_translations: [
      {
        pos: "adj",
        chinese: " 坚持的， 不屈不挠的； 持续不断的； 反复出现的",
        english:
          "continuing to exist or happen, especially for longer than is usual or desirable",
      },
    ],
  },
  {
    name: "sake",
    trans: ["缘故， 理由"],
    usphone: "sek",
    ukphone: "seɪk",
    sentences: [
      {
        english: "He moved to the seaside for the sake of his health.",
        chinese: "他为了健康而迁居海滨。",
      },
      {
        english: "I only went for Kay’s sake.",
        chinese: "我是为了凯才去的。",
      },
      {
        english:
          "I hope he’s told the truth for his own sake (= because it will be good for him ) .",
        chinese: "为了他自己好，我希望他已经说出了真相。",
      },
    ],

    detailed_translations: [
      {
        pos: "n",
        chinese: " 缘故， 理由",
        english: "in order to help, improve, or please someone or something",
      },
    ],
  },
  {
    name: "conceal",
    trans: ["把…隐藏起来， 掩盖， 隐瞒"],
    usphone: "kən'sil",
    ukphone: "kən'siːl",
    sentences: [
      {
        english: "The shadows concealed her as she crept up to the house.",
        chinese: "她借着阴影蹑手蹑脚地走向房子。",
      },
      {
        english: "The path was concealed by long grass.",
        chinese: "小路隐藏在长长的草里。",
      },
      {
        english: "a concealed weapon",
        chinese: "藏匿的武器",
      },
    ],

    detailed_translations: [
      {
        pos: "vt",
        chinese: " 把…隐藏起来， 掩盖， 隐瞒",
        english: "to hide something carefully",
      },
    ],
  },
  {
    name: "audience",
    trans: ["听众， 观众， 读者"],
    usphone: "'ɔdɪəns",
    ukphone: "'ɔːdiəns",
    sentences: [
      {
        english: "The audience began clapping and cheering.",
        chinese: "观众开始鼓掌欢呼。",
      },
      {
        english: "One member of the audience described the opera as ‘boring’.",
        chinese: "有一名观众说这出歌剧“乏味”。",
      },
    ],
    detailed_translations: [
      {
        pos: "n",
        chinese: " 听众， 观众， 读者",
        english:
          "a group of people who come to watch and listen to someone speaking or performing in public",
      },
    ],
  },
  {
    name: "meanwhile",
    trans: ["与此同时"],
    usphone: "'minwaɪl",
    ukphone: "'miːnwaɪl",
    sentences: [
      {
        english:
          "Cook the sauce over a medium heat until it thickens. Meanwhile start boiling the water for the pasta.",
        chinese: "用中火把调味汁煮到变稠，同时烧水准备煮意大利面。",
      },
    ],
    detailed_translations: [
      {
        pos: "adv",
        chinese: " 与此同时",
        english: "while something else is happening",
      },
    ],
  },
];
