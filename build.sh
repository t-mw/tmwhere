# using tidy 5.6.0 from macports
hugo
tidy -im -w 160 --tidy-mark no public/index.html
tidy -im -w 160 --tidy-mark no public/city_generation.html
rm public/**/{thumb,1,2,3}.*
rm -r public/downloads
