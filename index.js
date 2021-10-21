import KurdishNumbersToWords from "kurdish-numbers-to-words";

const kurdish_ipa = [
    "b",
    "dʒ",
    "tʃ",
    "d",
    "f",
    "ɡ",
    "ɣ",
    "h",
    "ħ",
    "ʒ",
    "k",
    "l",
    "ɫ",
    "m",
    "n",
    "ŋ",
    "p",
    "q",
    "ɾ",
    "r",
    "s",
    "ʃ",
    "t",
    "v",
    "w",
    "x",
    "j",
    "z",
    "ɑː",
    "eː",
    "ɛ",
    "iː",
    "ɪ",
    "oː",
    "ʊ",
    "uː"
]

const kurdish_letters = [
    "b",
    "c",
    "ç",
    "d",
    "f",
    "g",
    "x",
    "h",
    "h",
    "j",
    "k",
    "l",
    "l",
    "m",
    "n",
    "ng",
    "p",
    "q",
    "r",
    "r",
    "s",
    "ş",
    "t",
    "v",
    "w",
    "x",
    "y",
    "z",
    "a",
    "ê",
    "e",
    "î",
    "i",
    "o",
    "u",
    "û"
]

const allowed_characters = [
    'A', 'B', 'C', 'Ç', 'D',  'E', 'Ê', 'F', 'G', 'H',
    'I', 'Î', 'J', 'K', 'L',  'M', 'N', 'O', 'P', 'Q',
    'R', 'S', 'Ş', 'T', 'U',  'Û', 'V', 'W', 'X', 'Y',
    'Z', 'a', 'b', 'c', 'ç',  'd', 'e', 'ê', 'f', 'g',
    'h', 'i', 'î', 'j', 'k',  'l', 'm', 'n', 'o', 'p',
    'q', 'r', 's', 'ş', 't',  'u', 'û', 'v', 'w', 'x',
    'y', 'z', ' ', '|', '0',  '1', '2', '3', '4', '5',
    '6', '7', '8', '9',  '\n'
]

if(typeof String.prototype.replaceAll == "undefined") {
    String.prototype.replaceAll = function(match, replace){
        return this.split(match).join(replace)
    }
}
Array.prototype.getAllIndexes = function (value){
    let indexes = [], i = -1;
    while ((i = this.indexOf(value, i+1)) !== -1){
        indexes.push(i);
    }
    return indexes;
}

export default class Kipa {
    static _clear_text(text) {
        let re = new RegExp('[^' + allowed_characters.join('') + ']', 'g');
        return text.replaceAll(re, '')
    }
    static _prepare_text(text){
        text =  text.replaceAll(',', '*')
            .replaceAll('.', '*')
            .replaceAll('!', '*')
            .replaceAll('?', '*')
            .replaceAll('\n', '*')
            .replaceAll(':', '*')
        return text.split("*")
            .filter((term) => term.trim().length > 0)
            .map((term) => term.trim())
            .filter((term) => term.trim().length > 0)
    }
    static _process_text(text){
        let result =['|']
        result.push(this._prepare_text(text).map((term) => (term + " |\n")))
        return this._clear_text(result.join(' '))
    }
    static _extract_numbers(text){
        return text.replace(/[^0-9]/g, ' ').split(' ').filter((item) => item.trim().length > 0)
    }

    static _convert_ipa_word(word){
        word = word.toLowerCase()
        const reasons = []
        const numbers = this._extract_numbers(word)
        numbers.forEach((number) => word = word.replace(number, KurdishNumbersToWords.convert(parseInt(number))))

        let first_possibility = word
        let second_possibility = word

        if (word.includes('l') || word.includes('h')){
            reasons.push('Different accents or positions')
        }



        if (word.includes('ng')){
            first_possibility = first_possibility.replace('ng', kurdish_ipa[kurdish_letters.indexOf('ng')])
            second_possibility = second_possibility.replace('ng', kurdish_ipa[kurdish_letters.indexOf('ng')])
        }



        [...word].forEach((letter) => {

            if (!(letter === 'ŋ' || letter === ' ' || letter === '|')){
                if (letter === 'h' || letter === 'l'){
                    const indices = kurdish_letters.getAllIndexes(letter)
                    second_possibility = second_possibility.replace(letter, kurdish_ipa[indices[1]])
                    first_possibility = first_possibility.replace(letter, kurdish_ipa[indices[0]])
                }else{
                    first_possibility = first_possibility.replace(letter, kurdish_ipa[kurdish_letters.indexOf(letter)])
                    second_possibility = second_possibility.replace(letter, kurdish_ipa[kurdish_letters.indexOf(letter)])
                }
            }
        })

        if (second_possibility === first_possibility) second_possibility = ''


        return {word : word, first_ipa: first_possibility, second_ipa: second_possibility, reasons: reasons}

    }

    static _convert_ipa_text(text){
        const terms_text = this._process_text(text)
        const terms_list  = terms_text.split('\n')
        const all_list = []
        terms_list.forEach((term) => {
            const current_list = []
            term.split(' ').forEach((word) => {
                const current_res = this._convert_ipa_word(word)
                current_list.push(current_res)
            })
            all_list.push(current_list)
        })

        return all_list

    }

    static get_ipa(text){
        const all_list = this._convert_ipa_text(text)
        const result_list = []
        const alternatives = []
        all_list.forEach((current_list) => {
            const term = []
            current_list.forEach((current_term) => {
                term.push(current_term['first_ipa'])
                if (current_term['second_ipa'].length > 0){
                    alternatives.push({word: current_term['word'],
                        inserted_ipa: current_term['first_ipa'],
                        alternative_ipa: current_term['second_ipa'],
                        reasons: current_term['reasons']
                    })
                }
            })

            result_list.push(term)
        })

        const parts = []
        result_list.forEach((item) => {
            const result_part = item.join(' ')
            parts.push(result_part)
        })

        const resulted_text = parts.join('\n')
        return {resulted_ipa: resulted_text, alternatives: alternatives}
    }

    static translate_text(text){
        return this.get_ipa(text)['resulted_ipa']
    }
}
