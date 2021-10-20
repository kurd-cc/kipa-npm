import Kipa from "./index.js";

describe('IPA_TEXT', function() {
    describe('#translate_text()', function() {
        it('should return `| bɑːʃ |` as ipa of `baş`', function(done) {
            console.log(Kipa.translate_text("baş"))
            if (Kipa.translate_text("baş").trim() === '| bɑːʃ |'){
                done()
            }else{
                done('The result was not the same')
            }
        });
    });
});