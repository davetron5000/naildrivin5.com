DOT_FILES = *.dot
PNG_FILES = $(patsubst %.dot,%.png,$(DOT_FILES))

%.png : %.dot
	dot -Gdpi=300 -Tpng $< -o$@
	convert $@ -resize 320x320 $(basename $@)-320.png
	convert $@ -resize 500x500 $(basename $@)-500.png
	#@open $@:
	@echo "<figure>"
	@echo	"  <a href=\"/images/$@\">"
	@echo	"    <img src=\"/images/$@\""
	@echo "         srcset=\"/images/$@ 629w,"
	@echo "                 /images/$(basename $@)-320.png 320w,"
	@echo "                 /images/$(basename $@)-500.png 500w\""
	@echo "         sizes=\"(max-width: 320px) 320px,"
	@echo	"                (max-width: 500px) 500px,"
	@echo	"                629px\""
	@echo "         alt=\"alt text here\">"
	@echo	"  </a>"
	@echo	"  <figcaption class=\"\">"
	@echo	"    Caption goes here (<a target=\"_new\" href=\"/images/$@\">Open bigger version in new window</a>)"
	@echo	"  </figcaption>"
	@echo	"</figure>"

%.svg : %.dot
	dot -Gdpi=300 -Tsvg $< -o$@
	#@open $@:
	@echo "<figure>"
	@echo	"  <a href=\"/images/$@\">"
	@echo	"    <img src=\"/images/$@\""
	@echo "         alt=\"alt text here\">"
	@echo	"  </a>"
	@echo	"  <figcaption class=\"\">"
	@echo	"    Caption goes here (<a target=\"_new\" href=\"/images/$@\">Open bigger version in new window</a>)"
	@echo	"  </figcaption>"
	@echo	"</figure>"

all: $(PNG_FILES)
