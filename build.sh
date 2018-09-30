# using tidy 5.6.0 from macports
hugo
tidy -i -m -w 160 -ashtml -utf8 public/index.html
tidy -i -m -w 160 -ashtml -utf8 public/city_generation.html
rm public/**/{thumb,1,2,3}.*
rm -r public/downloads
