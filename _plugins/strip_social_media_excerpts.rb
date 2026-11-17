# frozen_string_literal: true

# Removes elements with the `social-media-excerpt` class from rendered HTML.
# Used by atom.xml to keep the cross-posting excerpts out of the RSS feed.
#
#   {{ post.content | strip_social_media_excerpts }}
module Jekyll
  module StripSocialMediaExcerptsFilter
    CLASS_NAME = "social-media-excerpt"
    VOID_ELEMENTS = %w[
      area base br col embed hr img input link meta param source track wbr
    ].freeze
    TAG_RE = /<(\/?)([a-zA-Z][a-zA-Z0-9:-]*)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)>/m
    CLASS_ATTR_RE = /\bclass\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/i

    def strip_social_media_excerpts(html)
      return html if html.nil? || html.empty?

      source = html.to_s
      result = +""
      cursor = 0
      skip_start = nil
      skip_tag = nil
      depth = 0

      source.to_enum(:scan, TAG_RE).each do
        match = Regexp.last_match
        closing = match[1] == "/"
        tag = match[2].downcase
        attrs = match[3]
        self_closing = match[4] == "/" || VOID_ELEMENTS.include?(tag)

        if skip_start.nil?
          next if closing || !social_media_excerpt?(attrs)

          if self_closing
            result << source[cursor...match.begin(0)]
            cursor = match.end(0)
          else
            skip_start = match.begin(0)
            skip_tag = tag
            depth = 1
          end
        elsif tag == skip_tag
          if closing
            depth -= 1
            if depth.zero?
              result << source[cursor...skip_start]
              cursor = match.end(0)
              skip_start = nil
              skip_tag = nil
            end
          elsif !self_closing
            depth += 1
          end
        end
      end

      result << source[cursor..]
      result
    end

    private

    def social_media_excerpt?(attrs)
      match = attrs.match(CLASS_ATTR_RE)
      return false unless match

      classes = (match[1] || match[2] || match[3]).split(/\s+/)
      classes.include?(CLASS_NAME)
    end
  end
end

Liquid::Template.register_filter(Jekyll::StripSocialMediaExcerptsFilter)
