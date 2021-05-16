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
      file.puts "  title: \"Get the Most out of Rails\""
      file.puts "  subtitle: \"A Deep Dive into Sustainability\""
      file.puts "  link: \"http://bit.ly/sus-rails\""
      file.puts "  image: \"/images//sustainable-rails-cover.png\""
      file.puts "  cta: \"Buy Now $49.95\""
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
  sh "RUBYOPT=-W0 bundle exec jekyll serve --future #{flags.join(' ')}"
end

desc "Serve up the site locally"
task serve: :build do
  serve(drafts: false, watch: true)
end

desc "Serve up the site locally"
task "serve:drafts" => :build do
  serve(drafts: true, watch: true)
end


deploy_task = if ENV["CIRCLE_BRANCH"] == "main"
                :deploy
              elsif ENV["CIRCLE_BRANCH"].to_s.strip != ""
                :preview
              else
                :not_on_ci
              end

desc "Deploy to prod or preview from CI"
task "ci:deploy" => deploy_task

task :not_on_ci do
  fail "You are not on CI so cannot deploy"
end

desc "Deploy to AWS"
task :deploy => :build do
  fail "Must be run from root" unless Dir.exist?("_site")
  [
    "--cache-control=\"max-age=3600\"",
  ].each do |args|
    command = "aws s3 sync #{args} _site/ s3://naildrivin5.com"
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
  ].each do |file_to_invalidate|
    sh "aws cloudfront create-invalidation --distribution-id=E19I9AKMQP8NDQ --paths=/#{file_to_invalidate}"
  end
  puts "Site is up on http://naildrivin5.com"
end

desc "Preview on S3"
task :preview => :build do
  fail "Must be run from root" unless Dir.exist?("_site")
  command = "aws s3 sync _site/ s3://naildrivin5.com-preview"
  puts command
  sh(command) do |ok,res|
    fail res.inspect unless ok
  end
  puts "Site is up on http://naildrivin5.com-preview.s3.amazonaws.com/index.html"
end

desc "Generate SWOTs"
task :swot do
  require "erb"
  require "active_support/core_ext/string/inflections"
  heroku_lines = File.read("swot/heroku.md").split(/\n/)

  swot_name = "Heroku"
  swot = {
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: [],
  }
  current_swot = nil
  current_thing = nil
  heroku_lines.each do |line|
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
  File.open("swot/heroku.html","w") do |file|
    b = binding
    file.puts(template.result(b))
  end
end
