import json

def convert_json_to_jsonl(input_file, output_file):
    """
    将包含JSON数组的标准JSON文件转换为JSON Lines文件。

    :param input_file: 输入的 .json 文件路径
    :param output_file: 输出的 .jsonl 文件路径
    """
    try:
        with open(input_file, 'r', encoding='utf-8') as infile, \
             open(output_file, 'w', encoding='utf-8') as outfile:
            
            # 从输入文件加载整个JSON数组
            data = json.load(infile)
            
            # 确保输入是列表（JSON数组）
            if not isinstance(data, list):
                raise TypeError("输入的JSON文件根元素必须是一个数组 (list)!")

            # 遍历数组中的每个对象
            for entry in data:
                # 将每个对象转换为JSON字符串，并确保没有多余的缩进
                # ensure_ascii=False 保证中文字符不会被转义
                json_line = json.dumps(entry, ensure_ascii=False)
                
                # 写入文件并添加换行符
                outfile.write(json_line + '\n')
                
        print(f"转换成功！文件已保存为: {output_file}")

    except FileNotFoundError:
        print(f"错误: 输入文件 {input_file} 未找到。")
    except json.JSONDecodeError:
        print(f"错误: 输入文件 {input_file} 不是有效的JSON格式。")
    except Exception as e:
        print(f"发生未知错误: {e}")

# --- 使用示例 ---
if __name__ == "__main__":
    input_json_file = 'coca20000.json'
    output_jsonl_file = 'coca20000.jsonl'
    convert_json_to_jsonl(input_json_file, output_jsonl_file)