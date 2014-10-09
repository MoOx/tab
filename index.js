(function(options) {
  var backgrounds = options.backgrounds
  var updateInterval = 30 // sec, 0 disable auto update

  var loaderEl = document.querySelector(".js-putainde-Tab-loader")
  var settingsEl = document.querySelector(".js-putainde-Tab-settings")
  var closeSettingsEl = document.querySelector(".js-putainde-Tab-settings-close")
  var toggleSettingsEl = document.querySelector(".js-putainde-Tab-toggleSettings")
  var backgroundEl = document.querySelector(".js-putainde-Tab-background")
  var backgroundCreditsEl = document.querySelector(".js-putainde-Tab-backgroundCredit")
  var clockEl = document.querySelector(".js-putainde-Tab-time");
  var changeBackgroundEl = document.querySelector(".js-putainde-Tab-changeBackground")

  var timeout

  /**
   * RUN THE SHIT
   *
   * `onload` is used so backgrounds huge list can be listed below, not above.
   * This make code easier to read.
   */
  window.onload = function() {
    startClock()

    loadRandomBackground(function() {
      // loader is useless after first load
      loaderEl.setAttribute("hidden", true)
    })

    changeBackgroundEl.addEventListener("click", function() {
      changeBackgroundEl.classList.add("putainde-Tab-animate-spin")
      loadRandomBackground(function() {
        onNextAnimationIteration(changeBackgroundEl, function() {
          changeBackgroundEl.classList.remove("putainde-Tab-animate-spin")
        })
      })
    })

    toggleSettingsEl.addEventListener("click", function() {
      settingsEl.classList.toggle("putainde-Tab-settings--hidden")
    })

    closeSettingsEl.addEventListener("click", function() {
      settingsEl.classList.toggle("putainde-Tab-settings--hidden", true)
    })

    loadCustomisations()

    // we can"t do that, history API is limited to current domain
    // well we don"t have a domain for file:/// so we are screwed...
    // any idea ?
    // https://github.com/putaindecode/tab/issues/2
    // history.pushState({}, "", "");
  }

  /**
   * load a random background
   */
  function loadRandomBackground(callback) {
    loadBackground(getRandomBackground(), function(item) {
      backgroundEl.classList.add("putainde-Tab-background--hidden")
      backgroundCreditsEl.innerHTML = ""

      var updated = false
      // first time, we already have putainde-Tab-background--hidden
      // so there is no animation, so there is no need to wait for its end.
      // @todo replace this hacky hack by a smart thing using transitionStart & transitionEnd to update a flag ;)
      if (!backgroundEl.style.backgroundImage) {
        updated = updateBackground(item)
      }
      else {
        onNextTransitionEnd(backgroundEl, function() {
          updated = updateBackground(item)
        })
      }

      if (updateInterval) {
        if (timeout) {
          clearTimeout(timeout)
        }

        timeout = setTimeout(loadRandomBackground, updateInterval * 1000)
      }

      if (typeof callback === "function") {
        callback()
      }
    })
  }

  function updateBackground(item) {
    backgroundEl.style.backgroundImage = "url(" + item.url + ")"
    backgroundEl.classList.remove("putainde-Tab-background--hidden")

    var credits = item.source ? "Credits: " + item.source : "If you know the source, please let you know."
    var title = item.title ? item.title : credits

    backgroundCreditsEl.setAttribute("href", item.sourceUrl)
    backgroundCreditsEl.innerHTML = title
    if (credits !== title) {
      backgroundCreditsEl.setAttribute("title", credits)
    }

    return true
  }

  /**
   * load a background then execute a callback
   *
   * @param {Object}   item     background object to load
   * @param {Function} callback callback to execute when image is loaded. First arg is the item itself, 2nd is the image object.
   */
  function loadBackground(item, callback) {
    var img = new Image()
    img.src = item.url
    if (typeof callback === "function") {
      img.onload = callback.bind(callback, item, img)
    }
  }

  /**
   * Returns a random integer between min (included) and max (excluded)
   *
   * Using Math.round() will give you a non-uniform distribution
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
   */
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * get a random background item
   */
  function getRandomBackground() {
    return backgrounds[getRandomInt(0, backgrounds.length - 1)]
  }

  /**
   * execute callback for the next transitionEnd
   * need to be called after the start or unexpected result might append
   *
   * @param {Object}   el       dom element to look at
   * @param {Function} callback function to execute at the end
   */
  function onNextTransitionEnd (el, callback) {
    onNextAnimationEnd (el, callback, {
      transition: "transitionend",
      OTransition: "otransitionend",
      MozTransition: "transitionend",
      WebkitTransition: "webkitTransitionEnd"
    })
  }

  /**
   * execute callback for the next animationIteration
   * need to be called after the start or unexpected result might append
   *
   * @param {Object}   el       dom element to look at
   * @param {Function} callback function to execute at the end
   */
  function onNextAnimationIteration(el, callback) {
    onNextAnimationEnd(el, callback, {
      animation: "animationiteration",
      OAnimation: "oanimationiteration",
      MozAnimation: "animationiteration",
      WebkitAnimation: "webkitAnimationIteration"
    })
  }

  /**
   * execute callback for the next animationEnd
   * need to be called after the start or unexpected result might append
   *
   * @param {Object}   el       dom element to look at
   * @param {Function} callback function to execute at the end
   * @param {Object}   animKeys optional anim keys (used for onNextTransitionEnd())
   */
  function onNextAnimationEnd (el, callback, animKeys) {
    var ani
    var anims = animKeys || {
      animation: "animationend",
      OAnimation: "oanimationend",
      MozAnimation: "animationend",
      WebkitAnimation: "webkitAnimationEnd"
    }

    var i
    for (i in anims) {
      if (anims.hasOwnProperty(i) && el.style[i] !== undefined) {
        ani = anims[i]
      }
    }

    var duration = parseInt(window.getComputedStyle(el).getPropertyValue("transition-duration")) || 1 // shitty fallback

    if (ani) {
      var cb = function() {
        callback()
        el.removeEventListener(ani, cb)
        clearTimeout(shittyFallback)
      }
      el.addEventListener(ani, cb, false)

      // transition end doesn't work properly when tab is in background on some browser (safari 7/8)
      // so we add a shitty timeout
      var shittyFallback = setTimeout(cb, (duration * 1000) + 200)
    }
    else {
      setTimeout(callback, 1000) // poor fallback - lol
    }
  }

  /**
   * start the clock
   */
  function startClock() {
    updateClock()

    // do not update each 60sec
    // because you don't know when you started
    // and you can miss a minute if you start at 00:00:40
    setInterval(updateClock, 10 * 1000)
  }

  /**
   * update the clock
   */
  function updateClock() {
    var date = new Date()
    var hours = date.getHours().toString()
    var minutes = date.getMinutes().toString()
    clockEl.innerHTML = (hours.length < 2 ? "0" : "") + hours + ":" + (minutes.length < 2 ? "0" : "") + minutes
  }

  /**
   * load user customisations
   */
  function loadCustomisations() {
    var queryString = window.location.search.slice(1)
    var parameters = {}

    queryString.split("&").map(function(declaration) {
      var chunks = declaration.split("=", 2)
      var key = chunks[0]
      var value = chunks[1]

      switch (key) {
        case "scripts":
          var scriptUrls = value.split(",")
          loadCustomScripts(scriptUrls)
          break
        case "styles":
          var styleUrls = value.split(",")
          loadCustomStyles(styleUrls)
          break
      }
    })
  }

  /**
   * load custom user scripts
   */
  function loadCustomScripts(scriptUrls) {
    scriptUrls.forEach(function(url) {
      var scriptEl = document.createElement("script")
      scriptEl.setAttribute("src", url)

      document.body.appendChild(scriptEl)
    })
  }

  /**
   * load custom user stylesheets
   */
  function loadCustomStyles(styleUrls) {
    styleUrls.forEach(function(url) {
      var linkEl = document.createElement("link")
      linkEl.setAttribute("rel", "stylesheet")
      linkEl.setAttribute("href", url)

      document.body.appendChild(linkEl)
    })
  }

})(window.putaindeTab)
