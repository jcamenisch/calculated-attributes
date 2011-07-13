/* 
  TODO:
  * Refactor into more logical objects.
  * Consider integrating ideas from http://www.pengoworks.com/workshop/jquery/calculation/calculation.plugin.htm
  * Improve pub sub model to reduce unnecessary repetition of calculations.
*/

(function($) {
  /* Note: This extra function on the $.fn namespace is a no-no, but I couldn't resist 
     providing myself some syntax sugar. */
  /* TODO: Consider replacing this with dependency on field plugin */
  $.fn.effectiveValue = function() {
    return this.is(':checked,:text,select') ?
      this.val() :
      0;
  };

  calculations = {
    subscribe: function(subscribers,inputs) {
      subscribers.data('inputs',
        $(inputs).each(function() {
          $(this).data('subscribers',
            $(this).data('subscribers') ? 
              $(this).data('subscribers').add(subscribers) : 
              $(subscribers)
          );
        })
      );
    },
    pullSubscription: function() {
      var settings = $(this).data('settings');
      var inputs = $(this).data('inputs');
      if ('aggregation' in settings && inputs.length > 1)
        newValue = calculations.aggregations.apply(settings.aggregation, inputs);
      else if (inputs.length == 1)
        newValue = inputs.effectiveValue();
      else
        newValue = 0;
      if ('state' in settings)
        settings.state.func($(this), calculations.evaluateArgs(newValue, settings.state.args))
      else
        $(this).val(newValue);
    },
    evaluateArgs: function(value, args) {
      var argsCopy = args.slice(0);
      if (argsCopy.shift() == 'if')
        return this.evaluateIf(value, argsCopy);
    },
    evaluateIf: function(value, args){
      var isTrue = function (value, args) {
        return calculations.saysTrue(value);
      }
      var conditions = {
        'true': isTrue,
        checked: isTrue,
        gt: function(value, args){ return value > args[0]; },
        gte: function(value, args){ return value >= args[0]; },
        lt: function(value, args){ return value < args[0]; },
        lte: function(value, args){ return value <= args[0]; },
        between: function(value, args){ return args[0] <= value && value <= args[1]; },
        otherwise: function(value, args) {
          if (args.length > 0)
            return value == args[0];
          else
            return isTrue(a);
        }    
      };
      if (args[0] in conditions) {
        return conditions[args.shift()](value, args);
      } else
        return conditions['otherwise'](value, args);
    },
    stateSetters: {
      visible: function(target, state){
        if (state)
          target.show();
        else
          target.hide();
      }
    },
    activeSelector: ':checked,:text',
    aggregations: {
      apply: function(aggregationKey, elements){
        if (aggregationKey in calculations.aggregations) {
          var aggregation = calculations.aggregations[aggregationKey];
          return elements
            .map(aggregation.map).get()
            .reduce(aggregation.reduce);
        } else alert ('can\'t find aggregation "'+aggregationKey+'"')
      },
      sum: {
        map: function(a,b) { return +$(this).effectiveValue(); },
        reduce: function(a,b) { return a + b }
      },
      max: {
        map: function(a,b) { return +$(this).effectiveValue(); },
        reduce: function(a,b) { return Math.max(a, b) }
      },
      all: {
        map: function(a,b) { return calculations.saysTrue($(this).effectiveValue()); },
        reduce: function(a,b) { return a && b }
      },
      any: {
        map: function(a,b) { return calculations.saysTrue($(this).effectiveValue()); },
        reduce: function(a,b) { return a || b }
      }
    },
    saysTrue: function (something){
      return typeof something != 'undefined' && !(something+"").match(/^(0|false|no)?$/i);
    }
  }

  $.fn.CalculatedAttributes = function(){
    this.find('input,select').each(function(){
      $(this).change(function(){
        if (typeof $(this).data('subscribers') === 'object') {
          $(this).data('subscribers').each(function(){
            $(this).change();
          });
        }
      });
    });
    this.find('.subscribe')
      .change(calculations.pullSubscription)
      .each(function(){
        var classes = $(this).attr('class').split(' ');
        var settings = {};
        for (i in classes) {
          if (classes[i] !== 'subscribe') {
            words = classes[i].split('-');
            firstWord = words.shift();
            if (firstWord === 'to') {
              if (words[0] in calculations.aggregations) {
                settings.aggregation = words.shift();
              }
              var inputClass = words.join('-')
              settings.inputSelector =
                'input#'+inputClass+',select#'+inputClass+
                ',input.'+inputClass+',select.'+inputClass+
                ',.'+inputClass+' input,.'+inputClass+' select';
            } else if (firstWord in calculations.stateSetters) {
              settings.state = {
                func: calculations.stateSetters[firstWord],
                args: words
              };
            }
          } 
        }
        if ('inputSelector' in settings) {
          $(this).data('settings', settings);
          calculations.subscribe($(this),$(this).data('settings').inputSelector);
        }
      })
      .change();
    return this;
  }

})(jQuery);