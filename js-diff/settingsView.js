define([
    'jquery',
    'underscore',
    'marionette',
    'infobar',
    'app/stackcheckbox/view/stackView',
    'text!app/products/template/settings.html'
], 
function ($, _, Marionette, infobar, stackcheckboxView, template) {
    'use strict';

    var mainStack = new stackcheckboxView({
        mod: 'stack_hover'
    });

    return Backbone.Marionette.LayoutView.extend({
        template: template,
        tagName: 'div',
        className: 'infobar infobar_fixed zz8',
        regions: {
            regionMain: '[data-stack=main]'
        },
        ui: {
            saveBtn: '[data-infobar-save]'
        },
        events: {
            'click @ui.saveBtn': 'save'
        },
        originalColumns: null,
        initialize: function (options) {
            var mainStackColl = [];

            this.infobar = this.$el.infobar({
                onAutoClose: $.proxy(function (type, e) {
                    if (!$(e.target).is('[data-ctrl="settings"]') && !$(e.target).closest('[data-ctrl="settings"]').length) {
                        mainStack.setCollection(this.originalColumns);
                        mainStack.render();
                        this.infobar.hide();
                    }
                }, this)
            });

            _.each(options.columns, function(value, key) {
                if (value.data !== '_checkboxMark' && value.data !== '_copy') {
                    mainStackColl.push({
                        'name': value.data, 
                        'title': value.name, 
                        'checked': value.visible,
                        'disabled': (value.data === 'id' || value.data === 'name' || value.data === 'type_name' ? true : false)
                    });
                }
            });

            this.originalColumns = mainStackColl;

            mainStack.setCollection(mainStackColl);
        },
        onBeforeShow: function () {
            this.regionMain.show(mainStack);
        },
        save: function () {
            var noChanges = mainStack.collection.every(function (m, i) {
                return this.originalColumns[i].checked === m.get('checked');
            }, this);

            if (!noChanges) {
                this.originalColumns = mainStack.collection.toJSON();
                this.trigger('columns:changed', this.originalColumns);
            }

            this.infobar.hide();
        }
    });
});
