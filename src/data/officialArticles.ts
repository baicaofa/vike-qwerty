import type { CustomArticle } from "@/pages/CustomArticle/store/type";

// 扩展CustomArticle接口，添加官方文章特有的字段
export interface OfficialArticle extends CustomArticle {
  isOfficial: boolean;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  description?: string;
  wordCount?: number;
  tags?: string[];
}

// 文章难度说明
export const DIFFICULTY_DESCRIPTIONS = {
  easy: "简单：适合初学者，基础词汇为主",
  medium: "中等：包含一些专业词汇，适合有一定基础的学习者",
  hard: "困难：包含较多专业词汇和复杂句式，适合高级学习者",
};

// 文章分类
export const ARTICLE_CATEGORIES = [
  "英语学习",
  "科技",
  "商务",
  "日常对话",
  "文学",
];

// 英语学习类文章
const englishLearningArticles: OfficialArticle[] = [
  {
    id: 1001,
    uuid: "official-1001",
    title: "英语学习入门指南",
    content:
      "Learning English can be a rewarding journey. Start with basic vocabulary and simple sentences. Practice every day, even if it's just for 15 minutes. Listen to English songs and watch English movies with subtitles. Don't be afraid to make mistakes - they are part of the learning process. Join language exchange groups to practice speaking with others. Remember that consistency is key to mastering any language.",
    createdAt: Date.now(),
    isOfficial: true,
    category: "英语学习",
    difficulty: "easy",
    description: "适合英语初学者的基础指南",
    wordCount: 70,
  },
  {
    id: 1002,
    uuid: "official-1002",
    title: "如何提高英语口语",
    content:
      "Improving your English speaking skills requires regular practice. Find a language partner or join conversation groups. Record yourself speaking and listen for areas to improve. Learn common phrases and expressions used in daily conversations. Practice speaking in front of a mirror to build confidence. Watch interviews and try to imitate native speakers' pronunciation. Remember that making mistakes is normal and part of the learning process. The more you speak, the more comfortable you'll become.",
    createdAt: Date.now(),
    isOfficial: true,
    category: "英语学习",
    difficulty: "medium",
    description: "提高英语口语能力的实用技巧",
    wordCount: 85,
  },
  {
    id: 1003,
    uuid: "official-1003",
    title: "高级英语写作技巧",
    content:
      "Advanced English writing requires attention to structure, vocabulary, and style. Begin by outlining your main points before writing. Use a variety of sentence structures to keep your writing engaging. Incorporate advanced vocabulary appropriately, but avoid unnecessary complexity. Pay attention to transitions between paragraphs to ensure logical flow. Edit your work multiple times, focusing on different aspects each time: grammar, vocabulary, coherence, and overall impact. Seek feedback from others to identify blind spots in your writing. Remember that clarity should always be prioritized over complexity.",
    createdAt: Date.now(),
    isOfficial: true,
    category: "英语学习",
    difficulty: "hard",
    description: "适合高级英语学习者的写作指导",
    wordCount: 105,
  },
];

