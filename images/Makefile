DOT_FILES = *.dot
PNG_FILES = $(patsubst %.dot,%.png,$(DOT_FILES))

%.png : %.dot
	dot -Tpng $< -o$@
	@open $@

all: $(PNG_FILES)
