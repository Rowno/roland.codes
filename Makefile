BASEURL = /rolandwarmerdam.co.nz/_site

build:
	jekyll --base-url $(BASEURL)

auto:
	jekyll --auto --base-url $(BASEURL)

production:
	jekyll --base-url http://rolandwarmerdam.co.nz

deploy: production
	rsync -avz --delete _site/ vps:/var/www/rolandwarmerdam/htdocs/

.PHONY: build production deploy auto
