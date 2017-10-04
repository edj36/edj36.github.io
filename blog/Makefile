# generates the index.html file for the blog directory
index:
	pandoc index.md -o index.html -f markdown -t html5 --standalone --template github.html5 --smart --normalize

# generates a post with table of contents
# in order for this to work <name> must be a .md file within this directory
# call via: $ make postwithcontents name=<name> (and don't include the .md extension)
postwithcontents:
	pandoc $(name).md -o $(name).html -f markdown -t html5 --standalone --template github.html5 --toc --toc-depth 2 --smart --normalize

# generates a post without table of contents
# same instructions as above for calling and generating a post
post:
	pandoc $(name).md -o $(name).html -f markdown -t html5 --standalone --template github.html5 --smart --normalize

