/*! STCSS v1.22 Beta | Julien Roy - royjulien.com | 11.22.13 */

/******************************************************
 * BUG: > 2 classes on a single tag not working
 ******************************************************/

//globals
    processTag = '#generate';
    renderTag = 'code';
    indentation = '&nbsp;&nbsp;&nbsp;&nbsp;';// For one TAB, use &#09
    brackets = {
        o : ' {<br/><br/>',
        c : '}'
    };
    ul = {
        o : '<ul>',
        c : '</ul>'
    };
    li = {
        o : '<li>',
        c : '</li>'
    };
    cssComment ='<span class="comment">/******************** <br/> * MAIN CSS <br/> ********************/ <br/></span>';
    globalCssComment =  '<span class="comment">/******************** <br/> * GLOBALS <br/> ********************/ <br/></span>';

var stcss = function() {

    var globalCss = '',
        css = '',
        warning = '',
        allTags = [],
        tagArray = [],
        attArray = [],
        ids = [],
        classes = [],
        recursive = function($node) {
            $node.children().each(function(){
                allTags.push(this);
                recursive($(this));
            });
        },
        append = function(content) {
            return $(renderTag).append(content);
        };
    
    // go through the entire dom
    recursive($(processTag));
    
    globalCss+=ul.o;
    css+=ul.o;
        for (i=0; i < allTags.length; i++) {
            liDepth = $(allTags[i]).parents().length;
            tagName = allTags[i].tagName.toLowerCase();
            
            if (tagName != 'script') {
                // attributes
                attr = allTags[i].attributes;
                if (attr.length) {
                    for (k=0; k < attr.length; k++) {
                        attrName = attr[k].nodeName;
                        attrValue = attr[k].nodeValue;
                        
                        // Duplicate ID's
                        if (ids.indexOf(attrValue) > 0){
                            warning+='<span class="warning">';
                            warning+='Duplicate Found: ';
                            warning+='#'+attrValue;
                            warning+='</span><br/>';
                        } else if (attArray.indexOf(attrValue) < 0) {
                            attArray.push(attrValue);
                            
                            if (attrName == 'id' || attrName == 'class') {
                                css+=li.o;
                                    for (j=2; j < liDepth; j++) css+=indentation;
                                    switch (attrName) {
                                        case 'id':
                                            ids.push(attrValue);
                                            css+='#'+attrValue;
                                            css+=brackets.o;
                                            for (j=2; j < liDepth; j++) css+=indentation;
                                            css+=brackets.c;
                                            break;
                                        case 'class':
                                            classes.push(attrValue);
                                            var rpl = attrValue.replace(' ', '.');
                                            css+='.'+rpl;
                                            css+=brackets.o;
                                            for (j=2; j < liDepth; j++) css+=indentation;
                                            css+=brackets.c;
                                            break;
                                    }
                                css+=li.c;
                            }
                        }
                    }
                } else if (tagName == 'header' || tagName == 'nav' || tagName == 'footer') {
                    for (j=2; j < liDepth; j++) css+=indentation;
                    // Adds comments to major tags
                    css+= '<span class="comment">';
                        css+= '/* '+tagName.toUpperCase()+' */';
                    css+= '</span><br/>';
                    for (j=2; j < liDepth; j++) css+=indentation;
                    css+=tagName;
                    css+=brackets.o;
                    for (j=2; j < liDepth; j++) css+=indentation;
                    css+=brackets.c;
                } else {
                    if (tagArray.indexOf(tagName) < 0) {
                        tagArray.push(tagName);
                        globalCss+=li.o;
                            globalCss+=tagName;
                            globalCss+=brackets.o;
                            globalCss+=brackets.c;
                        globalCss+=li.c;
                    }
                }
            }
        }
    globalCss+=ul.c;
    css+=ul.c;
    
    if (warning.length) append(warning);
    if (globalCss.length) globalCss = globalCssComment + globalCss;
    append(globalCss);
    
    if (css.length) css = cssComment + css;
    append(css);
}

$('#html-box').bind('input', function() {
    $('#generate').html($(this).val());
    
    //clear board if not empty
    if ($(renderTag).html().length > 0)
        $(renderTag).html('')
    
    stcss();
});

// Run once for the sample
stcss();