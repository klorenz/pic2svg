child = require('child_process');
tempfile = require('tempfile');
fs = require('fs');

function spawnSync(program, argv, opts, error) {
  var result = child.spawnSync(program, argv, opts);
  if (result.error) {
    if (result.error.errno === 'ENOENT') {
      if (typeof error === 'string') {
        throw new Error(error);
      } else {
        var msg = ''
        if (error.prolog) {
          msg += error.prolog;
        }
        if (error[process.platform]) {
          msg += error[process.platform];
        }
        if (error.epilog) {
          msg += error.epilog;
        }
        throw new Error(msg);
      }
    }
  }
  return result;
}

function pic2svg(content, data) {
  var data = data || {};

  // fonts at http://infohost.nmt.edu/tcc/soft/plotutils/plotutils_10.html#SEC67
  var pic_font = "Helvetica";
  if (data.pic_font) {
    pic_font = data.pic_font;
  }

  if (!content.match(/^\.PS/)) {
     content = ".PS\n"+content+"\n.PE\n";
  }

  console.log("content", content)

  /* pic2plot also can produce svg, but with an ugly white border and background
     rect.  For beeing able to crop away the white border, go via ps and pdf */
  result = spawnSync("pic2plot", ["-Tps", "-F"+pic_font], {
    input: content
  }, {
    prolog: 'pic2plot not found.  Install GNU plotutils.',
    linux: 'E.g. on Debian and Ubuntu do: `apt-get install plotutils`',
    darwin: 'See http://macappstore.org/plotutils/',
  });

  result = spawnSync("ps2pdf", ["-", "-"], {
    input: result.stdout
  }, {
    prolog: 'ps2pdf not found.  Install Ghostscript.'
  });

  var pdfcropped = tempfile(".pdf");
  result = spawnSync("pdfcrop", ["-margins", "2 2 2 2", "-", pdfcropped], {
    input: result.stdout
  }, {
    prolog: "pdfcrop not found.  Install pdfcrop.pl."
  });

  var svgfile = tempfile(".svg");
  result = spawnSync("pdf2svg", [pdfcropped, svgfile], {}, {
    prolog: 'pdf2svg not found.  Install pdf2svg tool.'
  });

  result = fs.readFileSync(svgfile).toString();

  fs.unlinkSync(pdfcropped);
  fs.unlinkSync(svgfile);

  return result
}


module.exports = {
  "pic2svg": pic2svg,
}

if (require.main === module) {
  var content = '';
  process.stdin.on('data', function(chunk) {
    content += chunk.toString();
  });

  process.stdin.on('end', function() {
    process.stdout.write(pic2svg(content));
  });
}
