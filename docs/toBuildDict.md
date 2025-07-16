# 如何导入新的词典 📚

注意，我们的词典主要来源于社区贡献。当你想要导入新的词典时，最好准备好词典的源文件，以便我们能够更好的帮助你。

## 0. 交给我们！🤝

### 0.1 如果你没有任何编程基础 🚫💻

我们推荐你加入 Keybr 社区群，在群中反映你的需求，我们的开发者会帮助你导入词典。


### 0.2 如果你不会编程，但会使用 github🐙

我们推荐你以“Dictionary Request”为开头发起 Issue，描述你的词典需求并提供词典来源。

## 1. 亲自动手！🛠️

### 1.1 词典的目标文件格式 📄

词典的文件格式是 `词典名.json` ，其内容结构应当是:

```json

[
  {
    "name": "explosive",
    "usphone": "ɪk'splosɪv; ɪk'splozɪv",
    "ukphone": "ɪk'spləusɪv",
    "sentences": [
      {
        "english": "Because the gas is highly explosive, it needs to be kept in high-pressure containers.",
        "chinese": "由于这种气体极易爆炸，因此需要保存在高压容器内。"
      },
      {
        "english": "A small explosive device (= bomb ) was set off outside the UN headquarters today.",
        "chinese": "今天有一枚小型炸弹在联合国总部外爆炸。"
      }
    ],
    "detailed_translations": [
      {
        "pos": "adj",
        "chinese": " 爆炸的； 极易引起争论的",
        "english": "able or likely to explode"
      },
      {
        "pos": "n",
        "chinese": "炸药",
        "english": "a substance that can cause an explosion"
      }
    ]
  }
 ]
```

其中name字段是必须要的，其余字段越全，练习体验越好。例如:

```json
{
    "name": "cancel",
    "usphone": "'kænsl",
    "ukphone": "'kænsl",
    "sentences": [
      {
        "english": "Our flight was cancelled.",
        "chinese": "我们的航班取消了。"
      },
      {
        "english": "I’m afraid I’ll have to cancel our meeting tomorrow.",
        "chinese": "恐怕我得取消我们明天的会议。"
      },
      {
        "english": "You’ll just have to ring John and cancel.",
        "chinese": "你只能打电话给约翰取消了。"
      }
    ],
    "detailed_translations": [
      {
        "pos": "vt",
        "chinese": " 取消， 撤销； 删去",
        "english": "to decide that something that was officially planned will not happen"
      }
    ]
  },
  {
    "name": "explosive",
    "usphone": "ɪk'splosɪv; ɪk'splozɪv",
    "ukphone": "ɪk'spləusɪv",
    "sentences": [
      {
        "english": "Because the gas is highly explosive, it needs to be kept in high-pressure containers.",
        "chinese": "由于这种气体极易爆炸，因此需要保存在高压容器内。"
      },
      {
        "english": "A small explosive device (= bomb ) was set off outside the UN headquarters today.",
        "chinese": "今天有一枚小型炸弹在联合国总部外爆炸。"
      }
    ],
    "detailed_translations": [
      {
        "pos": "adj",
        "chinese": " 爆炸的； 极易引起争论的",
        "english": "able or likely to explode"
      },
      {
        "pos": "n",
        "chinese": "炸药",
        "english": "a substance that can cause an explosion"
      }
    ]
  },
  {
    "name": "numerous",
    "usphone": "'numərəs",
    "ukphone": "'njuːmərəs",
    "sentences": [
      {
        "english": "Numerous attempts have been made to hide the truth.",
        "chinese": "为掩盖事实作了很多尝试。"
      },
      {
        "english": "The two leaders have worked together on numerous occasions.",
        "chinese": "那两位领导人已经多次合作。"
      }
    ],
    "detailed_translations": [
      {
        "pos": "adj",
        "chinese": " 众多的",
        "english": "many"
      }
    ]
  },
  {
    "name": "govern",
    "usphone": "'ɡʌvɚn",
    "ukphone": "'gʌvn",
    "sentences": [
      {
        "english": "the leaders who govern the country",
        "chinese": "治理这个国家的领导人"
      },
      {
        "english": "The party had been governing for seven months.",
        "chinese": "该党执政已经有七个月了。"
      }
    ],
    "detailed_translations": [
      {
        "pos": "vi",
        "chinese": " 居支配地位， 占优势",
        "english": ""
      },
      {
        "pos": "vt",
        "chinese": "统治，治理，支配",
        "english": "to officially and legally control a country and make all the decisions about taxes, laws, public services etc"
      }
    ]
  },

```

#### 1.1.0 如何将词典的源文件转换为目标文件格式？🔄

由于词典的源文件格式、来源各异，我们无法为你提供统一的转换方法，但是我们可以提供一些思路：

#### 1.1.1 你可以将部分词典源文件的内容发送给 ChatGPT 并描述需求，让 ChatGPT 生成转换脚本 🤖

#### 1.1.2 你也可以使用在线工具将词典源文件转换为目标文件格式，此类在线工具有很多，如 <https://csvjson.com/csv2json> 🔧

#### 1.1.3 如果内容不多，你也可以手动将词典源文件转换为目标文件格式，或批量交给 ChatGPT 生成 ✍️

#### 1.1.4 如果你卡在了这一步，可以回到 0 部分，交给我们来帮你完成这一步 🔄

### 1.2 词典的目标文件位置 📍

词典的目标文件位置是 `/public/dicts/`，请将处理好的词典文件放置在该目录下

### 1.3 词典的索引建立 🔍

词典的索引建立是在 `/resources/dictionary.ts` 中完成的，你需要在该文件中添加一行代码，格式如下：

```json
{
    "id": "xxx",
    "name": "xxx",
    "description": "xxx",
    "category": "xxx",
    "url": "./dicts/xxx.json",
    "length": xxx
}
```

例如:

```json
  {
    "id": "cet4",
    "name": "CET-4",
    "description": "大学英语四级词库",
    "category": "英语学习",
    "url": "/dicts/CET4_T.json",
    "length": 2607,
    "language": "en",
  },
  {
    "id": "cet6",
    "name": "CET-6",
    "description": "大学英语六级词库",
    "category": "英语学习",
    "url": "/dicts/CET6_T.json",
    "length": 2345,
    "language": "en",
  },
```

其中,  
`id` 需要是所有词典中唯一的  
`name` 是展示给所有用户的词典名  
`description` 是词典描述  
`category` 是词典分类（你可以事先阅读所有已存在的词典分类，来为新的词典选择合适的分类）  
`url` 是词典的目标文件位置  
`length` 是词典的单词数量（可以通过运行脚本 `scripts/update-dict-size.js` 来自动计算）  
`language` 表示词典的语言

### 1.4 测试 🧪

使用 yarn 指令安装依赖，然后使用 yarn dev 启动开发服务器，访问 "http://localhost:3000"

如果你的词典已经成功导入，你将在词典列表中看到你的词典。🎉

### 1.5 提交 PR 📝

现在你可以提交 PR 了，我们会尽快 review 你的代码，如果一切顺利，你的词典将会在下一个版本中发布。🎉

## 别忘了，在任何步骤遇到困难时，你都可以转向 Keybr 社区寻求帮助。我们是一个非常友好的社区，随时欢迎你的加入！🤝
