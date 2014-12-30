var fs = require("fs")
var path = require("path")
var glob = require("glob")

var backgrounds = []

// using an array of glob to directly get the appropriate extensions is very slow
// so instead getting an ent
// ire folder, then manually filter
var allowedExt = [".jpg", ".JPG", ".jpeg", ".JPEG", ".png", ".PNG"]
var dir = process.env.PUTAINDETAB_PATH || "backgrounds"
console.log("Generating index for '" + dir + "'...")
glob(dir + "/**/*",
  function(err, files) {
    if (err) {throw err}

    // for test
    // files = files.slice(0, 10)

    var totalLength = files.length

    // get only images extensions
    files = files.filter(function(file) {
      return allowedExt.indexOf(path.extname(file)) > -1
    })

    console.log(files.length + " files found (on " + totalLength + " - " + (totalLength - files.length) + " skipped)...")

    // .putaindetabignore
    var ignoreFile
    try {
      ignoreFile = fs.readFileSync(dir + "/.putaindetabignore", {encoding: "utf8"})
    }
    catch (e) {
      console.log("No .putaindetabignore (or not readable) in " + dir)
    }
    if (ignoreFile) {
      var ignorePatterns = ignoreFile.split(require("os").EOL)
      if (!ignorePatterns.length) {
        console.log("No pattern found in .putaindetabignore")
      }
      else {
        console.log("Skipping files by patterns: " + ignorePatterns)
        var ignore = require('ignore')
        var putaindetabignore = ignore().addPattern(ignorePatterns)
        var nonIgnoredLength = files.length
        files = files.filter(putaindetabignore.createFilter())
        console.log(files.length + " files kept (on " + nonIgnoredLength + " - " + (nonIgnoredLength - files.length) + " ignored)...")
      }
    }

    // build images.js
    files.forEach(function(file) {
      var dirs = path.dirname(file).split(path.sep)
      var title = path.basename(file)
      title = title.replace(/\..+$/, "")
      if (dirs.length > 1) {
        title = dirs[dirs.length - 1] + " (" + title + ")"
      }
      backgrounds.push({
        //color: null, // @todo extract a color from the image
        url: file.replace(dir + "/", ""),
        source: null, // @todo extract author of the jpg if possible
        sourceUrl: "file://" + file,
        title: title
      })
    })

    // write images.js
    fs.writeFileSync(dir + "/images.js", "window.putaindeTab = " + JSON.stringify({
      backgrounds: backgrounds
    }, null, 2))
    console.log(dir + "/images.js successfully created.")
  }
)
