# need `pip install pyyaml` to run
# copied from https://github.com/jonbeebe/frontmatter
import yaml
import os
import datetime

# preset parts of index.html
top = """<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="generator" content="pandoc">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
  <title>Posts</title>
  <style type="text/css">code{white-space: pre;}</style>
<style type="text/css">
  body {
    margin:40px auto;
    max-width:650px;
    line-height:1.4;
    padding:0 10px;
    font-family: sans-serif;
  }
  h1,h2,h3 {
    line-height:1.2
  }
  pre { 
    background: rgba(0, 0, 0, 0.05);
    padding:5px;
  }
</style>
  <!--[if lt IE 9]>
    <script src="//cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7.3/html5shiv-printshiv.min.js"></script>
  <![endif]-->
</head>
<body>
<header>
<!--<h1>Posts</h1>-->
<h1>Posts</h1>
<p>
</p>
</header>"""

notes = """<h1 id="notes">Notes</h1>
<p>Below are notes from classes I have taken. Notes from classes were not assigned work. I created them to review material learned in class, usually in studying for exams.</p>
<ul>
<li>Notes from Evolutionary Processes, Evolutionary Algorithms, Evolutionary Games (<a href="https://classes.cornell.edu/browse/roster/SP18/class/ECE/4271">ECE 4271</a>): <a href="ece4271-review.pdf">pdf</a></li>
<li>Chapter summaries for algorithms course (<a href="http://www.cs.cornell.edu/courses/cs4820/2017fa/">CS 4820</a>): <a href="algo_chapter_summaries.pdf">pdf</a></li>
<li>Review sheet for machine learning course (<a href="https://people.ece.cornell.edu/acharya/teaching/ece4950s17/ece4950">ECE 4950</a>): <a href="ml_final_review.pdf">pdf</a></li>
</ul>"""

bottom = """<p>
<hr>
<a href="/">Home</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="/blog/">Blog</a></p>
</p>
</body>
</html>"""

# helpers for getting frontmatter
def parse(filename):
    """Opens file and returns Dictionary with metadata and content"""
    with open(filename) as p:
        lines = [line for line in p]

    separated = __separate_yaml_content(lines)
    meta = separated[0]
    contentlines = separated[1]
    content = ''.join(x for x in contentlines)

    return { 'metadata': meta, 'content': content }

def __separate_yaml_content(lines=[]):
    """Separates yaml lines from list of strings"""
    yaml_content = ''
    marker_reached = False
    linenum = 0

    for line in lines:
        if marker_reached:
            if line.startswith('---') or line.startswith('+++'):
                break
            yaml_content += line
        elif line.startswith('---') or line.startswith('+++'):
            marker_reached = True
        linenum += 1

    parsedyaml = yaml.load(yaml_content) or {}
    nextline = linenum + 1
    remaining = lines[nextline:]

    return (parsedyaml, remaining)

index = open('index.html','w')
index.write(top)
index.write('<p>')

# get list of (file, title, date) for only the files ready to publish
all_md_files = [f for f in os.listdir('.') if os.path.isfile(f) and f.endswith('.md')]
all_html_files = [f[:-5] for f in os.listdir('.') if os.path.isfile(f) and f.endswith('.html')] # names only
ready_files = []
for f in all_md_files:
    if f[:-3] in all_html_files: # check if corresponding html generated (i.e. ready to publish)
        post = parse(f)
        t = post['metadata'].get('title','')
        d = post['metadata'].get('date', '')
        ready_files.append((f,t,d))

# sort based on date
ready_files = sorted(ready_files, key=lambda x: datetime.datetime.strptime(x[2], '%m-%d-%Y'), reverse=True)
# write to html
for f,t,d in ready_files:
    index.write(d+': <a href=\'' + f[:-3] + '.html\'>' + t + '</a><br>')


index.write('</p>')
index.write(notes)
index.write(bottom)
index.close()



