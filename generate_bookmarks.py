#!/usr/bin/env python3

import json
import sys

if len(sys.argv) < 2:
    print("Usage: python3 generate_bookmarks.py pinboard.json")
    sys.exit(1)

json_file_path = sys.argv[1]

with open(json_file_path, 'r') as file:
    data = json.load(file)

list_items = [
    f'- [{item["description"]}]({item["href"]})'
    for item in data
    if item.get('shared') == "yes"
]

doc = """+++
title = "Bookmarks"
date = 2024-01-12T00:00:00+00:00
+++

""" + '\n'.join(list_items)

with open('./content/bookmarks/index.md', 'w') as file:
    file.write(doc)

print("bookmarks generated")
