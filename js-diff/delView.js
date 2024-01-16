define([
    'underscore',
    'jquery',
    'marionette',
    '_gritter',
    '_btn',
    'text!app/products/template/del.html',
    'bootstrap'
],
function (_, $, Marionette, _gritter, _btn, template) {
    'use strict';

    return Backbone.Marionette.ItemView.extend({
        template: template,
        tagName: 'div',
        className: 'modal fade modal_alpha modal_centered zz13',
        attributes: {
            role: 'dialog',
            tabindex: '-1'
        },
        id: 'productsDelModal',
        ui: {
            productsDelConfirm: '#productsDelConfirm',
            productsDelCancel: '#productsDelCancel'
        },
        events: {
            'click @ui.productsDelConfirm': 'preDel'
        },
        // coll:
        // 1) Backbone коллекция удаляемых моделей;
        // 2) массив id которые НЕ надо удалять, остальные удалить;
        add: function (coll) {
            this.coll = coll;
            this.ids = [];
        },
        preDel: function () {
            var self = this,
                $btns = $([this.ui.productsDelConfirm, this.ui.productsDelCancel]),
                coll = this.coll;

            var hide = function () {
                _btn.loading(false, $btns);
                self.$el.modal('hide');
            };

            if (!coll) {
                hide();
                return;
            }

            if (coll.length && coll[0].cid) {
                _btn.loading(true, $btns);

                // Backbone collection для удаления
                this.ids = coll.map(function (item) {
                    return item.get('id');
                });
                this.del();
            } else {
                _btn.loading(true, $btns);

                // Удалить все, кроме id из coll
                if (_.isFunction(this.fetchAllExcept)) {
                    this.fetchAllExcept({
                        success: function (collAllExcept) {
                            self.ids = collAllExcept.map(function (item) {
                                return item.get('id');
                            });
                            self.coll = collAllExcept;
                            self.del();
                        },
                        error: hide
                    });
                } else {
                    hide();
                }
            }
        },
        del: function () {
            var self = this,
                $btns = $([this.ui.productsDelConfirm, this.ui.productsDelCancel]);
            var errGritter = function (desc) {
                _gritter.show(__('PRODUCTS_TITLE_DELETE'), desc || __('PRODUCTS_TEXT_DELETE_ERROR'));
            };

            if (!this.ids || !this.ids.length) {
                _btn.loading(false, $btns);
                this.$el.modal('hide');
                return;
            }

            $.ajax({
                url: '/rest/rest_product.json',
                data: 'ids=' + this.ids.join(),
                type: 'DELETE',
                success: function (response) {
                    if (response && response.status === 'success') {
                        self.$el.modal('hide');
                        self.trigger('del:success', self.coll);

                        _gritter.show(__('PRODUCTS_TITLE_DELETE'), __('PRODUCTS_TEXT_DELETE_SUCCESS'));
                    } else if ((response.status === 'fail' || response.status === 'error') && response.message) {
                        errGritter(response.message);
                    } else {
                        errGritter();
                    }
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    errGritter(errorThrown);
                },
                complete: function () {
                    _btn.loading(false, $btns);
                }
            });
        }
    });
});
