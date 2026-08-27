import sys

with open("index.html", "r") as f:
    content = f.read()

content = content.replace(" <svg", "<svg")

with open("index.html", "w") as f:
    f.write(content)
