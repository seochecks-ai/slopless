[![NPM version](https://badge.fury.io/js/too-wordy.svg)](http://badge.fury.io/js/too-wordy)

# Word Complexity

npm module for checking for wordy or unnecessary passages in your writing

## Install

```shell
npm install too-wordy
```

## Use

```javascript
var complexity = require('too-wordy');

var problems = complexity('An abundance of long winded words to accentuate this boring sentence......');
// problems -> [{ match: "abundance", index: 3, offset: 9 }, {match: accentuate, ....}]
```

## See Also

[Wordy phrases](http://grammarist.com/wordiness/).

## License

MIT
