import os
import json

# 设置完整数据源文件名
REFERENCE_FILE = "KEYBR.officialwordlibraries.json"

# 读取 A.json 中的单词完整信息，并构建 name -> word_info 映射
with open(REFERENCE_FILE, "r", encoding="utf-8") as f:
    ref_data = json.load(f)

# 如果 A.json 是列表形式（多个单词）
if isinstance(ref_data, list):
    ref_dict = {item["name"]: item for item in ref_data}
# 如果是单个单词（对象结构）
else:
    ref_dict = {ref_data["name"]: ref_data}

# 遍历当前目录下的所有 json 文件
for filename in os.listdir("."):
    if filename.endswith(".json") and filename != REFERENCE_FILE:
        file_path = os.path.join(".", filename)
        print(f"处理文件: {filename}")

        # 读取当前 json 文件
        with open(file_path, "r", encoding="utf-8") as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                print(f"⚠️ 文件 {filename} 解析失败，跳过")
                continue

        # 如果是单个对象，转成列表处理
        if isinstance(data, dict):
            words = [data]
            single_object = True
        elif isinstance(data, list):
            words = data
            single_object = False
        else:
            print(f"⚠️ 文件 {filename} 格式异常，跳过")
            continue

        # 更新每个单词
        for word in words:
            name = word.get("name")
            if not name:
                continue
            ref_word = ref_dict.get(name)
            if not ref_word:
                continue

            # 补全字段
            for field in ["usphone", "ukphone", "sentences", "detailed_translations"]:
                if field not in word or not word[field]:
                    word[field] = ref_word.get(field)

        # 写回文件
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(words[0] if single_object else words, f, ensure_ascii=False, indent=2)

print("✅ 所有文件处理完成。")
