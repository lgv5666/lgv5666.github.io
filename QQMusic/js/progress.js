function Progress($progress_bar,$progress_line,$progress_dot) {
    return new Progress.prototype.init($progress_bar,$progress_line,$progress_dot);
}

(function (window) {
    Progress.prototype = {
      construct:Progress,
        isDrag:false,
      init:function ($progress_bar,$progress_line,$progress_dot) {
          this.$progressBar = $progress_bar;
          this.$progressLine = $progress_line;
          this.$progressDot = $progress_dot;
      },
        progressClick:function (callback) {
          var progressThis = this;
            this.$progressBar.click(function (e) {
                var line_width = e.pageX-$(this).offset().left;
                progressThis.$progressLine.width(line_width);
                progressThis.$progressDot.css("left",e.pageX-$(this).offset().left);

                callback(line_width/progressThis.$progressBar.width());
            });
        },
        progressMove:function (callback) {
            var progressThis = this;
          this.$progressBar.mousedown(function () {
              var left = $(this).offset().left;
              $(document).mousemove(function (e) {
                  progressThis.isDrag = true;
                  var line_width = e.pageX-left;

                  if (line_width<0){
                      line_width=0;
                  }
                  if (line_width>progressThis.$progressBar.width()){
                      line_width = progressThis.$progressBar.width();
                  }
                  progressThis.$progressLine.width(line_width);
                  progressThis.$progressDot.css("left",line_width);
                  callback(line_width/progressThis.$progressBar.width());
              });
          });

          $(document).mouseup(function () {
              progressThis.isDrag = false;
              $(document).off("mousemove");
          });

        },
        setProgress:function (value) {
          if (this.isDrag){
              return;
          }
            this.$progressLine.css("width",value+"%");
            this.$progressDot.css("left",value+"%");
        }
    };
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
}(window));