// 科技类文章
const techArticles: OfficialArticle[] = [
  {
    id: 2001,
    uuid: "official-2001",
    title: "人工智能入门",
    content:
      "Artificial Intelligence (AI) is transforming our world. AI systems can now recognize images, understand speech, and even drive cars. Machine Learning is a subset of AI where computers learn from data without explicit programming. Deep Learning uses neural networks with many layers to process complex patterns. Natural Language Processing allows computers to understand and generate human language. Computer Vision enables machines to interpret and make decisions based on visual data. As AI continues to evolve, ethical considerations become increasingly important to ensure responsible development and deployment.",
    createdAt: Date.now(),
    isOfficial: true,
    category: "科技",
    difficulty: "medium",
    description: "人工智能基础知识介绍",
    wordCount: 90,
  },
  {
    id: 2002,
    uuid: "official-2002",
    title: "网络安全基础",
    content:
      "Cybersecurity is essential in our digital world. Strong passwords are your first line of defense - use a combination of letters, numbers, and symbols. Enable two-factor authentication whenever possible. Keep your software and operating systems updated to patch security vulnerabilities. Be cautious of phishing attempts in emails or messages. Use secure networks and avoid public Wi-Fi for sensitive transactions. Regular data backups can save you from ransomware attacks. Remember that cybersecurity is everyone's responsibility, both at home and in the workplace.",
    createdAt: Date.now(),
    isOfficial: true,
    category: "科技",
    difficulty: "easy",
    description: "保护数字安全的基本知识",
    wordCount: 85,
  },
  {
    id: 2003,
    uuid: "official-2003",
    title: "区块链技术解析",
    content:
      "Blockchain technology represents a paradigm shift in how we record and verify transactions. At its core, a blockchain is a distributed ledger that maintains a continuously growing list of records, called blocks, which are linked using cryptography. Each block contains a timestamp and transaction data, and by design, is resistant to modification. This technology enables decentralized consensus, eliminating the need for central authorities in various applications. Smart contracts, self-executing contracts with the terms directly written into code, further extend blockchain's capabilities. While cryptocurrencies like Bitcoin were the first implementation, blockchain's potential extends to supply chain management, voting systems, healthcare records, and much more.",
    createdAt: Date.now(),
    isOfficial: true,
    category: "科技",
    difficulty: "hard",
    description: "深入解析区块链技术原理和应用",
    wordCount: 115,
  },
];

// 商务类文章
const businessArticles: OfficialArticle[] = [
  {
    id: 3001,
    uuid: "official-3001",
    title: "商务邮件写作",
    content:
      "Business emails should be clear, concise, and professional. Start with a proper greeting using the recipient's name when possible. Clearly state your purpose in the first paragraph. Use short paragraphs and bullet points for readability. Maintain a professional tone throughout the email. End with a clear call to action or next steps. Include a professional signature with your contact information. Always proofread before sending to catch any errors. Remember that effective business communication builds your professional reputation.",
    createdAt: Date.now(),
    isOfficial: true,
    category: "商务",
    difficulty: "medium",
    description: "有效商务邮件的写作指南",
    wordCount: 85,
  },
  {
    id: 3002,
    uuid: "official-3002",
    title: "商务会议用语",
    content:
      "In business meetings, clear communication is essential. Start by saying 'I'd like to call this meeting to order' to begin formally. Use phrases like 'The purpose of today's meeting is...' to set objectives. When moving to a new topic, say 'Let's move on to the next item on our agenda.' For sharing opinions, start with 'In my view' or 'From my perspective.' To disagree politely, try 'I see your point, but have you considered...' When concluding, summarize with 'To sum up' or 'In conclusion.' Finally, end with 'Thank you all for your participation. The meeting is adjourned.'",
    createdAt: Date.now(),
    isOfficial: true,
    category: "商务",
    difficulty: "easy",
    description: "商务会议中常用的英语表达",
    wordCount: 95,
  },
];

// 日常对话类文章
const conversationArticles: OfficialArticle[] = [
  {
    id: 4001,
    uuid: "official-4001",
    title: "餐厅点餐对话",
    content:
      "Waiter: Good evening! Welcome to our restaurant. Would you like a table for two?\nCustomer: Yes, please. Could we have a table by the window?\nWaiter: Of course. Please follow me. Here's your table and the menu. Today's special is grilled salmon with vegetables.\nCustomer: That sounds good. What soup do you recommend?\nWaiter: Our mushroom soup is very popular. Would you like to try it?\nCustomer: Yes, I'll have the mushroom soup and the grilled salmon. \nWaiter: Excellent choice. And what would you like to drink?\nCustomer: A glass of white wine, please.\nWaiter: I'll be right back with your drinks and soup.",
    createdAt: Date.now(),
    isOfficial: true,
    category: "日常对话",
    difficulty: "easy",
    description: "餐厅点餐的日常英语对话",
    wordCount: 110,
  },
  {
    id: 4002,
    uuid: "official-4002",
    title: "机场对话",
    content:
      "Airport Staff: Good morning. May I see your passport and boarding pass, please?\nPassenger: Here you are. I'm flying to London today.\nAirport Staff: Thank you. Did you pack your bags yourself?\nPassenger: Yes, I did.\nAirport Staff: Are you carrying any prohibited items such as liquids over 100ml or sharp objects?\nPassenger: No, I'm not.\nAirport Staff: Your gate number is 23, and boarding starts at 10:30. The flight is on time.\nPassenger: Great! Where can I find the gate?\nAirport Staff: After security, follow the signs to Terminal B. It's about a 10-minute walk.\nPassenger: Thank you for your help.\nAirport Staff: You're welcome. Have a safe flight!",
    createdAt: Date.now(),
    isOfficial: true,
    category: "日常对话",
    difficulty: "medium",
    description: "机场办理登机的英语对话",
    wordCount: 120,
  },
];

