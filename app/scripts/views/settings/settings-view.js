'use strict';

var Backbone = require('backbone'),
    Scrollable = require('../../util/scrollable'),
    Keys = require('../../const/keys'),
    KeyHandler = require('../../util/key-handler'),
    baron = require('baron');

var SettingsView = Backbone.View.extend({
    template: require('templates/settings/settings.html'),

    views: null,

    events: {
        'click .settings__return-link': 'returnToApp'
    },

    initialize: function () {
        this.listenTo(Backbone, 'set-page', this.setPage);
        this.views = {  };
        KeyHandler.onKey(Keys.DOM_VK_ESCAPE, this.returnToApp, this);
    },

    remove: function() {
        KeyHandler.offKey(Keys.DOM_VK_ESCAPE, this.returnToApp, this);
        Backbone.View.prototype.remove.call(this);
    },

    render: function () {
        this.renderTemplate();
        this.scroll = baron({
            root: this.$el.find('.settings')[0],
            scroller: this.$el.find('.scroller')[0],
            bar: this.$el.find('.scroller__bar')[0],
            $: Backbone.$
        });
        this.scrollerBar = this.$el.find('.scroller__bar');
        this.scrollerBarWrapper = this.$el.find('.scroller__bar-wrapper');
        this.pageEl = this.$el.find('.scroller');
        return this;
    },

    setPage: function (e) {
        if (this.views.page) {
            this.views.page.remove();
        }
        var SettingsPageView = require('./settings-' + e.page + '-view');
        this.views.page = new SettingsPageView({ el: this.pageEl, model: e.file });
        this.views.page.render();
        this.file = e.file;
        this.page = e.page;
        this.pageResized();
    },

    returnToApp: function() {
        Backbone.trigger('toggle-settings');
    }
});

_.extend(SettingsView.prototype, Scrollable);

module.exports = SettingsView;
