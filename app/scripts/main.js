'use strict';

$(document).ready(function() {
  /*
  Form Validation
  */
  var selector;
  var $form = $('form.join');
  var $submit = $('button.submit');
  var errorTemplate = '<div class="hint">{{msg}}</div>';
  var errorFadeSpeed = 200;
  var validationRules = {
    '#fieldName': {
      errorMessage: 'Please enter a valid email address',
      errorClassSelector: 'p',
      required: false,
      test: function(val) {
        return !!val.length;
      }
    },
    '#fieldEmail': {
      errorMessage: 'Please enter a valid email address',
      errorClassSelector: 'p',
      required: true,
      test: function(val) {
        return /^\S+@\S+\.\S+$/.test(val); // http://www.regexr.com/
      }
    },
    '#fieldtrlyhd': {
      errorMessage: 'Please enter a number for your size',
      errorClassSelector: 'p',
      required: false,
      test: function(val) {
        return /^\d+$/.test(val); // http://www.regexr.com/
      }
    }
  };

  function initField($el, rule) {
    $el.data('originalValue', $el.val());
    $el.on('focus', function() {
      hideError($el, rule.errorClassSelector);
    });
  }
  for (selector in validationRules) {
    initField($(selector), validationRules[selector]);
  }

  $submit.click(function(e) {
    e.preventDefault();
    if (formValidate()) {
      $form.submit();
    // } else {
      // console.log('form invalid');
    }
  });

  function formValidate() {
    var formIsValid = true;
    var selector, $el, rule, value, originalValue, valid;
    for (selector in validationRules) {
      $el = $(selector);
      rule = validationRules[selector];
      value = $el.val();
      originalValue = $el.data('originalValue');
      valid = (!rule.required && originalValue === value) || rule.test(value);
      if (!valid) {
        showError($el, rule.errorClassSelector, rule.errorMessage);
      }
      formIsValid = valid && formIsValid;
    }
    return formIsValid;
  }
  function showError($el, errorTarget, msg) {
    if ($el.data('errorMsg')) {
      return;
    }
    var $error = $(errorTemplate.replace('{{msg}}', msg));
    $el.data('errorMsg', $error);
    $el.after($error.hide());
    $error.slideDown(errorFadeSpeed);
    $el.closest(errorTarget).addClass('error');
  }
  function hideError($el, errorTarget) {
    var $error = $el.data('errorMsg');
    if ($error) {
      $error.slideUp(errorFadeSpeed, function() {
        $(this).remove();
      });
      $el.removeData('errorMsg');
      $el.closest(errorTarget).removeClass('error');
    }
  }
});