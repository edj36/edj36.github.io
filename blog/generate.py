# requirements to run:
#     pyyaml: `pip install pyyaml`
#     pandoc: https://pandoc.org
# copied frontmatter parsing from https://github.com/jonbeebe/frontmatter
import yaml
import os
import datetime
import glob
import subprocess
from tqdm import tqdm

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
    line-height:1.5;
    padding:0 10px;
    font-family: sans-serif;
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

bottom = """<p>
<hr>
<a href="/">Home</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="/blog/">Blog</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="/notes/">Notes</a>
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

def generate_posts():
    print('generating html posts from md')
    md_files = glob.glob('*.md')
    for md_file in tqdm(md_files):
        html_file = md_file[:-3]
        pandoc_string = 'pandoc {} -o {}.html -f markdown -t html5 --standalone --template ../templates/simple.html5 --smart --normalize'.format(md_file,html_file)
        subprocess.run(pandoc_string, shell=True, check=True)
    print('done generating html posts from md')

def generate_index():
    print('generating index page')
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
        index.write('{}: <a href=\'{}.html\'>{}</a><br>'.format(d,f[:-3],t))
        index.write('\n')


    index.write('</p>')
    index.write(bottom)
    index.close()
    print('done generating index page')

if __name__ == "__main__":
    generate_posts()
    generate_index()





