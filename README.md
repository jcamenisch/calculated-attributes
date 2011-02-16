Calculated Attributes
=====================

A jQuery plugin for binding DOM elements' attributes to values of form inputs. The bindings
are configured in page markup using self-explanatory classes.

Usage
-----

### Basic Example

    <input id="example1" type="checkbox" value="Yes" />
    <input type="text" class="subscribe to-example1" />

Here any time the first input changes, the second one will be updated to match.

Notice the class, "subscribe." This keyword sets off all the other calculation functionality.
From there, the plugin looks for a class starting with "to-", which describes where to pull values
from for calculation.

The string following "to-" in the class can refer to an id or class of input(s), or an id or class
of elements that contain inputs.

### Aggregate Calculations

    <input class="example2" type="checkbox" value="1" />
    <input class="example2" type="checkbox" value="1" />

    <input type="text" class="subscribe to-sum-example2" />

In this case, the third input will show the sum of the checked .example2 inputs. All checkboxes
and radio inputs are valued at 0 when unchecked.

The special word "sum" is recognized as a defined aggregate calculator. Currently, the other 
available aggregates are "max", "all" (boolean and), and "any" (boolean or). More aggregates
can be easily defined with a few lines of code.

### Setting Attributes

Instead of setting the value of an input, CalculatedAttributes can set other attributes if it
finds a recognized "attribute setter." Currently the only attribute setter defined is "visible."

To bind an attribute of an element to a calculated value:

    <input class="example3" type="checkbox" value="Yes" />
    <input class="example3" type="checkbox" value="Yes" />

    <p class="subscribe to-all-example3 visible-if-true">
      This paragraph will be visible only if all the matching inputs have a
      "truthy" value.
    </p>

The "if-true" construct can also be replaced with other conditions:

* -if-*x* -- equal to *x*
* -if-gt-*x* -- greater than *x*
* -if-gte-*x* -- greater than or equal to *x*
* -if-lt-*x* -- less than *x*
* -if-lte-*x* -- less than or equal to *x*
* -if-between-*x*-*y* -- between the values of *x* and *y* inclusive

### Truthiness

In contrast to Javascript's builtin ideas of truthiness, the strings "No", "no", "false", "False", 
and "0" will be converted to false, along with the empty string, the number 0, and any unchecked 
checkbox or radio input (which are actually valued at 0).

Installation
------------

Upload calculated-attributes.js on your web server, and insert the following in the page
head, or before the closing body tag:

    <script type="text/javascript" src="/path/to/calculated-attributes.js"></script>
    <script type="text/javascript">
      $('body').CalculatedAttributes();
    </script>

To confine functionality to a particular part of the document, you can replace $('body') with
any jQuery selector.

Caveats
-------

The only attribute supported currently is "visible." Additional ones can be easily added
once I need them.
