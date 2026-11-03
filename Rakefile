require "date"

desc "Generate SWOTs"
task :swot do
  require "erb"
  require "pathname"
  require "active_support/core_ext/string/inflections"
  Dir["swot/*.md"].each do |markdown_file|
    markdown_file = Pathname(markdown_file)
    basename = markdown_file.basename.to_s.gsub(/\.md$/,"")
    swot_name = basename.titleize
    lines = File.read(markdown_file).split(/\n/)

    swot = {
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: [],
    }
    current_swot = nil
    current_thing = nil
    lines.each do |line|
      if line =~ /^# (.+$)/ # new SWOT top-level
        which_one = $1
        if !current_swot.nil? # if switching
          if !current_thing.nil?
            current_swot << current_thing
            current_thing = nil
          end
        end
        current_swot = swot[which_one.downcase.strip.to_sym]
        if current_swot.nil?
          raise "#{which_one} isn't a SWOT thingy"
        end
      elsif current_swot.nil?
        next
      else
        if line =~ /^## (.+$)/
          if !current_thing.nil?
            current_swot << current_thing
          end
          name = $1.strip
          current_thing = {
            name: name,
            id: name.parameterize,
            content: []
          }
        elsif current_thing.nil?
          next
        elsif  line =~ /^\s*$/
          next
        else
          current_thing[:content] << line
        end
      end
    end
    current_swot << current_thing

    template = ERB.new(File.read("swot/template.html.erb"))
    File.open("swot/#{basename}.html","w") do |file|
      b = binding
      file.puts(template.result(b))
    end
  end
end
