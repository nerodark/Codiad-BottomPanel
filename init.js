(function(global, $) {
  var codiad = global.codiad,
    scripts = document.getElementsByTagName("script"),
    path = scripts[scripts.length - 1].src.split("?")[0],
    curpath = path.split("/").slice(0, -1).join("/") + "/";

  $(function() {
    codiad.bottomPanel.init();
  });

  codiad.bottomPanel = {
    initialBottomPanelHeight: 300,

    init: function() {
    },

    createBottomPanel: function() {
      var panelHeight = this.initialBottomPanelHeight;
      var panelBarHeight = parseInt($(".sidebar-handle").css("width"));
      this.destroyBottomPanel();
      $("#workspace").css({"position": "absolute"}).append(
        "<div id=\"bottom-panelbar\" class=\"sidebar-handle\">" +
          "<span>==</span>" +
        "</div>" +
        "<div id=\"bottom-panel\">" +
          "<a id=\"tab-close-button\" class=\"icon-cancel-circled\"></a>" +
        "</div>"
      );
      $("#cursor-position").data("original-css-bottom-value", $("#cursor-position").css("bottom"));
      $("#bottom-panelbar").data("panelbar-height", panelBarHeight);
      $("#bottom-panel").data("panel-height", panelHeight);
      $("#bottom-panel #tab-close-button").click(function(e) {
        // this is needed for the moment because there is another element with id tab-close-button
        e.preventDefault();
        codiad.bottomPanel.destroyBottomPanel();
      });
      $(".sidebar-handle").css("box-shadow", "none");
      $("#bottom-panelbar").css({"position": "fixed", "bottom": (panelHeight - panelBarHeight) + "px", "width": "100%", "height": panelBarHeight + "px", "text-align": "center", "cursor": "row-resize", "z-index": "0"}).draggable({"axis": "y", "drag": function() {
        var newPanelHeight = $(window).height() - parseInt($(this).css("top")) - panelBarHeight;
        codiad.bottomPanel.resizeWorkspaceForBottomPanel(newPanelHeight, panelBarHeight, true);
        // redraw right sidebar due to a chrome bug
        $("#sb-right").hide();
        $("#sb-right").height();
        $("#sb-right").show();
      }, "start": function() {
        $("#bottom-panelbar").css({"z-index": "99999"});
        //$("iframe").css("visibility", "hidden");
        $("iframe").css({"pointer-events": "none"});
      }, "stop": function() {
        $("#bottom-panelbar").css({"top": "", "z-index": "0"});
        //$("iframe").css("visibility", "");
        $("iframe").css({"pointer-events": ""});
      }});
      $("#bottom-panelbar span").css({"width": "100%", "top": "-2px"});
      $("#bottom-panel").css({"position": "fixed", "bottom": "0px", "width": "100%"});
      $("#bottom-panel #tab-close-button").css({"position": "absolute", "top": "7px", "right": "0px"});
      $(window).resize(this.resizeEventForBottomPanel);
      this.resizeWorkspaceForBottomPanel(panelHeight, panelBarHeight);
    },

    destroyBottomPanel: function() {
      $("#bottom-panelbar, #bottom-panel").remove();
      $(".sidebar").css({"height": "", "bottom": ""});
      $(".sidebar-handle").css("box-shadow", "");
      $("#editor-bottom-bar").css({"bottom": ""});
      $("#cursor-position").css({"bottom": $("#cursor-position").data("original-css-bottom-value")});
      $(window).unbind("resize", this.resizeEventForBottomPanel);
      $(window).resize();
    },

    resizeWorkspaceForBottomPanel: function(panelHeight, panelBarHeight, drag) {
      var newPanelHeight, sidebarsCssBottomValue, editorBottomBarCssBottomValue, cursorPositionCssBottomValue, bottomPanelHeight;
      if (drag) {
        newPanelHeight = panelHeight + panelBarHeight;
        sidebarsCssBottomValue = panelHeight + panelBarHeight;
        editorBottomBarCssBottomValue = panelHeight + panelBarHeight;
        cursorPositionCssBottomValue = parseInt($("#cursor-position").data("original-css-bottom-value")) + panelHeight + panelBarHeight;
        bottomPanelHeight = panelHeight;
      } else {
        newPanelHeight = panelHeight;
        sidebarsCssBottomValue = panelHeight;
        editorBottomBarCssBottomValue = panelHeight;
        cursorPositionCssBottomValue = parseInt($("#cursor-position").data("original-css-bottom-value")) + panelHeight;
        bottomPanelHeight = panelHeight - panelBarHeight;
      }
      $(".sidebar").css({"height": "auto", "bottom": sidebarsCssBottomValue + "px"});
      $("#editor-bottom-bar").css({"bottom": editorBottomBarCssBottomValue + "px"});
      $("#cursor-position").css({"bottom": cursorPositionCssBottomValue + "px"});
      $("#bottom-panel").data("panel-height", newPanelHeight).css({"height": bottomPanelHeight + "px"});
      $(window).resize();
    },

    resizeEventForBottomPanel: function() {
      var panelHeight = $("#bottom-panel").data("panel-height");
      var panelBarHeight = $("#bottom-panelbar").data("panelbar-height");
      // resize editor
      $("#root-editor-wrapper").css({"height": "-=" + panelHeight + "px"});
      codiad.editor.resize();
      $("#bottom-panelbar").css({"top": "", "bottom": (panelHeight - panelBarHeight) + "px"});
    }
  };
})(this, jQuery);
