import { useEffect, useRef, useState } from "react";

interface NewsItem {
  date: string;
  title: string;
  tag?: string;
  desc: string;
  images: string[];
  btn?: string;
}

const newsList: NewsItem[] = [
  {
    date: "2025年5月13日",
    title: "「语音通话」模型升级，对话更智能流畅",
    tag: "电脑版",
    desc: "电脑版「语音通话」模型升级，对话如真人般自然流畅。你可以通过首页按钮...",
    images: [
      "https://www.mwexk.cn/uploads/allimg/20240516/3-2405161P213261.jpg",
    ],
    btn: "下载电脑版",
  },
  {
    date: "2025年5月13日",
    title: "电脑版支持切换搜索引擎",
    tag: "电脑版",
    desc: "只需打开新标签页，即可在地址栏自由切换默认搜索引擎，享受个性化搜索体验。",
    images: [
      "https://www.mwexk.cn/uploads/allimg/20240516/3-2405161P213261.jpg",
    ],
  },
  {
    date: "2025年5月13日",
    title: "「帮我写作」文档编辑器支持自动续写",
    tag: "试一试",
    desc: "开启「自动续写」功能后，只需将光标在编辑器内停留3秒，豆包将根据上下文...",
    images: [
      "https://www.mwexk.cn/uploads/allimg/20240516/3-2405161P213261.jpg",
    ],
  },
  {
    date: "2025年5月8日",
    title: "「AI 云盘」支持视频问答、脑图和摘要",
    tag: "试一试",
    desc: "「AI 云盘」升级，支持视频总结与问答。只需上传视频至云盘，点击「问问豆包」...",
    images: [
      "https://www.mwexk.cn/uploads/allimg/20240516/3-2405161P213261.jpg",
      "https://www.mwexk.cn/uploads/allimg/20240516/3-2405161P213261.jpg",
      "https://www.mwexk.cn/uploads/allimg/20240516/3-2405161P213261.jpg",
    ],
  },
];

export default function UpdatesPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          const idx = parseInt(
            entry.target.getAttribute("data-index") || "0",
            10
          );
          setCurrentIndex(idx);
        }
      },
      { threshold: 0.5 }
    );

    observerRef.current = observer;
    const cards = container.querySelectorAll(".dynamic-card");
    cards.forEach((card) => observer.observe(card));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          paddingBottom: "1rem",
        }}
        className="py-4 bg-white"
      >
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center">
          产品动态
        </h1>
        <p className="text-gray-400 mb-8 flex items-center justify-center">
          探索产品新功能及最新动态资讯
        </p>
      </div>

      <div className="flex justify-center  px-2 py-6">
        <div className="mx-auto" style={{ maxWidth: "768px", width: "100%" }}>
          {/* 顶部标题（滚动时固定） */}

          {/* 动态列表容器 */}
          <div ref={containerRef} className="relative">
            {/* 竖线（贯穿所有卡片，视觉上为一条直线） */}

            {newsList.map((item, idx) => (
              <div
                key={idx}
                data-index={idx}
                className="dynamic-card flex flex-row items-start relative mb-12"
              >
                {/* 第一个div：日期（靠左，滚动时固定） */}
                <div
                  className="flex flex-col items-start mr-6"
                  style={{
                    width: "80px",
                    minWidth: "80px",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <span
                    className="text-s text-gray-400"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    {item.date}
                  </span>
                </div>
                {/* 第二个div：竖线（贯穿所有卡片）与时间点（圆点） */}
                <div
                  className="flex flex-col items-center mr-6"
                  style={{
                    width: "80px",
                    minWidth: "80px",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <div
                    className="w-3 h-3 bg-blue-500 rounded-full"
                    style={{ marginLeft: "0px" }}
                  />
                </div>
                {/* 第三个div：卡片内容（滚动时向上滚动） */}
                <div className="flex-1">
                  <ProductNewsItem {...item} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductNewsItem({
  title,
  tag,
  desc,
  images,
  btn,
}: Omit<NewsItem, "date">) {
  const [current, setCurrent] = useState(0);
  const hasMultiple = images.length > 1;

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  return (
    <div className="dark:bg-gray-800 rounded-xl shadow p-6">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-bold text-lg">{title}</span>
        {tag && (
          <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-xs">
            {tag}
          </span>
        )}
        {btn && (
          <button className="ml-2 px-2 py-0.5 text-xs bg-blue-500 text-white rounded">
            {btn}
          </button>
        )}
      </div>
      <div className="text-gray-600 dark:text-gray-300 mb-4">{desc}</div>
      {images && images.length > 0 && (
        <div className="relative w-full max-w-md h-64 mx-auto flex items-center justify-center">
          {hasMultiple && (
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white rounded-full p-1 shadow"
              onClick={prev}
              aria-label="上一张"
            >
              &lt;
            </button>
          )}
          <img
            src={images[current]}
            alt=""
            className="rounded-lg object-cover"
            style={{ width: "100%", height: "100%" }}
          />
          {hasMultiple && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/70 hover:bg-white rounded-full p-1 shadow"
              onClick={next}
              aria-label="下一张"
            >
              &gt;
            </button>
          )}
          {/* 轮播图指示器 */}
          {hasMultiple && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <span
                  key={i}
                  className={`inline-block w-2 h-2 rounded-full cursor-pointer ${
                    i === current ? "bg-blue-500" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrent(i)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
