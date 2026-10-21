# frozen_string_literal: true

Jekyll::Hooks.register :site, :pre_render do |site|
  next unless site.config["serving"]

  site.config["reload_token"] = format("%.6f", Time.now.to_f)
end

Jekyll::Hooks.register :site, :post_write do |site|
  next unless site.config["serving"]

  File.write(File.join(site.dest, "__reload"), site.config["reload_token"])
end
