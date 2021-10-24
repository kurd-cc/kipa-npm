import Kipa from "./index.js";

describe('IPA_TEXT', function() {
    describe('#translate_text()', function() {
        it('should return `| bɑːʃ |` as ipa of `baş`', function(done) {
            if (Kipa.translate_text("baş").trim() === '| bɑːʃ |'){
                done()
            }else{
                done('The result was not the same')
            }
        });
    });
});

describe('IPA_TEXT_WIKTIONARY', function() {
    describe('#_convert_ipa_word()', function() {
        it('Roj only has one form included in wikiferheng although "r" has 2 sounds', function(done) {
            if (Kipa._convert_ipa_word("roj")['second_ipa'] === ''){
                done()
            }else{
                done('There was a second ipa')
            }
        });
    });
});