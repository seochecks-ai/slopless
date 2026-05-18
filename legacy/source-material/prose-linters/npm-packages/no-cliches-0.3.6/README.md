[![NPM version](https://badge.fury.io/js/no-cliches.svg)](http://badge.fury.io/js/no-cliches)

# No Clichés

npm module to check for clichés in your writing.

## Install

```shell
npm install no-cliches
```

## Use

```javascript
const cliches = require('no-cliches');

const problems = cliches('Writing specs puts me at loose ends.');
// problems -> [{ match: "at loose ends", index: 22, offset: 12 }]
```

##See Also

[Concise Writing](http://grammar.ccc.commnet.edu/grammar/concise.htm)

[Clichés List](http://www.be-a-better-writer.com/cliches.html)

## License

MIT
