# KIPA
A NPM package to convert Kurdish (Kurmanji) text to IPA phonetics.

### Features
- Instant, no limitations.
- Auto convert numbers included.

### Installation:
- With `npm`:
```shell
npm install kipa
```
- With `yarn`:
```shell
yarn add kipa
```

### Usage:
- To only get the resulted ipa text:
```javascript
import Kipa from 'kipa'

let ipa = Kipa.translate_text('dem baş ji bo we!')
console.log(ipa)
```
```text
| dɛm bɑːʃ ʒɪ boː wɛ |
```

- To get more details as an object:

```javascript
import Kipa from 'kipa'

let ipa = Kipa.get_ipa('dem baş ji bo we hemûyan û 4 kesên din jî!')
console.log(ipa)
```
```javascript
{
  resulted_ipa: '| dɛm bɑːʃ ʒɪ boː wɛ hɛmuːjɑːn uː tʃɑːɾ kɛseːn dɪn ʒiː |\n',
  alternatives: [
    {
      word: 'hemûyan',
      inserted_ipa: 'hɛmuːjɑːn',
      alternative_ipa: 'ħɛmuːjɑːn',
      reasons: ['Different accents or positions']
    }
  ]
}
```

### Testing:
You can test with `mocha`:
```shell
npm test
```