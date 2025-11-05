require "date"

desc "Create a new post via [title,date,link] with date being 'today', 'tomorrow', or a specific date"
task :new_post, [:title,:date,:link] do |t,args|
  date = if args[:date].nil? || args[:date] == "today"
           Date.today
         elsif args[:date] == 'tomorrow'
           Date.today + 1
         else
           begin
             Date.parse(args[:date])
           rescue Date::Error => ex
             puts "#{ex}: '#{args[:date]}'"
             fail
           end
         end

  title = args[:title]

  formatted_date = date.strftime('%Y-%m-%d')

  slug = formatted_date + "-" + title.gsub(/[\s\W]/,"-").downcase

  post_filename =  "_posts/#{slug}.md"

  File.open(post_filename,"w") do |file|
    file.puts "---"
    file.puts "layout: post"
    file.puts "title: \"#{title}\""
    file.puts "date: #{formatted_date} 9:00"
    if args[:link]
      file.puts "link: #{args[:link]}"
    else
      file.puts "ad:"
      file.puts "  title: \"Fix Your Dev Environment for Good\""
      file.puts "  subtitle: \"Stop Re-installing and Start Coding\""
      file.puts "  link: \"https://sowl.co/bhKWwy\""
      file.puts "  image: \"/images/docker-book-cover.jpg\""
      file.puts "  cta: \"Buy Now $19.95\""
    end
    file.puts "---"
    file.puts
    if args[:link]
      file.puts "This is the intro and a reference to [the link][link], as well as a quote:"
      file.puts
      file.puts "> this is a quote from the articel"
      file.puts
      file.puts "And a follow up quip if needed"
      file.puts
      file.puts "[link]: #{args[:link]}"
    else
      file.puts "This is the intro"
      file.puts
      file.puts "<!-- more -->"
      file.puts
      file.puts "This is some content"
      file.puts
      file.puts "<div data-ad></div>"
      file.puts
      file.puts "This is some more content"
    end
  end
  puts post_filename
end

def build(future: false, drafts: false)
  flags = []
  flags << "--future"     if future
  flags << "--drafts"     if drafts

  sh "RUBYOPT=-W0 bundle exec jekyll build #{flags.join(' ')}"
  sh "RUBYOPT=-W0 bundle exec sass _sass/styles.scss:css/styles.css"
end

desc "Build the site into _site"
task :build => :swot do
  build(future: ENV["CI"] && ENV["CIRCLE_BRANCH"] != "main")
end

def serve(drafts: false, watch: false)
  flags = []
  flags << "--drafts"     if drafts
  flags << "--watch"      if watch
  flags << "--livereload" if watch
  sh "RUBYOPT=-W0 bundle exec jekyll serve -H 0.0.0.0 --future #{flags.join(' ')}"
end

desc "Serve up the site locally"
task serve: :build do
  serve(drafts: false, watch: true)
end

desc "Serve up the site locally with drafts"
task "serve:drafts" => :build do
  serve(drafts: true, watch: true)
end

desc "Deploy to prod"
task :deploy => :build do

task :deploy => :build do
  fail "Must be run from root" unless Dir.exist?("_site")
  [
    "--cache-control=\"max-age=3600\"",
  ].each do |args|
    command = "aws s3 sync #{args} _site/ s3://naildrivin5.com --profile personal"
    puts command
    sh(command) do |ok,res|
      fail res.inspect unless ok
    end
  end
  [
    "index.html",
    "atom.xml",
    "css/styles.css",
    "blm.html",
    "books/index.html",
  ].each do |file_to_invalidate|
    sh "aws cloudfront create-invalidation --distribution-id=E19I9AKMQP8NDQ --paths=/#{file_to_invalidate} --profile personal"
  end
  puts "Site is up on http://naildrivin5.com"
end

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
