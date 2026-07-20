import re

with open("story.html", "r") as f:
    html = f.read()

html = html.replace('<div class="timeline-dot"></div>', '<img src="./assets/story/Parivartan-Leaf.png" alt="" class="timeline-leaf" />')

with open("story.html", "w") as f:
    f.write(html)

with open("css/story.css", "r") as f:
    css = f.read()

# Replace .timeline-dot styles
css = css.replace('.timeline-dot {', '.timeline-leaf {')
css = css.replace('.timeline-item.right .timeline-dot {', '.timeline-item.right .timeline-leaf {')
css = css.replace('.timeline-dot, .timeline-item.right .timeline-dot {', '.timeline-leaf, .timeline-item.right .timeline-leaf {')

# Find the block for .timeline-leaf and replace it completely with the new styles
old_leaf_style = """  position: absolute;
  right: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  background: #FFFFFF;
  border: 3px solid #85BD56;
  border-radius: 50%;
  z-index: 2;"""

new_leaf_style = """  position: absolute;
  right: -14px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  object-fit: contain;
  z-index: 2;"""

css = css.replace(old_leaf_style, new_leaf_style)

# Mobile replacement for left position
css = css.replace("""  left: 12px;
    right: auto;""", """  left: 10px;
    right: auto;""")

with open("css/story.css", "w") as f:
    f.write(css)

print("Updated leaf.")
