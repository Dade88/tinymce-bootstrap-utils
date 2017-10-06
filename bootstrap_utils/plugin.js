tinymce.PluginManager.requireLangPack('bootstrap-utils', 'fr_FR');

tinymce.PluginManager.add('bootstrap-utils', function(editor, url) {
    /* COLLAPSE */
    editor.on('init', function() {
        editor.formatter.register('bootstrap-collapse-div-format', {
            block: 'div',
            classes: 'collapse',
            attributes: {'id': '%identifier'}
        });
    });

    editor.addButton('bootstrap-collapse', {
        type: 'splitbutton',
        text: 'Collapse',
        icon: false,
        menu: [{
            text: 'Link',
            icon: false,
            stateSelector: 'a[data-toggle=collapse]',
            onclick: function() {
                var data = {};
                var selectedElm = editor.selection.getNode();
                var anchorElm = editor.dom.getParent(selectedElm, 'a[href]');

                data.text = anchorElm ? (anchorElm.innerText || anchorElm.textContent) : editor.selection.getContent({format: 'text'});
                data.identifier = anchorElm ? editor.dom.getAttrib(anchorElm, 'href').substring(1) : '';

                editor.windowManager.open({
                    title: 'Collapse link',
                    data: data,
                    body: [
                        {type: 'textbox', name: 'text', label: 'Text'},
                        {type: 'textbox', name: 'identifier', label: 'Collapse identifier'}
                    ],
                    onsubmit: function(e) {
                        var data = e.data;
                        var linkAttrs = {
                            href: '#' + data.identifier,
                            'data-toggle': 'collapse',
                            'aria-expanded': 'false',
                            'aria-controls': data.identifier
                        };

                        if (anchorElm) {
                            if ("innerText" in anchorElm) {
                                anchorElm.innerText = data.text;
                            } else {
                                anchorElm.textContent = data.text;
                            }
                            editor.dom.setAttribs(anchorElm, linkAttrs);
                            editor.selection.select(anchorElm);
                        } else {
                            editor.insertContent(editor.dom.createHTML('a', linkAttrs, editor.dom.encode(data.text)));
                        }
                    }
                });
            }
        }, {
            text: 'Container',
            icon: false,
            stateSelector: 'div.collapse',
            onclick: function() {
                var data = {};
                var selectedElm = editor.selection.getNode();
                var divElm = editor.dom.getParent(selectedElm, 'div.collapse');

                data.identifier = divElm ? editor.dom.getAttrib(divElm, 'id') : '';
                editor.windowManager.open({
                    title: 'Collapse div',
                    data: data,
                    body: [
                        {type: 'textbox', name: 'identifier', label: 'Collapse identifier'}
                    ],
                    onsubmit: function(e) {
                        var data = e.data;

                        editor.undoManager.transact(function() {
                            editor.focus();
                            editor.formatter.apply('bootstrap-collapse-div-format', {identifier: data.identifier});
                            editor.nodeChanged();
                        });
                    }
                });
            }
        }]
    });
});