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
  "新概念英语第一册",
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

// 新概念英语第一册
const nce1Articles: OfficialArticle[] = [
  {
    id: 1110000111,
    uuid: "111000011001",
    title: "新概念英语第一册 - 第1课程",
    content:
      "Excuse me! Yes? Is this your handbag? Pardon? Is this your handbag? Yes, it is. Thank you very much.",
    createdAt: 1752745887226,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第1课内容",
    wordCount: 19,
  },
  {
    id: 1110000113,
    uuid: "111000011003",
    title: "新概念英语第一册 - 第3课程",
    content:
      "My coat and my umbrella please. Here is my ticket. Thank you, sir. Number five. Here's your umbrella and your coat. This is not my umbrella. Sorry sir. Is this your umbrella? No, it isn't. Is this it? Yes, it is. Thank you very much.",
    createdAt: 1752745888835,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第3课内容",
    wordCount: 45,
  },
  {
    id: 1110000115,
    uuid: "111000011005",
    title: "新概念英语第一册 - 第5课程",
    content:
      "MR. BLAKE: Good morning.STUDENTS:  Good morning, Mr. Blake.MR. BLAKE: This is Miss Sophie Dupont. Sophie is a new student.She is French.MR. BLAKE: Sophie, this is Hans.He is German.HANS:      Nice to meet you.MR. BLAKE: And this is Naoko. She's Japanese.NAOKO:     Nice to meet you.MR. BLAKE: And this is Chang-woo.  He's Korean.CHANG-WOO: Nice to meet you.MR. BLAKE: And this is Luming. He is Chinese.LUMNG:     Nice to meet you.MR. BLAKE: And this is Xiaohui.She's Chinese, too.XIAOHUI:   Nice to meet you.",
    createdAt: 1752745890668,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第5课内容",
    wordCount: 77,
  },
  {
    id: 1110000117,
    uuid: "111000011007",
    title: "新概念英语第一册 - 第7课程",
    content:
      "ROBERT: I am a new student.My name's Robert.SOPHIE: Nice to meet you.My name's Sophie.ROBERT: Are you French?SOPHIE: Yes, I am.SOPHIE: Are you French too?ROBERT: No, I am not.SOPHIE: What nationality are you?ROBERT: I'm Italian.ROBERT: Are you a teacher?SOPHIE: No, I'm not.ROBERT: What's your job?SOPHIE: I'm a keyboard operator.SOPHIE: What's your job?ROBERT: I'm an engineer.",
    createdAt: 1752745897193,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第7课内容",
    wordCount: 56,
  },
  {
    id: 1110000119,
    uuid: "111000011009",
    title: "新概念英语第一册 - 第9课程",
    content:
      "STEVEN: Hello, Helen.HELEN:  Hi, Steven.STEVEN: How are you today?HELEN:  I'm very well, thank you. And you?STEVEN: I'm fine, thanks.STEVEN: How is Tony?HELEN:  He's fine, thanks.How's Emma?STEVEN: She's very well, too, Helen.STEVEN: Goodbye, Helen.Nice to see you.HELEN:  Nice to see you, too, Steven. Goodbye.",
    createdAt: 1752745900057,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第9课内容",
    wordCount: 45,
  },
  {
    id: 11100001111,
    uuid: "111000011011",
    title: "新概念英语第一册 - 第11课程",
    content:
      "HEACHER：Whose shirt is that?HEACHER：Is this your shirt, Dave?DAVE:    No. Sir. It's not my shirt.DAVE:    This is my shirt. My shirt's blue.TEACHER: Is this shirt Tim's?DAVE:    Perhaps it is, sir. Tim's shirt's white.HEACHER：Tim!TIM:     Yes, sir?HEACHER：Is this your shirt?TIM:     Yes, sir.HEACHER：Here you are. Catch!TIM:     Thank you, sir.",
    createdAt: 1752745901751,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第11课内容",
    wordCount: 45,
  },
  {
    id: 11100001113,
    uuid: "111000011013",
    title: "新概念英语第一册 - 第13课程",
    content:
      "LOUISE: What colour's your new dress?ANNA:   It's green.ANNA:   Come upstairs and see it.LOUISE: Thank you.ANNA:   Look! Here it is!LOUISE: That's a nice dress.It's very smart.ANNA:   My hat's new, too.LOUISE: What colour is it?ANNA:   It's the same colour.It's green, too.LOUISE: That is a lovely hat!",
    createdAt: 1752745907911,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第13课内容",
    wordCount: 45,
  },
  {
    id: 11100001115,
    uuid: "111000011015",
    title: "新概念英语第一册 - 第15课程",
    content:
      "CUSTOMS OFFICER: Are you Swedish?GIRLS: No, we are not.We are Danish.CUSTOMS OFFICER: Are your friends Danish, too?GIRLS: No, they aren't.They are Norwegian.CUSTOMS OFFICER: Your passports, please.GIRLS: Here they are.CUSTOMS OFFICER: Are these your cases?GIRLS: No, they aren't.GIRLS: Our cases are brown.Here they are.CUSTOMS OFFICER: Are you tourists?GIRLS: Yes, we are.CUSTOMS OFFICER: Are your friends tourists too?GIRLS: Yes, they are.CUSTOMS OFFICER: That's fine.GIRLS: Thank you very much.",
    createdAt: 1752745909576,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第15课内容",
    wordCount: 66,
  },
  {
    id: 11100001117,
    uuid: "111000011017",
    title: "新概念英语第一册 - 第17课程",
    content:
      "Come and meet our employees, Mr. Richards. Thank you, Mr. Jackson. This is Nicola Grey, and this is Claire Taylor. How do you do? Those women are very hard-working. What are their jobs? They're keyboard operators. This is Michael Baker, and this is Jeremy Short. How do you do? They aren't very busy! What are their jobs? They're sales reps. They are very lazy. Who is this young man? This is Jim. He is our office assistant.",
    createdAt: 1752745912230,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第17课内容",
    wordCount: 77,
  },
  {
    id: 11100001119,
    uuid: "111000011019",
    title: "新概念英语第一册 - 第19课程",
    content:
      "What's the matter, children? We are tired and thirsty, Mum. Sit down here. Are you all right now? No, we aren't. Look! There’s an ice cream man. Two ice creams please. Here you are, children. Thanks, Mum. These ice creams are nice. Are you all right now? Yes, we are, thank you.",
    createdAt: 1752745913844,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第19课内容",
    wordCount: 52,
  },
  {
    id: 11100001121,
    uuid: "111000011021",
    title: "新概念英语第一册 - 第21课程",
    content:
      "Give me a book please, Jane. Which book? This one? No, not that one. The red one. This one? Yes, please. Here you are. Thank you.",
    createdAt: 1752745919188,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第21课内容",
    wordCount: 26,
  },
  {
    id: 11100001123,
    uuid: "111000011023",
    title: "新概念英语第一册 - 第23课程",
    content:
      "Give me some glasses please, Jane. Which glasses? These glasses? No, not those. The ones on the shelf. These? Yes, please. Here you are. Thanks.",
    createdAt: 1752745920897,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第23课内容",
    wordCount: 25,
  },
  {
    id: 11100001125,
    uuid: "111000011025",
    title: "新概念英语第一册 - 第25课程",
    content:
      "Mrs. Smith’s kitchen is small. There is a refrigerator in the kitchen. The refrigerator is white. It is on the right. There is an electric cooker in the kitchen. The cooker is blue. It is on the left. There is a table in the middle of the room. There is a bottle on the table. The bottle is empty. There is a cup on the table, too. The cup is clean.",
    createdAt: 1752745922494,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第25课内容",
    wordCount: 71,
  },
  {
    id: 11100001127,
    uuid: "111000011027",
    title: "新概念英语第一册 - 第27课程",
    content:
      "Mrs. Smith’s living room is large. There is a television in the room. The television is near the window. There are some magazines on the television. There is a table in the room. There are some newspapers on the table. There are some armchairs in the room. The armchairs are near the table. There is a stereo in the room. The stereo is near the door. There are some books on the stereo. There are some pictures in the room. The pictures are on the wall.",
    createdAt: 1752745926704,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第27课内容",
    wordCount: 86,
  },
  {
    id: 11100001129,
    uuid: "111000011029",
    title: "新概念英语第一册 - 第29课程",
    content:
      "Come in, Amy. Shut the door, please. This bedroom is very untidy. What must I do, Mrs. Jones? Open the window and air the room. Then put these clothes in the wardrobe. Then make the bed. Dust the dressing table. Then sweep the floor.",
    createdAt: 1752745932872,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第29课内容",
    wordCount: 44,
  },
  {
    id: 11100001131,
    uuid: "111000011031",
    title: "新概念英语第一册 - 第31课程",
    content:
      "Where’s Sally, Jack? She’s in the garden, Jane. What’s she doing? She’s sitting under the tree. Is Tim in the garden, too? Yes, he is. He’s climbing the tree. I beg your pardon? Who’s climbing the tree. Tim is. What about the dog? The dog’s in the garden, too. It’s running across the grass. It’s running after a cat.",
    createdAt: 1752745934524,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第31课内容",
    wordCount: 59,
  },
  {
    id: 11100001133,
    uuid: "111000011033",
    title: "新概念英语第一册 - 第33课程",
    content:
      "It’s a fine day today. There are some clouds in the sky, but the sun is shining. Mr Jones’s with his family. They are walking over the bridge. There are some boats on the river. Mr Jones and his wife are looking at them. Sally is looking at a big ship. The ship is going under the bridge. Tim is looking at an aeroplane. The aeroplane is flying over the river.",
    createdAt: 1752745937091,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第33课内容",
    wordCount: 71,
  },
  {
    id: 11100001135,
    uuid: "111000011035",
    title: "新概念英语第一册 - 第35课程",
    content:
      "This is a photograph of our village. Our village is in a valley. It is between two hills. The village is on a river. Here is another photograph of the village. My wife and I are walking along the banks of the river. We are on the left. There is a boy in the water. He is swimming across the river. Here is another photograph. This is the school building. It is beside a park. The park is on the right. Some children are coming out of the building. Some of them are going into the park.",
    createdAt: 1752745941632,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第35课内容",
    wordCount: 97,
  },
  {
    id: 11100001137,
    uuid: "111000011037",
    title: "新概念英语第一册 - 第37课程",
    content:
      "You’re working hard, George. What are you doing? I’m making a bookcase. Give me that hammer please, Dan. Which hammer. This one? No, not that one. The big one. Here you are. Thanks, Dan. What are you going to do now, George? I’m going to paint it. What colour are you going to paint it? I’m going to paint it pink. Pink! This bookcase isn’t for me. It’s for my daughter, Susan. Pink’s her favorite colour.",
    createdAt: 1752745944297,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第37课内容",
    wordCount: 76,
  },
  {
    id: 11100001139,
    uuid: "111000011039",
    title: "新概念英语第一册 - 第39课程",
    content:
      "What are you going to do with that vase, Penny? I’m going to put it on this table, Sam. Don’t do that. Give it to me. What are you going to do with it? I’m going to put it here, in front of the window. Be careful. Don’t drop it! Don’t put it there, Sam. Put it here, on this shelf. There we are! It's a lovely vase. Those flowers are lovely, too.",
    createdAt: 1752745947227,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第39课内容",
    wordCount: 73,
  },
  {
    id: 11100001141,
    uuid: "111000011041",
    title: "新概念英语第一册 - 第41课程",
    content:
      "Is that bag heavy, Penny? Not very.  Here!  Put it on this chair.  What’s in it?  A piece of cheese.  A loaf of bread.  A bar of soap.  A bar of chocolate.  A bottle of milk.  A pound of sugar.  Half a pound of coffee.  A quarter of a pound of tea.  And a tin of tobacco.  Is that tin of tobacco for me?  Well, it’s certainly not for me!",
    createdAt: 1752745948862,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第41课内容",
    wordCount: 70,
  },
  {
    id: 11100001143,
    uuid: "111000011043",
    title: "新概念英语第一册 - 第43课程",
    content:
      "Can you make the tea, Sam? Yes, of course I can, Penny. Is there any water in this kettle(水壶)? Yes, there is. Where's the tea? It’s over there, behind the teapot. Can you see it? I can see the teapot, but I can't see the tea. There it is! It's in front of you. Ah yes, I can see it now. Where are the cups? There are some in the cupboard.Can you find them? Yes. Here they are. Hurry up, Sam. The kettle's boiling.",
    createdAt: 1752745956918,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第43课内容",
    wordCount: 84,
  },
  {
    id: 11100001145,
    uuid: "111000011045",
    title: "新概念英语第一册 - 第45课程",
    content:
      "THE BOSS: Can you come here a minute please, Bob? BOB: Yes, sir? THE BOSS: Where's Pamela? BOB: She's next door. She's in her office, sir. THE BOSS: Can she type this letter for me? Ask her please. BOB: Yes, sir. BOB: Can you type this letter for the boss please, Pamela? PAMELA: Yes, of course I can. BOB: Here you are. PAMELA: Thank you, Bob. PAMELA: Bob! BOB: Yes? What's the matter. PAMELA: I can't type this letter. PAMELA: I can't read it! The boss's handwriting is terrible!",
    createdAt: 1752745958601,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第45课内容",
    wordCount: 89,
  },
  {
    id: 11100001147,
    uuid: "111000011047",
    title: "新概念英语第一册 - 第47课程",
    content:
      "MRS YOUNG:        Do you like coffee, Mrs Price? MRS PRICE:        Yes, I do.MRS YOUNG:        Do you want a cup?MRS PRICE:        Yes, please. Mrs Young.MRS YOUNG:        Do you want any sugar?MRS PRICE:        Yes, please.MRS YOUNG:        Do you want any milk?MRS PRICE:        No, thank you. I don't like milk in my coffee. I like black coffee.MRS YOUNG:       Do you like biscuits?MRS PRICE:        Yes, I do.MRS YOUNG:        Do you want one?MRS PRICE:        Yes, please.",
    createdAt: 1752745960163,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第47课内容",
    wordCount: 71,
  },
  {
    id: 11100001149,
    uuid: "111000011049",
    title: "新概念英语第一册 - 第49课程",
    content:
      "BUTCHER: Do you want any meat today. Mrs. Bird?MRS.BIRD: Yes, please.BUTCHER: Do you want beef or lamb?MRS.BIRD: Beef, please.BUTCHER: This lamb's very good.MRS.BIRD: I like lamb, but my husband doesn't.BUTCHER: What about some steak? This is a nice piece.MRS.BIRD: Give me that piece, please.MRS.BIRD: And a pound of mince, too.BUTCHER: Do you want a chicken, Mrs. Bird? They 're very nice.MRS.BIRD: No, thank you.MRS.BIRD: My husband likes steak, but he doesn't like chicken.BUTCHER: To tell you the truth, Mrs. Bird, I don't like chicken either!",
    createdAt: 1752745960163,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第49课内容",
    wordCount: 71,
  },
  {
    id: 11100001151,
    uuid: "111000011051",
    title: "新概念英语第一册 - 第51课程",
    content:
      "HANS:                 Where do you come from? DIMITRI:            I come from Greece.HANS:                 What's the climate like in your country?DIMITRI:              It's very pleasant.Hans:                    What's the weather like in spring?DIMITRI:             It's often windy in March. It's always warm in April and May, but it rains sometimes.HANS:                  What's it like in summer?DIMITRI:             It's always hot in June, July and August. The sun shines every day.HANS:                Is it cold or warm in autumn?DIMITRI:             It's always warm in September and October. It's often cold in November and it rains sometimes.HANS:                  Is it very cold in winter?DIMITRI:             It's often cold in December, January and February. It snows sometimes.",
    createdAt: 1752745970082,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第51课内容",
    wordCount: 101,
  },
  {
    id: 11100001153,
    uuid: "111000011053",
    title: "新概念英语第一册 - 第53课程",
    content:
      "HANS:                  Where do you come from? JIM:                     I come from England. HANS:                  What's the climate like in your country? Jim:                      It's mild（温和的）, but it's not always pleasant. Jim:                      The weather's often cold in the North and windy in the East. It's often wet in the West and sometimes warm in the South. Hans:                    Which seasons do you like best? Jim:                      I like spring and summer. The days are long and the nights are short. The sun rises early and sets late.        I don't like autumn and winter.  The days are short and the nights are long. The sun rises late and sets early.  Our climate is not very good, but it's certainly interesting. It's our favorite subject of conversation.",
    createdAt: 1752745971708,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第53课内容",
    wordCount: 119,
  },
  {
    id: 11100001155,
    uuid: "111000011055",
    title: "新概念英语第一册 - 第55课程",
    content:
      "The Sawyers live at 87 King Street. In the morning, Mr Sawyer goes to work and the children go to school. Their father takes them to school every day.Mrs Sawyer stays at home every day. She does the housework. She always eats her lunch at noon.In the afternoon, she usually sees her friends. They often drink tea together. In the evening, the children come home from school. They arrive home early.Mr Sawyer comes home from work. He arrives home late. At night, the children always do their homework. Then they go to bed. Mr Sawyer usually reads his newspaper, but sometimes he and his wife watch television.",
    createdAt: 1752745973323,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第55课内容",
    wordCount: 107,
  },
  {
    id: 11100001157,
    uuid: "111000011057",
    title: "新概念英语第一册 - 第57课程",
    content:
      "It is eight o'clock.  The children go to school by car every day, but today, they are going to school on foot. It is ten o'clock.  Mrs Sawyer usually stays at home in the morning, but this morning, she is going to the shops.  It is four o’clock. In the afternoon, Mrs Sawyer usually drinks tea in the living-room, but this afternoon, she is drinking tea in the garden.It is six o’clock. In the evening, the children usually do their homework, but this evening, they are not doing their homework. At the moment, they are playing in the garden.It is nine o’clock, Mr. Sawyer usually reads his newspaper at night, but he is not reading his newspaper tonight. At the moment, he is reading an interesting book.",
    createdAt: 1752745979562,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第57课内容",
    wordCount: 127,
  },
  {
    id: 11100001159,
    uuid: "111000011059",
    title: "新概念英语第一册 - 第59课程",
    content:
      "LADY:            I want some envelopes please.STATIONER:       Do you want the large size, or the small size?LADY:            The large size please.LADY:           Do you have any writing-paper(信纸)?Stationer:        Yes, we do.Stationer:       I don't have any small pads.. I only have large ones. Do you want a pad(便签簿)?LADY:           Yes, please.LADY:           And I want some black ink and some glue.Stationer:       A bottler of ink and a bottle of glue.LADY:            And I want a large box of chalk, too.Stationer:        I only have small boxes. Do you want one?LADY:            No, thank you.Stationer:        Is that all?LADY:            That's all, thank you.Stationer:        What else do you want?LADY:            I want my change.",
    createdAt: 1752745981203,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第59课内容",
    wordCount: 101,
  },
  {
    id: 11100001161,
    uuid: "111000011061",
    title: "新概念英语第一册 - 第61课程",
    content:
      "MR WILLIANMS:        Where's Jimmy? MRS WILLIAMS:          He's in bed. MR WILLIAMS:               What's the matter with him? MRS WILLIAMS:          He feels ill. MR WILLIAMS:              He looks ill. MRS WILLIAMS:          We must call the doctor. MR WILLIAMS:              Yes, we must. MR WILLIAMS:              Can you remember the doctor's telephone number? MRS WILLIAMS:          Yes. It's 09754. DOCTOR:                    Open your mouth,  Jimmy. Show me your tongue. Say, 'Ah'. MR WILLIMAMS:              What's the matter with him, doctor? DOCTOR:                    He has a bad cold,      Mr Williams, so he must stay in bed for a week. MRS WILLIAMS:        That's good news for Jimmy. DOCTOR:                    Good news? Why? MR WILLIAMS:              Because he doesn't like school!",
    createdAt: 1752745982821,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第61课内容",
    wordCount: 106,
  },
  {
    id: 11100001163,
    uuid: "111000011063",
    title: "新概念英语第一册 - 第63课程",
    content:
      "DOCTOR:             How's Jimmy today? MRS WILLIAMS: He's better , thank you, doctor. DOCTOR:             Can I see him please, Mrs Williams? MRS WILLIAMS:       Certainly, doctor. Come upstairs. DOCTOR:             You look very well, Jimmy. You are better now, but you mustn't get up yet. You must stay in bed for another two days. DOCTOR:             The boy mustn't go to school yet,        Mrs Williams. And he mustn't eat rich food. Mrs Williams:         Does he have a temperature, doctor? Doctor:                 No, he doesn’t. MRS WILLIAMS:       Must he stay in bed? DOCTOR:             Yes. He must remain in bed for another two days. He can get up for about two hours each day, but you must keep the room warm. DOCTOR:             Where's Mr Williams this evening? MRS WILLIAMS:       He's in bed, doctor. Can you see him, please? He has a bad cold, too!",
    createdAt: 1752745984524,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第63课内容",
    wordCount: 137,
  },
  {
    id: 11100001165,
    uuid: "111000011065",
    title: "新概念英语第一册 - 第65课程",
    content:
      "FATHER:    What are you going to do this evening,  Jill? Jill:            I'm going to meet some friends, Dad. FATHER:        You mustn't come home late. You must be home at half past ten. Jill:         I can’t get home so early, Dad.Can I have the key to the front door, please? FATHER:        NO, you can't. MOTHER:    Betty's eighteen years old, Tom. She's not a baby. Give her the key. She always comes home early. FATHER:        Oh, all right! FATHER:   Here you are.   But you mustn't come home after a quarter past eleven. Do you hear? Jill:        Yes, Dad. Jill:        Thanks, Mum. MOTHER:       That's all right. Goodbye. Enjoy yourself! Jill:        We always enjoy ourselves, Mum. Bye, bye.",
    createdAt: 1752745987371,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第65课内容",
    wordCount: 114,
  },
  {
    id: 11100001167,
    uuid: "111000011067",
    title: "新概念英语第一册 - 第67课程",
    content:
      "MRS JOHNSON:Hello. Were you at the butcher's?  MRS WILLIAMS:Yes. I was. Were you at the butcher's ,too?  MRS JOHNSON:No, I wasn't. I was at the greengrocer's.  How's Jimmy today?  MRS WILLIAMS:He's very well, thank you.  MRS JOHNSON:Was he absent from school last week?  MRS WILLIAMS:Yes, he was. He was absent on Monday, Tuesday, Wednesday and Thursday. How are you all keeping? MRS JOHNSON:Very well, thank you. We’re going to spend three days in the country. We’re going to stay at my mother's for the week-end.  MRS WILLIAMS:Friday, Saturday and Sunday in the country! Aren't you lucky!",
    createdAt: 1752745992268,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第67课内容",
    wordCount: 104,
  },
  {
    id: 11100001169,
    uuid: "111000011069",
    title: "新概念英语第一册 - 第69课程",
    content:
      "There is a car race near our town every year. In 1995, there was a very big race.   There were hundreds of people there. My wife and I were at the race. Our friends, Julie and Jack were there, too. You can see us in the crowd. We are standing on the left.   There were twenty cars in the race. There were English cars, French cars, German cars, Italian cars, American cars and Japanese cars.   It was an exciting finish. The winner was Billy Stewart. He was in car number fifteen. Five other cars were just behind him.   On the way home, my wife said to me, “Don’t drive so quickly! You’re not Billy Stewart!”",
    createdAt: 1752745996736,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第69课内容",
    wordCount: 115,
  },
  {
    id: 11100001171,
    uuid: "111000011071",
    title: "新概念英语第一册 - 第71课程",
    content:
      "Jane : What's Ron Marston like , Pauline ? Pauline :  He's awful ! He telephoned me four times yesterday , and three times the day before yesterday.  Pauline:    He telephoned the office yesterday morning and yesterday afternoon. My boss answered the telephone .  Jane : What did your boss say to him ?  Pauline:    He said ,\"Pauline is typing letters .She can't speak to you now !\" Pauline :  Then I arrived home at six o'clock yesterday evening .He telephoned again .But I didn't answer the phone !  Jane : Did he telephone again last night ?  Pauline :  Yes , he did . He telephoned at nine o'clock .  Jane : What did you say to him ?  Pauline :  I said ,”This is Pauline 's mother . Please don't telephone my daughter again !”  Jane :  Did he telephone again ?  Pauline :  No , he didn't !",
    createdAt: 1752746002811,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第71课内容",
    wordCount: 151,
  },
  {
    id: 11100001173,
    uuid: "111000011073",
    title: "新概念英语第一册 - 第73课程",
    content:
      "Last week Mrs Mills went to London. She does not know London very well, and she lost her way.  Suddenly, she saw a man near a bus-stop. “ I can ask him the way.” She said to herself.  “Excuse me,” she said.  “Can you tell me the way to King Street please?”  The man smiled pleasantly. He did not understand English!  He spoke German. He was a tourist.  Then he put his hand into his pocket, and took out a phrase-book.  He opened the book and found a phrase. He read the phrase slowly.   “I am sorry,” he said. “ I do not speak English.”",
    createdAt: 1752746004520,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第73课内容",
    wordCount: 105,
  },
  {
    id: 11100001175,
    uuid: "111000011075",
    title: "新概念英语第一册 - 第75课程",
    content:
      "LADY : Have you any shoes like these?SALESMAN: What size?Lady: Size five.Salesman: What colour?Lady: Black.Salesman: I’m sorry. We don't have it.Lady: But my sister bought this pair last month.Salesman: Did she buy them here?Lady: No, she bought them in the U.S.Salesman: We had some shoes like those a month ago, but we haven’t any now.Lady: Can you get a pair for me please?Salesman: I’m afraid that I can’t. They were in fashion last year and the year before last.But they’re not in fashion this year.Salesman: These shoes are in fashion now.Lady: They look very uncomfortable.Salesman: They are very uncomfortable. But women always wear uncomfortable shoes!",
    createdAt: 1752746004520,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第75课内容",
    wordCount: 105,
  },
  {
    id: 11100001177,
    uuid: "111000011077",
    title: "新概念英语第一册 - 第77课程",
    content:
      "Nurse:            Good morning, Mr Croft.  Mr Croft:        Good morning, nurse. I want to see the dentist, please. Nurse:            Have you an appointment?（有预约吗？） Mr Croft:        No, I haven't . Nurse:          Is it urgent? Mr Croft:        Yes, it is . It's very urgent. I feel awful. I have a terrible toothache. Nurse:           Can you come at 10 am on Monday, April 24th? Mr Croft:        I must see the dentist now, nurse. Nurse:           The dentist is very busy at the moment. Can you come at 2:00 PM? Mr Croft:        That's very late. Can't the dentist see me now? Nurse:            I'm afraid that he can't , Mr Croft. Can't you wait till this afternoon? Mr Croft:       I can wait, but my toothache can't !",
    createdAt: 1752746013551,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第77课内容",
    wordCount: 120,
  },
  {
    id: 11100001179,
    uuid: "111000011079",
    title: "新概念英语第一册 - 第79课程",
    content:
      "Tom:       What are you doing, Peggy?  Peggy:     I'm making a shopping-list, Tom. Tom:       What do we need? Peggy:    We need a lot of things this week. Peggy:     I must go to the grocer's. We haven't got much tea or coffee, and we haven't got any sugar or jam. Tom:       What about vegetables? Peggy:     I must go to the greengrocer's. We haven't got many tomatoes, but we've got a lot of potatoes. Peggy:    I must go to the butcher's, too. We need some meat. We haven't got any meat at all. Tom:       Have we got any beer and wine? Peggy:     No, we haven't. And I'm not going to get any! Tom:       I hope that you've got some money. Peggy:     I haven't got much. Tom:       Well, I haven't got much either!",
    createdAt: 1752746017198,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第79课内容",
    wordCount: 129,
  },
  {
    id: 11100001181,
    uuid: "111000011081",
    title: "新概念英语第一册 - 第81课程",
    content:
      "John:       Hullo, Peggy! Where's Tom?  Peggy:     He's upstairs. He's having a bath.  Peggy:     Tom!  Tom:       Yes?  Peggy:     John's here.  Tom:       I'm nearly ready.  Tom:       Hullo, John. Have a cigarette.  John:       No thanks, Tom.  Tom:       Have a glass of whisky then.  John:       O.K. Thanks.  Tom:       Is dinner ready, Peggy?  Peggy:     It's nearly ready. We can have dinner at seven o'clock.  Tom:      John and I had lunch together today. We went to a restaurant.  Peggy:     What did you have?  Tom:       We had roast beef and potatoes.  Peggy:     Oh!  Tom:       What's the matter, Peggy?  Peggy:     Well, you're going to have roast beef and potatoes again tonight!",
    createdAt: 1752746018834,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第81课内容",
    wordCount: 103,
  },
  {
    id: 11100001183,
    uuid: "111000011083",
    title: "新概念英语第一册 - 第83课程",
    content:
      "Peggy:     Hello, John. Come in.  Tom:       Hello, John. We're having lunch. Do you want to have lunch with us?John:       No thank you, Tom. I've already had lunch. I had lunch at half past twelve.Peggy:     Have a cup of coffee then.John:       I've just had a cup, thank you. I had one after my lunch.Tom:       Let's go into the living-room, Peggy. We can have our coffee there.Peggy:       Excuse the mess, John. This room's very untidy. We're packing our suitcases. We're going to leave tomorrow. Tom and I are going to have a holiday.John:       Aren't you lucky!Tom:       When are you going to have a holiday, John?John:       I don't know. I've already had my holiday this year.Peggy:     Where did you go?John:       I stayed at home!",
    createdAt: 1752746023654,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第83课内容",
    wordCount: 121,
  },
  {
    id: 11100001185,
    uuid: "111000011085",
    title: "新概念英语第一册 - 第85课程",
    content:
      "George: Hullo, Ken.Ken: Hullo, George.George: Have you just been to the cinema?Ken: Yes, I have.George: What's on?Ken: “Paris in the Spring”.George: Oh, I've already seen it. I saw it on a B.B.C. television programme last year. It's an old film, but it's very good.Ken: Paris is a beautiful city.George: I have never been there. Have you ever been there, Ken?Ken: Yes, I have. I was there in April.George: Paris in the spring, eh?Ken: It was spring, but the weather was awful. It rained all the time.George: Just like dear old London!",
    createdAt: 1752746023654,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第85课内容",
    wordCount: 121,
  },
  {
    id: 11100001187,
    uuid: "111000011087",
    title: "新概念英语第一册 - 第87课程",
    content:
      "Mr Wood:       Is my car ready yet?  Attendant:       I don't know, sir.  What's the licence number of your car?Mr Wood:     It's LFZ 312 G.Attendant:     When did you bring it to us?Mr Wood:       I brought it here three days ago.Attendant:     Ah yes, I remember now.Mr Wood:     Have your mechanics finished yet?Attendant:     No, they're still working on it. Let's go into the garage and have a look at it.Attendant:     Isn't that your car?Mr Wood:     Well, it was my car.Attendant:     Didn't you have a crash?Mr Wood:     That's right. She drove it into a lamp post（电线杆）. Can your mechanics repair it?Attendant:     Well, they're trying to repair it, sir. But to tell you the truth, you need a new car.",
    createdAt: 1752746036888,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第87课内容",
    wordCount: 115,
  },
  {
    id: 11100001189,
    uuid: "111000011089",
    title: "新概念英语第一册 - 第89课程",
    content:
      "Mr Hill:      Good afternoon. I believe that this house is for sale（待售）. Mr West:      That's right. Mr Hill:      May I have a look at it please? Mr West:      Yes, of course. Come in. Mr Hill:      How long have you lived here? Mr West:      I have lived here for twenty years. Mr Hill:      Twenty years! That's a long time. Mr West:      Yes, I have been here since 1947. Mr Hill:      Then why do you want to sell it? Mr West:      Because I have just retired. I want to buy a small house in the country. Mr Hill:      How much does this house cost? Mr West:      £6850. Mr Hill:      That's a lot of money! Mr West:      It's worth every penny of it. Mr Hill:      Well, I like the house, but I can't decide yet. My wife must see it first. Mr West:      Women always have the last word.",
    createdAt: 1752746038714,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第89课内容",
    wordCount: 146,
  },
  {
    id: 11100001191,
    uuid: "111000011091",
    title: "新概念英语第一册 - 第91课程",
    content:
      "Mrs Smith:     Has Mr West sold his house yet?  Mrs Brown:     Yes, he has. He sold it last week.  Mrs Smith:     Has he moved to his new house yet? Mrs Brown:     No, not yet. He's still here. He's going to move tomorrow. Mrs Smith:     When? Tomorrow morning? Mrs Brown:     No. Tomorrow afternoon. I'll miss him. He has always been a good neighbour. Mrs Green:     He's a very nice person. We shall all miss him. Mrs Smith;     When will the new people move into this house? Mrs Brown:    I think that they will move in the day after tomorrow. Mrs Green:     Will you see Mr West today, Mrs Brown? Mrs Brown:     Yes, I will. Mrs Green:     Please give him my regards. （give one's regards to sb.向sb.问候） Mr Smith:     Poor Mr West! He didn't want to leave this house. Mrs Brown:     No, he didn't want to leave, but his wife did!",
    createdAt: 1752746040458,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第91课内容",
    wordCount: 149,
  },
  {
    id: 11100001193,
    uuid: "111000011093",
    title: "新概念英语第一册 - 第93课程",
    content:
      "Mr Hill is our new next-door neighbour. He's a pilot.  He was in the R.A.F.(皇家空军) He will fly to New York next month. The month after next he will fly to Tokyo. At the moment（现在）,  he's in Madrid. He flew to Spain a week ago. He will return to London the week after next. He's only forty-one years old, and he has already been to nearly every country in the world. Mr Hill is a very lucky man. But his wife isn't very lucky. She usually stays at home!",
    createdAt: 1752746042301,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第93课内容",
    wordCount: 89,
  },
  {
    id: 11100001195,
    uuid: "111000011095",
    title: "新概念英语第一册 - 第95课程",
    content:
      "George:        Two return tickets to London please. What time will the next train leave? Attendant:     At nineteen minutes past eight. George:        Which platform? Attendant:     Platform Two. Over the bridge. Ken:           What time will the next train leave? George:        At eight nineteen. Ken:           We've got plenty of time. George:        It's only three minutes to eight.  Ken:           Let's go and have a drink. There's a bar next door to the station. George:        We had better go back to the station now, Ken. Porter:        Tickets please. George:        We want to catch the eight nineteen to London. Porter:        You've just missed it! George:        What! It's only eight fifteen. Porter:        I'm sorry, sir. That clock's ten minutes slow. George:        When's the next train? Porter:        In five hours' time!",
    createdAt: 1752746049784,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第95课内容",
    wordCount: 123,
  },
  {
    id: 11100001197,
    uuid: "111000011097",
    title: "新概念英语第一册 - 第97课程",
    content:
      "Mr Hall:     I left a suitcase on the train to London the other day.  Attendant:  Can you describe it, sir?  Mr Hall:   It's a small blue case and it's got a zip. There's a label on the handle with my name and address on it.  Attendant: Is this case yours?  Mr Hall:   No, that's not mine.  Attendant:     What about this one? This one's got a label.  Mr Hall:        Let me see it.  Attendant:     What's you name and address?   Mr Hall:      David Hall,83, Bridge Street.  Attendant:    That's right. D.N.Hall.83.Bridge Street.  Attendant:       Three pound and fifty pence please.  Mr Hall:          Here you are.  Attendant:       Thank you.  Mr Hall:          Hey!  Attendant:       What's the matter?  Mr Hall:          This case doesn't belong to me! You've given me the wrong case!",
    createdAt: 1752746051379,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第97课内容",
    wordCount: 125,
  },
  {
    id: 11100001199,
    uuid: "111000011099",
    title: "新概念英语第一册 - 第99课程",
    content:
      "Ted :              Ow!  Pat:                What's the matter, Ted? Ted:              I slipped and fell downstairs. Pat:                Have you hurt yourself? Ted:               Yes, I have. I think that I've hurt my back. Pat:                Try and stand up. Can you stand up?Here. Let me help you. Ted:               I'm sorry, Pat. I'm afraid that I can't get up. Pat:                I think that the doctor had better see you. I'll telephone Dr Carter. Pat:               The doctor says that he will come at once. I'm sure that you need an X-ray, Ted.",
    createdAt: 1752746053011,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第99课内容",
    wordCount: 86,
  },
  {
    id: 111000011101,
    uuid: "111000011101",
    title: "新概念英语第一册 - 第101课程",
    content:
      "Grandmother:  Read Jimmy's card to me please, Mary. Mary:         “I have just arrived in Scotland and I'm staying at a Youth Hostel.”Grandmother:  Eh?Mary:         He says he's just arrived in Scotland.  He says he's staying at a Youth Hostel.You know he's a member of the Y.H.A.Grandmother:         The what?Mary:                    The Y.H.A., mother. The Youth Hostel's Association.Grandmother:         What else does he say?Mary:                    “I'll write a letter soon. I hope you are all well.”Grandmother:         What? Speak up, Mary. I'm afraid I can't hear you.Mary:                    He says he'll write a letter soon. He hopes we are all well. “ Love, Jimmy.”Grandmother:         Is that all? He doesn't say very much, does he?Mary:                    He can't write very much on a card, mother.",
    createdAt: 1752746057323,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第101课内容",
    wordCount: 115,
  },
  {
    id: 111000011103,
    uuid: "111000011103",
    title: "新概念英语第一册 - 第103课程",
    content:
      "Harry:     How was the examination, Dick?  Dick:       Not too bad. I think I passed in English and Mathematics. The questions were very easy. How about you, Harry?Harry:     The English and Maths papers weren't easy enough for me. I hope I haven't failed.Dick:       I think I failed the Intelligence Test. I could answer sixteen of the questions. They were very easy. But I couldn't answer the rest.  They were too difficult for me.Harry:       Intelligence tests are awful, aren't they?Dick:       I hate them. I'm sure I've got a low I.Q.Harry:     Oh, cheer up（振作点）! Perhaps we didn't do too badly. The guy next to me wrote his name at the top of the paper.Dick:       Yes?Harry:     Then he sat there and looked at it for three hours! He didn't write a word!",
    createdAt: 1752746058899,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第103课内容",
    wordCount: 128,
  },
  {
    id: 111000011105,
    uuid: "111000011105",
    title: "新概念英语第一册 - 第105课程",
    content:
      "The Boss:     Where's Miss Simpson, Bob? I want her.  Bob:          Do you want to speak to her, sir? The Boss:     Yes, I do. I want her to come to my office. Tell her to come at once. Miss Simpson: Did you want to see me, sir? The Boss:     Ah, yes, Miss Simpson. How do you spell“ intelligent”? Can you tell me? Miss Simpson: I-N-T-E-L-L-I-G-E-N-T. The Boss:     That's right. You've typed it with only one “L”. This letter's full of mistakes. I want you to type it again. Miss Simpson: Yes, I'll do that. I'm sorry about that. The Boss:     And here's a little present for you. Miss Simpson: What is it? The Boss:     It's a dictionary. I hope it will help you.",
    createdAt: 1752746060878,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第105课内容",
    wordCount: 122,
  },
  {
    id: 111000011107,
    uuid: "111000011107",
    title: "新概念英语第一册 - 第107课程",
    content:
      "Assistant:        Do you like this dress, madam?   Lady:             I like the colour very much. It's a lovely dress, but it's too small for me.  Assistant:        What about this one? It's a lovely dress. It's very smart.Short skirts are in fashion now. Would you like to try it?  Lady:             All right.  Lady:             I'm afraid this green dress is too small for me as well. It's smaller than the blue one.  Lady:             I don't like the colour either. It doesn't suit me at all. I think the blue dress is prettier.  Lady:             Could you show me another blue dress?I want a dress like that one, but it must be my size.  Assistant:        I'm afraid I haven't got a larger dress. This is the largest dress in the shop.",
    createdAt: 1752746062858,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第107课内容",
    wordCount: 126,
  },
  {
    id: 111000011109,
    uuid: "111000011109",
    title: "新概念英语第一册 - 第109课程",
    content:
      "Betty:      Shall I make some coffee, Jane? Jane:       That's a good idea, Betty. Betty:      It's ready. Do you want any milk? Jane:       Just a little please. Betty:      What about some sugar? Two teaspoonfuls? Jane:       No, less than that. One and a half teaspoonfuls please. That's enough for me. Jane:       That was very nice. Betty:      Would you like some more? Jane:       Yes, please. Jane:       I'd like a cigarette, too. May I have one? Betty:      Of course. I think there are a few in that box. Jane:       I'm afraid it's empty. Betty:      What a pity!（真遗憾） Jane:       It doesn't matter. Betty:      Have a biscuit instead. Eat more and smoke less! Jane:       That's very good advice!",
    createdAt: 1752746069270,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第109课内容",
    wordCount: 112,
  },
  {
    id: 111000011111,
    uuid: "111000011111",
    title: "新概念英语第一册 - 第111课程",
    content:
      "Mr Frith:        I like this TV very much. How much does it cost please? Assistant:        It's the most expensive model in the shop. It costs 500 pounds. Mrs Frith:       That's too expensive for us. We can't afford all that money. Assistant:        This model's less expensive than that one. It's only 300 pounds.But, of course, it's not as good as the expensive one.  Mr Frith:        I don't like this model.The other model's more expensive, but it's worth the money. Mr Frith:        Can we buy it on instalments?(分期付款) Assistant:   Of course.  You can pay a deposit（保证金） of ten pounds, and then one pound a week for sixty weeks. Mr Frith:        Do you like it, dear? Mrs Frith:       I certainly do, but I don't like the price. You always want the best, but we can't afford it. Sometimes you think you're a millionaire! Mr Frith:        Millionaires don't buy things on instalments!",
    createdAt: 1752746070951,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第111课内容",
    wordCount: 148,
  },
  {
    id: 111000011113,
    uuid: "111000011113",
    title: "新概念英语第一册 - 第113课程",
    content:
      "Conductor:       Fares please! Man:             Trafalgar Square please. Conductor:       I'm sorry, sir. I can't change a pound note. Haven't you got any small change? Man:             I've got no small change, I'm afraid. Conductor:       I'll ask some of the passengers. Conductor:       Have you any small change, sir? 1st Passenger:   I'm sorry. I've got none. 2ndPassenger:    I haven't got any either. Conductor:       Can you change this pound note, madam? 3rd Passenger:   I'm afraid I can't. 4th Passenger:   Neither can I. Conductor:       I'm very sorry, sir. You must get off the bus.None of our passengers can change this note. They're all millionaires! Two Tramps:      Except us, conductor. 1st Tramp:       I've got some small change. 2nd Tramp:       So have I.",
    createdAt: 1752746072587,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第113课内容",
    wordCount: 115,
  },
  {
    id: 111000011115,
    uuid: "111000011115",
    title: "新概念英语第一册 - 第115课程",
    content:
      "Helen:      Isn't there anyone at home? Jim:        I'll knock again, Helen. Everything's very quiet. I'm sure there's no one at home. Helen:      But that's impossible. Karol and Tom invited us to lunch. Look through the window. Helen:      Can you see anything? Jim:        Nothing at all. Helen:      Let's try the back door. Jim:        Look! Everyone's in the garden. Pat:         Hello, Helen. Hullo, Jim. Tom:       Everybody wants to have lunch in the garden. It's nice and warm out here. Pat:         Come and have something to drink. Jim:       Thanks, Karol . May I have a glass of bear please? Pat:         Beer? There's none left. You can have some lemonade. (柠檬水) Jim:        Lemonade! Tom:       Don't believe her, Jim. She's only joking. Have some beer!",
    createdAt: 1752746074216,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第115课内容",
    wordCount: 120,
  },
  {
    id: 111000011117,
    uuid: "111000011117",
    title: "新概念英语第一册 - 第117课程",
    content:
      "When my husband was going into the dining-room this morning , he dropped some coins on the floor.There were coins everywhere. We looked for them, but we could not find them all.While we were having breakfast, our little boy, Tommy, found two small coins on the floor.He put them both into his mouth. We both tried to get the coins, but it was too late. Tommy had already swallowed them!Later that morning, when I was doing the housework, my husband telephoned me from the office.“How's Tommy?” he asked.“I don't know,” I answered, “Tommy's been to the lavatory three times this morning, but I haven't had any change yet!”",
    createdAt: 1752746080635,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第117课内容",
    wordCount: 108,
  },
  {
    id: 111000011119,
    uuid: "111000011119",
    title: "新概念英语第一册 - 第119课程",
    content:
      "Do you like stories? I want to tell you a true story. It happened to a friend of mine a year ago.While my friend, George, was reading in bed, two thieves climbed into his kitchen. After they had entered the house, they went into the dining-room. It was very dark, so they turned on a torch. Suddenly, they heard a voice behind them. “What's up? What's up?”(什么事) someone called. The thieves dropped the torch and ran away as quickly as they could.George heard the noise and came downstairs quickly. He turned on the light, but he couldn't see anyone. The thieves had already gone. But George's parrot, Henry, was still there.“What's up, George?” he called. “Nothing, Henry,” George said and smiled. “Go back to sleep.”",
    createdAt: 1752746082233,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第119课内容",
    wordCount: 125,
  },
  {
    id: 111000011121,
    uuid: "111000011121",
    title: "新概念英语第一册 - 第121课程",
    content:
      "Customer:       I bought two expensive dictionaries here half an hour ago, but I forgot to take them with me. Manager:   Who served you, sir? Customer:   The lady who is standing behind the counter. Manager:   Which books did you buy? Customer:   The books which are on the counter. Manager:   Did you serve this gentleman half an hour ago, Miss Roberts?He says he's the man who bought these books. Miss Roberts:  I can't remember, sir. The man whom I served was wearing a hat. Manager:   Have you got a hat, sir? Customer:   Yes, I have. Manager:   Would you put it on, please? Customer:   All right. Manager:        Is this the man that you served, Miss Roberts? Miss Roberts:   Yes, sir. I recognize him now.",
    createdAt: 1752746083821,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第121课内容",
    wordCount: 121,
  },
  {
    id: 111000011123,
    uuid: "111000011123",
    title: "新概念英语第一册 - 第123课程",
    content:
      "Bill:    Look, Bob. This is a photograph I took during my trip to Australia.  Bob:   Let me see it, Bill. Bob:    This is a good photograph. Who are these people? Bill:   They're people I met during the trip. Bill:   That's the ship we traveled on. Bob:    What a beautiful ship! Bob:   Who's this? Bill:   That's the man I told you about. Remember? Bob:   Ah yes. The one who offered you a job in Australia. Bill:   That's right. Bob:   Who's this?Bill:   Guess! Bob:   It's not you, is it? Bill:   That's right. Bill:   I grew a beard during the trip, but I shaved it off when I came home. Bob:   Why did you shave it off? Bill:   My wife didn't like it!",
    createdAt: 1752746090244,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第123课内容",
    wordCount: 120,
  },
  {
    id: 111000011125,
    uuid: "111000011125",
    title: "新概念英语第一册 - 第125课程",
    content:
      "Susan:   Can't you come in and have tea now, Peter?   Peter:   Not yet, dear. I must water the garden first. Susan:   Do you have to water it now? Peter:   I'm afraid I must. Look at it!   It's terribly dry. Susan:   What a nuisance!（真讨厌） Peter:   Last summer it was very dry, too. Don't you remember? I had to water it every day. Susan:   Well, I'll have tea by myself. Susan:   That was quick! Have you finished already? Peter:   Yes, dear. Look out of the window. Susan:   Good heaven! It's raining. That means you needn't water the garden. Peter:   That was a pleasant surprise. It means I can have tea, instead.",
    createdAt: 1752746091898,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第125课内容",
    wordCount: 109,
  },
  {
    id: 111000011127,
    uuid: "111000011127",
    title: "新概念英语第一册 - 第127课程",
    content:
      "Kate:   Can you recognize that woman, Millie? Millie: I think I can, Kate. It must be Karen Marsh, the actress. Kate:   I thought so. Who's that beside her? Millie: That must be Conrad Reeves. Kate:   Conrad Reeves, the actor? It can't be. Let me have another look. I think you're right! Isn't he her third husband? Millie: No, He must be her fourth or fifth. Kate:  Doesn't Karen Marsh look old! Millie:   She does, doesn't she! I read she's twenty-nine, but she must be at least forty. Kate:     I'm sure she is. Millie:   She was a famous actress when I was still a schoolgirl. Kate:     That was a long time ago, wasn't it? Millie:   Not that long ago! I'm not more than twenty-nine myself.",
    createdAt: 1752746093500,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第127课内容",
    wordCount: 124,
  },
  {
    id: 111000011129,
    uuid: "111000011129",
    title: "新概念英语第一册 - 第129课程",
    content:
      "Ann:        Look, Harry! That policeman's waving to you. He wants you to stop. Policeman:  Where do you think you are? On a race track?You must have been driving at seventy miles an hour. Harry:      I can't have been. Policeman:  I was doing eighty when I overtook you. Policeman:  Didn't you see the speed limit? Harry:      I'm afraid I didn't, officer. I must have been dreaming . Ann:        He wasn't dreaming, officer. I was telling him to drive slowly. Harry:      That's why I didn't see the sign. Policeman:  Let me see your driving-license and your insurance certificate. Policeman:  I won't charge you this time. But you'd better not do it again! Harry:      Thank you. I'll certainly be more careful. Ann:        I told you to drive slowly, Harry. Harry:      You always tell me to drive slowly, darling. Ann:        Well, next time you'd better take my advice!",
    createdAt: 1752746097062,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第129课内容",
    wordCount: 144,
  },
  {
    id: 111000011131,
    uuid: "111000011131",
    title: "新概念英语第一册 - 第131课程",
    content:
      "Roy:     Where are you going to spend your holidays this year, Harry?  Harry:   We may go abroad. I'm not sure. My wife wants to go to Egypt.I'd like to go there, too. We can't make up our minds. Roy:     Will you travel by sea or by air? Harry:   We may travel by sea. Roy:     It's cheaper, isn't it? Harry:   It may be cheaper, but it takes a long time. Roy:     I'm sure you will enjoy yourselves. Harry:   Don't be so sure. We may not go anywhere. My wife always worries too much. Who's going to look after the dog? Who's going to look after the house?Who's going to look after the garden?We have this problem every year.In the end, we stay at home and look after everything!",
    createdAt: 1752746101687,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第131课内容",
    wordCount: 127,
  },
  {
    id: 111000011133,
    uuid: "111000011133",
    title: "新概念英语第一册 - 第133课程",
    content:
      "Reporter:      Have you just made a new film, Miss Marsh? Miss Marsh:    Yes, I have.Reporter:      Are you going to make another?Miss Marsh:    No, I'm not. I'm going to retire. I feel very tired. I don't want to make another film for a long time.Kate:          let's buy a newspaper, Millie. Listen to this!“ Karen Marsh: Sensational News!（轰动新闻） By our reporter, Alan Jones. Miss Karen Marsh arrived at London Airport today. She was wearing a blue dress and a mink coat. She told me she had just made a new film. She said she was not going to make another.  She said she was going to retire. She told reporters she felt very tired and didn't want to make another film for a long time.”Millie:        Well, fancy that, Kate!",
    createdAt: 1752746103340,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第133课内容",
    wordCount: 127,
  },
  {
    id: 111000011135,
    uuid: "111000011135",
    title: "新概念英语第一册 - 第135课程",
    content:
      "Reporter:        Are you really going to retire, Miss marsh? Miss Marsh:    I may. I can't make up my mind. I shall have to ask my future husband. He won't let me make another film.Reporter:        Your future husband, Miss Marsh?Miss Marsh:   Yes. Let me introduce him to you. His name is Carlos. We are going to get married next week.Kate:             Look, Millie!    Here's another report about Karen Marsh. Listen:\"Karen Marsh: The Latest. At her London Hotel today Miss Marsh told reporters she might retire. She said she couldn't make up her mind. She said she would have to ask her future husband. She said her future husband would not let her make another film. Then she introduced us to Carlos and told us they would get married next week.\"Millie:             That's sensational news, isn't it, Kate? Kate:It certainly is. He'll be her sixth husband!Reporter:        Your future husband, Miss Marsh?Miss Marsh:   Yes. Let me introduce him to you. His name is Carlos. We are going to get married next week.Kate:             Look, Millie!    Here's another report about Karen Marsh. Listen:“ Karen Marsh: The Latest. At her London Hotel today Miss Marsh told reporters she might retire. She said she couldn't make up her mind. She said she would have to ask her future husband. She said her future husband would not let her make another film. Then she introduced us to Carlos and told us they would get married next week.”Millie:             That's sensational news, isn't it, Kate? Kate:It certainly is. He'll be her sixth husband!",
    createdAt: 1752746106726,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第135课内容",
    wordCount: 251,
  },
  {
    id: 111000011137,
    uuid: "111000011137",
    title: "新概念英语第一册 - 第137课程",
    content:
      "June:    Are you doing the football pools(赌注), Brian?Brian:   Yes, I've nearly finished, June. I'm sure we will win something this week.June:   You always say that, but we never win anything! What will you do if you win a lot of money?Brian:    If I win a lot of money , I shall buy you a mink coat.June:    I don't want  a mink coat! I want to see the world.（见世面）Brian:   All right. If we win a lot of money, we shall travel around the world and we shall stay at the best hotels. Then we shall return home and buy a big house in the country. We shall have a beautiful garden and…June:   But if we spend all that money we shall be poor again. What shall we do then?Brian:    If we spend all the money, we shall try and win the football pools again.June:   It's a pleasant dream, but everything depends on “if”!",
    createdAt: 1752746111886,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第137课内容",
    wordCount: 152,
  },
  {
    id: 111000011139,
    uuid: "111000011139",
    title: "新概念英语第一册 - 第139课程",
    content:
      "Mr Grimes:     Is that you, John?  John Smith:   Yes, speaking. Mr Grimes:   Tell Mary we shall be late for dinner this evening. John Smith:   I'm afraid I don't understand. Mr Grimes:   Hasn't Mary told you? She invited betty and me to dinner this evening. I said I would be at your house at six o'clock, but the boss wants me to do some extra work. I'll have to stay at the office. I don't know when I shall finish. Oh, and by the way, my wife wants to know if Mary needs any help. John Smith:    I don't know what you're talking about. Mr Grimes:        That is John Smith, isn't it? John Smith:       Yes, I'm John Smith. Mr Grimes:       You are John Smith, the engineer, aren't you? John Smith:       That's right. Mr Grimes:       You work for the Overseas Engineering Company, don't you? John Smith:    No, I don't. I'm John Smith the telephone engineer and I'm repairing your telephone line.",
    createdAt: 1752746113485,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第139课内容",
    wordCount: 159,
  },
  {
    id: 111000011141,
    uuid: "111000011141",
    title: "新概念英语第一册 - 第141课程",
    content:
      "Last week, my four year old daughter, Sally, was invited to a children's party. I decided to take her by train. Sally was very excited because she had never traveled on a train before. She sat near the window and asked questions about everything she saw. Suddenly, a middle-aged lady got on the train and sat opposite Sally.“Hull, little girl.” She said. Sally did not answer, but looked at her curiously.The lady was dressed in a blue coat and a large, funny hat. After the train had left the station, the lady opened her handbag and took out her powder compact(粉盒). She then began to make up her face.“Why are you doing that?” Sally asked.“To make myself beautiful,” the lady answered. She put away her compact and smiled kindly.“But you are still ugly.” Sally said. Sally was amused, but I was very embarrassed!",
    createdAt: 1752746117199,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第141课内容",
    wordCount: 144,
  },
  {
    id: 111000011143,
    uuid: "111000011143",
    title: "新概念英语第一册 - 第143课程",
    content:
      "I live in a very old town which is surrounded by beautiful woods. It is a famous beauty spot. On Sundays, hundreds of people come from the city to see our town and to walk through the woods. Visitors have been asked to keep the woods clean and tidy. Litter baskets have been placed under the trees, but people still throw their rubbish everywhere. Last Wednesday, I went for a walk in the woods. What I saw made me very sad. I counted seven old cars and three old refrigerators. The little baskets were empty and the ground was covered with pieces of paper, cigarette ends, old tyres, empty bottles and rusty tins. Among the rubbish, I found a sign which said, 'Anyone who leaves litter in these woods will be prosecuted!'",
    createdAt: 1752746123618,
    isOfficial: true,
    category: "新概念英语第一册",
    difficulty: "easy",
    description: "新概念英语第一册第143课内容",
    wordCount: 132,
  },
];

// 合并所有官方文章
export const officialArticles: OfficialArticle[] = [
  ...englishLearningArticles,
  ...techArticles,
  ...businessArticles,
  ...conversationArticles,
  ...nce1Articles,
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
