(function($){

    $.fn.rteditable = function(options) {

        var defaults = {
            url: '/'
        };

        var options = $.extend(defaults, options);

        // Create selector
        $("body").append("<div id='rt-sel'>input</div>");
        $("body").append("<div id='rt-ol'></div>");
        var $sel = $("div#rt-sel");
        var $ol = $("div#rt-ol");

        $which = {
            enter: 13,
            a: 97,
            b: 98,
            i: 105,
            u: 117
        }

        var $i = {
            highlighted: null,
            editing: null,
            saving: null
        }

        var $f = {
            saveChanges: function() {
                var element = $i.saving;
                var data = {
                    slug: element.data("slug"),
                    oldHtml: element.data("oldHtml"),
                    html: element.html(),
                    rteditable: true
                }

                $ol.css({
                    "border-color": "rgba(104, 162, 181, 1)"
                });

                $.ajax({
                    type: 'POST',
                    url: options.url,
                    data: data,
                    success: function(data, textStatus, jqXHR) {
                        $ol.fadeOut(500, function() {
                            $i.saving = null;
                            $f.updateOutline();
                            $f.updateSelector();
                            $ol.css({
                                opacity: 1,
                                "border-color": "rgba(104, 162, 181, 0.2)"
                            });
                        });
                    }
                });

            },
            updateSelector: function(text) {
                if($i.editing != null) {

                    // Check if valid
                    var position = $f.getCaretPosition();
                    if(!(position.left == 0 && position.top == 0)) {

                        // Get text element
                        var selection = window.getSelection();
                        var nodeName = $(selection.anchorNode).parent()[0].nodeName.toLowerCase();
                        $sel.html(nodeName);
                        $sel.css(position);
                        $sel.show();
                    }

                }else{
                    $sel.hide();
                }
            },
            updateOutline: function() {
                var $scope = null;
                if($i.saving != null) {
                    $scope = $i.saving;
                }else if($i.editing != null) {
                    $scope = $i.editing;
                }else if($i.highlighted != null) {
                    $scope = $i.highlighted;
                }

                if($scope != null) {
                    var offset = {
                        left: $scope.outerWidth(true) - $scope.innerWidth(),
                        top: $scope.outerHeight(true) - $scope.innerHeight()
                    }
                    $ol.css({
                        left: $scope.offset().left - 4,
                        top: $scope.offset().top - 4,
                        width: $scope.outerWidth(true),
                        height: $scope.outerHeight(true)
                    });

                    $ol.fadeIn(150);
                }else{
                    $ol.fadeOut(150);
                }
            },
            getCaretPosition: function() {
                var selection = window.getSelection();
                var range = selection.getRangeAt(0).cloneRange();
                range.collapse(false);
                var rect = range.getBoundingClientRect();

                if(rect.right == 0 && rect.bottom == 0) {

                    // todo: check if valid
                    range.setEnd(range.endContainer, range.endOffset + 1);
                    rect = range.getBoundingClientRect();

                    if(rect.right == 0 && rect.bottom == 0) {
                        if(range.startOffset > 0) {
                            range.setStart(range.startContainer, range.startOffset - 1);
                            rect = range.getBoundingClientRect();
                        }
                    }
                }

                return {
                    left: rect.right,
                    top: rect.bottom + $(window).scrollTop()
                };

            }
        }

        $tmp = {};

        $ef = {
            getCharCount: function(node) {
                var textNodes = $ef.getTextNodes(node);
                var charCount = 0;
                for (var i = 0, textNode; textNode = textNodes[i++]; ) {
                    charCount = charCount + textNode.length;
                }
                return charCount;
            },
            getTextNodes: function(node) {
                var textNodes = [];
                if (node.nodeType == 3) {
                    textNodes.push(node);
                } else {
                    var children = node.childNodes;
                    if(children) {
                        for (var i = 0, len = children.length; i < len; ++i) {
                            textNodes.push.apply(textNodes, $ef.getTextNodes(children[i]));
                        }
                    }
                }
                return textNodes;
            },
            getSelectData: function(node, offset) {
                $tmp.position = null;
                $tmp.node = null;
                var textNodes = $ef.getTextNodes(node);
                var remaining = offset;
                for (var i = 0, textNode; textNode = textNodes[i++]; ) {
                    if(remaining > textNode.length) {
                        remaining = remaining - textNode.length;
                    }else{
                        return {
                            position: remaining,
                            node: textNode
                        };
                    }
                }
                return false;

            },
            select: function($this, start, end) {

                // Get char count
                var charCount = $ef.getCharCount($this[0]);

                // Create range
                var selection = window.getSelection();
                var range = document.createRange();
                range.selectNodeContents($this[0]);
                selection.removeAllRanges();
                selection.addRange(range);

                // Check for special selections
                switch(start) {
                    case "start":
                        start = 0;
                        end = 0;
                        break;
                    case "end":
                        start = charCount;
                        end = charCount;
                        break;
                    case "all":
                        start = 0;
                        end = charCount;
                        break;
                }

                // Set selection
                var startSelectData = $ef.getSelectData($this[0], start);
                var endSelectData = $ef.getSelectData($this[0], end);
                range.setStart(startSelectData.node, startSelectData.position);
                range.setEnd(endSelectData.node, endSelectData.position);

                // Update UI
                $f.updateSelector();
                $f.updateOutline();
            }
        }

        // Disable outline
        this.css({
            outline: "medium none"
        });

        return this.each(function() {

            var $this = $(this);

            $this.focus(function() {
                $this = $(this);
                $i.editing = $this;
                $this.data("oldHtml", $this.html());
                $f.updateSelector();
                $f.updateOutline();
            });

            $this.blur(function() {
                $this = $(this);
                $this.attr("contentEditable", "false");
                $i.editing = null;
                if($this.data("oldHtml") != $this.html()) {
                    $i.saving = $this;
                    $f.saveChanges();
                }
                $f.updateSelector();
                $f.updateOutline();
            });

            $this.hover(function() {
                $this = $(this);
                $this.attr("contentEditable", "true");
                $i.highlighted = $this;
                $f.updateOutline();
            }, function() {
                $this = $(this);
                $i.highlighted = null;
                $f.updateOutline();
            });

            $this.keypress(function(event) {
                $this = $(this);
                if(event.metaKey) {
                    switch(event.which) {
                        case $which.a:
                            event.preventDefault();
                            $ef.select($this, "all");
                            break;
                        case $which.b:
                            event.preventDefault();
                            document.execCommand("bold", false);
                            break;
                        case $which.i:
                            event.preventDefault();
                            document.execCommand("italic", false);
                            break;
                        case $which.u:
                            event.preventDefault();
                            document.execCommand("underline", false);
                            break;
                        case 0:
                            switch(event.keyCode) {
                                case 38:
                                    event.preventDefault();
                                    $ef.select($this, "start");
                                    break;
                                case 40:
                                    event.preventDefault();
                                    $ef.select($this, "end");
                                    break;
                                case 37:
                                    event.preventDefault();
                                    $ef.select($this, "start");
                                    break
                                case 39:
                                    event.preventDefault();
                                    $ef.select($this, "end");
                                    break;
                            }
                    }
                }
            });

            $this.keyup(function(event) {
                $this = $(this);
                $f.updateSelector();
                $f.updateOutline();

                // Update group nodes
                if($this.data("slug")) {
                    var others = $("[data-slug="+$this.data("slug")+"]");
                    others.each(function() {
                        if($(this).html() != $this.html()) {
                            $(this).html($this.html());
                        }
                    });

                }

            });

            $this.click(function(event) {
                $f.updateSelector();
                $f.updateOutline();
            });

            $this.change(function() {
            });

        });
    };
})(jQuery);