# tab

> Get a nice picture each time you open a new blank tab.

_Note: before [reporting a bug](https://github.com/putaindecode/tab/issues/new), please checkout [opened issues](https://github.com/putaindecode/tab/issues/) first._

## Usage

### Online

Set [putaindecode.io/tab/](http://putaindecode.io/tab/) as a url for your new tab/window. _Do not remove the trailing slash or you will get a redirection (with the slash) which will create a lag every time you will open a new tab._

##### Firefox

Go to `about:config?filter=browser.newtab.url` and set `http://putaindecode.io/tab/`

### Local (customisable)

```bash
$ git clone https://github.com/putaindecode/tab.git
```

#### Update pictures feed (optional)

Edit `images.js`. If you do this step, be careful of the manifest `cache.appcache` (remove the reference in the html file or adjust it).

##### Firefox

Go to `about:config?filter=browser.newtab.url` and set `file:///YOUR/PATH/TO/tab/index.html`

---

## Contributing

_We do not have a builded app for now (see [#23](https://github.com/putaindecode/tab/issues/23)), but we use an appcache file._  
**This means every modifications in every cached files (for now the entire app & assets) need a corresponding update in the cache manifest.**  
_Updating the timestamp in the `cache.appcache` file manually should do the trick until we automate all the things._

Work on a branch & respect coding style.

    $ git clone https://github.com/putaindecode/tab.git
    $ git checkout -b patch-1
    $ open index.html

## [License](LICENSE)
