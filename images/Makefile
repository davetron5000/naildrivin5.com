DOT_FILES = *.dot
PNG_FILES = $(patsubst %.dot,%.png,$(DOT_FILES))

%.png : %.dot
	dot -Tpng $< -o$@
	convert $@ -resize 320x320 320-$@
	convert $@ -resize 500x500 500-$@
	@open $@

all: $(PNG_FILES)
