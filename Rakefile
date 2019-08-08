require "date"

desc "Create a new post via [title,date,link] with date being 'today', 'tomorrow', or a specific date"
task :new_post, [:title,:date,:link] do |t,args|
  date = if args[:date].nil? || args[:date] == "today"
           Date.today
         elsif args[:date] == 'tomorrow'
           Date.today + 1
         else
           Date.parse(args[:date])
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
      file.puts "  title: \"Focus on Results\""
      file.puts "  subtitle: \"11 Practices You Can Start Doing Now\""
      file.puts "  link: \"http://bit.ly/dcsweng\""
      file.puts "  image: \"/images/sweng-cover.png\""
      file.puts "  cta: \"Buy Now $25\""
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

desc "Build the site into _site"
task :build do
  drafts = if ENV["DRAFTS"] == "true"
             "--drafts"
           else
             ""
           end
  sh "bundle exec jekyll build #{drafts}"
  sh "bundle exec sass _sass/styles.scss:css/styles.css"
end

desc "Serve up the site locally"
task serve: :build do
  drafts = if ENV["DRAFTS"] == "true"
             "--drafts"
           else
             ""
           end
  sh "bundle exec jekyll serve --future --watch #{drafts} --livereload"
end


deploy_task = if ENV["CIRCLE_BRANCH"] == "master"
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
    "blog/2019/07/10/the-frightening-state-security-around-npm-package-management.html",
    "blog/2019/07/25/four-better-rules-for-software-design.html",
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
