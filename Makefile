BASEURL = /rolandwarmerdam.co.nz/_site
URL = http://localhost/rolandwarmerdam.co.nz/_site

build:
	jekyll --base-url $(BASEURL) --url $(URL)

auto:
	jekyll --auto --base-url $(BASEURL) --url $(URL)

production:
	jekyll --url http://rolandwarmerdam.co.nz

deploy: production
	rsync -avz --delete _site/ vps:/var/www/rolandwarmerdam/htdocs/

.PHONY: build production deploy auto
