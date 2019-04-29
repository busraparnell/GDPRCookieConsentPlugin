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

    function CleanModal(id) {
        id = '#' + id;
        $(id).modal('hide');
        $(id).on('hidden.bs.modal', function (e) {
            $(this).modal('dispose');
            $(id).remove();
        });
    }

    $.fn.gdprcookieconsent = function (options, event) {

        var settings = $.extend({
            id: 'gdpr-cookie-consent-modal',
            title: 'T & C - Cookies & Privacy Policy',
            backdrop: 'static',
            message: '',
            delay: 0,
            expDay: 1000,
            linkLabel: 'here.',
            link: '/policy',
            acceptButton: 'I consent.',
            advanceOptions: false,
            advanceTitle: 'Details',
            advanceButton: 'Costumize',
            onAccept: function () { },
            advanceCookies: [
                {
                    key: 'Essential',
                    title: '<a href="#" onclick="getCookie();"> Essential </a>',
                    description: 'Can\'t be disabled, website requires these cookies to work properly.',
                    isFixed: true
                },
                {
                    key: 'second',
                    title: 'second',
                    description: 'asd',
                    isFixed: false
                },
                {
                    key: 'third',
                    title: 'third',
                    description: 'asd',
                    isFixed: false
                },
                {
                    key: 'forth',
                    title: 'forth',
                    description: 'asd',
                    isFixed: false
                }
            ]
        }, options);

        var testCookie = GetCookie('testCookie');
        var userPreferences = GetCookie('Preferences');
        var $elmnt = $(this);
        if (!testCookie || !userPreferences || event == 'reinit') {

            CleanModal(settings.id);

            var modalBody = '';
            var modalButtons = '';

            if (settings.advanceOptions === true) {
                modalButtons = '<button id = "' + settings.id + '-advanced-button" type = "button" class = "btn btn-light">' + settings.advanceTitle + '</button><button id = "' + settings.id + '-accept-button" type = "button" class = "btn btn-dark" data-dismiss = "modal">' + settings.acceptButton + '</button>';
                var selectAdvanceCookies = '';
                preferences = JSON.parse(userPreferences);
                $.each(settings.advanceCookies, function (index, area) {
                    if (area.key !== '' && area.title !== '') {

                        var cookieDisabled = '';
                        if (area.isFixed == true) {
                            cookieDisabled = ' checked="checked" disabled="disabled"';
                        }

                        var cookieDescrptn = '';
                        if (area.description !== false) {
                            cookieDescrptn = ' title="' + area.description + '"';
                        }

                        var areaId = settings.id + '-option-' + area.key;

                        selectAdvanceCookies += '<li><input type = "checkbox" id="' + areaId + '" name= "gdprcookie[]" value="' + area.key + '" data-auto="on" ' + cookieDisabled + '><label name = "gdprcookie[]" data-toggle="tooltip" data-placement="right" for="' + areaId + '"' + cookieDescrptn + '>' + area.title + '</label></li>';
                    }
                });

                modalBody = '<div id="' + settings.id + '-message">' + settings.message + '<a href="' + settings.link + '" target="_blank" rel="noopener noreferrer" id="' + settings.id + '-more-link">' + settings.linkLabel + '</a>' + '</div>' + '<div id="' + settings.id + '-advanced-types" style="display:none; margin-top: 10px;"><h5 id="' + settings.id + '-advanced-title">' + settings.advanceTitle + '</h5>' + selectAdvanceCookies + '</div>';
            }
            else {
                modalButtons = '<button id = "' + settings.id + '-accept-button" type = "button" class = "btn btn-dark" data-dismiss = "modal">' + settings.acceptButton + '</button>';
                modalBody = '<div id = "' + settings.id + '-message">' + settings.message + '<a href="' + settings.link + '" target="_blank" rel="noopener noreferrer" id="' + settings.id + '-more-link">' + settings.linkLabel + '</a>'; + '</div >';
            }

            var modal = '<div class="modal fade" id =  "' + settings.id + '"><div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header"><h4 class="modal-title" id = "' + settings.id + '-title">' + settings.title + '</h4><button type="button" class="close" data-dismiss="modal" aria-hidden="true" aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="modal-body">' + modalBody + '</div > <div class="modal-footer">' + modalButtons + '</div></div></div></div>';

            setTimeout(function () {
                $($elmnt).append(modal);

                $('#' + settings.id).modal({ keyboard: false, backdrop: settings.backdrop });

                if (event === 'reinit' && settings.advanceOptions === true) {

                    setTimeout(function () {
                        $('#' + settings.id + '-advanced-button').trigger('click');
                        $.each(preferences, function (index, area) {
                            $('#' + settings.id + '-option-' + area).prop('checked', true);
                        });
                    }, 1000)
                }
            }, settings.delay);


            $('body').on('click', '#' + settings.id + '-accept-button', function () {

                SetCookie('NewCookie', true, settings.expDay);

                CleanModal(settings.id);

                $('input[name="gdprcookie[]"][data-auto="on"]').prop('checked', true);

                DeleteCookie('Preferences');

                var preferences = [];

                $.each($('input[name="gdprcookie[]"]').serializeArray(), function (i, area) {
                    preferences.push(area.value);
                });

                SetCookie('Preferences', JSON.stringify(preferences), 365);

                settings.OnAccept.call(this);

            });

            $('body').on('click', '#' + settings.id + '-advanced-button', function () {

                $('input[name="gdprcookie[]"]:not(:disabled)').attr('data-auto', 'off').prop('checked', false);

                $('label[name="gdprcookie[]"]').tooltip({ offset: '0, 10' });

                $('#' + settings.id + '-advanced-types').slideDown('fast', function () {
                    $('#' + settings.id + '-advanced-button').prop('disabled', true);
                });

            });
        }

        {
            var cookieValue = true;
            if (testCookie == 'false') {
                cookieValue = false;
            }
            SetCookie('testCookie', cookieValue, settings.expDay);
            CleanModal(settings.id);
        }

    }; 

    $.fn.gdprcookieconsent.GetPreferences = function () {
        var preference = GetCookie('Preferences');
        return JSON.parse(preference);
    };

    $.fn.gdprcookieconsent.IsPreferenceExist = function (prf) {
        var pref = $.fn.gdprcookieconsent.GetPreferences();

        if (GetCookie('test') === false) {
            return false;
        }

        if (pref === false || pref.indexOf(prf) === -1) {
            return false;
        }

        return true;

    };
    

}(jQuery));