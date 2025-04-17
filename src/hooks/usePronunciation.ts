import { pronunciationConfigAtom } from "@/store";
import type { PronunciationType } from "@/typings";
import { addHowlListener } from "@/utils";
import { romajiToHiragana } from "@/utils/kana";
import noop from "@/utils/noop";
import type { Howl } from "howler";
import { useAtomValue } from "jotai";
import { useEffect, useMemo, useState } from "react";
import useSound from "use-sound";
import type { HookOptions } from "use-sound/dist/types";

const PROXY_URL = "/api/pronunciation";

export function generateWordSoundSrc(
  word: string,
  pronunciation: Exclude<PronunciationType, false>
): string {
  const params = new URLSearchParams();
  params.append("audio", word);

  switch (pronunciation) {
    case "uk":
      params.append("type", "1");
      break;
    case "us":
      params.append("type", "2");
      break;
    case "romaji":
      params.append("audio", romajiToHiragana(word));
      params.append("le", "jap");
      break;
    case "zh":
      params.append("le", "zh");
      break;
    case "ja":
      params.append("le", "jap");
      break;
    case "de":
      params.append("le", "de");
      break;
    case "hapin":
    case "kk":
      params.append("le", "ru"); // 有道不支持哈萨克语, 暂时用俄语发音兜底
      break;
    case "id":
      params.append("le", "id");
      break;
    default:
      return "";
  }

  return `${PROXY_URL}?${params.toString()}`;
}

export default function usePronunciationSound(word: string, isLoop?: boolean) {
  const pronunciationConfig = useAtomValue(pronunciationConfigAtom);
  const loop = useMemo(
    () => (typeof isLoop === "boolean" ? isLoop : pronunciationConfig.isLoop),
    [isLoop, pronunciationConfig.isLoop]
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const soundUrl = useMemo(() => {
    const url = generateWordSoundSrc(word, pronunciationConfig.type);
    return url;
  }, [word, pronunciationConfig.type]);

  const [play, { stop, sound }] = useSound(soundUrl, {
    html5: true,
    format: ["mp3"],
    loop,
    volume: pronunciationConfig.volume,
    rate: pronunciationConfig.rate,
    onplayerror: (id, error) => {
      setError(error);
      setIsPlaying(false);
    },
  } as HookOptions);

  useEffect(() => {
    if (!sound) return;
    sound.loop(loop);
    return noop;
  }, [loop, sound]);

  useEffect(() => {
    if (!sound) return;
    const unListens: Array<() => void> = [];

    unListens.push(
      addHowlListener(sound, "play", () => {
        setIsPlaying(true);
        setError(null);
      })
    );
    unListens.push(
      addHowlListener(sound, "end", () => {
        setIsPlaying(false);
      })
    );
    unListens.push(
      addHowlListener(sound, "pause", () => {
        setIsPlaying(false);
      })
    );
    unListens.push(
      addHowlListener(sound, "playerror", (id, error) => {
        setError(error);
        setIsPlaying(false);
      })
    );

    return () => {
      setIsPlaying(false);
      setError(null);
      unListens.forEach((unListen) => unListen());
      (sound as Howl).unload();
    };
  }, [sound]);

  return { play, stop, isPlaying, error };
}

export function usePrefetchPronunciationSound(word: string | undefined) {
  const pronunciationConfig = useAtomValue(pronunciationConfigAtom);

  useEffect(() => {
    if (!word) return;

    const soundUrl = generateWordSoundSrc(word, pronunciationConfig.type);
    if (soundUrl === "") return;

    const head = document.head;
    const isPrefetch = (
      Array.from(head.querySelectorAll("link[href]")) as HTMLLinkElement[]
    ).some((el) => el.href === soundUrl);

    if (!isPrefetch) {
      const audio = new Audio();
      audio.src = soundUrl;
      audio.preload = "auto";

      // gpt 说这这两行能尽可能规避下载插件被触发问题。 本地测试不加也可以，考虑到别的插件可能有问题，所以加上保险
      audio.crossOrigin = "anonymous";
      audio.style.display = "none";

      head.appendChild(audio);

      return () => {
        head.removeChild(audio);
      };
    }
  }, [pronunciationConfig.type, word]);
}
