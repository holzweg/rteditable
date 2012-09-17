(function($){

    $.fn.rteditable = function(options) {

        if(options == "stop") {
            this.unbind("focus");
            this.unbind("hover");
            this.unbind("blur");
            this.unbind("keypress");
            this.unbind("keyup");
            this.unbind("click");
            this.attr("contentEditable", "false");
            return true;
        }

        // Set defaults
        var defaults = {
            url: '/',
            permissions: {},
            shortcuts: {}
        };
        var defaultPermissions = {
            default: {
                newline: false,
                paste: false,
                cut: false,
                format: false,
                dragover: false,
                drop: false
            }
        }
        var defaultShortcuts = {
            "#b": "bold",
            "#i": "italic",
            "#u": "underline",
            "#-": "decreaseFontSize",
            "#+": "increaseFontSize",
            "#r": "removeFormat",
            "#s": "strikeThrough"
        }

        // Create options
        var options = $.extend(defaults, options);
        options.permissions = $.extend(defaultPermissions, options.permissions);
        options.shortcuts = $.extend(defaultShortcuts, options.shortcuts);

        // Create selector
        $("body").append("<div id='rt-sel'>input</div>");
        $("body").append("<div id='rt-ol'></div>");
        var $sel = $("div#rt-sel");
        var $ol = $("div#rt-ol");

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

                        // Get token
                        var token = $i.editing.data("token");
                        if(token) {
                            $sel.html(token);
                        }else{
                            // Get text element
                            var selection = window.getSelection();
                            var nodeName = $(selection.anchorNode).parent()[0].nodeName.toLowerCase();
                            $sel.html(nodeName);
                        }


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

                if(rect == null || (rect.right == 0 && rect.bottom == 0)) {

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
            can: function($this, action) {
                // Fetch default permissions
                var permissions = options.permissions.default;
                // Append override permissions
                if($this.data("permissions") && options.permissions[$this.data("permissions")]) {
                    permissions = $.extend(permissions, options.permissions[$this.data("permissions")]);
                }
                // Return true/false
                return permissions[action];

            },
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
            select: function(start, end) {

                $this = $i.editing;
                if(!$i.editing) {
                    return false;
                }

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

            $this.bind("cut paste dragover drop", function(event) {
                if(!$ef.can($this, event.type)) {
                    event.preventDefault();
                }
            });

            $this.keypress(function(event) {
                $this = $(this);


                // Character Map
                var mapString = "";
                if(event.ctrlKey) { mapString = mapString + "$"; }
                if(event.altKey) { mapString = mapString + "@"; }
                if(event.metaKey) { mapString = mapString +  "#"; }
                if(mapString != "") {
                    var character = String.fromCharCode(event.which);
                    var matches = character.match(/[\w+-]{1}/g);
                    if(matches != null && matches.length && matches[0] != "") {
                        var mapString = mapString + matches[0];

                        // Check if key binding is registered
                        if(options.shortcuts[mapString]) {
                            var commandArray = options.shortcuts[mapString].split("|");
                            var command = commandArray.shift();
                            var argument = commandArray.shift();
                            if($ef.can($this, "format")) {
                                document.execCommand(command, false);
                            }
                            event.preventDefault();
                            return true;
                        }

                    }
                }

                // check escape (cancel and reset editing)
                if(event.keyCode == 27) {
                    event.preventDefault();
                    $this.html($this.data("oldHtml"));
                    $this.blur();
                    return true;
                }

                // check return (newline)
                if(event.which == 13 && !$ef.can($this, "newline")) {
                    event.preventDefault();
                    return false;
                }

                // check command return (commit)
                if(event.metaKey && event.which == 13) {
                    event.preventDefault();
                    $this.blur();
                    return true;
                }

                // check command a (select all)
                if(event.metaKey && event.which == 97) {
                    event.preventDefault();
                    $ef.select("all");
                    return true;
                }

                // check command left/up (move to beginning)
                if(event.metaKey && (event.keyCode == 37 || event.keyCode == 38)) {
                    event.preventDefault();
                    $ef.select("start");
                    return true;
                }

                // check command right/down (move to end)
                if(event.metaKey && (event.keyCode == 39 || event.keyCode == 40)) {
                    event.preventDefault();
                    $ef.select("end");
                    return true;
                }

            });

            $this.keyup(function(event) {
                $this = $(this);
                $f.updateSelector();
                $f.updateOutline();

                // Update group nodes
                if($this.data("slug")) {
                    var others = $("[data-slug="+$this.data("slug")+"]").not($this);

                    var html = $this.html();
                    // Remove <br> at end of text
                    if(html.substr(-4) == "<br>") {
                        console.log(html);
                        html = html.substr(0, html.length - 4);
                        console.log(html);
                    }
                    others.each(function() {
                        if($(this).html() != html) {
                            $(this).html(html);
                        }
                    });

                }

            });

            $this.click(function(event) {
                $f.updateSelector();
                $f.updateOutline();
            });

        });

    };
})(jQuery);