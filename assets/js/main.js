
window.onload = start

function start() {
  const prompt = document.querySelector(".prompt")
  prompt.innerHTML = 'Anonymous ~$ㅤ'
  var term = new Terminal('#input-line .cmdline', '#container output')
  term.init()

}

var util = util || {};
util.toArray = function (list) {
  return Array.prototype.slice.call(list || [], 0);
};

var Terminal = Terminal || function (cmdLineContainer, outputContainer) {
  window.URL = window.URL || window.webkitURL;
  window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

  var cmdLine_ = document.querySelector(cmdLineContainer);
  var output_ = document.querySelector(outputContainer);

  const CMDS_ = [
    '<span class="sys">[version]</span>' + '   Display version number.',
    '<span class="sys">[check]</span>' + '      Check if you have any bitches.',
    '<span class="sys">[secret]</span>' + '     The key to gaining bitches.',
    '<span class="sys">[repository]</span>' + ' Check the repository of the project' + '<span class="highlight"> ALIAS: repo</span>'
  ];

  var fs_ = null;
  var cwd_ = null;
  var history_ = [];
  var histpos_ = 0;
  var histtemp_ = 0;

  window.addEventListener('click', function (e) {
    cmdLine_.focus();
  }, false);

  cmdLine_.addEventListener('click', inputTextClick_, false);
  cmdLine_.addEventListener('keydown', historyHandler_, false);
  cmdLine_.addEventListener('keydown', processNewCommand_, false);

  //
  function inputTextClick_(e) {
    this.value = this.value;
  }

  //
  function historyHandler_(e) {
    if (history_.length) {
      if (e.keyCode == 38 || e.keyCode == 40) {
        if (history_[histpos_]) {
          history_[histpos_] = this.value;
        } else {
          histtemp_ = this.value;
        }
      }

      if (e.keyCode == 38) { // up
        histpos_--;
        if (histpos_ < 0) {
          histpos_ = 0;
        }
      } else if (e.keyCode == 40) { // down
        histpos_++;
        if (histpos_ > history_.length) {
          histpos_ = history_.length;
        }
      }

      if (e.keyCode == 38 || e.keyCode == 40) {
        this.value = history_[histpos_] ? history_[histpos_] : histtemp_;
        this.value = this.value; // Sets cursor to end of input.
      }
    }
  }

  //
  function processNewCommand_(e) {

    if (e.keyCode == 9) { // tab
      e.preventDefault();
      // Implement tab suggest.
    } else if (e.keyCode == 13) { // enter
      // Save shell history.
      if (this.value) {
        history_[history_.length] = this.value;
        histpos_ = history_.length;
      }

      // Duplicate current input and append to output section.
      var line = this.parentNode.parentNode.cloneNode(true);
      line.removeAttribute('id')
      line.classList.add('line');
      var input = line.querySelector('input.cmdline');
      input.autofocus = false;
      input.readOnly = true;
      output_.appendChild(line);

      if (this.value && this.value.trim()) {
        var args = this.value.split(' ').filter(function (val, i) {
          return val;
        });
        var cmd = args[0].toLowerCase();
        args = args.splice(1); // Remove cmd from arg list.
      }

      switch (cmd) {
        case 'repo':
          var url = args.join(' ');
          output('<span class="sys">[SYSTEM]</span>' + ' https://github.com/Naibuu/bitches');
          break;
        case 'repository':
          var url = args.join(' ');
          output('<span class="sys">[SYSTEM]</span>' + ' https://github.com/Naibuu/bitches');
          break;
        case 'secret':
          output('<span class="sys">[SYSTEM]</span>' + ' The key to getting bitches is by not having any skill issues unlike you.');
          break;
        case 'developer':
          output('<span class="sys">[HS50]</span> ' + "What's up! I'm the developer of this project, if you're looking to see more of my stupid creations. Be sure to visit my github page! It's listed in the bottom right corner");
          break;
        case 'clear':
          output_.innerHTML = '';
          this.value = '';
          return;
        case 'say':
          output('<span class="sys">[SYSTEM]</span>' + ' ' + args.join(' '));
          break;
        case 'help':
          output('<div class="ls-files">' + CMDS_.join('<br>') + '</div>');
          break;
        default:
          if (cmd) {
            output('<div class="error">' + cmd + ' : An unexpected comamnd. Check "help" for the commands list. ' + "</div>");
          }
      };

      window.scrollTo(0, getDocHeight_());
      this.value = ''; // Clear/setup line for next input.
    }
  }

  //

  function formatColumns_(entries) {
    var maxName = entries[0].name;
    util.toArray(entries).forEach(function (entry, i) {
      if (entry.name.length > maxName.length) {
        maxName = entry.name;
      }
    });

    var height = entries.length <= 3 ?
      'height: ' + (entries.length * 15) + 'px;' : '';

    // 12px monospace font yields ~7px screen width.
    var colWidth = maxName.length * 7;

    return ['<div class="ls-files" style="-webkit-column-width:',
      colWidth, 'px;', height, '">'];
  }

  //
  function output(html) {
    output_.insertAdjacentHTML('beforeEnd', '<p>' + html + '</p>');
  }

  // Cross-browser impl to get document's height.
  function getDocHeight_() {
    var d = document;
    return Math.max(
      Math.max(d.body.scrollHeight, d.documentElement.scrollHeight),
      Math.max(d.body.offsetHeight, d.documentElement.offsetHeight),
      Math.max(d.body.clientHeight, d.documentElement.clientHeight)
    );
  }

  //
  return {
    init: function () {
      output('<img align="left" src="http://www.w3.org/html/logo/downloads/HTML5_Badge_128.png" width="100" height="100" style="padding: 0px 10px 20px 0px"><h2 style="letter-spacing: 4px">Your Terminal</h2><p>' + genTime() + '</p><p>Enter "help" for more information.</p>');
    },
    output: output
  }
};