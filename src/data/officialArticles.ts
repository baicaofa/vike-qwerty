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
  "新概念英语第一册",
  "新概念英语第二册",
  "新概念英语第三册",
  "新概念英语第四册",
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
// 新概念英语第二册
const nce2Articles: OfficialArticle[] = [
  {
    id: 1120000001,
    uuid: "11200001001",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c1\u8bfe\u7a0b",
    content:
      "Last week I went to the theatre. I had a very good seat. The play was very interesting. I did not enjoy it. A young man and a young woman were sitting behind me. They were talking loudly. I got very angry. I could not hear the actors. I turned round. I looked at the man and the woman angrily. They did not pay any attention. In the end, I could not bear it. I turned round again. \u2018I can't hear a word!' I said angrily. \u2018It's none of your business, ' the young man said rudely. \u2018This is a private conversation!'",
    createdAt: 1752834772044,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c1\u8bfe\u5185\u5bb9",
    wordCount: 102,
  },
  {
    id: 1120000002,
    uuid: "11200001002",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c2\u8bfe\u7a0b",
    content:
      "It was Sunday. I never get up early on Sundays. I sometimes stay in bed until lunchtime. Last Sunday I got up very late. I looked out of the window. It was dark outside. 'What a day!' I thought. 'It's raining again. ' Just then, the telephone rang. It was my aunt Lucy. 'I've just arrived by train, ' she said. 'I'm coming to see you. ''But I'm still having breakfast, ' I said. 'What are you doing?' she asked. 'I'm having breakfast, ' I repeated. 'Dear me, ' she said. 'Do you always get up so late? It's one o'clock!'",
    createdAt: 1752834773117,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c2\u8bfe\u5185\u5bb9",
    wordCount: 101,
  },
  {
    id: 1120000003,
    uuid: "11200001003",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c3\u8bfe\u7a0b",
    content:
      "Postcards always spoil my holidays. Last summer, I went to Italy. I visited museums and sat in public gardens. A friendly waiter taught me a few words of Italian. Then he lent me a book. I read a few lines, but I did not understand a word. Every day I thought about postcards. My holidays passed quickly, but I did not send cards to my friends. On the last day I made a big decision. I got up early and bought thirty-seven cards. I spent the whole day in my room, but I did not write a single card!",
    createdAt: 1752834774206,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c3\u8bfe\u5185\u5bb9",
    wordCount: 99,
  },
  {
    id: 1120000004,
    uuid: "11200001004",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c4\u8bfe\u7a0b",
    content:
      "I have just received a letter from my brother, Tim. He is in Australia. He has been there for six months. Tim is an engineer. He is working for a big firm and he has already visited a great number of different places in Australia. He has just bought an Australian car and has gone to Alice Springs, a small town in the centre of Australia. He will soon visit Darwin From there, he will fly to Perth. My brother has never been abroad before, so he is finding this trip very exciting.",
    createdAt: 1752834775287,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c4\u8bfe\u5185\u5bb9",
    wordCount: 93,
  },
  {
    id: 1120000005,
    uuid: "11200001005",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c5\u8bfe\u7a0b",
    content:
      "Mr. James Scott has a garage in Silbury and now he has just bought another garage in Pinhurst. Pinhurst is only five miles from Silbury, but Mr. Scott cannot get a telephone for his new garage, so he has just bought twelve pigeons. Yesterday, a pigeon carried the first message from Pinburst to Silbury. The bird covered the distance in three minutes. Up to now, Mr. Scott has sent a great many requests for spare parts and other urgent messages from one garage to the other. In this way, he has begun his own private 'telephone' service.",
    createdAt: 1752834776367,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c5\u8bfe\u5185\u5bb9",
    wordCount: 97,
  },
  {
    id: 1120000006,
    uuid: "11200001006",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c6\u8bfe\u7a0b",
    content:
      "I have just moved to a house in Bridge Street. Yesterday a beggar knocked at my door. He asked me for a meal and a glass of beer. In return for this, the beggar stood on his head and sang songs. I gave him a meal. He ate the food and drank the beer. Then he put a piece of cheese in his pocket and went away. Later a neighbour told me about him. Everybody knows him. His name is Percy Buttons. He calls at every house in the street once a month and always asks for a meal and a glass of beer.",
    createdAt: 1752834781719,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c6\u8bfe\u5185\u5bb9",
    wordCount: 104,
  },
  {
    id: 1120000007,
    uuid: "11200001007",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c7\u8bfe\u7a0b",
    content:
      "The plane was late and detectives were waiting at the airport all morning. They were expecting a valuable parcel of diamonds from South Africa. A few hours earlier, someone had told the police that thieves would try to steal the diamonds. When the plane arrived, some of the detectives were waiting inside the main building while others were waiting on the airfield. Two men took the parcel off the plane and carried it into the Customs House. While two detectives were keeping guard at the door, two others opened the parcel. To their surprise, the precious parcel was full of stones and sand!",
    createdAt: 1752834782786,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c7\u8bfe\u5185\u5bb9",
    wordCount: 103,
  },
  {
    id: 1120000008,
    uuid: "11200001008",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c8\u8bfe\u7a0b",
    content:
      "Joe Sanders has the most beautiful garden in our town. Nearly everybody enters for 'The Nicest Garden Competition' each year, but Joe wins every time.Bill Frith's garden is larger than Joe's. Bill works harder than Joe and grows more flowers and vegetables, but Joe's garden is more interesting. He has made neat paths and has built a wooden bridge over a pool. I like gardens too, but I do not like hard work. Every year I enter for the garden competition too, and I always win a little prize for the worst garden in the town!",
    createdAt: 1752834783860,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c8\u8bfe\u5185\u5bb9",
    wordCount: 96,
  },
  {
    id: 1120000009,
    uuid: "11200001009",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c9\u8bfe\u7a0b",
    content:
      "On Wednesday evening, we went to the Town Hall. It was the last day of the year and a large crowd of people had gathered under the Town Hall clock. It would strike twelve in twenty minutes' time. Fifteen minutes passed and then, at five to twelve, the clock has stopped. The big minute hand did not move. We waited and waited, but nothing happened. Suddenly someone shouted, \u2018It's two minutes past twelve! The clock has stopped!* I looked at my watch. It was true. The big clock refused to welcome the New Year. At that moment, everybody began to laugh and sing.",
    createdAt: 1752834784926,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c9\u8bfe\u5185\u5bb9",
    wordCount: 103,
  },
  {
    id: 1120000010,
    uuid: "11200001010",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c10\u8bfe\u7a0b",
    content:
      "We have an old musical instrument. It is called a clavichord. It was made in Germany in 1681. Our clavichord is kept in the living-room. It has belonged to our family for a long time. The instrument was bought by my grandfather many years ago. Recently it was damaged by a visitor. She tried to play jazz on it! She struck the keys too hard and two of the strings were broken. My father was shocked. Now we were not allowed to touch it. It is being repaired by a friend of my father's.",
    createdAt: 1752834786053,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c10\u8bfe\u5185\u5bb9",
    wordCount: 94,
  },
  {
    id: 1120000011,
    uuid: "11200001011",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c11\u8bfe\u7a0b",
    content:
      "I was having dinner at a restaurant when Tony Steele came in. Tony worked in a lawyer's office years ago, but he is now working at a bank. He gets a good salary, but he always borrows money from his friends and never pays it back. Tony saw me and came and sat at the same table. He has never borrowed money from me. While he was eating, I asked him to lend me \u00a32. To my surprise, he gave me the money immediately. 'I have never borrowed any money from you,' Harry said,'so now you can pay for my dinner!'",
    createdAt: 1752834787129,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c11\u8bfe\u5185\u5bb9",
    wordCount: 101,
  },
  {
    id: 1120000012,
    uuid: "11200001012",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c12\u8bfe\u7a0b",
    content:
      "Our neighbour, Captain Charles Alison, will sail from Portsmouth tomorrow. We shall meet him at the harbour early in the morning. He will be in his small boat, Topsail.Topsail is a famous little boat. It has sailed across the Atlantic many times. Captain Alison will set out at eight o'clock so we shall have plenty of time. We shall see his boat and then we shall say goodbye to him. He will be away for two months. We are very proud of him. He will take part in an important race across the Atlantic.",
    createdAt: 1752834791556,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c12\u8bfe\u5185\u5bb9",
    wordCount: 94,
  },
  {
    id: 1120000013,
    uuid: "11200001013",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c13\u8bfe\u7a0b",
    content:
      "The Greenwood Boys are a group of popular singers. At present, they are visiting all parts of the country. They will be arriving here tomorrow. They will be coming by train and most of the young people in the town will be meeting them at the station. Tomorrow evening they will be singing at the Workers' Club. The Greenwood Boys will be staying for five days. During this time, they will give five performances. As usual,the police will have a difficult time.They will be trying to keep order. It is always the same on these occasions.",
    createdAt: 1752834792645,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c13\u8bfe\u5185\u5bb9",
    wordCount: 96,
  },
  {
    id: 1120000014,
    uuid: "11200001014",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c14\u8bfe\u7a0b",
    content:
      "I had an amusing experience last year. After I had left a small village in the south of France, I drove on to the next town. On the way, a young man waved to me. I stopped and he asked me for a lift. As soon as he had got into the car, I said good morning to him in French and he replied in the same language. Apart from a few words, I do not know any French at all. Neither of us spoke during the journey. I had nearly reached the town, when the young man suddenly said, very slowly, 'Do you speak English?' As I soon learnt, he was English himself!",
    createdAt: 1752834793712,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c14\u8bfe\u5185\u5bb9",
    wordCount: 114,
  },
  {
    id: 1120000015,
    uuid: "11200001015",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c15\u8bfe\u7a0b",
    content:
      "The secretary told me that Mr Harms worth would see me. I felt very nervous when I went into his office. He did not look up from his desk when I entered. After I had sat down, he said that business was very bad. He told me that the firm could not afford to pay such large salaries. Twenty people had already left. I knew that my turn had come.'Mr Harmsworth,' I said in a weak voice.'Don't interrupt,' he Said. Then he smiled and told me I would receive an extra \u00a3100 a year!",
    createdAt: 1752834794803,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c15\u8bfe\u5185\u5bb9",
    wordCount: 94,
  },
  {
    id: 1120000016,
    uuid: "11200001016",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c16\u8bfe\u7a0b",
    content:
      "If you park your car in the wrong place, a traffic policeman will soon find it. You will be very lucky if he lets you go without a ticket. However, this does not always happen. Traffic police are sometimes very polite. During a holiday in Sweden,I found this note on my car:' Sir, we welcome you to our city. This is a \"No Parking\" area. You will enjoy your stay here if you pay attention to our street signs. This note is only a reminder.' If you receive a request like this, you can-not fail to obey it!",
    createdAt: 1752834795894,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c16\u8bfe\u5185\u5bb9",
    wordCount: 98,
  },
  {
    id: 1120000017,
    uuid: "11200001017",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c17\u8bfe\u7a0b",
    content:
      "My aunt Jennifer is an actress. She must be at least thirty-five years old. In spite of this, she often appears on the stage as a young girl. Jennifer will have to take part in a new play soon. This time, she will be a girl of seventeen. In the play, she must appear in a bright red dress and long black stockings. Last year in another play, she had to wear short socks and a bright, orange-coloured dress. If anyone ever asks her how old she is, she always answers, 'Darling, it must be terrible to be grown up!'",
    createdAt: 1752834796977,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c17\u8bfe\u5185\u5bb9",
    wordCount: 100,
  },
  {
    id: 1120000018,
    uuid: "11200001018",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c18\u8bfe\u7a0b",
    content:
      " After I had had lunch at a village pub, I looked for my bag. I had left it on a chair beside the door and now it wasn't there! As I was looking for it, the landlord came in.'Did you have a good meal?\" he asked.'Yes, thank you,' I answered, 'but I can't pay the bill. I haven't got my bag.'The landlord smiled and immediately went out. In a few minutes he returned with my bag and gave it back to me.'I'm very sorry,' he said. 'My dog had taken in into the garden. He often does this!'",
    createdAt: 1752834798042,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c18\u8bfe\u5185\u5bb9",
    wordCount: 98,
  },
  {
    id: 1120000019,
    uuid: "11200001019",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c19\u8bfe\u7a0b",
    content:
      "'The play may begin at any moment,' I said.'It may have begun already,' Susan answered.I hurried to the ticket office. 'May I have two tickets please?' I asked.'I'm sorry, we've sold out,' the girl said.'What a pity!' Susan exclaimed.Just then, a man hurried to the ticket office.'Can I return these two tickets?' he asked.'Certainly,' the girl said.I went back to the ticket office at once.'Could I have those two tickets please?' I asked.'Certainly,' the girl said, 'but they're for next Wednesday's performance. Do you still want them?''I might as well have them,' I said sadly.",
    createdAt: 1752834801158,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c19\u8bfe\u5185\u5bb9",
    wordCount: 95,
  },
  {
    id: 1120000020,
    uuid: "11200001020",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c20\u8bfe\u7a0b",
    content:
      "Fishing is my favourite sport. I often fish for hours without catching anything. But this does not worry me. Some fishermen are unlucky. Instead of catching fish, they catch old boots and rubbish. I am even less lucky. I never catch anything -- not even old boots. After having spent whole mornings on the river, I always go home with an empty bag. 'You must give up fishing!' my friends say. 'It's a waste of time.' But they don't realize one important thing. I'm not really interested in fishing. I am only interested in sitting in a boat and doing nothing at all!",
    createdAt: 1752834802238,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c20\u8bfe\u5185\u5bb9",
    wordCount: 103,
  },
  {
    id: 1120000021,
    uuid: "11200001021",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c21\u8bfe\u7a0b",
    content:
      "Aeroplanes are slowly driving me mad. I live near an airport and passing planes can be heard night and day. The airport was built years ago, but for some reason it could not be used then. Last year, however, it came into use. Over a hundred people must have been driven away from their homes by the noise. I am one of the few people left. Sometimes I think this house will be knocked down by a passing plane.\tI have been offered a large sum of money to go away, but I am determined to stay here. Everybody says I must be mad and they are probably right.",
    createdAt: 1752834803312,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c21\u8bfe\u5185\u5bb9",
    wordCount: 109,
  },
  {
    id: 1120000022,
    uuid: "11200001022",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c22\u8bfe\u7a0b",
    content:
      "My daughter, Jane, never dreamed of receiving a letter from a girl of her own age in Holland. Last year, we were travelling across the Channel and Jane put a piece of paper with her name and address on it into a bottle. She threw the bottle into the sea. She never thought of it again, but ten months later, she received a letter from a girl in Holland. Both girls write to each other regularly now. However, they have decided to use the post office. Letters will cost a little more, but they will certainly travel faster.",
    createdAt: 1752834804377,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c22\u8bfe\u5185\u5bb9",
    wordCount: 98,
  },
  {
    id: 1120000023,
    uuid: "11200001023",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c23\u8bfe\u7a0b",
    content:
      "I had a letter from my sister yesterday. She lives in Nigeria. In her letter, she said that she would come to England next year. If she comes, she will get a surprise. We are now living in a beautiful new house in the country. Work on it had begun before my sister left. The house was completed five months ago. In my letter, I told her that she could stay with us. The house has many large rooms and there is a lovely garden. It is a very modern house, so it looks strange to some people. It must be the only modern house in the district.",
    createdAt: 1752834805471,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c23\u8bfe\u5185\u5bb9",
    wordCount: 108,
  },
  {
    id: 1120000024,
    uuid: "11200001024",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c24\u8bfe\u7a0b",
    content:
      "\tI entered the hotel manager's office and sat down. I had just lost $50 and I felt very upset. 'I left the money in my room,' I said, 'and it's not there now.' The manager was sympathetic, but he could do nothing. 'Everyone's losing money these days,' he said. He started to complain about this wicked world but was interrupted by a knock at the door. A girl came in and put an envelope on his desk. It contained $50. 'I found this outside this gentleman's room,' she said. 'Well,' I said to the manager, 'there is still some honesty in this world!'",
    createdAt: 1752834806547,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c24\u8bfe\u5185\u5bb9",
    wordCount: 103,
  },
  {
    id: 1120000025,
    uuid: "11200001025",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c25\u8bfe\u7a0b",
    content:
      "I arrived in London at last. The railway station was big, black and dark. I did not know the way to my hotel, so I asked a porter. I not only spoke English very carefully, but very clearly as well. The porter, however, could not understand me. I repeated my question several times and at last he understood. he answered me, but he spoke neither slowly nor clearly. 'I am a foreigner,' I said. Then he spoke slowly, but I could not understand him.My teacher never spoke English like that! The porter and I looked at each other and smiled. Then he said something and I understood it. 'You'll soon learn English!' he said. I wonder. In England, each person speaks a different language. The English understand each other, but I don't understand them! Do they speak English?",
    createdAt: 1752834812640,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c25\u8bfe\u5185\u5bb9",
    wordCount: 138,
  },
  {
    id: 1120000026,
    uuid: "11200001026",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c26\u8bfe\u7a0b",
    content:
      " I am an art student and I paint a lot of pictures. Many people pretend that they understand modern art. They always tell you what a picture is 'about'. Of course, many pictures are not 'about' anything. They are just pretty patterns. We like them in the same way that we like pretty curtain material. I think that young children often appreciate modern pictures better than anyone else. They notice more. My sister is only seven, but she always tells me whether my pictures are good or not. She came into my room yesterday.'What are you doing?' she asked. 'I'm hanging this picture on the wall,' I answered. 'It's a new one. Do you like it?'She looked at it critically for a moment. 'It's all right,' she said, 'but isn't it upside down?'I looked at it again. She was right! It was!",
    createdAt: 1752834813715,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c26\u8bfe\u5185\u5bb9",
    wordCount: 142,
  },
  {
    id: 1120000027,
    uuid: "11200001027",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c27\u8bfe\u7a0b",
    content:
      " Late in the afternoon, the boys put up their tent in the middle of a field. As soon as this was done, they cooked a meal over an open fire. They were all hungry and the food smelled good. After a wonderful meal, they told stories and sang songs by the campfire. But some time later it began to rain. The boys felt tired so they put out the fire and crept into their tent. Their sleeping bags were warm and comfortable, so they all slept soundly. In the middle of the night, two boys woke up and began shouting. The tent was full of water! They all leapt out of their sleeping bags and hurried outside. It was raining heavily and they found that a stream had formed in the field. The stream wound its way across the field and then flowed right under their tent!",
    createdAt: 1752834814780,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c27\u8bfe\u5185\u5bb9",
    wordCount: 147,
  },
  {
    id: 1120000028,
    uuid: "11200001028",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c28\u8bfe\u7a0b",
    content:
      "Jasper White is one of those rare people who believes in ancient myths.he has just bought a new house in the city, but ever since he moved in, he has had trouble with cars and their owners. When he returns home at night, he always finds that someone has parked a car outside his gate. Because of this, he has not been able to get his own car into his garage even once. Jasper has put up 'No Parking' signs outside his gate, but these have not had any effect. Now he has put an ugly stone head over the gate. It is one of the ugliest faces I have ever seen. I asked him what it was and he told me that it was Medusa, the Gorgon. jasper hopes that she will turn cars and their owners to stone. But none of them has been turned to stone yet!",
    createdAt: 1752834815838,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c28\u8bfe\u5185\u5bb9",
    wordCount: 150,
  },
  {
    id: 1120000029,
    uuid: "11200001029",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c29\u8bfe\u7a0b",
    content:
      "Captain Ben Fawcett has bought an unusual taxi and has begun a new service. The 'taxi' is a small Swiss aeroplane called a 'Pilatus Porter'. This wonderful plane can carry seven passengers. The most surprising thing about it, however, is that it can land anywhere: on snow, water, or even on a ploughed field. Captain Fawcett's first passenger was a doctor who flew from Birmingham to a lonely village in the Welsh mountains. Since then, Captain Fawcett has flown passengers to many unusual places. Once he landed on the roof of a block of flats and on another occasion, he landed in a deserted car park. Captain Fawcett has just refused a strange request from a businessman. The man wanted to fly to Rockall, a lonely island in the Atlantic Ocean, but Captain Fawcett did not take him because the trip was too dangerous.",
    createdAt: 1752834817060,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c29\u8bfe\u5185\u5bb9",
    wordCount: 144,
  },
  {
    id: 1120000030,
    uuid: "11200001030",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c30\u8bfe\u7a0b",
    content:
      "The Wayle is a small river that cuts across the park near my home. I like sitting by the Wayle on fine afternoons.It was warm last Sunday, so I went and sat on the river bank as usual. Some children were playing games on the bank and there were some people rowing on the river. Suddenly, one of the children kicked a ball very hard and it went towards a passing boat. Some people on the bank called out to the man in the boat, but he did not hear them. The ball struck him so hard that he nearly fell into the water. I turned to look at the children, but there weren't any in sight: they had all run away!  The man laughed when he realized what had happened. He called out to the children and threw the ball back to the bank.",
    createdAt: 1752834818266,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c30\u8bfe\u5185\u5bb9",
    wordCount: 145,
  },
  {
    id: 1120000031,
    uuid: "11200001031",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c31\u8bfe\u7a0b",
    content:
      " Yesterday afternoon Frank Hawkins was telling me about his experiences as a young man. Before he retired, Frank was the head of a very large business company, but as a boy he used to work in a small shop. It was his job to repair bicycles and at that time he used to work fourteen hours a day. He saved money for years and in 1958 he bought a small workshop of his own. In his twenties Frank used to make spare parts for aeroplanes. At that time he had two helpers. In a few years the small workshop had become a large factory which employed seven hundred and twenty-eight people. Frank smiled when he remembered his hard early years and the long road to success. He was still smiling when the door opened and his wife came in. She wanted him to repair their grandson's bicycle!",
    createdAt: 1752834822875,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c31\u8bfe\u5185\u5bb9",
    wordCount: 147,
  },
  {
    id: 1120000032,
    uuid: "11200001032",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c32\u8bfe\u7a0b",
    content:
      "People are not so honest as they once were. The temptation to steal is greater than ever before -- especially in large shops.  A detective recently watched a well-dressed woman who always went into a large store on Monday mornings. One Monday, there were fewer people in the shop than usual when the woman came in, so it was easier for the detective to watch her. The woman first bought a few small articles. After a little time, she chose one of the most expensive dresses in the shop and handed it to an assistant who wrapped it up for her as quickly as possible. Then the woman simply took the parcel and walked out of the shop without paying. When she was arrested, the detective found out that the shop assistant was her daughter. The girl 'gave' her mother a free dress once a week!",
    createdAt: 1752834823948,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c32\u8bfe\u5185\u5bb9",
    wordCount: 146,
  },
  {
    id: 1120000033,
    uuid: "11200001033",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c33\u8bfe\u7a0b",
    content:
      "Nearly a week passed before the girl was able to explain what had happened to her. One afternoon she set out from the coast in a small boat and was caught in a storm. Towards evening, the boat struck a rock and the girl jumped into the sea. Then she swam to the shore after spending the whole night in the water. During that time she covered a distance of eight miles.   Early next morning, she saw a light ahead. She knew she was near the shore because the light was high up on the cliffs. On arriving at the shore, the girl struggled up the cliff towards the light she had seen. That was all she remembered. When she woke up a day later, she found herself in hospital.",
    createdAt: 1752834825016,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c33\u8bfe\u5185\u5bb9",
    wordCount: 130,
  },
  {
    id: 1120000034,
    uuid: "11200001034",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c34\u8bfe\u7a0b",
    content:
      "Dan Robinson has been worried all week. Last Tuesday he received a letter from the local police. In the letter he was asked to call at the station. Dan wondered why he was wanted by the police, but he went to the station yesterday and now he is not worried anymore. At the station, he was told by a smiling policeman that his bicycle had been found. Five days ago, the policeman told him, the bicycle was picked up in a small village four hundred miles away. It is now being sent to his home by train. Dan was most surprised when he heard the news. He was amused too, because he never expected the bicycle to be found. It was stolen twenty years ago when Dan was a boy of fifteen!",
    createdAt: 1752834826100,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c34\u8bfe\u5185\u5bb9",
    wordCount: 132,
  },
  {
    id: 1120000035,
    uuid: "11200001035",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c35\u8bfe\u7a0b",
    content:
      "Roy Trenton used to drive a taxi. A short while ago, however, he became a bus driver and he has not regretted it. He is finding his new work far more exciting. When he was driving along Catford Street recently, he saw two thieves rush out of a shop and run towards a waiting car. One of them was carrying a bag full of money. Roy acted quickly and drove the bus straight at the thieves. The one with the money got such a fright that he dropped the bag. As the thieves were trying to get away in their car, Roy drove his bus into the back of it. While the battered car was moving away, Roy stopped his bus and telephoned the police. The thieves' car was badly damaged and easy to recognize. Shortly afterwards, the police stopped the car and both men were arrested.",
    createdAt: 1752834827197,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c35\u8bfe\u5185\u5bb9",
    wordCount: 147,
  },
  {
    id: 1120000036,
    uuid: "11200001036",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c36\u8bfe\u7a0b",
    content:
      "Debbie Hart is going to swim across the English Channel tomorrow. She is going to set out from the French coast at five o'clock in the morning. Debbie is only eleven years old and she hopes to set up a new world record. She is a strong swimmer and many people feel that she is sure to succeed.  Debbie's father will set out with her in a small boat. Mr. Hart has trained his daughter for years. Tomorrow he will be watching her anxiously as she swims the long distance to England.  Debbie intends to take short rests every two hours. She will have something to drink but she will not eat any solid food.Most of Debbie's school friends will be waiting for her on the English coast. Among them will be Debbie's mother, who swam the Channel herself when she was a girl.",
    createdAt: 1752834828270,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c36\u8bfe\u5185\u5bb9",
    wordCount: 144,
  },
  {
    id: 1120000037,
    uuid: "11200001037",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c37\u8bfe\u7a0b",
    content:
      "The Olympic Games will be held in our country in four years' time.  As a great many people will be visiting the country, the government will be building new hotels, an immense stadium, and a new Olympic-standard swimming pool. They will also be building new roads and a special railway line.  The Games will be held just outside the capital and the whole area will be called 'Olympic City'. Workers will have completed the new roads by the end of this year. By the end of next year, they will have finished work on the new stadium. The fantastic modern buildings have been designed by Kurt Gunter. Everybody will be watching anxiously as the new buildings go up. We are all very excited and are looking forward to the Olympic Games because they have never been held before in this country.",
    createdAt: 1752834833474,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c37\u8bfe\u5185\u5bb9",
    wordCount: 141,
  },
  {
    id: 1120000038,
    uuid: "11200001038",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c38\u8bfe\u7a0b",
    content:
      "My old friend, Harrison, had lived in the Mediterranean for many years before he returned to England. He had often dreamed of retiring in England and had planned to settle down in the country.  He had no sooner returned than he bought a house and went to live there. Almost immediately he began to complain about the weather, for even though it was still summer, it rained continually and it was often bitterly cold. After so many years of sunshine, Harrison got a shock. He acted as if he had never lived in England before. In the end, it was more than he could bear. He had hardly had time to settle down when he sold the house and left the country. The dream he had had for so many years ended there. Harrison had thought of everything except the weather.",
    createdAt: 1752834834539,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c38\u8bfe\u5185\u5bb9",
    wordCount: 141,
  },
  {
    id: 1120000039,
    uuid: "11200001039",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c39\u8bfe\u7a0b",
    content:
      "While John Gilbert was in hospital, he asked his doctor to tell him whether his operation had been successful, but the doctor refused to do so. The following day, the patient asked for a bedside telephone. When he was alone, he telephoned the hospital exchange and asked for Doctor Millington.When the doctor answered the phone, Mr. Gilbert said he was inquiring about a certain patient, a Mr. John Gilbert. He asked if Mr. Gilbert's operation had been successful and the doctor told him that it had been. He then asked when Mr. Gilbert would be allowed to go home and the doctor told him that he would have to stay in hosptial for another two weeks. Then Dr. Millington asked the caller if he was a relative of the patient. 'No,' the patient answered, 'I am Mr. John Gilbert.'",
    createdAt: 1752834835640,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c39\u8bfe\u5185\u5bb9",
    wordCount: 139,
  },
  {
    id: 1120000040,
    uuid: "11200001040",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c40\u8bfe\u7a0b",
    content:
      "Last week at a dinner party, the hostess asked me to sit next to Mrs. Rumbold. Mrs. Rumbold was a large, unsmiling lady in a tight black dress. She did not even look up when I took my seat beside her. Her eyes were fixed on her plate and in a short time, she was busy eating. I tried to make conversation.'A new play is coming to \"The Globe\" soon,' I said. 'Will you be seeing it?''No,' she answered.'Will you be spending your holidays abroad this year?' I asked.'No,' she answered.'Will you be staying in England?' I asked.'No,' she answered.In despair, I asked her whether she was enjoying her dinner.'Young man,' she answered, 'if you ate more and talked less, we would both enjoy our dinner!\"",
    createdAt: 1752834836714,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c40\u8bfe\u5185\u5bb9",
    wordCount: 126,
  },
  {
    id: 1120000041,
    uuid: "11200001041",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c41\u8bfe\u7a0b",
    content:
      "'Do you call that a hat?' I said to my wife.'You needn't be so rude about it,' my wife answered as she looked at herself in the mirror.I sat down on one of those modern chairs with holes in it and waited. We had been in the hat shop for half an hour and my wife was still in front of the mirror.'We mustn't buy things we don't need,' I remarked suddenly. I regretted saying it almost at once.'You needn't have said that,' my wife answered. 'I needn't remind you of that terrible tie you bought yesterday.''I find it beautiful,' I said. 'A man can never have too many ties.''And a woman can't have too many hats,' she answered.Ten minutes later we walked out of the shop together. My wife was wearing a hat that looked like a lighthouse!",
    createdAt: 1752834837796,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c41\u8bfe\u5185\u5bb9",
    wordCount: 139,
  },
  {
    id: 1120000042,
    uuid: "11200001042",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c42\u8bfe\u7a0b",
    content:
      "  As we had had a long walk through one of the markets of old Delhi, we stopped at a square to have a rest. After a time, we noticed a snake charmer with two large baskets at the other side of the square, so we went to have a look at him.  As soon as he saw us, he picked up a long pipe which was covered with coins and opened one of the baskets. When he began to play a tune, we had our first glimpse of the snake. It rose out of the basket and began to follow the movements of the pipe. We were very much surprised when the snake charmer suddenly began to play jazz and modern pop songs. The snake, however, continued to 'dance' slowly. It obviously could not tell the difference between Indian music and jazz!",
    createdAt: 1752834838864,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c42\u8bfe\u5185\u5bb9",
    wordCount: 142,
  },
  {
    id: 1120000043,
    uuid: "11200001043",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c43\u8bfe\u7a0b",
    content:
      "In 1929, three years after his flight over the North Pole, the American explorer, R.E. Byrd, successfully flew over the South Pole for the first time. Though, at first, Byrd and his men were able to take a great many photographs of the mountains that lay below, they soon ran into serious trouble. At one point, it seemed certain that their plane would crash. It could only get over the mountains if it rose to 10,000 feet. Byrd at once ordered his men to throw out two heavy food sacks. The plane was then able to rise and it cleared the mountains by 400 feet. Byrd now knew that he would be able to reach the South Pole which was 300 miles away, for there were no more mountains in sight. The aircraft was able to fly over the endless white plains without difficulty.",
    createdAt: 1752834839966,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c43\u8bfe\u5185\u5bb9",
    wordCount: 144,
  },
  {
    id: 1120000044,
    uuid: "11200001044",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c44\u8bfe\u7a0b",
    content:
      " Mrs. Anne Sterling did not think of the risk she was taking when she ran through a forest after two men. They had rushed up to her while she was having a picnic at the edge of a forest with her children and tried to steal her handbag. In the struggle, the strap broke and, with the bag in their possession, both men started running through the trees. Mrs. Sterling got so angry that she ran after them. She was soon out of breath, but she continued to run. When she caught up with them, she saw that they had sat down and were going through the contents of the bag, so she ran straight at them. The men got such a fright that they dropped the bag and ran away. 'The strap needs mending,' said Mrs. Sterling later, 'but they did not steal anything.'",
    createdAt: 1752834843830,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c44\u8bfe\u5185\u5bb9",
    wordCount: 145,
  },
  {
    id: 1120000045,
    uuid: "11200001045",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c45\u8bfe\u7a0b",
    content:
      "The whole village soon learnt that a large sum of money had been lost. Sam Benton, the local butcher, had lost his wallet while taking his savings to the post office. Sam was sure that the wallet must have been found by one of the villagers, but it was not returned to him.   Three months passed, and then one morning, Sam found his wallet outside his front door. It had been wrapped up in newspaper and it contained half the money he had lost, together with a note which said: 'A thief, yes, but only 50 per cent a thief!'  Two months later, some more money was sent to Sam with another note: 'Only 25 per cent a thief now!' In time, all Sam's money was paid back in this way. The last note said: 'I am 100 per cent honest now!'",
    createdAt: 1752834844899,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c45\u8bfe\u5185\u5bb9",
    wordCount: 142,
  },
  {
    id: 1120000046,
    uuid: "11200001046",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c46\u8bfe\u7a0b",
    content:
      "When a plane from London arrived at Sydney airport, workers began to unload a number of wooden boxes which contained clothing. No one could account for the fact that one of the boxes was extremely heavy.   It suddenly occurred to one of the workers to open up the box. He was astonished at what he found. A man was lying in the box on top of a pile of woolen goods. He was so surprised at being discovered that he did not even try to run away.  After he was arrested, the man admitted hiding in the box before the plane left London. He had had a long and uncomfortable trip, for he had been confined to the wooden box for over eighteen hours. The man was ordered to pay $3,500 for the cost of the trip. The normal price of a ticket is $2,000!",
    createdAt: 1752834845966,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c46\u8bfe\u5185\u5bb9",
    wordCount: 145,
  },
  {
    id: 1120000047,
    uuid: "11200001047",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c47\u8bfe\u7a0b",
    content:
      " A public house which was recently bought by Mr.Ian Thompson is up for sale. Mr.Thompson is going to sell it because it is haunted.  He told me that he could not go to sleep one night because he heard a strange noise coming from the bar. The next morning, he found that the doors had been blocked by chairs and the furniture had been moved. Though Mr.Thompson had turned the lights off before he went to bed, they were on in the morning. He also said that he had found five empty whisky bottles which the ghost must have drunk the night before. When I suggested that some villagers must have come in for a free drink, Mr.Thompson shook his head. The villagers have told him that they will not accept the pub even if he gives it away.",
    createdAt: 1752834847088,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c47\u8bfe\u5185\u5bb9",
    wordCount: 139,
  },
  {
    id: 1120000048,
    uuid: "11200001048",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c48\u8bfe\u7a0b",
    content:
      "Dentists always ask questions when it is impossible for you to answer.My dentist had just pulled out one of my teeth and had told me to rest for a while. I tried to say something, but my mouth was full of cotton wool. He knew I collected match boxes and asked me whether my collection was growing. He then asked me how my brother was and whether I liked my new job in London. In answer to these questions I either nodded or made strange noises. Meanwhile, my tongue was busy searching out the hole where the tooth had been. I suddenly felt very worried, but could not say anything. When the dentist at last removed the cotton wool from my mouth, I was able to tell him that he had pulled out the wrong tooth.",
    createdAt: 1752834848220,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c48\u8bfe\u5185\u5bb9",
    wordCount: 136,
  },
  {
    id: 1120000049,
    uuid: "11200001049",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c49\u8bfe\u7a0b",
    content:
      "Tired of sleeping on the floor, a young man in Teheran saved up for years to buy a real bed. For the first time in his life, he became the proud owner of a bed which had springs and a mattress. Because the weather was very hot, he carried the bed on to the roof of his house. He slept very well for the first two nights, but on the third night, a storm blew up. A gust of wind swept the bed off the roof and sent it crashing into the courtyard below. The young man did not wake up until the bed had struck the ground. Although the bed was smashed to pieces, the man was miraculously unhurt. When he woke up, he was still on the mattress. Glancing at the bits of wood and metal that lay around him, the man sadly picked up the mattress and carried it into his house. After he had put it on the floor, he promptly went to sleep again.",
    createdAt: 1752834849327,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c49\u8bfe\u5185\u5bb9",
    wordCount: 169,
  },
  {
    id: 1120000050,
    uuid: "11200001050",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c50\u8bfe\u7a0b",
    content:
      "I love travelling in the country, but I don't like losing my way.I went on an excursion recently, but my trip took me longer than I expected.'I'm going to Woodford Green,' I said to the conductor as I got on the bus, 'but I don't know where it is.''I'll tell you where to get off.' answered the conductor.I sat in the front of the bus to get a good view of the countryside. After some time, the bus stopped. Looking round, I realized with a shock that I was the only passenger left on the bus.'You'll have to get off here,' the conductor said. 'This is as far as we go.''Is this Woodford Green?' I asked.'Oh dear,' said the conductor suddenly. 'I forgot to put you off.''It doesn't matter,' I said. 'I'll get off here.''We're going back now,' said the conductor.'Well, in that case, I prefer to stay on the bus,' I answered.",
    createdAt: 1752834855631,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c50\u8bfe\u5185\u5bb9",
    wordCount: 153,
  },
  {
    id: 1120000051,
    uuid: "11200001051",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c51\u8bfe\u7a0b",
    content:
      "My friend, Hugh, has always been fat, but things got so bad recently that he decided to go on a diet.  He began his diet a week ago.First of all, he wrote out a long list of all the foods which were forbidden. The list included most of the things Hugh loves: butter, potatoes, rice, beer, milk, chocolate; and sweets. Yesterday I paid him a visit. I rang the bell and was not surprised to see that Hugh was still as fat as ever.He led me into his room and hurriedly hid a large parcel under his desk. It was obvious that he was very embarrassed. When I asked him what he was doing, he smiled guiltily and then put the parcel on the desk.He explained that his diet was so strict that he had to reward himself occasionally. Then he showed me the contents of the parcel. It contained five large bars of chocolate and three bags of sweets!",
    createdAt: 1752834856700,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c51\u8bfe\u5185\u5bb9",
    wordCount: 160,
  },
  {
    id: 1120000052,
    uuid: "11200001052",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c52\u8bfe\u7a0b",
    content:
      "We have just moved into a new house and I have been working hard all morning. I have been trying to get my new room in order. This has not been easy because I own over a thousand books. To make matters worse, the room is rather small, so I have temporarily put my books on the floor. At the moment, they cover every inch of floor space and I actually have to walk on them to get in or out of the room. A short while ago, my sister helped me to carry one of my old bookcases up the stairs. She went into my room and got a big surprise when she saw all those books on the floor. 'This is the prettiest carpet I have ever seen,' she said. She gazed at it for some time then added, 'You don't need bookcases at all. You can sit here in your spare time and read the carpet!'",
    createdAt: 1752834857773,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c52\u8bfe\u5185\u5bb9",
    wordCount: 159,
  },
  {
    id: 1120000053,
    uuid: "11200001053",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c53\u8bfe\u7a0b",
    content:
      "At last firemen have put out a big forest fire in California. Since then, they have been trying to find out how the fire began. Forest fires are often caused by broken glass or by cigarette ends which people carelessly throw away. Yesterday the firemen examined the ground carefully, but were not able to find any broken glass. They were also quite sure that a cigarette end did not start the fire. This morning, however, a firemen accidentally discovered the cause. He noticed the remains of a snake which was wound round the electric wires of a 16,000-volt power line. In this way, he was able to solve the mystery. The explanation was simple but very unusual. A bird had snatched up the snake from the ground and then dropped it on to the wires. The snake then wound itself round the wires. When it did so, it sent sparks down to the ground and these immediately started a fire.",
    createdAt: 1752834858855,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c53\u8bfe\u5185\u5bb9",
    wordCount: 160,
  },
  {
    id: 1120000054,
    uuid: "11200001054",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c54\u8bfe\u7a0b",
    content:
      "After breakfast, I sent the children to school and then I went to the shops. It was still early when I returned home. The children were at school, my husband was at work and the house was quiet. So I decided to make some meat pies. In a short time I was busy mixing butter and flour and my hands were soon covered with sticky pastry. At exactly that moment, the telephone rang. Nothing could have been more annoying.I picked up the receiver between two sticky fingers and was dismayed when I recognized the voice of Helen Bates. It took me ten minutes to persuade her to ring back later. At last I hung up the receiver. What a mess! There was pastry on my fingers, on the telephone, and on the doorknobs. I had no sooner got back to the kitchen than the doorbell rang loud enough to wake the dead. This time it was the postman and he wanted me to sign for a registered letter!",
    createdAt: 1752834859935,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c54\u8bfe\u5185\u5bb9",
    wordCount: 168,
  },
  {
    id: 1120000055,
    uuid: "11200001055",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c55\u8bfe\u7a0b",
    content:
      "Dreams of finding lost treasure almost came true recently. A new machine called 'The Revealer' has been invented and it has been used to detect gold which has been buried in the ground. The machine was used in a cave near the seashore where -- it is said -- pirates used to hide gold. The pirates would often bury gold in the cave and then fail to collect it. Armed with the new machine, a search party went into the cave hoping to find buried treasure. The leader of the party was examining the soil near the entrance to the cave when the machine showed that there was gold under the ground. Very excited, the party dug a hole two feel deep. They finally found a small gold coin which was almost worthless. The party then searched the whole cave thoroughly but did not find anything except an empty tin trunk. In spite of this, many people are confident that 'The Revealer' may reveal something of value fairly soon.",
    createdAt: 1752834861025,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c55\u8bfe\u5185\u5bb9",
    wordCount: 169,
  },
  {
    id: 1120000056,
    uuid: "11200001056",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c56\u8bfe\u7a0b",
    content:
      "Once a year, a race is held for old cars. A lot of cars entered for this race last year and there was a great deal of excitement just before it began.One of the most handsome cars was a Rolls-Royce Silver Ghost. The most unusual car was a Benz which had only three wheels. Built in 1885, it was the oldest car taking part. After a great many loud explosions, the race began. Many of the cars broke down on the course and some drivers spent more time under their cars than in them! A few cars, however, completed the race. The winning car reached a speed of forty miles an hour -- much faster than any of its rivals. It sped downhill at the end of the race and its driver had a lot of trouble trying to stop it.  The race gave everyone a great deal of pleasure. It was very different from modern car races but no less exciting.",
    createdAt: 1752834865274,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c56\u8bfe\u5185\u5bb9",
    wordCount: 162,
  },
  {
    id: 1120000057,
    uuid: "11200001057",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c57\u8bfe\u7a0b",
    content:
      " A woman in jeans stood at the window of an expensive shop. Though she hesitated for a moment, she finally went in and asked to see a dress that was in the window. The assistant who served her did not like the way she was dressed. Glancing at her scornfully, he told her that the dress was sold.The woman walked out of the shop angrily and decided to punish the assistant next day.She returned to the shop the following morning dressed in a fur coat, with a handbag in one hand and a long umbrella in the other. After seeking out the rude assistant, she asked for the same dress. Not realizing who she was, the assistant was eager to serve her this time. With great difficulty, he climbed into the shop window to get the dress. As soon as she saw it, the woman said she did not like it.  She enjoyed herself making the assistant bring almost everything in the window before finally buying the dress she had first asked for.",
    createdAt: 1752834866354,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c57\u8bfe\u5185\u5bb9",
    wordCount: 173,
  },
  {
    id: 1120000058,
    uuid: "11200001058",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c58\u8bfe\u7a0b",
    content:
      "The tiny village of Frinley is said to possess a 'cursed tree'. Because the tree was mentioned in a newspaper, the number of visitors to Frinley has now increased. The tree was planted near the church fifty years ago, but it is only in recent years that it has gained an evil reputation. It is said that if anyone touches the tree, he will have bad luck; if he picks a leaf, he will die. Many villagers believe that the tree has already claimed a number of victims. The vicar has been asked to have the tree cut down, but so far he has refused. He has pointed out that the tree cut down, but so far he has refused. He has pointed out that the tree is a useful source of income, as tourists have been coming from all parts of the country to see it. In spite of all that has been said, the tourists have been picking leaves and cutting their names on the tree-trunk. So far, not one of them has been struck down by sudden death!",
    createdAt: 1752834867603,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c58\u8bfe\u5185\u5bb9",
    wordCount: 181,
  },
  {
    id: 1120000059,
    uuid: "11200001059",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c59\u8bfe\u7a0b",
    content:
      "Our dog, Rex, used to sit outside our front gate and bark. Every time he wanted to come into the garden he would bark until someone opened the gate. As the neighbours complained of the noise, my husband spent weeks training him to press his paw on the latch to let himself in. Rex soon became an expert at opening the gate. However, when I was going out shopping last week, I noticed him in the garden near the gate. This time he was barking so that someone would let him out ! Since then, he has developed another bad habit. As soon as he opens the gate from the outside, he comes into the garden and waits until the gate shuts. Then he sits and barks until someone lets him out. After this he immediately lets himself in and begins barking again. Yesterday my husband removed the gate and Rex got so annoyed we have not seen him since.",
    createdAt: 1752834868680,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c59\u8bfe\u5185\u5bb9",
    wordCount: 160,
  },
  {
    id: 1120000060,
    uuid: "11200001060",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c60\u8bfe\u7a0b",
    content:
      "At a village fair, I decided to visit a fortune-teller called Madam Bellinsky. I went into her tent and she told me to sit down. After I had given her some money,she looked into a crystal ball and said: 'A relation of yours is coming to see you. She will be arriving this evening and intends to stay for a few days. The moment you leave this tent, you will get a big surprise. A woman you know well will rush towards you. She will speak to you and then she will lead you away from this place. That is all.'As soon as I went outside, I forgot all about Madam Bellinsky because my wife hurried towards me. 'Where have you been hiding ?' she asked impatiently. 'Your sister will be here in less than an hour and we must be at the station to meet her. We are late already.' As she walked away, I followed her out of the fair.",
    createdAt: 1752834869782,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c60\u8bfe\u5185\u5bb9",
    wordCount: 162,
  },
  {
    id: 1120000061,
    uuid: "11200001061",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c61\u8bfe\u7a0b",
    content:
      "The Hubble telescope was launched into space by NASA on April 20,1990 at a cost of over a billion dollars.Right from the start there was trouble with the Hubble. The pictures it sent us were very disappointing because its main mirror was faulty!  NASA is now going to put the telescope right, so it will soon be sending up four astronauts to repair it. The shuttle Endeavour will be taking the astronauts to the Hubble. A robot-arm from the Endeavour will grab the telescope and hold it while the astronauts make the necessary repairs.  Of course, the Hubble is above the earth's atmosphere, so it will soon be sending us the clearest pictures of the stars and distant galaxies that we have ever seen. The Hubble will tell us a great deal about the age and size of the universe. By the time you read this, the Hubble's eagle eye will have sent us thousands and thousands of wonderful pictures.",
    createdAt: 1752834870868,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c61\u8bfe\u5185\u5bb9",
    wordCount: 160,
  },
  {
    id: 1120000062,
    uuid: "11200001062",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c62\u8bfe\u7a0b",
    content:
      "Firemen had been fighting the forest for nearly three weeks before they could get it under control. A short time before, great trees had covered the countryside for miles around. Now, smoke still rose up from the warm ground over the desolate hills. .Winter was coming on and the hills threatened the surrounding villages with destruction, for heavy rain would not only wash away the soil but would cause serious floods as well.   When the fire had at last been put out, the forest authorities ordered several tons of a special type of grass-seed which would grow quickly. The seed was sprayed over the ground in huge quantities by aeroplanes. The planes had been planting seed for nearly a month when it began to rain. By then, however, in many places the grass had already taken root. In place of the great trees which had been growing there for centuries patches of green had begun to appear in the blackened soil.",
    createdAt: 1752834874852,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c62\u8bfe\u5185\u5bb9",
    wordCount: 161,
  },
  {
    id: 1120000063,
    uuid: "11200001063",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c63\u8bfe\u7a0b",
    content:
      "Jeremy Hampden has a large circle of friends and is very popular at parties. Everybody admires him for his great sense of humour -- everybody, that is, except his six-year-old daughter, Jenny. Recently, one of Jeremy's closest friends asked him to make a speech at a wedding reception. This is the sort of thing that Jeremy loves. He prepared the speech carefully and went to the wedding with Jenny. he had included a large number of funny stories in the speech and, of course, it was a great success. As soon as he had finished, Jenny told him she wanted to go home. Jeremy was a little disappointed by this but he did as his daughter asked. On the way home, he asked Jenny if she had enjoyed the speech. To his surprise, she said she hadn't. Jeremy asked her why this was so and she told him that she did not like to see so many people laughing at him!",
    createdAt: 1752834875916,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c63\u8bfe\u5185\u5bb9",
    wordCount: 161,
  },
  {
    id: 1120000064,
    uuid: "11200001064",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c64\u8bfe\u7a0b",
    content:
      "In 1858, a French engineer, Aime Thome de Gamond, arrived in England with a plan for a twenty-one-mile tunnel under the English Channel. He said that it would be possible to build a platform in the centre of the Channel. This platform would serve as a port and a railway station. The tunnel would be well-ventilated if tall chimneys were built above sea level.  In 1860, a better plan was put forward by an Englishman, William Low. He suggested that a double railway-tunnel should be built. This would solve the problem of ventilation, for if a train entered this tunnel, it would draw in fresh air behind it. Forty-two years later a tunnel was actually begun. If, at the time, the British had not feared invasion, it would have been completed.  The world had to wait almost another 100 years for the Channel Tunnel. It was officially opened on March 7,1994, finally connecting Britain to the European continent.",
    createdAt: 1752834877038,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c64\u8bfe\u5185\u5bb9",
    wordCount: 158,
  },
  {
    id: 1120000065,
    uuid: "11200001065",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c65\u8bfe\u7a0b",
    content:
      "Last Christmas, the circus owner, Jimmy Gates, decided to take some presents to a children's hospital. Dressed up as Father Christmas and accompanied by a 'guard of honour' of six pretty girls, he set off down the main street of the city riding a baby elephant called Jumbo. He should have known that the police would never allow this sort of thing. A policeman approached Jimmy and told him he ought to have gone along a side street as Jumbo was holding up the traffic. Though Jimmy agreed to go at once, Jumbo refused to move. Fifteen policemen had to push very hard to get him off the main street. The police had a difficult time, but they were most amused. 'Jumbo must weigh a few tons,' said a policeman afterwards, 'so it was fortunate that we didn't have to carry him. Of course, we should arrest him, but as he has a good record, we shall let him off this time.'",
    createdAt: 1752834878110,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c65\u8bfe\u5185\u5bb9",
    wordCount: 162,
  },
  {
    id: 1120000066,
    uuid: "11200001066",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c66\u8bfe\u7a0b",
    content:
      "In 1963 a Lancaster bomber crashed on Wallis Island, a remote place in the South Pacific, a long way west of Samoa. The plane wasn't too badly damaged, but over the years, the crash was forgotten and the wreck remained undisturbed. Then in 1989, twenty-six years after the crash, the plane was accidentally rediscovered in an aerial survey of the island. By this time, a Lancaster bomber in reasonable condition was rare and worth rescuing. The French authorities had the plane packaged and moved in parts back to France. Now a group of enthusiasts are going to have the plane restored. It has four Rolls-Royce Merlin engines, but the group will need to have only three of them rebuilt. Imagine their surprise and delight when they broke open the packing cases and found that the fourth engine was sweet as honey -- still in perfect condition. A colony of bees had turned the engine into a hive and it was totally preserved in beeswax!",
    createdAt: 1752834879212,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c66\u8bfe\u5185\u5bb9",
    wordCount: 164,
  },
  {
    id: 1120000067,
    uuid: "11200001067",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c67\u8bfe\u7a0b",
    content:
      "Haroun Tazieff, the Polish scientist, has spent his lifetime studying active volcanoes and deep caves in all parts of the world. In 1948, he went to Lake Kivu in the Congo to observe a new volcano which he later named Kituro. Tazieff was able to set up his camp very close to the volcano while it was erupting violently. Though he managed to take a number of brilliant photographs, he could not stay near the volcano for very long. He noticed that a river of liquid rock was coming towards him. It threatened to surround him completely, but Tazieff managed to escape just in time.  He waited until the volcano became quiet and he was able to return two days later. This time, he managed to climb into the mouth of Kituro so that he could take photographs and measure temperatures. Tazieff has often risked his life in this way. He has been able to tell us more about active volcanoes than any man alive.",
    createdAt: 1752834880791,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c67\u8bfe\u5185\u5bb9",
    wordCount: 165,
  },
  {
    id: 1120000068,
    uuid: "11200001068",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c68\u8bfe\u7a0b",
    content:
      "I crossed the street to avoid meeting him, but he saw me and came running towards me. It was no use pretending that I had not seen him, so I waved to him. I never enjoy meeting Nigel Dykes. He never has anything to do. No matter how busy you are, he always insists on coming with you. I had to think of a way of preventing him from following me around all morning.\t'Hello, Nigel,' I said. 'Fancy meeting you here!''Hi, Elizabeth,' Nigel answered. 'I was just wondering how to spend the morning -- until I saw you. You're not busy doing anything, are you?''No, not at all,' I answered. 'I'm going to...''Would you mind my coming with you?' he asked, before I had finished speaking.'Not at all,' I lied, 'but I'm going to the dentist.''Then I'll come with you,' he answered. 'There's always plenty to read in the waiting room!",
    createdAt: 1752834881980,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c68\u8bfe\u5185\u5bb9",
    wordCount: 152,
  },
  {
    id: 1120000069,
    uuid: "11200001069",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c69\u8bfe\u7a0b",
    content:
      "I was being tested for a driving licence for the third time. I had been asked to drive in heavy traffic and had done so successfully. \tAfter having been instructed to drive out of town, I began to acquire confidence. Sure that I had passed, I was almost beginning to enjoy my test. The examiner must have been pleased with my performance, for he smiled and said. 'Just one more thing, Mr.Eames. Let us suppose that a child suddenly crosses the road in front of you. As soon as I tap on the window, you must stop within five feet.'  I continued driving and after some time, the examiner tapped loudly, Though the sound could be heard clearly, it took me a long time to react. I suddenly pressed the brake pedal and we were both thrown forward. The examiner looked at me sadly. 'Mr.Eames,' he said, in a mournful voice, 'you have just killed that child!'",
    createdAt: 1752834883052,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c69\u8bfe\u5185\u5bb9",
    wordCount: 157,
  },
  {
    id: 1120000070,
    uuid: "11200001070",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c70\u8bfe\u7a0b",
    content:
      "During a bullfight, a drunk suddenly wandered into the middle of the ring. The crowd began to shout, but the drunk was unaware of the danger. The bull was busy with the matador at the time, but it suddenly caught sight of the drunk who was shouting rude remarks and waving a red cap. Apparently sensitive to criticism, the bull forgot all about the matador and charged at the drunk. The crowd suddenly grew quiet. The drunk, however, seemed quite sure of himself. When the bull got close to him, he clumsily stepped aside to let it pass. The crowd broke into cheers and the drunk bowed. By this time, however, three men had come into the ring and they quickly dragged the drunk to safety.Even the bull seemed to feel sorry for him, for it looked on sympathetically until the drunk was out of the way before once more turning its attention to the matador.",
    createdAt: 1752834885194,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c70\u8bfe\u5185\u5bb9",
    wordCount: 156,
  },
  {
    id: 1120000071,
    uuid: "11200001071",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c71\u8bfe\u7a0b",
    content:
      "When you visit London,one of the first things you will see is Big Ben , the famous clock which can be heard all over the world on the B.B.C. If the Houses of Parliament had not been burned down in 1834, the great clock would never have been erected. Big Ben takes its name from Sir Benjamin Hall who was responsible for the making of the clock when the new Houses of Parliament were being built. It is not only of immense size, but is extremely accurate as well. Officials from Greenwich Observatory have the clock checked twice a day. On the B.B.C. you can hear the clock when it is actually striking because microphones are connected to the clock tower.Big Ben has rarely gone wrong. Once, however, it failed to give the correct time. A painter who had been working on the tower hung a pot of paint on one of the hands and slowed it down!",
    createdAt: 1752834886313,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c71\u8bfe\u5185\u5bb9",
    wordCount: 158,
  },
  {
    id: 1120000072,
    uuid: "11200001072",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c72\u8bfe\u7a0b",
    content:
      "The great racing driver, Sir Malcolm Campbell, was the first man to drive at over 300 miles per hour. He set up a new world record in September 1935 at Bonneville Salt Flats, Utah. Bluebird, the car he was driving, had been specially built for him. It was over 30 feet in length and had a 2,500-horsepower engine.  After his attempt, Campbell was disappointed to learn that his average speed had been 299 miles per hour. However, a few days later, he was told that a mistake had been made. His average speed had been 301 miles per hour.",
    createdAt: 1752834887465,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c72\u8bfe\u5185\u5bb9",
    wordCount: 99,
  },
  {
    id: 1120000073,
    uuid: "11200001073",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c73\u8bfe\u7a0b",
    content:
      "Children who play truant from school are unimaginative. A quiet day's fishing, or eight hours in a cinema seeing the same film over and over again, is usually as far as they get.  They have all been put to shame by a boy who, while playing truant, travelled 1,600 miles. He hitchhiked to Dover and, towards evening, went into a boat to find somewhere to sleep. When he woke up next morning, he discovered that the boat had, in the meantime, travelled to Calais. No one noticed the boy as he crept off. From there, he hitchhiked to Paris in a lorry. The driver gave him a few biscuits and a cup of coffee and left him just outside the city. The next car the boy stopped did not take him into the centre of Paris as he hoped it would, but to Perpignan on the French-Spanish border. There he was picked up by a policeman and sent back to England by the local authorities. He has surely set up a record for the thousands of children who dream of evading school.",
    createdAt: 1752834888575,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c73\u8bfe\u5185\u5bb9",
    wordCount: 182,
  },
  {
    id: 1120000074,
    uuid: "11200001074",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c74\u8bfe\u7a0b",
    content:
      "An ancient bus stopped by a dry river bed and a party of famous actors and actresses got off. Dressed in dark glasses and old clothes, they had taken special precautions so that no one should recognize them. But as they soon discovered, disguises can sometimes be too perfect.'This is a wonderful place for a picnic,' said Gloria Gleam.'It couldn't be better, Gloria,' Brinksley Meers agreed. 'No newspaper men, no film fans! Why don't we come more often?'Meanwhile, two other actors, Rockwall Slinger and Merlin Greeves, had carried two large food baskets to a shady spot under some trees. When they had all made themselves comfortable, a stranger appeared. He looked very angry. 'Now you get out of here, all of you!' he shouted. 'I'm sheriff here. Do you see that notice? It says \"No Camping\" -- in case you can't read!''Look, sheriff,' said Rockwall, 'don't be too hard on us. I'm Rockwall Slinger and this is Merlin Greeves.''Oh, is it?' said the sheriff with a sneer. 'Well, I'm Brinksley Meers, and my other name is Gloria Gleam. Now you get out of here fast!'",
    createdAt: 1752834889666,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c74\u8bfe\u5185\u5bb9",
    wordCount: 185,
  },
  {
    id: 1120000075,
    uuid: "11200001075",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c75\u8bfe\u7a0b",
    content:
      "When a light passenger plane flew off course some time ago, it crashed in the mountains and its pilot was killed. The only passengers, a young woman and her two baby daughters, were unhurt. It was the middle of winter. Snow lay thick on the ground. The woman knew that the nearest village was miles away. When it grew dark, she turned a suitcase into a bed and put the children inside it, covering them with all the clothes she could find. During the night, it got terribly cold. The woman kept as near as she could to the children and even tried to get into the case herself, but it was too small. Early next morning, she heard planes passing overhead and wondered how she could send a signal. Then she had an idea. She stamped out the letters 'SOS' in the snow. Fortunately, a pilot saw the signal and sent a message by radio to the nearest town. It was not long before a helicopter arrived on the scene to rescue the survivors of the plane crash.",
    createdAt: 1752834890751,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c75\u8bfe\u5185\u5bb9",
    wordCount: 179,
  },
  {
    id: 1120000076,
    uuid: "11200001076",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c76\u8bfe\u7a0b",
    content:
      " 'To end our special news bulletin,' said the voice of the television announcer, 'we're going over to the macaroni fields of Calabria. Macaroni has been grown in this area for over six hundred years. Two of the leading growers, Giuseppe Moldova and Riccardo Brabante, tell me that they have been expecting a splendid crop this year and harvesting has begun earlier than usual. Here you can see two workers who, between them, have just finished cutting three cartloads of golden brown macaroni stalks. The whole village has been working day and night gathering and threshing this year's crop before the September rains. On the right, you can see Mrs. Brabante herself. She has been helping her husband for thirty years now. Mrs. Brabante is talking to the manager of the local factory where the crop is processed. This last scene shows you what will happen at the end of the harvest: the famous Calabrian macaroni-eating competition! Signor Fratelli, the present champion, has won it every year since 1991. And that ends our special bulletin for today, Thursday, April lst. We're now going back to the studio.'",
    createdAt: 1752834891825,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c76\u8bfe\u5185\u5bb9",
    wordCount: 186,
  },
  {
    id: 1120000077,
    uuid: "11200001077",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c77\u8bfe\u7a0b",
    content:
      "The mummy of an Egyptian woman who died in 800 B.C. has just had an operation. The mummy is that of Shepenmut who was once a singer in the Temple of Thebes. As there were strange marks on the X-ray plates taken of the mummy, doctors have been trying to find out whether the woman died of a rare disease. The only way to do this was to operate. The operation, which lasted for over four hours, proved to be very difficult because of the hard resin which covered the skin. The doctors removed a section of the mummy and sent it to a laboratory. They also found something which the X-ray plates did not show: a small wax figure of the god Duamutef. This god which has the head of a cow was normally placed inside a mummy. The doctors have not yet decided how the woman died. They feared that the mummy would fall to pieces when they cut it open, but fortunately this has not happened. The mummy successfully survived the operation.",
    createdAt: 1752834893975,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c77\u8bfe\u5185\u5bb9",
    wordCount: 175,
  },
  {
    id: 1120000078,
    uuid: "11200001078",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c78\u8bfe\u7a0b",
    content:
      "After reading an article entitled 'Cigarette Smoking and Your Health' I lit a cigarette to calm my nerves. I smoked with concentration and pleasure as I was sure that this would be my last cigarette. For a whole week I did not smoke at all and during this time, my wife suffered terribly. I had all the usual symptoms of someone giving up smoking: a bad temper and an enormous appetite. My friends kept on offering me cigarettes and cigars. They made no effort to hide their amusement whenever I produced a packet of sweets from my pocket. After seven days of this I went to a party. Everybody around me was smoking and I felt extremely uncomfortable. When my old friend Brian urged me to accept a cigarette, it was more than I could bear. I took one guiltily, lit it and smoked with satisfaction. My wife was delighted that things had returned to normal once more. Anyway, as Brian pointed out, it is the easiest thing in the world to give up smoking. He himself has done it lots of times!",
    createdAt: 1752834895053,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c78\u8bfe\u5185\u5bb9",
    wordCount: 183,
  },
  {
    id: 1120000079,
    uuid: "11200001079",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c79\u8bfe\u7a0b",
    content:
      "I used to travel by air a great deal when I was a boy. My parents used to live in South America and I used to fly there from Europe in the holidays. A flight attendant would take charge of me and I never had an unpleasant experience. I am used to traveling by air and only on one occasion have I ever felt frightened. After taking off, we were flying low over the city and slowly gaining height, when the plane suddenly turned round and flew back to the airport. While we were waiting to land, a flight attendant told us to keep calm and to get off the plane quietly as soon as it had touched down. Everybody on board was worried and we were curious to find out what had happened. Later we learnt that there was a very important person on board. The police had been told that a bomb had been planted on the plane. After we had landed, the plane was searched thoroughly. Fortunately, nothing was found and five hours later we were able to take off again.",
    createdAt: 1752834896173,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c79\u8bfe\u5185\u5bb9",
    wordCount: 184,
  },
  {
    id: 1120000080,
    uuid: "11200001080",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c80\u8bfe\u7a0b",
    content:
      "Perhaps the most extraordinary building of the nineteeth century was the Crystal Palace, which was built in Hyde Park for the Great Exhibition of 1851. The Crystal Palace was different from all other buildings in the world, for it was made of iron and glass. It was one of the biggest buildings of all time and a lot of people from many countries came to see it. A great many goods were sent to the exhibition from various parts of the world. There was also a great deal of machinery on display. The most wonderful piece of machinery on show was Nasmyth's steam hammer. Though in those days, traveling was not as easy as it is today, steam boats carried thousands of visitors across the Channel from Europe. On arriving in England, they were taken to the Crystal Palace by train. There were six million visitors in all, and the profits from the exhibition were used to build museums and colleges. Later, the Crystal Palace was moved to South London. It remained one of the most famous buildings in the world until it was burnt down in 1936..",
    createdAt: 1752834897264,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c80\u8bfe\u5185\u5bb9",
    wordCount: 188,
  },
  {
    id: 1120000081,
    uuid: "11200001081",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c81\u8bfe\u7a0b",
    content:
      "When he had killed the guard, the prisoner of war quickly dragged him into the bushes. Working rapidly in the darkness, he soon changed into the dead man's clothes. Now, dressed in a blue uniform and with a rifle over his shoulder, the prisoner marched boldly up and down in front of the camp. He could hear shouting in the camp itself. Lights were blazing and men were running here and there: they had just discovered that a prisoner had escaped. At that moment, a large black car with four officers inside it, stopped at the camp gates. The officers got out and the prisoner stood to attention and saluted as they passed. When they had gone, the driver of the car came towards him. The man obviously wanted to talk. He was rather elderly with grey hair and clear blue eyes. The prisoner felt sorry for him, but there was nothing else he could do. As the man came near, the prisoner knocked him to the ground with a sharp blow. Then, jumping into the car, he drove off as quickly as he could.",
    createdAt: 1752834898353,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c81\u8bfe\u5185\u5bb9",
    wordCount: 185,
  },
  {
    id: 1120000082,
    uuid: "11200001082",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c82\u8bfe\u7a0b",
    content:
      "Fishermen and sailors sometimes claim to have seen monsters in the sea. Though people have often laughed at stories told by seamen, it is now known that many of these 'monsters' which have at times been sighted are simply strange fish. Occasionally, unusual creatures are washed to the shore, but they are rarely caught out at sea. Some time ago, however, a peculiar fish was caught near Madagascar.A small fishing boat was carried miles out to sea by the powerful fish as it pulled on the line. Realizing that this was no ordinary fish, the fisherman made every effort not to damage it in any way. When it was eventually brought to shore, it was found to be over thirteen feet long. It had a head like a horse, big blue eyes, shining silver skin, and a bright red tail. The fish, which has since been sent to a museum where it is being examined by a scientist, is called an oarfish. Such creatures have rarely been seen alive by man as they live at a depth of six hundred feet.",
    createdAt: 1752834899463,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c82\u8bfe\u5185\u5bb9",
    wordCount: 181,
  },
  {
    id: 1120000083,
    uuid: "11200001083",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c83\u8bfe\u7a0b",
    content:
      "The former Prime Minister, Mr. Wentworth Lane, was defeated in the recent elections. He is now retiring from political life and has gone abroad. My friend, Patrick, has always been a fanatical opponent of Mr. Lane's Radical Progressive Party. After the elections, Patrick went to the former Prime Minister's house. When he asked if Mr. Lane lived there, the policeman on duty told him that since his defeat, the ex-Prime Minister had gone abroad.On the following day, Patrick went to the house again. The same policeman was just walking slowly past the entrance, when Patrick asked the same question. Though a little suspicious this time, the policeman gave him the same answer. The day after, Patrick went to the house once more and asked exactly the same question. This time, the policeman lost his temper. 'I told you yesterday and the day before yesterday,' he shouted, 'Mr. Lane was defeated in the elections. He has retired from political life and gone to live abroad!\"I know,' answered Patrick, 'but I love to hear you say it!'",
    createdAt: 1752834903460,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c83\u8bfe\u5185\u5bb9",
    wordCount: 175,
  },
  {
    id: 1120000084,
    uuid: "11200001084",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c84\u8bfe\u7a0b",
    content:
      "Busmen have decided to go on strike next week. The strike is due to begin on Tuesday. No one knows how long it will last. The busmen have stated that the strike will continue until general agreement is reached about pay and working conditions. Most people believe that the strike will last for at least a week. Many owners of private cars are going to offer 'free rides' to people on their way to work. This will relieve pressure on the trains to some extent. Meanwhile, a number of university students have volunteered to drive buses while the strike lasts. All the students are expert drivers, but before they drive any of the buses, they will have to pass a special test. The students are going to take the test in two days' time. Even so, people are going to find it difficult to get to work. But so far, the public has expressed its gratitude to the students in letters to the Press. Only one or two people have objected that the students will drive too fast!",
    createdAt: 1752834904524,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c84\u8bfe\u5185\u5bb9",
    wordCount: 178,
  },
  {
    id: 1120000085,
    uuid: "11200001085",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c85\u8bfe\u7a0b",
    content:
      "I have just received a letter from my old school, informing me that my former headmaster, Mr. Stuart Page, will be retiring next week. Pupils of the school, old and new, will be sending him a present to mark the occasion. All those who have contributed towards the gift will sign their names in a large album which will be sent to the headmaster's home. We shall all remember Mr. Page for his patience and understanding and for the kindly encouragement he gave us when we went so unwillingly to school. A great many former pupils will be attending a farewell dinner in his honour next Thursday. It is a curious coincidence that the day before his retirement, Mr. Page will have been teaching for a total of forty years. After he has retired, he will devote himself to gardening. For him, this will be an entirely new hobby. But this does not matter, for, as he has often remarked, one is never too old to learn.",
    createdAt: 1752834905600,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c85\u8bfe\u5185\u5bb9",
    wordCount: 167,
  },
  {
    id: 1120000086,
    uuid: "11200001086",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c86\u8bfe\u7a0b",
    content:
      "As the man tried to swing the speedboat round, the steering wheel came away in his hands. He waved desperately to his companion, who had been water skiing for the last fifteen minutes.  Both men had hardly had time to realize what was happening when they were thrown violently into the sea. The speedboat had struck a buoy, but it continued to move very quickly across the water.  Both men had just begun to swim towards the shore, when they noticed with dismay that the speedboat was moving in a circle. It now came straight towards them at tremendous speed.  In less than a minute, it roared past them only a few feet away. After it had passed, they swam on as quickly as they could because they knew that the boat would soon return. They had just had enough time to swim out of danger when the boat again completed a circle. On this occasion, however, it had slowed down considerably. The petrol had nearly all been used up. Before long, the noise dropped completely and the boat began to drift gently across the water.",
    createdAt: 1752834906679,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c86\u8bfe\u5185\u5bb9",
    wordCount: 186,
  },
  {
    id: 1120000087,
    uuid: "11200001087",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c87\u8bfe\u7a0b",
    content:
      "'At the time the murder was committed, I was travelling on the 8 o'clock train to London,' said the man.'Do you always catch such an early train?' asked the inspector. 'Of course I do,' answered the man. 'I must be at work at 10 o'clock. My employer will confirm that I was there on time.' 'Would a later train get you to work on time?' asked the inspector. 'I suppose it would, but I never catch a later train.' 'At what time did you arrive at the station?' 'At ten to eight. I bought a paper and waited for the train.' 'And you didn't notice anything unusual?' 'Of course not.' 'I suggest,' said the inspector, 'that you are not telling the truth. I suggest that you did not catch the 8 o'clock train, but that you caught the 8.25 which would still get you to work on time. You see, on the morning of the murder, the 8 o'clock train did not run at all. It broke down at Ferngreen station and was taken off the line.'",
    createdAt: 1752834907754,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c87\u8bfe\u5185\u5bb9",
    wordCount: 177,
  },
  {
    id: 1120000088,
    uuid: "11200001088",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c88\u8bfe\u7a0b",
    content:
      "Six men have been trapped in a mine for seventeen hours. If they are not brought to the surface soon they may lose their lives. However, rescue operations are proving difficult. If explosives are used, vibrations will cause the roof of the mine to collapse. Rescue workers are therefore drilling a hole on the north side of the mine. They intend to bring the men up in a special capsule. Meanwhile, a microphone, which was lowered into the mine two hours ago, has enabled the men to keep in touch with their closest relatives. Though they are running out of food and drink, the men are cheerful and confident that they will get out soon. They have been told that rescue operations are progressing smoothly. If they knew how difficult it was to drill through the hard rock, they would lose heart.",
    createdAt: 1752834908833,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c88\u8bfe\u5185\u5bb9",
    wordCount: 142,
  },
  {
    id: 1120000089,
    uuid: "11200001089",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c89\u8bfe\u7a0b",
    content:
      "People will do anything to see a free show -- even if it is a bad one. When the news got round that a comedy show would be presented at our local cinema by the P. and U. Bird Seed Company, we all rushed to see it. We had to queue for hours to get in and there must have been several hundred people present just before the show began. Unfortunately, the show was one of the dullest we have ever seen. Those who failed to get in need not have felt disappointed, as many of the artistes who should have appeared did not come. The only funny things we heard that evening came from the advertiser at the beginning of the programme.He was obviously very nervous and for some minutes stood awkwardly before the microphone. As soon as he opened his mouth, everyone burst out laughing. \t We all know what the poor man should have said, but what he actually said was: 'This is the Poo and Ee Seed Bird Company. Good ladies, evening and gentlemen!\"",
    createdAt: 1752834915060,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c89\u8bfe\u5185\u5bb9",
    wordCount: 177,
  },
  {
    id: 1120000090,
    uuid: "11200001090",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c90\u8bfe\u7a0b",
    content:
      "Fish and chips has always been a favourite dish in Britain, but as the oceans have been overfished, fish has become more and more expensive. So it comes as a surprise to learn that giant fish are terrifying the divers on North Sea oil rigs.  Oil rigs have to be repaired frequently and divers, who often have to work in darkness a hundred feet under water, have been frightened out of their wits by giant fish bumping into them as they work. Now they have had special cages made to protect them from these monsters. The fish are not sharks or killer whales, but favourite eating varieties like cod and skate which grow to unnatural sizes, sometimes as much as twelve feet in length. Three factors have caused these fish to grow so large: the warm water round the hot oil pipes under the sea; the plentiful supply of food thrown overboard by the crews on the rigs; the total absence of fishing boats around the oil rigs. \tAs a result, the fish just eat and eat and grow and grow in the lovely warm water. Who eats who?",
    createdAt: 1752834916127,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c90\u8bfe\u5185\u5bb9",
    wordCount: 189,
  },
  {
    id: 1120000091,
    uuid: "11200001091",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c91\u8bfe\u7a0b",
    content:
      "A pilot noticed a balloon which seemed to be making for a Royal Air Force Station nearby. He informed the station at once, but no one there was able to explain the mystery.  The officer in the control tower was very angry when he heard the news, because balloons can be a great danger to aircraft. He said that someone might be spying on the station and the pilot was ordered to keep track of the strange object.  The pilot managed to circle the balloon for some time. He could make out three men in a basket under it and one of them was holding a pair of binoculars. When the balloon was over the station, the pilot saw one of the men taking photographs. Soon afterwards, the balloon began to descend and it landed near an airfield. The police were called in, but they could not arrest anyone, for the basket contained two Members of Parliament and the Commanding Officer of the station! As the Commanding Officer explained later, one half of the station did not know what the other half was doing!",
    createdAt: 1752834917193,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c91\u8bfe\u5185\u5bb9",
    wordCount: 184,
  },
  {
    id: 1120000092,
    uuid: "11200001092",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c92\u8bfe\u7a0b",
    content:
      "It must have been about two in the morning when I returned home. I tried to wake up my wife by ringing the doorbell, but she was fast asleep, so I got a ladder from the shed in the garden, put it against the wall, and began climbing towards the bedroom window. I was almost there when a sarcastic voice below said, 'I don't think the windows need cleaning at this time of the night.' I looked down and nearly fell off the ladder when I saw a policeman. I immediately regretted answering in the way I did, but I said, 'I enjoy cleaning windows at night.''So do I,' answered the policeman in the same tone. 'Excuse my interrupting you. I hate to interrupt a man when he's busy working, but would you mind coming with me to the station?'\t'Well, I'd prefer to stay here,' I said. 'You see. I've forgotten my key.' 'Your what?' he called. 'My key,' I shouted. Fortunately, the shouting woke up my wife who opened the window just as the policeman had started to climb towards me.",
    createdAt: 1752834918404,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c92\u8bfe\u5185\u5bb9",
    wordCount: 183,
  },
  {
    id: 1120000093,
    uuid: "11200001093",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c93\u8bfe\u7a0b",
    content:
      "One of the most famous monuments in the world, the Statue of Liberty, was presented to the United States of America in the nineteenth century by the people of France.  The great statue, which was designed by the sculptor Auguste Bartholdi, took ten years to complete. The actual figure was made of copper supported by a metal framework which had been especially constructed by Eiffel. 'Before it could be transported to the United States, a site had to be found for it and a pedestal had to be built. The site chosen was an island at the entrance of New York Harbour. \tBy 1884, a statue which was 151 feet tall had been erected in Paris. The following year, it was taken to pieces and sent to America. By the end of October 1886, the statue had been put together again and it was officially presented to the American people by Bartholdi. Ever since then, the great monument has been a symbol of liberty for the millions of people who have passed through New York Harbour to make their homes in America.",
    createdAt: 1752834919492,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c93\u8bfe\u5185\u5bb9",
    wordCount: 182,
  },
  {
    id: 1120000094,
    uuid: "11200001094",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c94\u8bfe\u7a0b",
    content:
      "Experiments have proved that children can be instructed in swimming at a very early age. At a special swimming pool in Los Angeles, children become expert at holding their breath under water even before they can walk.Babies of two months old do not appear to be reluctant to enter the water. It is not long before they are so accustomed to swimming that they can pick up weights from the floor of the pool. A game that is very popular with these young swimmers is the underwater tricycle race. Tricycles are lined up on the floor of the pool seven feet under water. The children compete against each other to reach the other end of the pool. Many pedal their tricycles, but most of them prefer to push or drag them. Some children can cover the whole length of the pool without coming up for breath even once. Whether they will ever become future Olympic champions, only time will tell. Meanwhile, they should encourage those among us who cannot swim five yards before they are gasping for air.",
    createdAt: 1752834920568,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c94\u8bfe\u5185\u5bb9",
    wordCount: 178,
  },
  {
    id: 1120000095,
    uuid: "11200001095",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c95\u8bfe\u7a0b",
    content:
      "When the Ambassador or Escalopia returned home for lunch, his wife got a shock. He looked pale and his clothes were in a frightful state.'What has happened?' she asked. 'How did your clothes get into such a mess?' 'A fire extinguisher, my dear,' answered the Ambassador drily. 'University students set the Embassy on fire this morning.' 'Good heavens!' exclaimed his wife. 'And where were you at the time?' 'I was in my office as usual,' answered the Ambassador. 'The fire broke out in the basement. I went down immediately, of course, and that fool, Horst, aimed a fire extinguisher at me. He thought I was on fire. I must definitely get that fellow posted.' The Ambassador's wife went on asking questions, when she suddenly noticed a big hole in her husband's hat. 'And how can you explain that?' she asked. 'Oh, that,' said the Ambassador. 'Someone fired a shot through my office window. Accurate, don't you think? Fortunately, I wasn't wearing it at the time. If I had been, I would not have been able to get home for lunch.'",
    createdAt: 1752834925460,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c95\u8bfe\u5185\u5bb9",
    wordCount: 180,
  },
  {
    id: 1120000096,
    uuid: "11200001096",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c - \u7b2c96\u8bfe\u7a0b",
    content:
      "A Festival for the Dead is held once a year in Japan. This festival is a cheerful occasion, for on this day, the dead are said to return to their homes and they are welcomed by the living.As they are expected to be hungry after their long journey, food is laid out for them. Specially-made lanterns are hung outside each house to help the dead to find their way. All night long, people dance and sing. In the early morning, the food that had been laid out for the dead is thrown into a river or into the sea as it is considered unlucky for anyone living to eat it. In towns that are near the sea, the tiny lanterns which had been hung in the streets the night before, are placed into the water when the festival is over. Thousands of lanterns slowly drift out to sea guiding the dead on their return journey to the other world. This is a moving spectacle, for crowds of people stand on the shore watching the lanterns drifting away until they can be seen no more.",
    createdAt: 1752834926516,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e8c\u518c\u7b2c96\u8bfe\u5185\u5bb9",
    wordCount: 184,
  },
];
// 新概念英语第三册
const nce3Articles: OfficialArticle[] = [
  {
    id: 1120000001,
    uuid: "11200001001",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c1\u8bfe\u7a0b",
    content:
      "Pumas are large, cat-like animals which are found in America. When reports came into London Zoo that a wild puma had been spotted forty-five miles south of London, they were not taken seriously. However, as the evidence began to accumulate, experts from the Zoo felt obliged to investigate, for the descriptions given by people who claimed to have seen the puma were extraordinarily similar.The hunt for the puma began in a small village where a woman picking blackberries saw 'a large cat' only five yards away from her. It immediately ran away when she saw it, and experts confirmed that a puma will not attack a human being unless it is cornered. The search proved difficult, for the puma was often observed at one place in the morning and at another place twenty miles away in the evening. Wherever it went, it left behind it a trail of dead deer and small animals like rabbits. Paw prints were seen in a number of places and puma fur was found clinging to bushes. Several people complained of \"cat-like noises' at night and a businessman on a fishing trip saw the puma up a tree. The experts were now fully convinced that the animal was a puma, but where had it come from? As no pumas had been reported missing from any zoo in the country, this one must have been in the possession of a private collector and somehow managed to escape. The hunt went on for several weeks, but the puma was not caught. It is disturbing to think that a dangerous wild animal is still at large in the quiet countryside.",
    createdAt: 1752835398410,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c1\u8bfe\u5185\u5bb9",
    wordCount: 272,
  },
  {
    id: 1120000002,
    uuid: "11200001002",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c2\u8bfe\u7a0b",
    content:
      "Our vicar is always raising money for one cause or another, but he has never managed to get enough money to have the church clock repaired. The big clock which used to strike the hours day and night was damaged many years ago and has been silent ever since.One night, however, our vicar woke up with a start: the clock was striking the hours! Looking at his watch, he saw that it was one o'clock, but the bell struck thirteen times before it stopped. Armed with a torch, the vicar went up into the clock tower to see what was going on. In the torchlight, he caught sight of a figure whom he immediately recognized as Bill Wilkins, our local grocer.'Whatever are you doing up here Bill?' asked the vicar in surprise. 'I'm trying to repair the bell,' answered Bill. 'I've been coming up here night after night for weeks now. You see, I was hoping to give you a surprise.''You certainly did give me a surprise!' said the vicar. 'You've probably woken up everyone in the village as well. Still, I'm glad the bell is working again.'That's the trouble, vicar,' answered Bill. 'It's working all right, but I'm afraid that at one o'clock it will strike thirteen times and there's nothing I can do about it.\"We'll get used to that, Bill,' said the vicar. \"Thirteen is not as good as one, but it's better than nothing. Now let's go downstairs and have a cup of tea.'",
    createdAt: 1752835399621,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c2\u8bfe\u5185\u5bb9",
    wordCount: 247,
  },
  {
    id: 1120000003,
    uuid: "11200001003",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c3\u8bfe\u7a0b",
    content:
      "Some time ago, an interesting discovery was made by archaeologists on the Aegean island of Kea. An American team explored a temple which stands in an ancient city on the promontory of Ayia Irini. The city at one time must have been prosperous, for it enjoyed a high level of civilization. Houses -- often three storeys high -- were built of stone. They had large rooms with beautifully decorated walls. The city was equipped with a drainage system, for a great many clay pipes were found beneath the narrow streets. The temple which the archaeologists explored was used as a place of worship from the fifteenth century B.C. until Roman times. In the most sacred room of temple, clay fragments of fifteen statues were found. Each of these represented a goddess and had, at one time, been painted. The body of one statue was found among remains dating from the fifteenth century B.C. It's missing head happened to be among remains of the fifth century B.C. This head must have been found in Classical times and carefully preserved. It was very old and precious even then. When the archaeologists reconstructed the fragments, they were amazed to find that the goddess turned out to be a very modern-looking woman. She stood three feet high and her hands rested on her hips. She was wearing a full-length skirt which swept the ground. Despite her great age, she was very graceful indeed, but, so far, the archaeologists have been unable to discover her identity.",
    createdAt: 1752835400712,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c3\u8bfe\u5185\u5bb9",
    wordCount: 251,
  },
  {
    id: 1120000004,
    uuid: "11200001004",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c4\u8bfe\u7a0b",
    content:
      "These days, people who do manual work often receive far more money than people who work in offices. People who work in offices are frequently referred to as \"white-collar workers' for the simple reason that they usually wear a collar and tie to go to work. Such is human nature, that a great many people are often willing to sacrifice higher pay for the privilege of becoming white-collar workers. This can give rise to curious situations, as it did in the case of Alfred Bloggs who worked as a dustman for the Ellesmere Corporation. When he got married, Alf was too embarrassed to say anything to his wife about his job. He simply told her that he worked for the Corporation. Every morning, he left home dressed in a smart black suit. He then changed into overalls and spent the next eight hours as a dustman. Before returning home at night. He took a shower and changed back into his suit. Alf did this for over two years and his fellow dustmen kept his secret Alf's wife has never discovered that she married a dustman and she never will, for Alf has just found another job. He will soon be working in an office. He will be earning only half as much as he used to, but he feels that his rise in status is well worth the loss of money. From now on, he will wear a suit all day and others will call him 'Mr. Bloggs', not 'Alf'.",
    createdAt: 1752835401801,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c4\u8bfe\u5185\u5bb9",
    wordCount: 250,
  },
  {
    id: 1120000005,
    uuid: "11200001005",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c5\u8bfe\u7a0b",
    content:
      "Editors of newspapers and magazines often go to extremes to provide their reader with unimportant facts and statistics. Last year a journalist had been instructed by a well-known magazine to write an article on the president's palace in a new African republic. When the article arrived, the editor read the first sentence and then refuse to publish it. The article began: 'Hundreds of steps lead to the high wall which surrounds the president's palace'. The editor at once sent the journalist a fax instructing him to find out the exact number of steps and the height of the wall. The journalist immediately set out to obtain these important facts, but the took a long time to send them Meanwhile, the editor was getting impatient, for the magazine would soon go to press. He sent the journalist two more faxes, but received no reply. He sent yet another fax informing the journalist that if he did not reply soon he would be fired. When the journalist again failed to reply, the editor reluctantly published the article as it had originally been written. A week later, the editor at last received a fax from the journalist. Not only had the poor man been arrested, but he had been sent to prison as well. However, he had at last been allowed to send a fax in which he informed the editor that the he had been arrested while counting the 1,084 steps leading to the fifteen-foot wall which surrounded the president's palace.",
    createdAt: 1752835402893,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c5\u8bfe\u5185\u5bb9",
    wordCount: 249,
  },
  {
    id: 1120000006,
    uuid: "11200001006",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c6\u8bfe\u7a0b",
    content:
      "The expensive shops in a famous arcade near Piccadilly were just opening. At this time of the morning, the arcade was almost empty. Mr. Taylor, the owner of a jewellery shop was admiring a new display. Two of his assistants had been working busily since eight o'clock and had only just finished. Diamond necklaces and rings had been beautifully arranged on a background of black velvet. After gazing at the display for several minutes, Mr. Taylor went back into his shop.The silence was suddenly broken when a large car, with its headlights on and its horn blaring, roared down the arcade. It came to a stop outside the jeweller's. One man stayed at the wheel while two others with black stocking over their faces jumped out and smashed the window of the shop with iron bars. While this was going on, Mr. Taylor was upstairs. He and his staff began throwing furniture out of the window. Chairs and tables went flying into the arcade. One of the thieves was struck by a heavy statue, but he was too busy helping himself to diamonds to notice any pain. The raid was all over in three minutes, for the men scrambled back into the car and it moved off at a fantastic speed. Just as it was leaving, Mr. Taylor rushed out and ran after it throwing ashtrays and vases, but it was impossible to stop the thieves. They had got away with thousands of pounds worth of diamonds.",
    createdAt: 1752835403968,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c6\u8bfe\u5185\u5bb9",
    wordCount: 247,
  },
  {
    id: 1120000007,
    uuid: "11200001007",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c7\u8bfe\u7a0b",
    content:
      "Has it ever happened to you? Have you ever put your trousers in the washing machine and then remembered there was a large bank note in your back pocket? When you rescued your trousers, did note in your back pocket? When you rescued your trousers, did you find the note was whiter than white? People who live in Britain needn't despair when they made mistakes like this (and a lot of people do)! Fortunately for them, the Bank of England has a team called Mutilated Ladies which deals with claims from people who fed their money to a machine or to their dog. Dogs, it seems, love to chew up money!A recent case concerns Jane Butlin whose fianc\u00e9, John, runs a successful furniture business. John had very good day and put his wallet containing $3,000 into the microwave oven for safekeeping. Then he and Jane went horse-riding. When they got home, Jane cooked their dinner in the microwave oven and without realizing it, cooked her fianc\u00e9's wallet as well. Imagine their dismay when they found a beautifully-cooked wallet and notes turned to ash! John went to see his bank manager who sent the remains of wallet and the money to the special department of the Bank of England in Newcastle: the Mutilate Ladies! They examined the remain and John got all his money back. 'So long as there's something to identify, we will give people their money back,' said a spokeswoman for the Bank. 'Last year, we paid $1.5m on 21,000 claims. Damaged bank notes. The Queen's head appears on English bank notes, and 'lady' refers to this.",
    createdAt: 1752835405047,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c7\u8bfe\u5185\u5bb9",
    wordCount: 268,
  },
  {
    id: 1120000008,
    uuid: "11200001008",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c8\u8bfe\u7a0b",
    content:
      "The Great St. Bernard Pass connects Switzerland to Italy. At 2,473 metres, it is the highest mountain pass in Europe. The famous monastery of St. Bernard, witch was founded in eleventh century, lies about a mile away. For hundreds of years, St. Bernard dogs have saved the lives of travellers crossing the dangerous Pass. These friendly dogs, which were first brought from Asia, were used as watchdogs even in Roman times. Now that a tunnel ahs been built through the mountains, the Pass is less dangerous, but each year, the dogs are still sent out into the snow whenever a traveller is in difficulty. Despite the new tunnel, there are still a few people who rashly attempt to cross the Pass on foot.During the summer months, the monastery is very busy, for it is visited by thousands of people who cross the Pass in cars. As there are so many people about, the dogs have to be kept in a special enclosure. In winter, however, life at the monastery is quite different. The temperature drops to -- 30 o and very few people attempt to cross the Pass. The monks prefer winter to summer of they have more privacy. The dogs have greater freedom, too, for they are allowed to wander outside their enclosure. The only regular visitors to the monastery in winter are parties of skiers who go there at Christmas and Easter. These young people, who love the peace of mountains, always receive a warm welcome at St. Bernard's monastery.",
    createdAt: 1752835406154,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c8\u8bfe\u5185\u5bb9",
    wordCount: 252,
  },
  {
    id: 1120000009,
    uuid: "11200001009",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c9\u8bfe\u7a0b",
    content:
      "Cats never fail to fascinate human beings. They can be friendly and affectionate towards humans, but they lead mysterious lives of their own as well. They never become submissive like dogs and horses. As a result, humans have learned to respect feline independence. Most cats remain suspicious of humans all their lives. One of the things that fascinates us most about cats is the popular belief that they have nine lives. Apparently, there is a good deal of truth in this idea. A cat's ability to survive falls is based on fact.Recently the New York Animal Medical Center made a study of 132 cats over a period of five months. All these cats had one experience in common: they had fallen off high buildings, yet only eight of them died from shock or injuries. Of course, New York is the ideal place for such an interesting study, because there is no shortage of tall buildings. There are plenty of high-rise windowsills to fall from! One cat, Sabrina, fell 32 storeys, yet only suffered from a broken tooth. 'Cats behave like well-trained paratroopers.' a doctor said. It seems that the further cats fall, the less they are likely to injure themselves. In a long drop, they reach speeds of 60 miles an hour and more. At high speeds, falling cats have time to relax. They stretch out their legs like flying squirrels. This increases their air-resistance and reduces the shock of impact when they hit the ground",
    createdAt: 1752835407233,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c9\u8bfe\u5185\u5bb9",
    wordCount: 246,
  },
  {
    id: 1120000010,
    uuid: "11200001010",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c10\u8bfe\u7a0b",
    content:
      "The great ship, Titanic, sailed for New York from Southampton on April 10th, 1912. She was carrying 1,316 passengers and crew of 891. Even by modern standards, the 46,000 ton Titanic was a colossal ship. At the time, however, she was not only the largest ship that had ever been built, but was regarded as unsinkable, for she had sixteen watertight compartments. Even if two of these were flooded, she would still be able to float. The tragic sinking of this great liner will always be remembered, for she went down on her first voyage with heavy loss of life.Four days after setting out, while the Titanic was sailing across the icy water of the North Atlantic, huge iceberg was suddenly spotted by a lookout. After the alarm had been given, the great ship turned sharply to avoid a direct collision. The Titanic turned just in time, narrowly missing the immense walk of ice which rose over 100 feet out of the water beside her. Suddenly, there was a slight trembling sound from below, and the captain went down to see what had happened. The noise had been so faint that no one though that the ship had been damaged. Below, the captain realized to his horror that the Titanic was sinking rapidly, for five of her sixteen watertight compartments had already been flooded! The order to abandon ship was given and hundreds of people plunged into the icy water. As there were not enough lifeboats for everybody, 1,500 lives were lost.",
    createdAt: 1752835408297,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c10\u8bfe\u5185\u5bb9",
    wordCount: 252,
  },
  {
    id: 1120000011,
    uuid: "11200001011",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c11\u8bfe\u7a0b",
    content:
      "Customs Officers are quite tolerant these days, but they can still stop you when you are going through the Green Channel and have nothing to declare. Even really honest people are often made to feel guilty. The hardened professional smuggler, on the other hand, is never troubled by such feelings, even if he has five hundred gold watches hidden in his suitcase. When I returned form abroad recently, a particularly officious young Customs Officer clearly regarded me as a smuggler.'Have you anything to declare?' he asked, looking me in the eye.'No', I answered confidently.'Would you mind unlocking this suitcase please?''Not at all,' I answered.The Officer went through the case with great care. All the thing I had packed so carefully were soon in a dreadful mess. I felt sure I would never be able to close the case again. Suddenly, I saw the Officer's face light up. He had spotted a tiny bottle at the bottom of my case and he pounced on it with delight.'Perfume, eh?' he asked sarcastically. 'You should have declared that. Perfume is not exempt from import duty.''But it isn't perfume,' I said. 'It's hair gel.' Then I added with a smile, 'It's a strange mixture I make myself.'As I expected, he did not believe me.'Try it!' I said encouragingly.The officer unscrewed the cap and put the bottle to his nostrils. He was greeted by an unpleasant smell which convinced him that I was telling the truth. A few minutes later, I was able to hurry away with precious chalk marks on my baggage.",
    createdAt: 1752835409386,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c11\u8bfe\u5185\u5bb9",
    wordCount: 258,
  },
  {
    id: 1120000012,
    uuid: "11200001012",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c12\u8bfe\u7a0b",
    content:
      "Most of us have formed an unrealistic picture of life on a desert island. We sometimes imagine a desert island to be a sort of paradise where the sun always shines. Life there is simple and good. Ripe fruit falls from the trees and you never have to work. The other side of the picture is quite the opposite. Life on a desert island is wretched. You either starve to death or live like Robinson Crusoe, Waiting for a boat which never comes. Perhaps there is an element of truth in both these pictures, but few us have had the opportunity to find out.Two men who recently spent five days on a coral island wished they had stayed there longer. They were taking a badly damaged boat from the Virgin Islands to Miami to have it repaired. During the journey, their boat began to sink. They quickly loaded a small rubber dinghy with food, matches, and cans of beer and rowed for a few miles across the Caribbean until they arrived at a tiny coral island. There were hardly any trees on the island and there was no water, but this did not prove to be a problem. The men collected rainwater in the rubber dinghy. As they had brought a spear gun with them, they had plenty to eat. They caught lobster and fish every day\uff0cand, as one of them put it 'ate like kings'. When a passing tanker rescued them five days later, both men were genuinely sorry that they had to leave.",
    createdAt: 1752835410462,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c12\u8bfe\u5185\u5bb9",
    wordCount: 255,
  },
  {
    id: 1120000013,
    uuid: "11200001013",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c13\u8bfe\u7a0b",
    content:
      "After her husband had gone to work. Mrs. Richards sent her children to school and went upstairs to her bedroom. She was too excited to do any housework that morning, for in the evening she would be going to a fancy-dress part with her husband. She intended to dress up as a ghost and as she had made her costume the night before, she was impatient to try it on. Though the costume consisted only of a sheet, it was very effective. After putting it on, Mrs. Richards went downstairs. She wanted to find out whether it would be comfortable to wear.Just as Mrs. Richards was entering the dinning room, there was a knock on the front door. She knew that it must be the baker. She had told him to come straight in if ever she failed to open the door and to leave the bread on the kitchen table. Not wanting to frighten the poor man, Mrs. Richards quickly hid in the small storeroom under the stairs. She heard the front door open and heavy footsteps in the hall. Suddenly the door of the storeroom was opened and a man entered. Mrs. Richards realized that it must be the man from the Electricity Board who had come to read the metre. She tried to explain the situation, saying 'It's only me', but it was too late. The man let out cry and jumped back several paces. When Mrs. Richards walked towards him, he fled, slamming the door behind him.",
    createdAt: 1752835411606,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c13\u8bfe\u5185\u5bb9",
    wordCount: 251,
  },
  {
    id: 1120000014,
    uuid: "11200001014",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c14\u8bfe\u7a0b",
    content:
      "There was a time when the owners of shops and businesses in Chicago that to pay large sums of money to gangsters in return for 'protection.' If the money was not paid promptly, the gangsters would quickly put a man out of business by destroying his shop. Obtaining 'protection money' is not a modern crime. As long ago as the fourteenth century, an Englishman, Sir John Hawkwood, made the remarkable discovery that people would rather pay large sums of money than have their life work destroyed by gangsters.Six hundred years ago, Sir Johan Hawkwood arrived in Italy with a band of soldiers and settled near Florence. He soon made a name for himself and came to be known to the Italians as Giovanni Acuto. Whenever the Italian city-states were at war with each other, Hawkwood used to hire his soldiers to princes who were willing to pay the high price he demanded. In times of peace, when business was bad, Hawkwood and his men would march into a city-state and, after burning down a few farms, would offer to go away protection money was paid to them. Hawkwood made large sums of money in this way. In spite of this, the Italians regarded him as a sort of hero. When he died at the age of eighty, the Florentines gave him a state funeral and had a pictured with as dedicated to the memory of 'the most valiant soldier and most notable leader, Signor Giovanni Haukodue.'",
    createdAt: 1752835412724,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c14\u8bfe\u5185\u5bb9",
    wordCount: 246,
  },
  {
    id: 1120000015,
    uuid: "11200001015",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c15\u8bfe\u7a0b",
    content:
      "Children always appreciate small gifts of money. Mum or dad, of course, provide a regular supply of pocket money, but uncles and ants are always a source of extra income. With some children, small sums go a long way. If fifty pence pieces are not exchanged for sweets, they rattle for months inside money boxes. Only very thrifty children manage to fill up a money box. For most of them, fifty pence is a small price to pay for a nice big bar of chocolate.My nephew, George, has a money box but it is always empty. Very few of the fifty pence pieces and pound coins I have given him have found their way there. I gave him fifty pence yesterday and advised him to save it. Instead he bought himself fifty pence worth of trouble. On his way to the sweet shop, he dropped his fifty pence and it bounced along the pavement and then disappeared down a drain. George took off his jacket, rolled up his sleeves and pushed is right arm through the drain cover. He could not find his fifty pence piece anywhere, and what is more, he could no get his arm out. A crowd of people gathered round him and a lady rubbed his arm with soap and butter, but George was firmly stuck. The fire brigade was called and two fire fighter freed George using a special type of grease. George was not too upset by his experience because the lady who owns the sweet shop heard about his troubles and rewarded him with large box of chocolates.",
    createdAt: 1752835414348,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c15\u8bfe\u5185\u5bb9",
    wordCount: 265,
  },
  {
    id: 1120000016,
    uuid: "11200001016",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c16\u8bfe\u7a0b",
    content:
      "Mary and her husband Dimitri lived in the tiny village of Perachora in southern Greece. One of Mary's prize possessions was a little white lamb which her husband had given her. She kept it tied to a tree in a field during the day and went to fetch it every evening. One evening, how-ever, the lamb was missing. The rope had been cut, so it was obvious that the lamb had been stolen.When Dimitri came in from the fields,His wife told him what had happened.Dimitri at once set out to find the thief.  He knew it would not prove difficult in such a small village. After telling several of his friends about the theft, Dimitri found out that his neighbour, Aleko, had suddenly acquired a new lamb.Dimitri immediately went to Aleko's house and angrily accused him of stealing the lamb. He told him he had better return it or he would call the police. Aleko denied taking it and led Dimitri into his back-yard. It was true that he had just bought a lamb, he explained, but his lamb was black. Ashamed of having acted so rashly, Dimitri apologized to Aleko for having accused him. While they were talking it began to rain and Dimitri stayed in Aleko's house until the rain stopped.When he went outside half an hour later, he was astonished to find that the little black lamb was almost white. Its wool, which had been dyed black, had been washed clean by the rain !",
    createdAt: 1752835415430,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c16\u8bfe\u5185\u5bb9",
    wordCount: 248,
  },
  {
    id: 1120000017,
    uuid: "11200001017",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c17\u8bfe\u7a0b",
    content:
      " Verrazano, an Italian about whom little is known, sailed into New York Harbour in 1524 and named it Angouleme. He described it as 'a very agreeable situation located within two small hills in the midst of which flowed a great river.' Though Verrazano is by no means considered to be a great explorer, his name will probably remain immortal, for on November 21st, 1964, the longest suspension bridge in the world was named after himThe Verrazano Bridge, which was designed by Othmar Ammann, joins Brooklyn to Staten Island. It has a span of 4,260 feet. The bridge is so long that the shape of the earth had to be taken into account by its designer. Two great towers support four huge cables. The towers are built on immense underwater platforms make of steel and concrete. The platforms extend to a depth of over 100 feet under the sea. These alone took sixteen months to build. Above the surface of the water, the towers rise to a height of nearly 700 feet. They support the cables from which the bridge has been suspended. Each of the four cables contains 26,108 lengths of wire. It has been estimated that if the bridge were packed with cars, it would still only be carrying a third of its total capacity. However, size and strength are not the only important things about this bridge. Despite its immensity, it is both simple and elegant, fulfilling its designer's dream to create 'an enormous object drawn as faintly as possible'.",
    createdAt: 1752835416521,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c17\u8bfe\u5185\u5bb9",
    wordCount: 252,
  },
  {
    id: 1120000018,
    uuid: "11200001018",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c18\u8bfe\u7a0b",
    content:
      " Modern sculpture rarely surprises us any more. The idea that modern art can only be seen in museums is mistaken. Even people who take no interest in art cannot have failed to notice examples of modern sculpture on display in public places. Strange forms stand in gardens, and outside buildings and shops. We have got quite used to them. Some so-called 'modern' pieces have been on display for nearly eighty years.In spite of this, some people -- including myself -- were surprise by a recent exhibition of modern sculpture. The first thing I saw when I entered the art gallery was a notice which said: 'Do not touch the exhibits. Some of them are dangerous!' The objects on display were pieces of moving sculpture. Oddly shaped forms that are suspended form the ceiling and move in response to a gust of wind are quite familiar to everybody. These objects, however, were different. Lined up against the wall, there were long thin wires attached to metal spheres. The spheres had been magnetized and attracted or repelled each other all the time. In the centre of the hall, there were a number of tall structures which contained coloured lights. These lights flickered continuously like traffic lights which have gone mad. Sparks were emitted from small black boxes and red lamps flashed on and off angrily. It was rather like an exhibition of prehistoric electronic equipment. These peculiar forms not only seemed designed to shock people emotionally, but to give them electric shocks as well!",
    createdAt: 1752835417599,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c18\u8bfe\u5185\u5bb9",
    wordCount: 252,
  },
  {
    id: 1120000019,
    uuid: "11200001019",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c19\u8bfe\u7a0b",
    content:
      "Kidnappers are rarely interested in animals, but they recently took considerable interest in Mrs. Eleanor Ramsay's cat. Mrs. Eleanor Ramsay, a very wealthy old lady, has shared a flat with her cat, Rastus, for a great many years. Rastus leads an orderly life. He usually takes a short walk in the evenings and is always home by seven o'clock. One evening, however, he failed to arrive. Mrs. Ramsay got very worried. She looked everywhere for him but could not find him.There days after Rastus' disappearance, Mrs. Ramsay received an anonymous letter. The writer stated that Rastus was in safe hands and would be returned immediately if Mrs. Ramsay paid a ransom of $1,000. Mrs. Ramsay was instructed to place the money in a cardboard box and to leave it outside her door. At first she decided to go to the police, but fearing that she would never see Rastus again -- the letter had made that quite clear -- she changed her mind. She withdrew $1000 from her bank and followed the kidnapper's instructions. The next morning, the box had disappeared but Mrs. Ramsay was sure that the kidnapper would keep his word. Sure enough, Rastus arrived punctually at seven o'clock that evening. He looked very well though he was rather thirsty, for he drank half a bottle of milk. The police were astounded when Mrs. Ramsay told them what she had done. She explained that Rastus was very dear to her. Considering the amount she paid, he was dear in more ways than one!",
    createdAt: 1752835418693,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c19\u8bfe\u5185\u5bb9",
    wordCount: 255,
  },
  {
    id: 1120000020,
    uuid: "11200001020",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c20\u8bfe\u7a0b",
    content:
      "In 1908 Lord Northcliffe offered a prize of $1,000 to the first man who would fly across the English Channel. Over a year passed before the first attempt was made. On July 19th, 1909, in the early morning, Hubert Latham took off from the French coast in his plane the 'Antoinette IV.' He had travelled only seven miles across the Channel when his engine failed and he was forced to land on sea. The 'Antoinette' floated on the water until Latham was picked up by a ship. Two days alter, Louis Bleriot arrived near Calais with a plane called 'No. XI'. Bleriot had been making planes since 1905 and this was his latest model. A week before, he had completed a successful overland flight during which he covered twenty-six miles. Latham, however, did not give up easily. He, too, arrived near Calais on the same day with a new  'Antoinette'. It looked as if there would be an exciting race across the Channel. Both planes were going to take off on July 25th, but Latham failed to get up early enough, After making a short test flight at 4,15 a.m., Bleriot set off half an hour later. His great flight lasted thirty-seven minutes. When he landed near Dover, the first person to greet him was a local policeman. Latham made another attempt a week later and got within half a mile of Dover, but he was unlucky again. His engine failed and he landed on the sea for the second time.",
    createdAt: 1752835419796,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c20\u8bfe\u5185\u5bb9",
    wordCount: 251,
  },
  {
    id: 1120000021,
    uuid: "11200001021",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c21\u8bfe\u7a0b",
    content:
      "Boxing matches were very popular in England two hundred years ago. In those days, boxers fought with bare fists for prize money. Because of this, they were known as 'prizefighters'. However, boxing was very crude, for these were no rules and a prizefighter could be seriously injured or even killed during a match. One of the most colourful figures in boxing history was Daniel Mendoza, who was born in 1764. The use of gloves was not introduced until 1860, when the Marquis of Queensberry drew up the first set of rules. Though he was technically a prizefighter, Mendoza did much to change crude prizefighting into a sport, for he brought science to the game. In this day, Mendoza enjoyed tremendous popularity. He was adored by rich and poor alike.Mendoza rose to fame swiftly after a boxing match when he was only fourteen years old. This attracted the attention of Richard Humphries who was then the most eminent boxer in England. He offered to train Mendoza and his young pupil was quick to learn. In fact, Mendoza soon became so successful that Humphries turned against him. The two men quarrelled bitterly and it was clear that the argument could only be settled by a fight. A match was held at Stilton, where both men fought for an hour. The public bet a great deal of money on Mendoza, but he was defeated. Mendoza met Humphries in the ring on a later occasion and he lost for a second time. It was not until his third match in 1790 that he finally beat Humphries and became Champion of England. Meanwhile, he founded a highly successful Academy and even Lord Byron became one of his pupils. He earned enormous sums of money and was paid as much as $100 for a single appear one of his pupils. He earned enormous sums of money and was paid as much as $100 for a single appearance. Despite this, he was so extravagant that he was always in debt. After he was defeated by a boxer called Gentleman Jackson, he was quickly forgotten. He was sent to prison for failing to pay his debts and died in poverty in 1836.",
    createdAt: 1752835420954,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c21\u8bfe\u5185\u5bb9",
    wordCount: 364,
  },
  {
    id: 1120000022,
    uuid: "11200001022",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c22\u8bfe\u7a0b",
    content:
      " Some plays are so successful that they run for years on end, In many ways, this is unfortunate for the poor actors who are required to go on repeating the same lines night after night. One would expect them to know their parts by heart and never have cause to falter. Yet this is not always the case. A famous actor in a highly successful play was once cast in the role of an aristocrat who had been imprisoned in the Bastille for twenty years. In the last act, a gaoler would always come on to the stage with a letter which he would hand to the prisoner. Even though the noble was expected to read the letter at each performance, he always insisted that it should be written out in full.One night, the gaoler decided to play a joke on his colleague to find out if, after so many performances, he had managed to learn the contents of the letter by heart. The curtain went up on the final act of the play and revealed the aristocrat sitting alone behind bars in his dark cell. Just then, the gaoler appeared with the precious letter in his bands. He entered the cell and presented the letter to the aristocrat. But the copy he gave him had not been written out in full as usual. It was simply a blank sheet of paper. The gaoler looked on eagerly, anxious to see if his fellow actor had at last learnt his lines. The noble stared at the blank sheet of paper for a few seconds. Then, squinting his eyes, he said: 'The light is dim. Read the letter to me'. And he promptly handed the sheet of paper to the gaoler. Finding that he could not remember a word of the letter either, the gaoler replied: 'The light is indeed dim, sire, I must get my glasses.' With this, he hurried off the stage. Much to the aristocrat's amusement, the gaoler returned a few moments later with a pair of glasses and the usual copy of the letter with he proceeded to read to the prisoner.",
    createdAt: 1752835422022,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c22\u8bfe\u5185\u5bb9",
    wordCount: 354,
  },
  {
    id: 1120000023,
    uuid: "11200001023",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c23\u8bfe\u7a0b",
    content:
      " People become quite illogical when they try to decide what can be eaten and what cannot be eaten. If you lived in the Mediterranean, for instance, you would consider octopus a great delicacy. You would not be able to understand why some people find it repulsive. On the other hand, your stomach would turn at the idea of frying potatoes in animal fat -- the normally accepted practice in many northern countries. The sad truth is that most of us have been brought up to eat certain foods and we stick to them all our lives. No creature has received more praise and abuse than the common garden snail. Cooked in wine, snails are a great luxury in various parts of the world. There are countless people who, ever since their early years, have learned to associate snails with food. My friend, Robert, lives in a country where snails are despised. As his flat is in a large town, he has no garden of his own. For years he has been asking me to collect snails from my garden and take them to him. The idea never appealed to me very much, but one day, after heavy shower, I happened to be walking in my garden when I noticed a huge number of snails taking a stroll on some of my prize plants. Acting on a sudden impulse, I collected several dozen, put them in a paper bag, and took them to Robert. Robert was delighted to see me and equally pleased with my little gift. I left the bag in the hall and Robert and I went into the living room where we talked for a couple of hours. I had forgotten all about the snails when Robert suddenly said that I must stay to dinner. Snails would, of course, be the main dish. I did not fancy the idea and I reluctantly followed Robert out of the room. To our dismay, we saw that there were snails everywhere: they had escaped from the paper bag and had taken complete possession of the hall! I have never been able to look at a snail since then.",
    createdAt: 1752835424422,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c23\u8bfe\u5185\u5bb9",
    wordCount: 357,
  },
  {
    id: 1120000024,
    uuid: "11200001024",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c24\u8bfe\u7a0b",
    content:
      "We often read in novels how a seemingly respectable person or family has some terrible secret which has been concealed from strangers for years. The English language possesses a vivid saying to describe this sort of situation. The terrible secret is called 'a skeleton in the cupboard'. At some dramatic moment in the story, the terrible secret becomes known and a reputation is ruined. The reader's hair stands on end when he reads in the final pages of the novel that the heroine a dear old lady who had always been so kind to everybody, had, in her youth, poisoned every one of her five husbands.      It is all very well for such things to occur in fiction. To varying degrees, we all have secrets which we do not want even our closest friends to learn, but few of us have skeletons in the cupboard. The only person I know who has a skeleton in the cupboard is George Carlton, and he is very pound of the fact. George studied medicine in his youth. Instead of becoming a doctor, however, he became a successful writer of detective stories. I once spend an uncomfortable weekend which I shall never forget at his house. George showed me to the guestroom which, he said, was rarely used. He told me to unpack my things and then come down to dinner. After I had stacked my shirts and underclothes in two empty drawers, I decided to hang one of the tow suits I had brought with me in the cupboard. I opened the cupboard door and then stood in front of two suits I had brought with me in the cupboard. I opened the cupboard door and then stood in front of it suits I had brought with me in the cupboard. I opened the cupboard door and then stood in front of it petrified. A skeleton was dangling before my eyes. The sudden movement of the door made it sway slightly and it gave me the impression that it was about to leap out at me. Dropping my suit, I dashed downstairs to tell George. This was worse than \"a terrible secret'; this was a read skeleton! But George was unsympathetic. 'Oh, that,' he said with a smile as if he were talking about an old friend. 'That's Sebastian. You forget that I was a medical student once upon a time.'",
    createdAt: 1752835425500,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c24\u8bfe\u5185\u5bb9",
    wordCount: 398,
  },
  {
    id: 1120000025,
    uuid: "11200001025",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c25\u8bfe\u7a0b",
    content:
      "One of the most famous sailing ships of the nineteenth century, the Cutty Sark, can still be seen at Greewich. She stands on dry land and is visited by thousands of people each year. She serves as an impressive reminder of the great ships of past. Before they were replaced by steamships, sailing vessels like the Cutty Sark were used to carry tea from China and wool from Australia. The Cutty Sark was one the fastest sailing ships that has ever been built. The only other ship to match her was the Thermopylae. Both these ships set out from Shanghai on June 18th, 1872 on an exciting race to England. This race, which went on for exactly four exactly four months, was the last of its kind. It marked the end of the great tradition of ships with sails and the beginning of a new era.The first of the two ships to reach Java after the race had begun was the Thermopylae, but on the Indian Ocean, the Cutty Sark took lead. It seemed certain that she would be the first ship home, but during the race she had a lot of bad luck. In August, she was struck by a very heavy storm during which her rudder was torn away. The Cutty Sark rolled from side to side and it became impossible to steer her. A temporary rudder was made on board from spare planks and it was fitted with great difficulty. This greatly reduced the speed of the ship, for there was a danger that if she traveled too quickly, this rudder would be torn away as well. Because of this, the Cutty Sark lost her lead. After crossing the Equator, the captain called in at a port to have a new rudder fitted, but by now the Thermopylae was over five hundred miles ahead. Though the new rudder was fitted at tremendous speed, it was impossible for the Cutty Sark to win. She arrived in England a week after the Thermopylae. Even this was remarkable, considering that she had had so many delays. These is no doubt that if she had not lost her rudder she would have won the race easily.",
    createdAt: 1752835426608,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c25\u8bfe\u5185\u5bb9",
    wordCount: 365,
  },
  {
    id: 1120000026,
    uuid: "11200001026",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c26\u8bfe\u7a0b",
    content:
      "No one can avoid being influenced by advertisements. Much as we may pride ourselves on our good taste, we are no longer free to choose the things we want, for advertising exerts a subtle influence on us. In their efforts to persuade us to buy this or that product, advertisers have made a close study of human nature and have classified all our little weaknesses.Advertisers discovered years ago that all of us love to get something for nothing. An advertisement which begins with the magic word FREE can rarely go wrong. These days, advertisers not only offer free samples, but free cars, free houses, and free trips round the world as well. They devise hundreds of competitions which will enable us to win huge sums of money. Radio and television have made it possible for advertisers to capture the attention of millions of people in this way.During a radio programme, a company of biscuit manufacturers once asked listeners to bake biscuits and send them to their factory. They offered to pay $10 a pound for the biggest biscuit baked by a listener. The response to this competition was tremendous. Before long, biscuits of all shapes and sizes began arriving at the factory. One lady brought in a biscuit on a wheelbarrow. It weighed nearly 500 pounds. A little later, a man came along with a biscuit which occupied the whole boot of his car. All the biscuits that were sent were carefully weighed. The largest was 713 pounds. It seemed certain that this would win the prize. But just before the competition closed, a lorry arrived at the factory with a truly colossal biscuit which weighed 2,400 pounds. It had been baked by a college student who had used over 1,000 pounds of flour, 800 pounds of sugar, 200 pounds of fat, and 400 pounds of various other ingredients. It was so heavy that a crane had to be used to remove it from the lorry. The manufacturers had to pay more money than they had anticipated, or they bought the biscuit from the student for $24,000.",
    createdAt: 1752835427706,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c26\u8bfe\u5185\u5bb9",
    wordCount: 347,
  },
  {
    id: 1120000027,
    uuid: "11200001027",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c27\u8bfe\u7a0b",
    content:
      "It has been said that everyone lives by selling something. In the light of this statement, teachers live by selling knowledge, philosophers by selling wisdom and priests by selling spiritual comfort. Though it may be possible to measure the value of material good in terms of money, it is extremely difficult to estimate the true value of the services which people perform for us. There are times when we would willingly give everything we possess to save our lives, yet we might grudge paying a surgeon a high fee for offering us precisely this service. The conditions of society are such that skills have to be paid for in the same way that goods are paid for at a shop. Everyone has something to sell.Tramps seem to be the only exception to this general rule. Beggars almost sell themselves as human being to arouse the pity of passers-by. But real tramps are not beggars. They have nothing to sell and require nothing from others. In seeking independence, they do not sacrifice their human dignity. A tramp may ask you for money, but he will never ask you to feel sorry for him. He has deliberately chosen to lead the life he leads and is fully aware of the consequences. He may never be sure where the next meal is coming from, but his is free from the thousands of anxieties which afflict other people. His few material possessions make it possible for him to move from place to place with ease. By having to sleep in the open, he gets far closer to the world of nature than most of us ever do. He may hunt, beg, or stead occasionally to keep himself alive; he may even, in times of real need, do a little work; but he will never sacrifice his freedom. We often speak of my even, in times of real need, do a little work; but he will never sacrifice his freedom. We often speak of tramps with contempt and put them in the same class as beggars, but how many of us can honestly say that we have not felt a little envious of their  simple way of life and their freedom from care?",
    createdAt: 1752835428806,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c27\u8bfe\u5185\u5bb9",
    wordCount: 368,
  },
  {
    id: 1120000028,
    uuid: "11200001028",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c28\u8bfe\u7a0b",
    content:
      "Small boats loaded with wares sped to the great liner as she was entering the harbour. Before she had anchored, the men from the boats had climbed on board and the decks were son covered with colourful rugs from Persia, silks from India, copper coffee pots, and beautiful handmade silverware. It was difficult not to be tempted. Many of the tourists on board had begun bargaining with the tradesmen, but I decide not to buy anything until I had disembarked.  I had no sooner got off the ship than I was assailed by a man who wanted to sell me a diamond ring. I had no intention of buying one, but I could not conceal the fact that I was impressed by the size of the diamonds. Some of them were as big as marbles. The man went to great lengths to prove that the diamonds were real. As we were walking past a shop, he held a diamond firmly against the window and made a deep impression in the glass. It took me over half an hour to get rid of him.     The next man to approach me was selling expensive pens and watches. I examined one of the pens closely. It certainly looked genuine. At the base of the gold cap, the words 'made in the U.S.A.' had been neatly inscribed. The man said that the pen was worth &10, but as a special favour, he would let me have it for &8. I shook my head and held up a finger indicating that I was willing to pay a pound. Gesticulating wildly, the man acted as if he found my offer out-rageous, but he eventually reduced the price to &3. Shrugging my shoulders, I began to walk away when, a moment later, he ran after me and thrust the pen into my hands. Though he kept throwing up his arms in despair, he readily accepted the pound I gave him. I felt especially pleased with my wonderful bargain--until I got back to the ship. No matter how hard I tried, it was im-possible to fill this beautiful pen with ink and to this day it has never written a single word !",
    createdAt: 1752835429918,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c28\u8bfe\u5185\u5bb9",
    wordCount: 365,
  },
  {
    id: 1120000029,
    uuid: "11200001029",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c29\u8bfe\u7a0b",
    content:
      " Whether we find a joke funny or not largely depends on where we have been brought up. The sense of humour is mysteriously bound up with national characteristics. A Frenchman, for instance, might find it hard to laugh at a Russian joke. In the same way, a Russian might fail to see anything amusing in a joke witch would make an Englishman laugh to tears. Most funny stories are based on comic situations. In spite of national differences, certain funny situations have a universal appeal. No matter where you live, you would find it difficult not to laugh at, say, Charlie Chaplin's early films. However, a new type of humour, which stems largely from the U.S., has recently come into fashion. It is called 'sick humour'. Comedians base their jokes on tragic situation like violent death or serious accidents. Many people find this sort of joke distasteful The following example of 'sick humour' will enable you to judge for yourself. A man who had broken his right leg was taken to hospital a few weeks before Christmas. From the moment he arrived there, he kept on pestering his doctor to tell him when he would be able to go home. He dreaded having to spend Christmas in hospital. Though the doctors did his best, the patient's recovery was slow. On Christmas Day, the man still had his right leg in plaster. He spent a miserable day in bed thinking of all the fun he was missing. The following day, however, the doctor consoled him by telling him that his chances of being able to leave hospital in time for New Year celebrations were good. The good. The man took heart and, sure enough, on New Years' Eve he was able to hobble along to a party. To compensate for his unpleasant experiences in hospital, the man drank a little more than was good for him. In the process, he enjoyed himself thoroughly and kept telling everybody how much he hated hospitals. He was still mumbling something about hospitals at the end of the party when he slipped on a piece of ice and broke his left leg.",
    createdAt: 1752835434600,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c29\u8bfe\u5185\u5bb9",
    wordCount: 357,
  },
  {
    id: 1120000030,
    uuid: "11200001030",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c30\u8bfe\u7a0b",
    content:
      "For years, villagers believed that Endley Farm was hunted. The farm was owned by two brothers, Joe and Bob Cox. They employed a few farmhands, but no one was willing to work there long. Every time a worker gave up his job, he told the same story. Farm labourers said that they always woke up to find that work had been done overnight. Hay had been cut and cowsheds had been cleaned. A farm worker, who stayed up all night claimed to have seen a figure cutting corn in the moonlight. In time, it became an accepted fact the Cox brothers employed a conscientious ghost that did most of their work for them. No one suspected that there might be someone else on the farm who had never been seen. This was indeed the case. A short time ago, villagers were astonished to learn that the ghost of Endley had died. Everyone went to the funeral, for the 'ghost' was none other than Eric Cox, a third brother who was supposed to have died as a young man. After the funeral, Joe and Bob revealed a secret which they had kept for over fifty years. Eric had been the eldest son of the family, very much older than his two brothers. He had been obliged to join the army during the Second World War. As he hated army life, he decided to desert his regiment. When he learnt that he would be sent abroad, he returned to the farm and his father hid him until the end of the war. Fearing the authorities, Eric remained in hiding after the war as well. His father told everybody that Eric had been killed in action. The only other people who knew the secret were Joe and Bob. They did not even tell their wives. When their father died, they thought it their duty to keep Eric in hiding. All these years, Eric had lived as a recluse. He used to sleep during the day and work at night, quite unaware of the fact that he had become the ghost of Endley. When he died, however, his brothers found it impossible to keep the secret any longer.",
    createdAt: 1752835435678,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c30\u8bfe\u5185\u5bb9",
    wordCount: 364,
  },
  {
    id: 1120000031,
    uuid: "11200001031",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c31\u8bfe\u7a0b",
    content:
      "    True eccentrics never deliberately set out to draw attention to themselves. They disregard social conventions without being conscious that they are doing anything extraordinary. This invariably wins them the love and respect of others, for they add colour to the dull routine of everyday life.     Up to the time of his death, Richard Colson was one of the most notable figures in our town. He was a shrewd and wealthy businessman, but most people in the town hardly knew anything about this side of his life. He was known to us all as Dickie and his eccentricity had become legendary long before he died. Dickie disliked snobs intensely. Though he owned a large car, he hardly ever used it, preferring always to go on foot. Even when it was raining heavily, he refused to carry an umbrella. One day, he walked into an expensive shop after having been caught in a particularly heavy shower. He wanted to buy a $300 watch for his wife, but he was in such a bedraggled condition than an assistant refused to serve him. Dickie left the shop without a word and returned carrying a large cloth bag. As it was extremely heavy, he dumped it on the counter. The assistant asked him to leave, but Dickie paid no attention to him and requested to see the manager. Recognizing who the customer was, the manager was most apologetic and reprimanded the assistant severely. When Dickie was given the watch, the presented the assistant with the cloth bag. It contained $300 in pennies. He insisted on the assistant's counting the money before he left -- 30,000 pennies in all! On another occasion, he invited a number of important critics to see his private collection of modern paintings. This exhibition received a great deal of attention in the press, for though the pictures were supposed to be the work of famous artists, they had in fact been painted by Dickie. It took him four years to stage this elaborate joke simply to prove that critics do not always know what they are talking about.",
    createdAt: 1752835436735,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c31\u8bfe\u5185\u5bb9",
    wordCount: 347,
  },
  {
    id: 1120000032,
    uuid: "11200001032",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c32\u8bfe\u7a0b",
    content:
      "The salvage operation had been a complete failure. The small ship, Elkor, which had been searching the Barents Sea for weeks, was on its way home. A radio message from the mainland had been received by the ship's captain instructing him to give up the search. The captain knew that another attempt would be made later, for the sunken ship he was trying to find had been carrying a precious cargo of gold bullion.Despite the message, the captain of the Elkor decided to try once more. The sea bed was scoured with powerful nets and there was tremendous excitement on board went a chest was raised from the bottom. Though the crew were at first under the impression that the lost ship had been found, the contents of the chest proved them wrong. What they had in fact found was a ship which had been sunk many years before.The chest contained the personal belongings of a seaman, Alan Fielding. There were books, clothing and photographs, together with letters which the seaman had once received from his wife. The captain of the Elkor ordered his men to salvage as much as possible from the wreck. Nothing of value was found, but the numerous items which were brought to the surface proved to be of great interest. From a heavy gun that was raised, the captain realized that the ship must have been a cruiser. In another chest, which contained the belongings of a ship's officer, there was an unfinished letter which had been written on March 14th, 1943. The captain learnt from the letter that the name of the lost ship was the Karen. The most valuable find of all was the ship's log book, parts of which it was still possible to read. From this the captain was able to piece together all the information that had come to light. The Karen had been sailing in a convoy to Russia when she was torpedoed by an enemy submarine. This was later confirmed by naval official at the Ministry of Defiance after the Elkor had returned home. All the items that were found were sent to the War Museum.",
    createdAt: 1752835437832,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c32\u8bfe\u5185\u5bb9",
    wordCount: 358,
  },
  {
    id: 1120000033,
    uuid: "11200001033",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c33\u8bfe\u7a0b",
    content:
      "    We have all experienced days when everything goes wrong. A day may begin well enough, but suddenly everything seems to get out of control. What invariably happens is that a great number of things choose to go wrong at precisely the same moment. It is as if a single unimportant event set up a chain of reactions. Let us suppose that you are preparing a meal and keeping an eye on the baby at the same time. The telephone rings and this marks the prelude to an unforeseen series of catastrophes. While you are on the phone, the baby pulls the tablecloth off the table, smashing half your best crockery and cutting himself in the process. You hang up hurriedly and attend to baby, crockery, etc. Meanwhile, the meal gets burnt. As if this were not enough to reduce you to tears, your husband arrives, unexpectedly bringing three guests to dinner.Things can go wrong on a big scale, as a number of people recently discovered in Parramatta, a suburb of Sydney. During the rush hour one evening two cars collided and both drivers began to argue. The woman immediately behind the two cars happened to be a learner. She suddenly got into a panic and stopped her car. This made the driver following her brake hard. His wife was sitting beside him holding a large cake. As she was thrown forward, the cake went right through the windscreen and landed on the road. Seeing a cake flying through the air, a lorry driver who was drawing up alongside the car, pulled up all of a sudden. The lorry was loaded with empty beer bottles and hundreds of them slid off the back of the vehicle and on to the road. This led to yet another angry argument. Meanwhile, the traffic piled up behind. It took the police nearly an hour to get the traffic on the move again. In the meantime, the lorry driver had to sweep up hundreds of broken bottles. Only two stray dogs benefited from all this confusion, for they greedily devoured what was left of the cake. It was just one of those days!",
    createdAt: 1752835438929,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c33\u8bfe\u5185\u5bb9",
    wordCount: 358,
  },
  {
    id: 1120000034,
    uuid: "11200001034",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c34\u8bfe\u7a0b",
    content:
      "   Antique shops exert a peculiar fascination on a great many people. The more expensive kind of antique shop where rare objects are beautifully displayed in glass cases to keep them free from dust is usually a forbidding place. But no one has to muster up courage to enter a less pretentious antique shop. There is always hope that in its labyrinth of musty, dark, disordered rooms a real rarity will be found amongst the piles of assorted junk that little the floors.   No one discovers a rarity by chance. A truly dedicated bargain hunter must have patience, and above all, the ability to recognize the worth of something when he sees it. To do this, he must be at least as knowledgeable as the dealer. Like a scientist bent on making a discovery, he must cherish the hope that one day he will be amply rewarded.     My old friend, Frank Halliday, is just such a person. He has often described to me how he picked up a masterpiece for a mere $50. One Saturday morning, Frank visited an antique shop in my neighbourhood. As he had never been there before, he found a great deal to interest him. The morning passed rapidly and Frank was about to leave when he noticed a large packing case lying on the floor. The morning passed rapidly and Frank just come in, but that he could not be bothered to open it. Frank begged him to do so and the dealer reluctantly prised it open. The contents were disappointing. Apart from an interesting-looking carved dagger, the box was full of crockery, much of it broken. Frank gently lifted the crockery out of the box an suddenly noticed a miniature painting at the bottom of the packing case. As its composition and line reminded him of an Italian painting he knew well, he decided to buy it. Glancing at it briefly, the dealer told him that it was worth $50. Frank could hardly conceal his excitement, for he knew that he had made a real discovery. The tiny painting proved to be an unknown masterpiece by Correggio and was worth hundreds of thousands of pounds.",
    createdAt: 1752835440009,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c34\u8bfe\u5185\u5bb9",
    wordCount: 360,
  },
  {
    id: 1120000035,
    uuid: "11200001035",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c35\u8bfe\u7a0b",
    content:
      "The word justice is usually associated with courts of law. We might say that justice has been done when a man's innocence or guilt has been proved beyond doubt. Justice is part of the complex machinery of the law. Those who seek it undertake an arduous journey and can never be sure that they will find it. Judges, however wise or eminent, are human and can make mistakes.    There are rare instances when justice almost ceases to be an abstract concept. Reward or punishment are meted out quite independent of human interference. At such times, justice acts like a living force. When we use a phrase like 'it serves him right', we are, in part, admitting that a certain set of circumstances has enabled justice to act of its own accord.    When a thief was caught on the premises of large jewellery store on morning, the shop assistants must have found it impossible to resist the temptation to say 'it serves him right.' The shop was an old converted house with many large, disused fireplaces and tall, narrow chimneys. Towards midday, a girl heard a muffed cry coming from behind on of the walls. As the cry was repeated several times, she ran to tell the manager who promptly rang up the fire brigade. The cry had certainly come form one of the chimneys, but as there were so many of them, the fire fighters could not be certain which one it was. They located the right chimney by tapping at the walls and listening for the man's cries. After chipping through a wall which was eighteen inches thick, they found that a man had been trapped in the chimney. As it was extremely narrow, the man was unable to move, but the fire fighters were eventually able to free him by cutting a huge hole in the wall. The sorry-looking, blackened figure that emerged, admitted at once that he had tried to break into the shop during the night but had got stuck in the chimney. He had been there for nearly ten hours. Justice had been done even before the man was handed over to the police.",
    createdAt: 1752835444398,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c35\u8bfe\u5185\u5bb9",
    wordCount: 359,
  },
  {
    id: 1120000036,
    uuid: "11200001036",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c36\u8bfe\u7a0b",
    content:
      "   We are less credulous than we used to be. In the nineteenth century, a novelist would bring his story to a conclusion by presenting his readers with a series of coincidences -- most of them wildly improbable. Readers happily accepted the fact that an obscure maidservant was really the hero's mother. A long-lost brother, who was presumed dead, was really alive all the time and wickedly plotting to bring about the hero's downfall. And so on. Modern readers would find such naive solution totally unacceptable. Yet, in real life, circumstances do sometimes conspire to bring about coincidences which anyone but a nineteenth century novelist would find incredible. When I was a boy, my grandfather told me how a German taxi driver, Franz Bussman, found a brother who was thought to have been killed twenty years before. While on a walking tour with his wife, he stooped to talk to a workman. After they had gone on, Mrs. Bussman commented on the workman's close resemblance to her husband and even suggested that he might be his brother. Franz poured scorn on the idea, pointing out that his brother had been killed in action during the war. Though Mrs. Busssman fully acquainted with this story, she thought that there was a chance in a million that she might be right. A few days later, she sent a boy to the workman to ask him if his name was Hans Bussman. Needless to say, the man's name was Hans Bussman and he really was Franz's long-lost brother. When the brothers were reunited, Hans explained how it was that he was still alive. After having been wounded towards the end of the war, he had been sent to hospital and was separated from his unit. The hospital had been bombed and Hans had made his way back into Western Germany on foot. Meanwhile, his unit was lost and all records of him had been destroyed. Hans returned to his family home, but the house had been bombed and no one in the neighbourhood knew what had become of the inhabitants. Assuming that his family had been killed during an air raid, Hans settled down in a village fifty miles away where he had remained ever since.",
    createdAt: 1752835445485,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c36\u8bfe\u5185\u5bb9",
    wordCount: 372,
  },
  {
    id: 1120000037,
    uuid: "11200001037",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c37\u8bfe\u7a0b",
    content:
      "We have learnt to expect that trains will be punctual. After years of conditioning, most of us have developed an unshakable faith in railway timetables. Ships may be delayed by storms; flights may be cancelled because of bad weather, but trains must be on time. Only an exceptionally heavy snowfall might temporarily dislocate railway services. It is all too easy to blame the railway authorities when something does go wrong. The truth is that when mistakes occur, they are more likely to be ours than theirs.After consulting my railway timetable, I noted with satisfaction that there was an express train to Westhaven. It went direct from my local station and the journey lasted mere hour and seventeen minutes. When I boarded the train, I could not help noticing that a great many local people got on as well. At the time, this did not strike me as odd. I reflected that there must be a great many local people besides myself who wished to take advantage of this excellent service. Neither was I surprise when the train stopped at Widley, a tiny station a few miles along the line. Even a mighty express train can be held up by signals. But when the train dawdled at station after station, I began to wonder, It suddenly dawned on me that this express was not roaring down the line at ninety miles an hour, but barely chugging along at thirty. One hour and seventeen minutes passed and we had not even covered half the distance. I asked a passenger if this was the Westhaven Express, but he had not even heard of it. I determined to lodge a complaint as soon as we arrived. Two hours later, I was talking angrily to the station master at Westhaven. When he denied the train's existence, I borrowed his copy of the timetable. There was a note of triumph in my voice when I told him that it was there in black and white. Glancing at it briefly, he told me to look again. A tiny asterisk conducted me to a footnote at the bottom of the page. It said: 'This service has been suspended.'",
    createdAt: 1752835446571,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c37\u8bfe\u5185\u5bb9",
    wordCount: 360,
  },
  {
    id: 1120000038,
    uuid: "11200001038",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c38\u8bfe\u7a0b",
    content:
      "Future historians will be in a unique position when they come to record the history of our own times. They will hardly know which facts to select from the great mass of evidence that steadily accumulates. What is more, they will not have to rely solely on the written word. Films, videos, CDs and CD-ROMS are just some of the bewildering amount of information they will have. They will be able, as it were, to see and hear us in action. But the historian attempting to reconstruct the distant past is always faced with a difficult task. He has to deduce what he can from the few scanty clues available. Even seemingly insignificant remains can shed interesting light on the history of early man.Up to now, historians have assumed that calendars came into being with the advent of agriculture, for then man was faced with a real need to understand something about the seasons. Recent scientific evidence seems to indicate that this assumption is incorrect.Historians have long been puzzled by dots, lines and symbols which have been engraved on walls, bones, and the ivory tusks of mammoths. The nomads who made these markings lived by hunting and fishing during the last Ice Age which began about 35,000 B.C. and ended about 10,000 B.C. By correlating markings made in various parts of the world, historians have been able to read this difficult code. They have found that it is connected with the passage of days and the phases of the moon. It is, in fact, a primitive type of calendar. It has long been known that the hunting scenes depicted on walls were not simply a form of artistic expression. They had a definite meaning, for they were as near as early man could get to writing. It is possible that there is a definite relation between these paintings and the markings that sometimes accompany them. It seems that man was making a real effort to understand the seasons 20,000 years earlier than has been supposed.",
    createdAt: 1752835447653,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c38\u8bfe\u5185\u5bb9",
    wordCount: 335,
  },
  {
    id: 1120000039,
    uuid: "11200001039",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c39\u8bfe\u7a0b",
    content:
      "The rough across the plain soon became so bad that we tried to get Bruce to drive back to the village we had come from. Even though the road was littered with boulders and pitted with holes, Bruce was not in the least perturbed. Glancing at his map, he informed us that the next village was a mere twenty miles away. It was not that Bruce always underestimated difficulties. He simply had no sense of danger at all. No matter what the conditions were, he believed that a car should be driven as fast as it could possibly go.As we bumped over eh dusty track, we swerved to avoid large boulders. The wheels scooped up stones which hammered ominously under the car. We felt sure that sooner or later a stone would rip a hole in our petrol tank or damage the engine. Because of this, we kept looking back, wondering if we were leaving a trail of oil and petrol behind us.What a relief it was when the boulders suddenly disappeared, giving way to a stretch of plain where the only obstacles were clumps of bushes. But there was worse to come. Just ahead of us there was a huge fissure. In response to renewed pleadings, Bruce stopped. Though we all got out to examine the fissure, he remained in the car. We informed him that the fissure extended for fifty years and was tow feet wide and four feet deep. Even this had no effect. Bruce went into a low gear and drove at a terrifying speed, keeping the front wheels astride the crack as he followed its zigzag course. Before we had time to worry about what might happen, we were back on the plain again. Bruce consulted the map once more and told us that the village was now only fifteen miles away. Our next obstacle was a shallow pool of water about half a mile across. Bruce charged at it, but in the middle, the car came to a grinding half. A yellow light on the dashboard flashed angrily and Bruce cheerfully announced that there was no oil in the engine!",
    createdAt: 1752835448760,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c39\u8bfe\u5185\u5bb9",
    wordCount: 356,
  },
  {
    id: 1120000040,
    uuid: "11200001040",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c40\u8bfe\u7a0b",
    content:
      "It has never been explained why university students seem to enjoy practical jokes more than else. Students specialize in a particular type of practical joke: the hoax. Inviting the fire brigade to put out a nonexistent fire is a crude form of deception which no self-respecting student would ever indulge in. Students often create amusing situations which are funny to everyone except the victims. When a student recently saw two workmen using a pneumatic drill outside his university, he immediately telephoned the police and informed them that two students dressed up as workmen were tearing up the road with a pneumatic drill. As soon as he had hung up, he went over to the workmen and told them that if a policeman ordered them to go away, they were not take him seriously. He added that a student had dressed up as a policeman and was playing all sorts of silly jokes on people. Both the police and the workmen were grateful to the student for this piece of advance information. The student did in an archway nearby where he could watch and hear everything that went on. Sure enough, a policeman arrived on the scene and politely asked the workmen to go away. When he received a very rude reply from one of the workmen. He threatened to remove them by force. The workmen told him to do as he pleased and the policeman telephoned for help. Shortly afterwards, four more policemen arrived and remonstrated with the workmen. As the men refused to stop working, the police attempted to seize the pneumatic drill. The workmen struggled fiercely and one of them lost his temper. He threatened to call the police. At this, the police pointed out ironically that this would hardly be necessary as the men were already under arrest. Pretending to speak seriously, one of the workmen asked if he might make a telephone call before being taken to the station. Permission was granted and a policeman accompanied him to a pay phone. Only when he saw that the man was actually telephoning the police did he realize that they had all been the victims of a hoax.",
    createdAt: 1752835449843,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c40\u8bfe\u5185\u5bb9",
    wordCount: 360,
  },
  {
    id: 1120000041,
    uuid: "11200001041",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c41\u8bfe\u7a0b",
    content:
      "The quiet life of the country ahs never appealed to me. City born and city bred. I have always regarded the country as something you look at through a train window, or something you occasional visit during the weekend. Most of my friends live in the city, yet they always go into raptures at the mere mention of the country. Though they extol the virtues of the peaceful life, only one of hem has ever gone to live in the country and he was back in town within six months. Even he still lives under the illusion that country life is somehow superior to town life. He is forever talking about the friendly people, the clean atmosphere, the closeness to nature and the gentle pace of living. Nothing can be compared, he maintains, with the first cockcrow, the twittering of birds at dawn, the sight of the rising sun glinting on the trees and pastures. This idyllic pastoral scene is only part of the picture. My friend fails to mention the long and friendless winter evenings in front of the TV -- virtually the only form of entertainment. He says nothing about the poor selection of goods in the shops, or about those unfortunate people who have to travel from the country to the city every day to get to work. Why people are prepared to tolerate a four-hour journey each day for the dubious privilege of living in the country is beyond me. They could be saved so much misery and expense if they chose to live in the city where they rightly belong.  If you can do without the few pastoral pleasures of the country, you will find the city can provide you with the best that life can offer. You never have to travel miles to see your friends. They invariably lie nearby and are always available for an informal chat or an evening's entertainment. Some of my acquaintances in the country come up to town once or twice a year to visit the theatre as a special treat. For them this is a major operation which involves considerable planning. As the play draws to its close, they wonder whether they will ever catch that last train home. The cit dweller never experiences anxieties of this sort. The latest exhibitions, films, or plays are only a short bus ride away. Shopping, too, is always a pleasure. The latest exhibitions, films, or plays are only a short bus ride away. Shopping, too, is always a pleasure. There is so much variety that you never have to make do with second best. Country people run wild when they go shopping in the city and stagger home loaded with as many of the exotic items as they can carry. Nor is the city without its moments of beauty. There is something comforting about the warm glow shed by advertisements on cold wet winter nights. Few things could be more impressive than the peace that descends on deserted city streets at weekends when the thousands that travel to work every day are tucked away in their homes in the country. It has always been a mystery to me who city dwellers, who appreciate all these things, obstinately pretend that they would prefer to live in the country.",
    createdAt: 1752835450956,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c41\u8bfe\u5185\u5bb9",
    wordCount: 546,
  },
  {
    id: 1120000042,
    uuid: "11200001042",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c42\u8bfe\u7a0b",
    content:
      "Cave exploration, or pot-holing, as it has come to be known, is a relatively new sport. Perhaps it is the desire for solitude or the chance of making an unexpected discovery that lures people down to the depths of the earth. It is impossible to give a satisfactory explanation for a pot-holer's motives. For him, caves have the same peculiar fascination which high mountains have for the climber. They arouse instincts which can only be dimly understood.Exploring really deep caves is not a task for the Sunday afternoon rambler. Such undertakings require the precise planning and foresight of military operations. It can take as long as eight days to rig up rope ladders and to establish supply bases before a descent can be made into a very deep cave. Precautions of this sort are necessary, for it is impossible to foretell the exact nature of the difficulties which will confront the pot-holer. The deepest known cave in the world is the Gouffre Berger near Grenoble. It extends to a depth of 3,723 feet. This immense chasm has been formed by an underground stream which has tunneled a course through a flaw in the rocks. The entrance to the cave is on a plateau in the Dauphine Alps. As it is only six feet across, it is barely noticeable. The cave might never have been discovered has not the entrance been spotted by the distinguished French pot-holer, Berger. Since its discovery, it has become a sort of potholers' Everest. Though a number of descents have been made, much of it still remains to be explored.A team of pot-holers recently went down the Gouffre Berger. After entering the narrow gap on the plateau, they climbed down the steep sides of the cave until they came to narrow corridor. They had to edge their way along this, sometimes wading across shallow streams, or swimming across deep pools. Suddenly they came to a waterfall which dropped into an underground lake at the bottom of the cave. They plunged into the lake, and after loading their gear on an inflatable rubber dinghy, let the current carry them to the other side. To protect themselves from the icy water, they had to wear special rubber suits. At the far end of the lake, they came to huge piles of rubble which had been washed up by the water. In this part of the cave, they could hear an insistent booming sound which they found was caused by a small waterspout shooting down into a pool from the roof of the cave. Squeezing through a cleft in the rocks, the pot-holers arrived at an enormous cavern, the size of a huge concert hall. After switching on powerful arc lights, they saw great stalagmites -- some of them over forty feet high -- rising up like tree-trunks to meet the stalactites suspended from the roof. Round about, piles of limestone glistened in all the colours of the rainbow. In the eerie silence of the cavern, the only sound that could be heard was made by water which dripped continuously from the high dome above them.",
    createdAt: 1752835454442,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c42\u8bfe\u5185\u5bb9",
    wordCount: 517,
  },
  {
    id: 1120000043,
    uuid: "11200001043",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c43\u8bfe\u7a0b",
    content:
      "Insurance companies are normally willing to insure anything. Insuring public or private property is a standard practice in most countries in the world. If, however, you were holding an open air garden party or a fete it would be equally possible to insure yourself in the event of bad weather. Needless to say, the bigger the risk an insurance company takes, the higher the premium you will have to pay. It is not uncommon to hear that a shipping company has made a claim for cost of salvaging a sunken ship. But the claim made by a local authority to recover the cost of salvaging a sunken pie dish must surely be unique.Admittedly it was an unusual pie dish, for it was eighteen feet long and six feet wide. It had been purchased by a local authority so that an enormous pie could be baked for an annual fair. The pie committee decided that the best way to transport the dish would be by canal, so they insured it for the trip. Shortly after it was launched, the pie committee went to a local inn to celebrate. At the same time, a number of teenagers climbed on to the dish and held a little party of their own. Dancing proved to be more than the dish could bear, for during the party it capsized and sank in seven feet of water.The pie committee telephoned a local garage owner who arrived in a recovery truck to salvage the pie dish. Shivering in their wet clothes, the teenagers looked on while three men dived repeatedly into the water to locate the dish. They had little difficulty in finding it, but hauling it out of the water proved to be a serious problem. The sides of the dish were so smooth that it was almost impossible to attach hawsers and chains to the rim without damaging it. Eventually chains were fixed to one end of the dish and a powerful winch was put into operation. The dish rose to the surface and was gently drawn towards the canal bank. For one agonizing moment, the dish was perched precariously on the bank of the canal, but it suddenly overbalanced and slid back into the water. The men were now obliged to try once more. This time they fixed heavy metal clamps to both sides of the dish so that they could fasten the chains. The dish now had to be lifted vertically because one edge was resting against the side of the canal. The winch was again put into operation and one of the men started up the truck. Several minutes later, the dish was again put into operation and one of the water. Water streamed in torrents over its sides with such force that it set up a huge wave in the canal. There was danger that the wave would rebound off the other side of the bank and send the dish plunging into the water again. By working at tremendous speed, the men managed to get the dish on to dry land before the wave returned.",
    createdAt: 1752835455513,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c43\u8bfe\u5185\u5bb9",
    wordCount: 514,
  },
  {
    id: 1120000044,
    uuid: "11200001044",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c44\u8bfe\u7a0b",
    content:
      "People travelling long distances frequently have to decide whether they would prefer to go by land, sea, or air. Hardly anyone can positively enjoy sitting in a train for more than a few hours. Train compartments soon get cramped and stuffy. It is almost impossible to take your mind off the journey. Reading is only a partial solution, for the monotonous rhythm of the wheels clicking on the rails soon lulls you to sleep. During the day, sleep comes in snatches. At night, when you really wish to go to sleep, you rarely manage to do so. If you are lucky enough to get a sleeper, you spend half the night staring at the small blue light in the ceiling, or fumbling to find you ticket for inspection. Inevitably you arrive at your destination almost exhausted. Long car journeys are even less pleasant, for it is quite impossible even to read. On motorways you can, at least, travel fairly safely at high speeds, but more often than not, the greater part of the journey is spent on roads with few service stations and too much traffic. By comparison, ferry trips or cruises offer a great variety of civilized comforts. You can stretch your legs on the spacious decks, play games, meet interesting people and enjoy good food -- always assuming, of course, that the sea is calm. If it is not, and you are likely to get seasick, no form of transport could be worse. Even if you travel in ideal weather, sea journeys take a long time. Relatively few people are prepared to sacrifice holiday time for the pleasure of travlling by sea.Aeroplanes have the reputation of being dangerous and even hardened travellers are intimidated by them. They also have the disadvantage of being an expensive form of transport. But nothing can match them for speed and comfort. Travelling at a height of 30,000 feet, far above the clouds, and at over 500 miles an hour is an exhilarating experience. You do not have to devise ways of taking your mind off the journey, for an aeroplane gets you to your destination rapidly. For a few hours, you settle back in a deep armchair to enjoy the flight. The real escapist can watch a film and sip champagne on some services. But even when such refinements are not available, there is plenty to keep you occupied. An aeroplane offers you an unusual and breathtaking view of the world. You soar effortlessly over high mountains and deep valleys. You really see the shape of the land. If the landscape is hidden from view, you can enjoy the extraordinary sight of unbroken cloud plains that stretch out for miles before you, while the sun shines brilliantly in a clear sky. The journey is so smooth that there is nothing to prevent you from reading or sleeping. However you decide to spend your time, one thing is certain: you will arrive at your destination fresh and uncrumpled. You will not have to spend the next few days recovering from a long and arduous journey.",
    createdAt: 1752835456635,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c44\u8bfe\u5185\u5bb9",
    wordCount: 512,
  },
  {
    id: 1120000045,
    uuid: "11200001045",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c45\u8bfe\u7a0b",
    content:
      "In democratic countries any efforts to restrict the freedom of the press are rightly condemned. However, this freedom can easily be abused. Stories about people often attract far more public attention than political events. Though we may enjoy reading about the lives of others, it is extremely doubtful whether we would equally enjoy reading about ourselves. Acting on the contention that facts are sacred, reporters can cause untold suffering to individuals by publishing details about their private lives. Newspapers exert such tremendous influence that they can not only bring about major changes to the lives of ordinary people but can even overthrow a government.The story of a poor family that acquired fame and fortune overnight, dramatically illustrates the power of the press. The family lived in Aberdeen, a small town of 23,000 inhabitants in South Dakota. As the parents had five children, life was a perpetual struggle against poverty. They were expecting their sixth child and were faced with even more pressing economic problems. If they had only had one more child, the fact would have passed unnoticed. They would have continued to struggle against economic odds and would have lived in obscurity. But they suddenly became the parents of quintuplets, an aeroplane arrived in Aberdeen bringing sixty reporters and photographers.The rise to fame was swift. Television cameras and newspapers carried the news to everyone in the country. Newspapers and magazines offered the family huge sums for the exclusive rights to publish stories and photographs. Gifts poured in not only from unknown people, but room baby food and soap manufacturers who wished to advertise their products. The old farmhouse the family lived in was to be replaced by new $500,000 home. Reporters kept pressing for interviews so lawyers had to be employed to act as spokesmen for the family at press conferences. While the five babies were babies were still quietly sleeping in oxygen tents in hospital nursery, their parents were paying the price for fame. It would never again be possible for them to lead normal lives. They had become the victims of commercialization, for their names had acquired a market value. Instead of being five new family members, these children had immediately become a commodity.",
    createdAt: 1752835457710,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c45\u8bfe\u5185\u5bb9",
    wordCount: 367,
  },
  {
    id: 1120000046,
    uuid: "11200001046",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c46\u8bfe\u7a0b",
    content:
      "So great is our passion for doing things for ourselves, that we are becoming increasingly less dependent on specialized labour. No one can plead ignorance of a subject any longer, for these are countless do-it-yourself publications. Armed with the right tools and materials, newlyweds gaily embark on the task of decorating their own homes. Men, particularly, spend hours of their leisure time installing their own fireplaces, laying out their own gardens; building garages and making furniture. Some really keen enthusiasts go so far as to build their own computers. Shops cater for the do-it-yourself craze not only by running special advisory services for novices, but by offering consumers bits and pieces which they can assemble at home. Such things provide an excellent outlet for pent up creative energy, but unfortunately not all of us are born handymen.Some wives tend to believe that their husbands are infinitely resourceful and can fix anything. Even men who can hardly drive a nail in straight are supposed to be born electricians, carpenters, plumbers and mechanics. When lights fuse, furniture gets rickety, pipes get clogged, or vacuum cleaners fail to operate, some woman assume that their husbands will somehow put things right. The worst thing about the do-it-yourself game is that sometimes even men live under the delusion that they can do anything, even when they have repeatedly been proved wrong. It is a question of pride as much as anything else.Last spring my wife suggested that I call in a man to look at our lawn mower. It had broken down the previous summer, and though I promised to repair it, I had never got round to it. I would not hear of the suggestion and said that I would fix it myself. One Saturday afternoon, I hauled the machine into the garden and had a close look at it. As far as I could see, it needed only a minor adjustment: a turn of a screw here, a little tightening up there, a drop of oil and it would be as good as new. Inevitably the repair job was not quite so simple. The mower firmly refused to mow, so I decided to dismantle it. The garden was soon littered with chunks of metal which had once made up a lawn mower. But I was extremely pleased with myself. I had traced the cause of the trouble. One of links in the chain that drives the wheels had snapped. After buying a new chain I was faced with the insurmountable task of putting the confusing jigsaw puzzle together again. I was not surprised to find that the machine still refused to work after I had reassembled it, for the simple reason that I was left with several curiously shaped bits of metal which did not seem to fit anywhere. I gave up in despair. The weeks passed and the grass grew. When my wife nagged me to do something about it, I told her that either I would have to buy a new mower or let the grass grow. Needless to say our house is now surrounded by a jungle. Buried somewhere in deep grass there is a rusting lawn mower which I have promised to repair one day.",
    createdAt: 1752835458782,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c46\u8bfe\u5185\u5bb9",
    wordCount: 536,
  },
  {
    id: 1120000047,
    uuid: "11200001047",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c47\u8bfe\u7a0b",
    content:
      "Pollution is the price we pay for an overpopulated, over industrialized planet. When you come to think about it, there are only four ways you can deal with rubbish: dump it, burn it, turn it into something you can use again, attempt to produce less of it. We keep trying all four methods, but he sheer volume of rubbish we produce worldwide threatens to overwhelm us. Rubbish, however, is only part of the problem of polluting our planet. The need to produce ever-increasing quantities of cheap food leads to a different kind of pollution. Industrialized farming methods produce cheap meat products: beef, pork and chicken. The use of pesticides and fertilizers produces cheap grain and vegetables. The price we pay for cheap food may be already too high: Mad Cow Disease (BSE) in cattle, salmonella in chicken and eggs, and wisteria in dairy products. And if you think you'll abandon meat and become a vegetarian, you have the choice of very expensive organically-grown vegetables or a steady diet of pesticides every time you think you're eating fresh salads and vegetables, or just having an innocent glass of water! However, there is an even more insidious kind of pollution that particularly affects urban areas and invades our daily lives, and that is noise. Burglar alarms going off at any time of the day or night serve only to annoy passers-by and actually assist burglars to burgle. Car alarms constantly scream at us in the street and are a source of profound irritation. A recent survey of the effects of noise revealed (surprisingly?) that dogs barking incessantly in the night rated the highest form of noise pollution on a scale ranging from 1 to 7. The survey revealed a large number of sources of noise that we really dislike. Lawn mowers whining on a summer's day, late-night parties in apartment blocks, noisy neighbors, vehicles of al kinds, especially large container trucks thundering through quiet village, planes and helicopters flying overhead, large radios carried round in public places and played at maximum volume. New technology has also made its own contribution to noise. A lot of people object to mobile phones, especially when they are used in public places like restaurants or on public transport. Loud conversations on mobile phones invade our thoughts or interrupt the pleasure of meeting friends for a quiet chat. The noise pollution survey revealed a rather spurring and possibly amusing old fashioned source of noise. It turned out to be snoring! Men were found to be the worst offenders. It was revealed that 20% of men in their mid-thirties snore. This figure rises to a staggering 60% of men in their sixties. Against these figures, it was found that only 5% of women snore regularly, while the rest are constantly woken or kept awake by their trumpeting partners. Whatever the source of noise, one thing is certain: silence, it seems, has become a golden memory.",
    createdAt: 1752835459863,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c47\u8bfe\u5185\u5bb9",
    wordCount: 487,
  },
  {
    id: 1120000048,
    uuid: "11200001048",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c48\u8bfe\u7a0b",
    content:
      "In this much-travelled world, there are still thousands of places which are inaccessible to tourists. We always assume that villagers in remote places are friendly and hospitable. But people who are cut off not only from foreign tourists, but even from their own countrymen can be hostile to travellers. Visits to really remote villages are seldom enjoyable -- as my wife and I discovered during a tour through the Balkans.We had spent several days in a small town and visited a number of old churches in the vicinity. These attracted many visitors, for they were not only of great architectural interest, but contained a large number of beautifully preserved frescoes as well. On the day before our departure, several bus loads of tourists descended on the town. This was more than we could bear, so we decided to spend our last day exploring the countryside. Taking a path which led out of the town, we crossed a few fields until we came to a dense wood. We expected the path to end abruptly, but we found that it traced its way through the trees. We tramped through the wood for over two hours until we arrived at a deep stream. We could see that the path continued on the other side, but we had no idea how we could get across the stream. Suddenly my wife spotted a boat moored to the bank. In it there was a boatman fast asleep. We gently woke him up and asked him to ferry us to the other side. Though he was reluctant to do so at first, we eventually persuaded him to take us.The path led to a tiny village perched on the steep sides of a mountain. The place consisted of a straggling unmade road which was lined on either side by small houses. Even under a clear blue sky, the village looked forbidding, as all the houses were built of grey mud bricks. The village seemed deserted, the only sign of life being an ugly-looking black goat on a short length of rope tied to a tree in a field nearby. Sitting down on a dilapidated wooden fence near the field, we opened a couple of tins of sardines and had a picnic lunch. All at once, I noticed that my wife seemed to be filled with alarm. Looking up I saw that we were surrounded by children in rags who were looking at us silently as we ate. We offered them food and spoke to them kindly, but they remained motionless. I concluded that they were simply shy of strangers. When we later walked down the main street of the villager, we were followed by a silent procession of children. The village which had seemed deserted, immediately came to life. Faces appeared at windows. Men in shirt sleeves stood outside their houses and glared at us. Old women in black shawls peered at us from doorways. The most frightening thing of all was that not a sound could be heard. There was no doubt that we were unwelcome visitors. We needed no further warning. Turning back down the main street, we quickened our pace and made our way rapidly towards the stream where we hoped the boatman was waiting.",
    createdAt: 1752835460979,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c48\u8bfe\u5185\u5bb9",
    wordCount: 540,
  },
  {
    id: 1120000049,
    uuid: "11200001049",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c49\u8bfe\u7a0b",
    content:
      "It is a good thing my aunt Harriet died years ago. If she were alive today she would not be able to air her views on her favourite topic of conversation: domestic servants. Aunt Harriet lived in that leisurely age when servants were employed to do housework. She had a huge, rambling country house called 'The Gables'. She was sentimentally attached to this house, for even though it was far too big for her needs, she persisted in living there long after her husband's death. Before she grew old, Aunt Harriet used to entertain lavishly. I often visited The Gables when I was boy. No matter how many guests were present, the great house was always immaculate. The parquet floors shone like mirrors; highly polished silver was displayed in gleaming glass cabinets; even my uncle's huge collection of books was kept miraculously free from dust. Aunt Harriet presided over an invisible army of servants that continuously scrubbed, cleaned, and polished. She always referred to them as 'the shifting population', for they came and went with such frequency that I never even got a chance to learn their names. Though my aunt pursued what was, in those days, an enlightened policy, in that she never allowed her domestic staff to work more than eight hours a day, she was extremely difficult to please. While she always criticized the fickleness of human nature, she carried on an unrelenting search for the ideal servant to the end of her days, even after she had been sadly disillusioned by Bessie.Bessie worked for Aunt Harriet for three years. During that time she so gained my aunt's confidence that she was put in charge of the domestic staff. Aunt Harriet could not find words to praise Bessie's industriousness and efficiency. In addition to all her other qualifications, Bessie was an expert cook. She acted the role of the perfect servant for three years before Aunt Harriet discovered her 'little weakness'. After being absent from the Gables for a week, my aunt unexpectedly returned one afternoon with a party of guests and instructed Bessie to prepare dinner. No only was the meal well below the usual standard, but Bessie seemed unable to walk steadily. She bumped into the furniture and kept mumbling about the guests. When she came in with the last course -- a huge pudding -- she tripped on the carpet and the pudding went flying through the air, narrowly missed my aunt, and crashed on the dining table with considerable force. Though this caused great mirth among the guests, Aunt Harriet was horrified. She reluctantly came to the conclusion that Bessie was drunk. The guests had, of course, realized this from the moment Bessie opened the door for them and, long before the final catastrophe, had had a difficult time trying to conceal their amusement. The poor girl was dismissed instantly. After her departure, Aunt Harriet discovered that there were piles of empty wine bottles of all shapes and sizes neatly stacked in what had once been Bessie's wardrobe. They had mysteriously found their way there from the wine cellar!",
    createdAt: 1752835465414,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c49\u8bfe\u5185\u5bb9",
    wordCount: 516,
  },
  {
    id: 1120000050,
    uuid: "11200001050",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c50\u8bfe\u7a0b",
    content:
      "The New Year is a time for resolutions. Mentally, at least, most of us could compile formidable lists of 'dos' and 'don'ts'. The same old favorites recur year in year out with monotonous regularity. We resolve to get up earlier each morning, eat less, find more time to play with the children, do a thousand and one jobs about the house, be nice to people we don't' like, drive carefully, and take the dog for a walk every day. Past experience has taught us that certain accomplishments are beyond attainment. If we remain inveterate smokers, it is only because we have so often experienced the frustration that results from failure. Most of us fail in our efforts at self-improvement because our schemes are too ambitious and we never have time to carry them out. We also make the fundamental error of announcing our resolutions to everybody so that we look even more foolish when we slip back into our bad old ways. Aware of these pitfalls, this year I attempted to keep my resolutions to myself. I limited myself to two modest ambitions: to do physical exercise every morning and to read more of an evening. An all-night party on New Year's Eve provided me with a good excuse for not carrying out either of these new resolutions on the first day of the year, but on the second, I applied myself assiduously to the task.   The daily exercises lasted only eleven minutes and I proposed to do them early in the morning before anyone had got up. The self-discipline required to drag myself out of bed eleven minutes earlier than usual was considerable. Nevertheless, I managed to creep down into the living room for two days before anyone found me out. After jumping about on the carpet and twisting the human frame into uncomfortable positions, I sat down at the breakfast table in an exhausted condition. It was this that betrayed me. The next morning the whole family trooped in to watch the performance. That was really unsettling, but I fended off the taunts and jibes of the family good-humouredly and soon everybody got used to the idea. However, my enthusiasm waned. The time I spent at exercises gradually diminished. Little by little the eleven minutes fell to zero. By January 10th, I was back to where I had started from. I argued that if I spent less time exhausting myself at exercises in the morning, I would keep my mind fresh for reading when I got home formwork Resisting the hypnotizing effect of television, I sat in my room for a few evenings with my eyes glued to book. One night, however, feeling cold and lonely, I went downstairs and sat in front of the television pretending to read. That proved to be my undoing, for I soon got back to my old bad habit of dozing off in front of the screen. I still haven't given up my resolution to do more reading. In fact, I have just bought a book entitled How to Read a Thousand Words a Minute. Perhaps it will solve my problem, but I just haven't had time to read it!",
    createdAt: 1752835466485,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c50\u8bfe\u5185\u5bb9",
    wordCount: 528,
  },
  {
    id: 1120000051,
    uuid: "11200001051",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c51\u8bfe\u7a0b",
    content:
      "Predicting the future is notoriously difficult. Who could have imagined, in the mid 1970s, for example, that by the end of the 20th century, computers would be as common in people's homes as TV sets? In the 1970s, computers were common enough, but only in big business, government departments, and large organizations. These were the so-called mainframe machines. Mainframe computers were very large indeed, often occupying whole air-conditioned rooms, employing full-time technicians and run on specially-written software. Though these large machines still exist, many of their functions have been taken over by small powerful personal computers, commonly known as PCs.In 1975, a primitive machine called the Altair, was launched in the USA. It can properly be described as the first 'home computer' and it pointed the way to the future. This was followed, at the end of the 1970s, by a machine called an Apple. In the early 1980s, the computer giant, IBM produced the world's first Personal Computer. This ran on an 'operating system' called DOS, produced by a then small company named Microsoft. The IBM Personal Computer was widely copied. From those humble beginnings, we have seen the development of the user-friendly home computers and multimedia machines which are in common use today.Considering how recent these developments are, it is even more remarkable that as long ago as the 1960s, an Englishman, Leon Bagrit, was able to predict some of the uses of computers which we know today. Bagrit dismissed the idea that computers would learn to 'think' for themselves and would 'rule the world', which people liked to believe in those days. Bagrit foresaw a time when computers would be small enough to hold in the hand, when they would be capable of providing information about traffic jams and suggesting alternative routes, when they would be used in hospitals to help doctors to diagnose illnesses, when they would relieve office workers and accountants of dull, repetitive clerical work. All these computer uses have become commonplace. Of course, Leon Bagrit could not possibly have foreseen the development of the Internet, the worldwide system that enables us to communicate instantly with anyone in any part of the world by using computers linked to telephone networks. Nor could he have foreseen how we could use the Internet to obtain information on every known subject, so we can read it on a screen in our homes and even print it as well if we want to. Computers have become smaller and smaller, more and more powerful and cheaper and cheaper. This is what makes Leon Bagrit's predictions particularly remarkable. If he, or someone like him, were alive today, he might be able to tell us what to expect in the next fifty years.",
    createdAt: 1752835467574,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c51\u8bfe\u5185\u5bb9",
    wordCount: 452,
  },
  {
    id: 1120000052,
    uuid: "11200001052",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c52\u8bfe\u7a0b",
    content:
      "My cousin, Harry, keeps a large curiously-shaped bottle on permanent display in his study. Despite the fact that the bottle is tinted a delicate shade of green, an observant visitor would soon notice that it is filled with what looks like a thick, grayish substance. If you were to ask Harry what was in the bottle, he would tell you that it contained perfumed mud. If you expressed doubt or surprise, he would immediately invite you to smell it and then to rub some into your skin. This brief experiment would dispel any further doubts you might have. The bottle really does contain perfumed mud. How Harry came into the possession of this outlandish stuff makes an interesting story which he is fond of relating. Furthermore, the acquisition of this bottle cured him of a bad habit he had been developing for years.Harry used to consider it a great joke to go into expensive cosmetic shops and make outrageous requests for goods that do not exist. He would invent fanciful names on the spot. On entering a shop, he would ask for a new perfume called 'Scented Shadow' or for 'insoluble bath cubes'. If a shop assistant told him she had not heard of it, he would pretend to be considerably put out. He loved to be told that one of his imaginary products was temporarily out of stock and he would faithfully promise to call again at some future date, but of course he never did. How Harry managed to keep a straight face during these performances is quite beyond me. Harry does not need to be prompted to explain how he bought his precious bottle of mud. One day, he went to an exclusive shop in London and asked for 'Myrolite', the shop assistant looked puzzled and Harry repeated the word, slowly stressing each syllable. When the woman shook her head in bewilderment, Harry went on to explain that 'myrolite' was a hard, amber-like substance which could be used to remove freckles. This explanation evidently conveyed something to the woman who searched shelf after shelf. She produced all sorts of weird concoctions, but none of them met with Harry's requirements. When Harry put on his act of being mildly annoyed, the assistant promised to order some for him. Intoxicated by his success, Harry then asked for perfumed mud. He expected the assistant to look at him in blank astonishment. However, it was his turn to be surprised, for the woman's eyes immediately lit up and she fetched several bottles which she placed on the counter for Harry to inspect. For once, Harry had to admit defeat. He picked up what seemed to be the smallest bottle and discreetly asked the price. He was glad to get away with a mere twenty pounds and he beat a hasty retreat, clutching the precious bottle under his arm. From then on, Harry decided that this little game he had invented might prove to be expensive. The curious bottle, which now adorns the bookcase in his study, was his first and last purchase of rare cosmetics.",
    createdAt: 1752835468678,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c52\u8bfe\u5185\u5bb9",
    wordCount: 514,
  },
  {
    id: 1120000053,
    uuid: "11200001053",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c53\u8bfe\u7a0b",
    content:
      "The Scandinavian countries are much admired all over the world for their enlightened social policies. Sweden has evolved an excellent system for protecting the individual citizen from highhanded or incompetent public officers. The system has worked so well, that it has been adopted in other countries too. The Swedes were the first to recognize that public official like civil servants, police officers, health inspectors or tax-collectors can make mistakes or act over-zealously in the belief that they are serving the public. As long ago as 1809, the Swedish Parliament introduced a scheme to safeguard the interest of the individual. A parliamentary committee representing all political parties appoints a person who is suitably qualified to investigate private grievances against the State. The official title of the person is 'Justiteombudsman', but the Swedes commonly refer to him as the 'J.O.' or 'Ombudsman'. The Ombudsman is not subject to political pressure. He investigates complaints large and small that come to him from all levels of society. As complaints must be made in writing, the Ombudsman receives an average of 1,200 letters a year. He has eight lawyer assistants to help him and examines every single letter in detail. There is nothing secretive about the Ombudsman's work for his correspondence is open to public inspection. If a citizen's complaint is justified, the Ombudsman will act on his behalf. The action he takes varies according to the nature of the complaint. He may gently reprimand an official or even suggest to parliament that a law the altered. The following case is a typical example of the Ombudsman's work.A foreigner living in a Swedish village wrote to the Ombudsman complaining that he had been ill-treated by the police, simply because he was a foreigner. The Ombudsman immediately wrote to the Chief of Police in the district asking him to send a record of the case. There was nothing in the record to show that the foreigner's complaint was justified and the Chief of Police strongly denied the accusation. It was impossible for the Ombudsman to take action, but when he received a similar complaint from another foreigner in the same village, he immediately sent one of his layers to investigate the matter. The lawyer ascertained that a policeman had indeed dealt roughly with foreigners on several occasions. The fact that the policeman was prejudiced against foreigners could not be recorded in the official files. It was only possible for the Ombudsman to find this out by sending one of his representatives to check the facts. The policeman in question was severely reprimanded and was informed that if any further complaints were lodged against him, he would prosecuted. The Ombudsman's prompt action at once put an end to an unpleasant practice which might have gone unnoticed.",
    createdAt: 1752835469758,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c53\u8bfe\u5185\u5bb9",
    wordCount: 459,
  },
  {
    id: 1120000054,
    uuid: "11200001054",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c54\u8bfe\u7a0b",
    content:
      "We have been brought up to fear insects. We regard them as unnecessary creatures that do more harm than good. We continually wage war on them, for they contaminate our food, carry diseases, or devour our crops. They sting or bite without provocation; they fly uninvited into our rooms on summer nights, or beat ageist our lighted windows. We live in dread not only of unpleasant insects like spiders or wasps, but of quite harmless one like moths. Reading about them increases our understanding without dispelling our fears. Knowing that the industrious ant lives in a highly organized society does nothing to prevent us from being filled with revulsion when we find hordes of them crawling over a carefully prepared picnic lunch. No matter how much we like honey, or how much we have read about the uncanny sense of direction which bees possess, we have a horror of being stung. Most of our fears are unreasonable, but they are impossible to erase. At the same time, however, insects are strangely fascinating. We enjoy reading about them, especially when we find that, like the praying mantis, they lead perfectly horrible lives. We enjoy staring at them, entranced as they go about their business, unaware (we hope) of our presence. Who has not stood in awe at the sight of a spider pouncing on a fly, or a column of ants triumphantly bearing home an enormous dead beetle?Last summer I spent days in the garden watching thousands of ants crawling up the trunk of my prize peach tree. The tree has grown against a warm wall on a sheltered side of the house. I am especially proud of it, not only because it has survived several severe winters, but because it occasionally produces luscious peaches. During the summer, I noticed tat the leaves of the tree were beginning to wither. Clusters of tin insects called aphids were to be found on the underside of the leaves. They were visited by a large colony of ants which obtained a sort of honey from them. I immediately embarked on an experiment which, even though if failed to get rid of the ants, kept me fascinated for twenty-four hours. I bound the base of the tree with sticky tape, making it impossible for the ants to reach the aphids. The tape was so stick that they did not dare to cross it. For a long time. I watched them scurrying around the base of the tree in bewilderment. I even went out at midnight with a torch and noted with satisfaction (and surprise) that the ants were still swarming around the sticky tape without being able to do anything about it. I got up early next morning hoping to find that the ants had given up in despair. Instead, I saw that they had discovered a new route. They were climbing up the wall of the house and then on to the leaves of the tree. I realized sadly that I had been completely defeated by their ingenuity. The ants had been quick to find an answer to my thoroughly unscientific methods!",
    createdAt: 1752835470851,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c54\u8bfe\u5185\u5bb9",
    wordCount: 518,
  },
  {
    id: 1120000055,
    uuid: "11200001055",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c55\u8bfe\u7a0b",
    content:
      "Recent developments in astronomy have made it possible to detect planets in our won Milky Way and in other galaxies. This is a major achievement because, in relative terms, planets are very small and old not emit light. Finding planets is proving hard enough, but finding life on them will prove infinitely more difficult. The first question to answer is whether a planet can actually support life. In our won solar system, for example, Venus is far too hot and Mars is far too cold to support life. Only the Earth provides ideal conditions, and even here it has taken more than four billion years for plant and animal life to evolve.Whether a planet can support life depends on the size and brightness of its star, that is its 'sun'. Imagine a star up t twenty times larger, brighter, brighter and hotter than our own sun. A planet would have to be a very long way from it to be capable of supporting life. Alternatively, if the star were small, the life-supporting planet would have to have a close orbit round it and also provide the perfect conditions for life forms to develop. But how would we find such a planet? At present, there is no telescope in existence that is capable of detecting the presence of life. The development of such a telescope will be one of the great astronomical projects of the twenty-first century.It is impossible to look for life on another planet using earth-based telescopes. Our own warm atmosphere and the heat generated by the telescope would make it impossible to detect objects as small as planets. Even a telescope in orbit round the earth, like the very successful Hubble telescope, would not be suitable because of the dust particles iron solar system. A telescope would have to be as far away as the planet Jupiter to look for life in outer space, because the dust becomes thinner the further we travel towards the outer edges of our own solar system. Once we detected a planet, we would have to find a way of blotting out the light from its star, so that we would be able to 'see' the planet properly and analyze its atmosphere. In the first instance, we would be looking for plant life, rather than 'little green men'. The life forms most likely to develop on a planet would be bacteria. It is bacteria that have generated the oxygen we breathe on earth. For most of the earth's history they have been the only form of life on our planet. As Earth-dwellers, we always cherish the hope that we will be visited by little green men and that we will be able to communicate with them. But this hope is always in the realms of science fiction. If we were able to discover lowly forms of life like bacteria on another planet, it would completely change our view of ourselves. As Daniel Goldin of NASA observed, 'Finding life elsewhere would change everything. No human endeavor or thought would be unchanged by it.\"",
    createdAt: 1752835471941,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c55\u8bfe\u5185\u5bb9",
    wordCount: 509,
  },
  {
    id: 1120000056,
    uuid: "11200001056",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c56\u8bfe\u7a0b",
    content:
      "The river which forms the eastern boundary of our farm has always played an important part in our lives. Without it we could not make a living. There is only enough spring water to supply the needs of the houses, so we have to pump from the river for farm use. We tell river all our secrets. We know instinctively, just as beekeepers with their bees, that misfortune might overtake us if the important events of our lives were not related to it.We have special river birthday parties in the summer. Sometimes were go upstream to a favourite backwater, sometimes we have our party at the boathouse, which a predecessor of ours at the farm built in the meadow hard by the deepest pool for swimming and diving. In a heat wave we choose a midnight birthday party and that is the most exciting of all. We welcome the seasons by the riverside, crowning the youngest girl with flowers in the spring, holding a summer festival on Midsummer Eve, giving thanks for the harvest in the autumn, and throwing a holy wreath into the current in the winter.After a long period of rain the river may overflow its banks. This is a rare occurrence as our climate seldom guest to extremes. We are lucky in that only the lower fields, which make up a very small proportion of our farm, are effected by flooding, but other farms are less favorably sited, and flooding can sometimes spell disaster for their owners.One had winter we watched the river creep up the lower meadows. All the cattle had been moved into stalls and we stood to lose little. We were, however, worried about our nearest neighbors, whose farm was low lying and who were newcomers to the district. As the floods had put the telephone out of order, we could not find out how they were managing. From an attic window we could get a sweeping view of the river where their land joined ours, and at the most critical juncture we took turns in watching that point. The first sign of disaster was a dead sheep floating down. Next came a horse, swimming bravely, but we were afraid that the strength of the current would prevent its landing anywhere before it became exhausted. Suddenly a raft appeared, looking rather like Noah's ark, carrying the whole family, a few hens, the dogs, cat, and bird in a cage. We realized that they must have become unduly frightened by the rising flood, for their house, which had sound foundations, would have stood stoutly even if it had been almost submerged. The men of our family waded down through our flooded meadows with boathooks, in the hope of being able to grapple a corner of the raft and pull it out of the current towards our bank. We still think it a miracle that they we able to do so.",
    createdAt: 1752835473055,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c56\u8bfe\u5185\u5bb9",
    wordCount: 485,
  },
  {
    id: 1120000057,
    uuid: "11200001057",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c57\u8bfe\u7a0b",
    content:
      "I stopped to let the car cool off and to study the map. I had expected to be near my objective by now, but everything still seemed alien to me. I was only five when my father had taken me abroad, and that we eighteen years ago. When my mother had died after a tragic accident, he did not quickly recover from the shock and loneliness. Everything around him was full of her presence, continually reopening the wound. So he decided to emigrate. In the new country he became absorbed in making a new life for the two of us, so that he gradually ceased to grieve. He did not marry again and I was brought up without a woman's care; but I lacked for nothing, for he was both father and mother to me. He always meant to go back on day, but not to stay. His roots and mine bad become too firmly embedded in the new land. But he wanted to see the old folk again and to visit my mother's grave. He became mortally ill a few months before we had planned to go and, when he knew that he was dying, he made me promise to go on my own.I hired a car the day after landing and bought a comprehensive book of maps, which I found most helpful on the cross-country journey, but which I did not think I should need on the last stage. It was not that I actually remembered anything at all. But my father had described over and over again what we should see at every milestone, after leaving the nearest town, so that I was positive I should recognize it as familiar territory. Well, I had been wrong, for I was now lost.I looked at the map and then at the millimeter. I had come ten miles since leaving the town, and at this point, according to my father, I should be looking at farms and cottages in a valley, with the spire of the church of our village showing in the far distance. I could see no valley, no farms, no cottages and no church spire -- only a lake. I decided that I must have taken a wrong turning somewhere. So I drove back to the town and began to retrace the route, taking frequent glances at the map. I landed up at the same corner. The curious thing was that the lake was not marked on the map. I left as if I had stumbled into a nightmare country, as you sometimes do in dreams. And, as in a nightmare, there was nobody in sight to help me. Fortunately for me, as I was wondering what to do next, there appeared on the horizon a man on horseback, riding in my direction. I waited till he came near, then I asked him the way to our old village. He said that there was now no village. I thought he must have misunderstood me, so I repeated its name. This time he pointed to the lake. The village no longer existed because it had been submerged, and all the valley too. The lake was not a natural one, but a man-made reservoir.",
    createdAt: 1752835476823,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c57\u8bfe\u5185\u5bb9",
    wordCount: 535,
  },
  {
    id: 1120000058,
    uuid: "11200001058",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c58\u8bfe\u7a0b",
    content:
      "The old lady was glad to be back at the block of flats where she lived. Her shopping had tired her and her basket ad grown heavier with every step of the way home. In the life her thoughts were on lunch and a good rest; but when she got out at her own floor, both were forgotten in her sudden discovery that her front door was open. She was thinking that she must reprimand her home help the next morning for such a monstrous piece of negligence, when she remembered that she had gone shopping after the home help had left and she knew that she had turned both keys in their locks, She walked slowly into the hall and at once noticed that all the room doors were open, yet following her regular practice she had shut them before going out. Looking into the drawing room, she saw a scene of confusion over by her writing desk. It was as clear as daylight then that burglars had forced an entry during her absence. Her first impulse was to go round all the rooms looking for the thieves, but then she decided that at her age it might be more prudent to have someone with her, so she went to fetch the porter from his basement. By this time her legs were beginning to tremble, so she sat down and accepted a cup of very strong tea, while he telephoned the police. Then, her composure regained, she was ready to set off with the porter's assistance to search for nay intruders who might still be lurking in her flat.They went through the rooms, being careful to touch nothing, as they did not want to hinder the police in their search for fingerprints. The chaos was inconceivable. She had lived in the flat for thirty years and was a veritable magpie at hoarding; and it seemed as though everything she possessed had been tossed out and turned over and over. At least sorting out the things she should have discarded years ago was now being made easier for her. Then a police inspector arrived with a constable and she told them of her discovery of the ransacked flat. The inspector began to look for fingerprints, while the constable checked that the front door locks had not been forced, thereby proving that the burglars had either used skeleton keys or entered over the balcony. There was no trace of fingerprints, but the inspector found a dirty red bundle that contained jewellery which the old lady said was not hers. So their entry into this flat was apparently not the burglars' first job that day and they must have been disturbed. The inspector then asked the old lady to try to check what was missing by the next day and advised her not to stay alone in the flat for a few nights. The old lady though the was a fussy creature, but since the porter agreed with him, she rang up her daughter and asked for her help in what she described as a little spot of bother.",
    createdAt: 1752835477917,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c58\u8bfe\u5185\u5bb9",
    wordCount: 517,
  },
  {
    id: 1120000059,
    uuid: "11200001059",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c59\u8bfe\u7a0b",
    content:
      "People tend to amass possessions, sometimes without being aware of doing so. Indeed they can have a delightful surprise when they find something useful which they did not know they owned. Those who never have to move house become indiscriminate collectors of what can only be described as clutter. They leave unwanted objects in drawers, cupboards and attics for years, in the belief that they may one day need just those very things. As they grow old, people also accumulate belongings for two other reasons, lack of physical and mental energy, both of which are essential in turning out and throwing away, and sentiment. Things owned for a long time are full associations with the past, perhaps with relatives who are dead, and so they gradually acquire a value beyond their true worth.Some things are collected deliberately in the home in an attempt to avoid waste. Among these I would list string and brown paper, kept by thrifty people when a parcel has been opened, to save buying these two requisites. Collecting small items can easily become a mania. I know someone who always cuts sketches out from newspapers of model clothes that she would like to buy if she had the money. As she is not rich, the chances that she will ever be able to afford such purchases are remote; but she is never sufficiently strong-minded to be able to stop the practice. It is a harmless bait, but it litters up her desk to such an extent that every time she opens it, loose bits of paper fall out in every direction.Collecting as a serous hobby is quite different and has many advantages. It provides relaxation for leisure hours, as just looking at one's treasures is always a joy. One does not have to go outside for amusement, since the collection is housed at home. Whatever it consists of, stamps, records, first editions of books china, glass, antique furniture, pictures, model cars, stuffed birds, toy animals, there is always something to do in connection with it, from finding the right place for the latest addition, to verifying facts in reference books. This hobby educates one not only in the chosen subject, but also in general matters which have some bearing on it. There are also other benefits. One wants to meet like-minded collectors, to get advice, to compare notes, to exchange articles, to show off the latest find. So one's circle of friends grows. Soon the hobby leads to travel, perhaps to a meeting in another town, possibly a trip abroad in search of a rare specimen, for collectors are not confined to any one country. Over the years, one may well become a authority on one's hobby and will very probably be asked to give informal talks to little gatherings and then, if successful, to larger audiences. In this way self-confidence grows, first from mastering a subject, then from being able to take about it. Collecting, by occupying spare time so constructively, makes a person contented, with no time for boredom.",
    createdAt: 1752835479007,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c59\u8bfe\u5185\u5bb9",
    wordCount: 505,
  },
  {
    id: 1120000060,
    uuid: "11200001060",
    title:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c - \u7b2c60\u8bfe\u7a0b",
    content:
      "Punctuality is a necessary habit in all public affairs in civilized society. Without it, nothing could ever be brought to a conclusion; everything would be in state of chaos. Only in a sparsely-populated rural community is it possible to disregard it. In ordinary living, there can be some tolerance of unpunctuality. The intellectual, who is working on some abstruse problem, has everything coordinated and organized for the matter in hand. He is therefore forgiven if late for a dinner party. But people are often reproached for unpunctuality when their only fault is cutting things fine. It is hard for energetic, quick-minded people to waste time, so they are often tempted to finish a job before setting out to keep an appointment. If no accidents occur on the way, like punctured tires, diversions of traffic, sudden descent of fog, they will be on time. They are often more industrious, useful citizens than those who are never late. The over-punctual can be as much a trial to others as the unpunctual. The guest who arrives half an hour too soon is the greatest nuisance. Some friends of my family had this irritating habit. The only thing to do was ask them to come half an hour later than the other guests. Then they arrived just when we wanted them. If you are citing a train, it is always better to be comfortably early than even a fraction of a minted too late. Although being early may mean wasting a little time, this will be less than if you miss the train and have to wait an hour or more for the next one; and you avoid the frustration of arriving at the very moment when the train is drawing out of the station and being unable to get on it. An even harder situation is to be on the platform in good time for a train and still to see it go off without you. Such an experience befell a certain young girl the first time she was traveling alone. She entered the station twenty minutes before the train was due, since her parents had impressed upon her that it would be unforgivable to miss it and cause the friends with whom she was going to stay to make two journeys to meet her. She gave her luggage to a porter and showed him her ticket. To her horror he said that she was two hours too soon. She felt inhere handbag for the piece of paper on which her father had written down al the details of the journey and gave it to the porter. He agreed that a train did come into the station at the time on the paper and that it did stop, but only to take on mail, not passengers. The girl asked to see a timetable, feeling sure that her father could not have made such a mistake. The porter went to fetch one and arrive back with the station master, who produced it with a flourish and pointed out a microscopic 'o' beside the time of the arrival of the train at his station; this little 'o' indicated that the train only stopped for mail. Just as that moment the train came into the station. The girl, tears streaming down her face, begged to be allowed to slip into the guard's van. But the station master was adamant: rules could not be broken and she had to watch that train disappear towards her destination while she was left behind.",
    createdAt: 1752835480133,
    isOfficial: true,
    category: "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c",
    difficulty: "easy",
    description:
      "\u65b0\u6982\u5ff5\u82f1\u8bed\u7b2c\u4e09\u518c\u7b2c60\u8bfe\u5185\u5bb9",
    wordCount: 584,
  },
];

// 合并所有官方文章
export const officialArticles: OfficialArticle[] = [
  ...englishLearningArticles,
  ...techArticles,
  ...nce1Articles,
  ...nce2Articles,
  ...nce3Articles,
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
