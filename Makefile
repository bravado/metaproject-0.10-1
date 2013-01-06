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
LESS_COMPRESSOR ?= `which lessc`
UGLIFYJS ?= `which uglifyjs`
JAVA ?= `which java`
YUI_COMPRESSOR= ../yuicompressor-2.4.7/build/yuicompressor-2.4.7.jar

# define objects

# metaproject
metaproject_less = ./less/metaproject.less

metaproject_css=			${SRC}/css/metaproject.css
metaproject_css_full=       ${DST}/metaproject.full.css
metaproject_css_min=		${DST}/metaproject.min.css
metaproject_css_obj=		${SRC}/css/jquery-ui-1.8.16.custom.css \
			${SRC}/css/metaproject.css

metaproject_js=			${DST}/metaproject.full.js
metaproject_js_min=		${DST}/metaproject.min.js
metaproject_js_obj=		${SRC}/js/metaproject.js \
			${SRC}/js/metaproject.*.js


PHONY:     help
all:       css metaproject
clean:
	${RM} -f ${metaproject_css} ${metaproject_css_full} ${metaproject_css_min} \
	${metaproject_js} ${metaproject_js_min}

help:
	@echo 'Makefile for release build automation'
	@echo ' Packages:'
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

#	${LESS_COMPRESSOR} --compress ${metaproject_less} > ${metaproject_css_min}
#	${LESS_COMPRESSOR} ${BOOTSTRAP_RESPONSIVE_LESS} > css/bootstrap-responsive.css
#	${LESS_COMPRESSOR} --compress ${BOOTSTRAP_RESPONSIVE_LESS} > css/bootstrap-responsive.min.css

#bootstrap-clean:
#    ${RM} -f css/bootstrap.css css/bootstrap.min.css \
#    css/bootstrap-responsive.css css/bootstrap-responsive.min.css

metaproject: ${metaproject_css} ${metaproject_js}

${metaproject_css}:
	${LESS_COMPRESSOR} ${metaproject_less} > $@
	${CAT} ${metaproject_css_obj} > ${metaproject_css_full}

${metaproject_js}:
	${CAT} ${metaproject_js_obj} > $@
	uglifyjs -nc $@ > ${metaproject_js_min}


metaproject-compress:
	${JAVA} -jar ${YUI_COMPRESSOR} \
        --charset utf8 --type css --line-break 1 \
        -o ${metaproject_css_min} ${metaproject_css}

# compressor
ifdef YUI_COMPRESSOR
metaproject: metaproject-compress
endif



