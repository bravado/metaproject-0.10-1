# build release
# based on the elrte build script by Troex Nevelin <troex@fury.scancode.ru>

Q=   @
CAT= cat
RM=  rm
CP=  cp
SRC= .
DST= build

# BOOTSTRAP
#BOOTSTRAP_RESPONSIVE = ./css/bootstrap-responsive.css
#BOOTSTRAP_RESPONSIVE_LESS = ./less/responsive.less

# bootstrap 
bootstrap_less = ./less/bootstrap.less
bootstrap_css=			${DST}/bootstrap.css
bootstrap_min_css = ${DST}/bootstrap.min.css

# metaproject
metaproject_css=		${DST}/metaproject.css
metaproject_css_min=		${DST}/metaproject.min.css
metaproject_css_obj=		${SRC}/css/jquery-ui-1.8.16.custom.css \
			${SRC}/css/metaproject.css

metaproject_js=			${DST}/metaproject.full.js
metaproject_js_min=		${DST}/metaproject.min.js
metaproject_js_obj=		${SRC}/js/metaproject.js \
			${SRC}/js/metaproject.*.js \
			${SRC}/js/metaproject-ui.js \
			${SRC}/js/metaproject-ui.*.js


PHONY:     help
all:       bootstrap metaproject
clean:	bootstrap-clean metaproject-clean

help:
	@echo 'Makefile for release build automation'
	@echo ' Packages:'
	@echo '   bootstrap	- compile the bundled bootstrap fork'
	@echo '   metaproject   - concatenate and compress metaproject base css and js files'
	@echo ''
	@echo ' MAKE targets:'
	@echo '   all           - build all packages'
	@echo '   help          - show this message'
	@echo '   clean     - remove all generated files from DST (${DST})'
	@echo ''
	@echo ' Individual package targets are possible. To build single package replace PACKAGE'
	@echo ' with name from "Packages" section:'
	@echo '   PACKAGE'
	@echo '   PACKAGE-clean'

bootstrap:
	./node_modules/.bin/recess --compile ${bootstrap_less} > ${bootstrap_css}
	./node_modules/.bin/recess --compress ${bootstrap_less} > ${DST}/bootstrap.min.css
#	./node_modules/.bin/recess --compile ${BOOTSTRAP_RESPONSIVE_LESS} > bootstrap/css/bootstrap-responsive.css
#	./node_modules/.bin/recess --compress ${BOOTSTRAP_RESPONSIVE_LESS} > bootstrap/css/bootstrap-responsive.min.css

metaproject: ${metaproject_css} ${metaproject_js}

bootstrap-clean:
	${RM} -f ${bootstrap_css} 

${metaproject_css}:
	${CAT} ${metaproject_css_obj} > $@

${metaproject_js}:
	${CAT} ${metaproject_js_obj} > $@
	./node_modules/.bin/uglifyjs $@ > ${metaproject_js_min}

metaproject-clean:
	${RM} -f ${metaproject_js} ${metaproject_js_min} \
	${metaproject_css} ${metaproject_css_min}

