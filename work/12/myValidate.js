(function($) {
    $.extend($.fn, {
        validate: function(options) {
            var validator = new $.validator(options, this[0]);
            $.data(this[0], "validator", validator);

            if (validator.settings.onsubmit) {
                this.on('submit.validate', function(event) {
                    if (validator.settings.debug) {
                        event.preventDefault();
                    }
                    if (validator.form()) {
                        alert('验证通过');
                        return true;
                    } else {
                        alert('验证不通过');
                        return false;
                    }
                });
            }
            $(":text", this).each(function() {
                $(this).blur(function() {
                    validator.check(this);
                });
            });
            return validator;
        },
    });
    $.validator = function(options, form) {
        this.settings = $.extend(true, {}, $.validator.defaults, options);
        this.currentForm = form;
        this.init();
    };
    $.extend($.validator, {
        defaults: {
            messages: {},
            rules: {},
            onsubmit: true,
        },
        messages: {
            error: '验证不通过',
            success: '验证通过',
        },
        prototype: {
            init: function() {
                this.errorList = [];
                var rules = this.settings.rules;
                $.each(rules, function(key, value) {
                    rules[key] = $.validator.normalizeRule(value);
                });
            },
            form: function() {
                this.checkForm();
                return this.errorList.length === 0;
            },
            checkForm: function() {
                var elements = $(this.currentForm).find("input").not(":submit").filter(function() {
                    return true;
                });
                for (var i = 0; elements[i]; i++) {
                    this.check(elements[i]);
                }
            },
            check: function(element) {
                element = $(element)[0];
                var rules = this.settings.rules[element.name];
                var rulesCount = $.map(rules, function(n, i) {
                    return i;
                }).length;
                var value = $(element).val();
                var success = $.validator.messages.success, rule, result;
                for (method in rules) {
                    rule = {
                        method: method,
                        parameters: rules[method],
                    };
                    result = $.validator.methods[method].call(this, value, element, rules[method]);
                    if (!result) {
                        this.formatAndAdd(element, rule);
                        return false;
                    }
                }
                for (var ei = 0, elen = this.errorList.length; ei < elen; ei++) {
                    if (this.errorList[ei].element == element) {
                        this.errorList.splice(ei, 1);
                        this.showLabel(element, success);
                        return true;
                    }
                }
                this.showLabel(element, success);
                return true;
            },
            formatAndAdd: function(element, rule) {
                var messages = this.settings.messages[element.name];
                var message = messages[rule.method] || $.validator.messages.error;
                var errorList = this.errorList;
                var isExist = false;
                for (var ei = 0, elen = errorList.length; ei < elen; ei++) {
                    if (errorList[ei].element == element) {
                        isExist = true;
                        errorList[ei].message = message;
                        errorList[ei].method = rule.method;
                    }
                }
                if(!isExist){
                    this.errorList.push({
                        message: message,
                        element: element,
                        method: rule.method,
                    });
                }
                this.showLabel(element, message);
            },
            showLabel: function(element, message) {
                $(element).next(".tips").remove();
                $(element).after('<label class="tips">' + message + '</label>');
            },
        },
        // 字符串转变为{string: true}
        normalizeRule: function(data) {
            if (typeof data === "string") {
                var transformed = {};
                $.each(data.split(/\s/), function() {
                    transformed[this] = true;
                });
                data = transformed;
            }
            return data;
        },
        methods: {
            required: function(value) {
                return value.length > 0;
            },
            email: function(value) {
                return /^\w+\@[a-zA-Z0-9]+\.[a-zA-Z]{2,4}$/.test(value);
            },
            card: function(value) {
                return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value);
            },
            phone: function(value) {
                return /^1(3|4|5|7|8)\d{9}$/.test(value);
            },
            min: function(value, element, param) {
                return value >= param;
            },
            max: function(value, element, param) {
                return value <= param;
            },
        },
    });
})(jQuery);