// 文学类文章
const literatureArticles: OfficialArticle[] = [
  {
    id: 5001,
    uuid: "official-5001",
    title: "The Gift of the Magi (Excerpt)",
    content:
      "One dollar and eighty-seven cents. That was all. And sixty cents of it was in pennies. Pennies saved one and two at a time by bulldozing the grocer and the vegetable man and the butcher until one's cheeks burned with the silent imputation of parsimony that such close dealing implied. Three times Della counted it. One dollar and eighty-seven cents. And the next day would be Christmas. There was clearly nothing to do but flop down on the shabby little couch and howl. So Della did it. Which instigates the moral reflection that life is made up of sobs, sniffles, and smiles, with sniffles predominating.",
    createdAt: Date.now(),
    isOfficial: true,
    category: "文学",
    difficulty: "hard",
    description: "O. Henry经典短篇小说《麦琪的礼物》节选",
    wordCount: 95,
  },
  {
    id: 5002,
    uuid: "official-5002",
    title: "The Happy Prince (Excerpt)",
    content:
      "High above the city, on a tall column, stood the statue of the Happy Prince. He was gilded all over with thin leaves of fine gold, for eyes he had two bright sapphires, and a large red ruby glowed on his sword-hilt. He was very much admired indeed. 'He is as beautiful as a weathercock,' remarked one of the Town Councillors who wished to gain a reputation for having artistic tastes; 'only not quite so useful,' he added, fearing lest people should think him unpractical, which he really was not.",
    createdAt: Date.now(),
    isOfficial: true,
    category: "文学",
    difficulty: "medium",
    description: "Oscar Wilde童话《快乐王子》开篇节选",
    wordCount: 85,
  },
];

// 合并所有官方文章
export const officialArticles: OfficialArticle[] = [
  ...englishLearningArticles,
  ...techArticles,
  ...businessArticles,
  ...conversationArticles,
  ...literatureArticles,
];

// 获取所有官方文章
export function getAllOfficialArticles(): OfficialArticle[] {
  return officialArticles;
}

// 按类别获取官方文章
export function getOfficialArticlesByCategory(
  category: string
): OfficialArticle[] {
  return officialArticles.filter((article) => article.category === category);
}

// 获取所有类别
export function getAllCategories(): string[] {
  return ARTICLE_CATEGORIES;
}

// 获取特定难度的文章
export function getArticlesByDifficulty(
  difficulty: "easy" | "medium" | "hard"
): OfficialArticle[] {
  return officialArticles.filter(
    (article) => article.difficulty === difficulty
  );
}

// 根据ID获取文章
export function getArticleById(id: number): OfficialArticle | undefined {
  return officialArticles.find((article) => article.id === id);
}

// 获取随机文章(可选指定类别)
export function getRandomArticle(category?: string): OfficialArticle {
  const articles = category
    ? officialArticles.filter((article) => article.category === category)
    : officialArticles;

  const randomIndex = Math.floor(Math.random() * articles.length);
  return articles[randomIndex];
}
