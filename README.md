# tab

> Get a nice picture each time you open a new blank tab.

_Note: before [reporting a bug](https://github.com/putaindecode/tab/issues/new), please checkout [opened issues](https://github.com/putaindecode/tab/issues/) first._

## Usage

### Online

Set [putaindecode.io/tab/](http://putaindecode.io/tab/) as a url for your new tab/window. _Do not remove the trailing slash or you will get a redirection (with the slash) which will create a lag every time you will open a new tab._

##### Firefox

Go to `about:config?filter=browser.newtab.url` and set `http://putaindecode.io/tab/` or add in your `user.js`

```js
user_pref("browser.newtab.url", "http://putaindecode.io/tab/");
```

### From a local folder

This project include a command to run this app locally for a given folder

```bash
$ git clone https://github.com/putaindecode/tab.git
$ cd tab
$ npm install
$ PUTAINDETAB_PATH="/Users/Shared/Photos" npm run generate-localhost
$ npm run copy-app
$ npm run hide-app
```

Notes:

- `generate-localhost` will create an `images.js` & `index.apache.conf` in `$PUTAINDETAB_PATH` by executing `generate-dir-index` then `generate-conf-apache`,
- `copy-app` will copy the app files (`index.html|js|css`) in `$PUTAINDETAB_PATH`,
- `hide-app` will copy just hide those file by using `chflags`. Nice to avoid noise in your folder (note that `unhide-app` make the reverse).


Now go into [localhost/tab](http://localhost/tab/) & enjoy.

#### Ignore files

You can place in your `$PUTAINDETAB_PATH` folder a `.putaindetabignore` file that will behave like commons ignore file (pattern/wildcard supported).
Here is an example

```
To sort*
Road Trip/2008 Trip with boring people
```

#### Browser setup

##### Firefox

In your user.js

```js
// set your new tab url
user_pref("browser.newtab.url", "http://localhost/tab/");

// enable file:// link on my homepage
user_pref("capability.policy.policynames", "localfilelinks");
user_pref("capability.policy.localfilelinks.sites", "http://localhost/");
user_pref("capability.policy.localfilelinks.checkloaduri.enabled", "allAccess");
```

<small>[Source](http://kb.mozillazine.org/Firefox_:_Issues_:_Links_to_Local_Pages_Don%27t_Work)</small>


### Options

You can pass some user script & styles to the url like this by appending some parameters.

Checkout this a real online example: [putaindecode.io/tab/?scripts=https://rawgit.com/MoOx/0c43795ea80dc48faa28/raw/9c9e8d899b14616fcf18e53f7e98f22aad03d6a9/custom.js&styles=https://rawgit.com/MoOx/0c43795ea80dc48faa28/raw/11d12f02ee26f6e310e842e8832d339f2a2f0c9f/custom.css](http://putaindecode.io/tab/?scripts=https://rawgit.com/MoOx/0c43795ea80dc48faa28/raw/9c9e8d899b14616fcf18e53f7e98f22aad03d6a9/custom.js&styles=https://rawgit.com/MoOx/0c43795ea80dc48faa28/raw/11d12f02ee26f6e310e842e8832d339f2a2f0c9f/custom.css)

#### `scripts`

Urls for user scripts, comma separated.

```
url/?scripts=url1.js,url2.js
```

#### `styles`

Urls for user styles, comma separated.

```
url/?styles=url1.js,url2.js
```


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
