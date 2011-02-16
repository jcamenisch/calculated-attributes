Calculated Attributes
=====================

A jQuery plugin for binding DOM elements' attributes to values of form inputs. The bindings
are configured in page markup using self-explanitory classes.

Usage
-----

    <input id="example1" type="checkbox" value="Yes" />
    <div class="example2">
      <input type="checkbox" value="1" />
      <input type="checkbox" value="2" />
    </div>
    <input class="example3" type="checkbox" value="Yes" />
    <input class="example3" type="checkbox" value="Yes" />
    ...
    <p class="subscribe to-example1 visible-if-true">
      This will appear only if the .example1 checkbox is checked.
    </p>
    <p>
      <input type="text" class="subscribe to-sum-example3" />
      This input will always show the sum of all the inputs matching the selector
      'input#example2,input.example2,.example2 input'. In this example, the values 
      of all the checked inputs contained in the ".example2" div will be summed
      and the sum assigned to the value of this input.
    </p>
    <p>
      Other aggregations can also be used, and new ones easily added.
    </p>
    <p class="subscribe to-all-example3 visible-if-true">
      This paragraph will be visible only if *all* the matching inputs have a
      "truthy" value--meaning they have a value other than 0, [Nn]o, [Ff]alse, or '',
      and they are checked if applicable.
    </p>
    <p>
      All checkboxes and radio inputs are valued at 0 when unchecked. For boolean
      calculations, this in effect makes them false.
    </p>
    <p>
      That "all" keyword is simply another aggregation applying a boolean and to
      the set of inputs. Similarly, the aggregation "any" will apply a boolean or
      to the set.
    </p>
    
    <script type="text/javascript" src="calculated-attributes.js"></script>
    <script type="text/javascript">
      $('body').CalculatedAttributes();
    </script>

Caveats
-------

The only "attribute" supported currently is "visible." Additional ones can be easily added
once I need them.
