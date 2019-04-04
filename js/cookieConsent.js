(function ($) {
    function SetCookie(key, value, exp) {
        if (exp) {
            var date = new Date();
            date.setTime(date.getTime() + (exp * 24 * 60 * 60 * 1000));
            var expireDate = "; expires=" + date.toGMTString();
        }
        else
            var expireDate = "";
            document.cookie = key + "=" + value + expireDate + "; path = /";
    }

    function GetCookie(key) {
        var key = key + "=";
        var cookieList = document.cookie.split(';');
        for (var i = 0; i < cookieList.length; i++) {
            var cookie = cookieList[i];
            while (cookie.charAt(0) == ' ') {
                cookie = cookie.substring(1, cookie.length);
            }
            if (cookie.indexOf(key) == 0) {
                return cookie.substring(key.length, cookie.length);
            }
        }
        return null;
    }

    function DeleteCookie(key) {
        SetCookie(key, "", -1);
    } 

    $.fn.gdprcookieconsent = function (options, event) {
        var settings = $.extend({
            id: ' gdpr-cookie-consent-modal',
            class: '',
            title: 'T & C - Privacy Policy',
            backdrop: 'static',
            message: '',
            delay: 0,
            expDay: 1000,
            linkLabel: '',
            link: '',
            acceptButton: 'I consent.',
            advanceOptions: false,
            advanceTitle: '',
            advanceButton: 'Costumize',
            onAccept: function () {},
            advanceCookies: [
                {
                    key: 'Essential',
                    title: 'first',
                    description: 'Can\'t be disabled, website requires these cookies to work properly.',
                    isFixed: true
                },
                {
                    key: 'second',
                    title: 'second',
                    description: '',
                    isFixed: false
                },
                {
                    key: 'third',
                    title: 'third',
                    description: '',
                    isFixed: false
                },
                {
                    key: 'forth',
                    title: 'forth',
                    description: '',
                    isFixed: false
                }
            ]
        }, options);

        var testCookie = GetCookie('test');
        var preferences = GetCookie('Preferences');
        if (!testCookie || !preferences || event == 'reinit') {
            CleanModal(settings.id);
            var modalBody = '';
            var modalButtons = '';
            var modalBodyStyle = '';

            if (settings.advanceOptions === true) {
                modalButtons = '<button id = "' + settings.id + '-advance-button" type = "button" class = "btn btn-light">' + settings.advanceTitle + '</button><button id = "' + settings.id + '-accept-button" type = "button" class = "btn btn-dark" data-dismiss = "modal">' + settings.acceptButton + '</button>';
                var selectAdvanceCookies = '';



                modalBody = '<div id="' + settings.id + '-message">' + settings.message + link + '</div>' + '<div id="' + settings.id + '-advanced-types" style="display:none; margin-top: 10px;"><h5 id="' + settings.id + '-advanced-title">' + settings.advanceTitle + '</h5>' + selectAdvanceCookies + '</div>';
            }
            else {
                modalButtons = '<button id = "' + settings.id + '-accept-button" type = "button" class = "btn btn-dark" data-dismiss = "modal">' + settings.acceptButton + '</button>';
                modalBody = '<div id = "' + settings.id + '-message">' + settings.message + link + '</div >';
            }

        }

        function CleanModal(id) {
            id = '#' + id;
            $(id).modal('hide');
            $(id).on('hidden.bs.modal', function (e) {
                $(this).modal('dispose');
                $(id).remove();
            });
        }

}(jquery));