BASEURL = /rolandwarmerdam.co.nz/_site

production:
	jekyll

build:
	jekyll --base-url $(BASEURL)

auto:
	jekyll --auto --base-url $(BASEURL)

.PHONY: auto
.PHONY: build
