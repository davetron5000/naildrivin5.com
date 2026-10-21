# frozen_string_literal: true

require "cgi"

# Inlines an SVG file (e.g. one generated from a .dot file) directly into
# the page so it can be styled with the site's CSS. Strips the XML prolog,
# DOCTYPE, and generator comments. Width/height are left in place so the
# diagram renders at its natural size; CSS caps it responsively.
#
#   {% inline_svg images/tradprog.svg "Description for assistive tech" %}
module Jekyll
  class InlineSvgTag < Liquid::Tag
    def initialize(tag_name, markup, tokens)
      super
      unless markup.strip =~ /\A(\S+)(?:\s+"([^"]*)")?\s*\z/
        raise ArgumentError, "usage: {% inline_svg path/to/file.svg \"optional label\" %}"
      end

      @path  = Regexp.last_match(1)
      @label = Regexp.last_match(2)
    end

    def render(context)
      file = File.join(context.registers[:site].source, @path)
      raise "inline_svg: no such file: #{@path}" unless File.file?(file)

      svg = File.read(file)
                .gsub(/<\?xml.*?\?>/m, "")
                .gsub(/<!DOCTYPE[^>]*>/m, "")
                .gsub(/<!--.*?-->/m, "")
                .strip
      svg.sub(/<svg\b[^>]*>/) do |tag|
        attrs = +'class="diagram"'
        attrs << %( role="img" aria-label="#{CGI.escapeHTML(@label)}") if @label
        tag.sub(/<svg/, "<svg #{attrs}")
      end
    end
  end
end

Liquid::Template.register_tag("inline_svg", Jekyll::InlineSvgTag)
