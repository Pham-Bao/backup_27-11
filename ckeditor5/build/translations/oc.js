(function (o) {
    const r = (o['oc'] = o['oc'] || {});
    r.dictionary = Object.assign(r.dictionary || {}, {
        '%0 of %1': '',
        Bold: 'Gras',
        Cancel: 'Anullar',
        Code: '',
        Italic: 'Italica',
        'Remove color': '',
        'Restore default': '',
        Save: 'Enregistrar',
        'Show more items': '',
        Strikethrough: '',
        Subscript: '',
        Superscript: '',
        Underline: ''
    });
    r.getPluralForm = function (o) {
        return o > 1;
    };
})(window.CKEDITOR_TRANSLATIONS || (window.CKEDITOR_TRANSLATIONS = {}));
