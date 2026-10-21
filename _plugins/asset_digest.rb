# frozen_string_literal: true

require "digest"

module AssetDigest
  def asset_digest(path)
    source = @context.registers[:site].source
    file = File.join(source, path)
    return "" unless File.file?(file)

    Digest::SHA256.file(file).hexdigest[0, 12]
  end
end

Liquid::Template.register_filter(AssetDigest)
