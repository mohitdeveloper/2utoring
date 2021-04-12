(function ($) {
    $.fn.ioTabs = function (options) {
        // Extend the default setting with the passed in options
        var settings = $.extend({}, $.fn.ioTabs.defaults, options);

        var $containers = $(this).find('.io-tab-container');
        return $containers.each(function () {
            var $this = $(this);
            
            $this.children('ul.io-tabs').on('click', 'li', function (element) {
                var tab = $(this).data('tab');
                $.fn.ioTabs.selected(tab);
            });
        });
    };

    $.fn.ioTabs.selected = function (tab) {
        var $tabContent = $('#' + tab);
        var $container = $tabContent.parents('.io-tab-container').eq(0);
        var $tab = $container.find('ul.io-tabs li[data-tab="' + tab + '"]');

        $container.children('ul.io-tabs').children('li').removeClass('active');
        $container.children('.io-tab-content').removeClass('active');

        $tab.addClass('active');
        $tabContent.addClass('active');
    };




    $.fn.ioTabs.selected_specific = function (tab, container) {

        var $tabContent = $('#' + tab);
        var $container = $tabContent.parents(container).eq(0);
        var $tab = $container.find('ul.io-tabs' + container + ' li[data-tab="' + tab + '"]');

        $container.children('ul.io-tabs' + container).children('li').removeClass('active');
        $container.children('.io-tab-content' + container).removeClass('active');

        $tab.addClass('active');
        $tabContent.addClass('active');
    };




    // Default settings for the tabs
    $.fn.ioTabs.defaults = {
        vertical: false
    };

})(jQuery);