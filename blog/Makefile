# generates the index.html file for the blog directory
index:
	pandoc index.md -o index.html -f markdown -t html5 --standalone --template ../templates/simple.html5 --smart --normalize

# generates a post with table of contents
# in order for this to work <name> must be a .md file within this directory
# call via: $ make postwithcontents name=<name> (and don't include the .md extension)
postwithcontents:
	pandoc $(name).md -o $(name).html -f markdown -t html5 --standalone --template ../templates/simple.html5 --toc --toc-depth 2 --smart --normalize --metadata date="`date +%D`"

# generates a post without table of contents
# same instructions as above for calling and generating a post
post:
	pandoc $(name).md -o $(name).html -f markdown -t html5 --standalone --template ../templates/simple.html5 --smart --normalize --metadata date="`date +%D`"

# generates a post without table of contents using old github template
# same instructions as above for calling and generating a post
github-post:
	pandoc $(name).md -o $(name).html -f markdown -t html5 --standalone --template ../templates/github.html5 --smart --normalize --metadata date="`date +%D`"

# generates a post without table of contents
# same instructions as above for calling and generating a post
# uses old tyler cipriani template and css
cipriani-post:
	pandoc $(name).md -o $(name).html -f markdown -t html5 --standalone --template ../templates/template.html5 --css ../styles/style.css --css ../styles/local.css --smart --normalize --metadata date="`date +%D`"

## still need
## coloring stuff
## fix nav links, add resume
## inspiration: https://tylercipriani.com/blog/2014/05/13/replace-jekyll-with-pandoc-makefile/
