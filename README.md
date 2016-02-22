JS-Refactor
===========

JS Refactor is a Visual Studio Code extension for adding a few useful refactorings to help speed development and 
reduce the time a Javascript developer has to spend performing repeated actions. It may only take a few extra
seconds to do these things by hand, but those seconds add up quite quickly.

JS Refactor has two key components: automated refactorings and code snippets.

## Keep In Touch

- [ChrisStead.com](http://www.chrisstead.com)
- [Visit me on Twitter](https://twitter.com/cm_stead)
- [Fork and Contribute on Github](https://github.com/cmstead/js-refactor)

## Automated Refactorings

JS Refactor supports the following refactorings (explanations below):

- Convert To Member Function
- Convert To Named Function
- Export Function
- Extract Variable
- Wrap In Condition
- Wrap In Executed Function
- Wrap in function
- Wrap in IIFE

### Usage

Select the code you wish to refactor and then press the F1 key to open the command pallette.  Begin typing the name of
the refactoring and select the correct refactoring from the list. You will be prompted for any necessary information.

### Explanations

**Convert To Member Function** Converts a named function to a member function for an object prototype definition.

**Convert To Named Function** Converts selected anonymous function assignment or member function declaration and converts it into a named function declaration.
Convert to named function only searches the first line of your selection and will only convert one function at a time.

**Export Function** creates new export declaration for selected function or function name

**Extract Variable** Creates new assigned variable declaration and extracts repeated values.

**Wrap In Condition** Wraps selected code in an if statement, adding indentation as necessary

**Wrap In Executed Function** is an extra step on top of wrap in function.  Instead of simply wrapping your selected code
in a new function declaration, JS Refactor encloses your code in a named function and immediately executes the
new function on the next line.  This makes the "extract method/function" refactoring trivial to implement since
the only work needed is to move the new function to an appropriate location in the code.

**Wrap in function** takes your selected code, at line-level precision, and wraps all of the lines in a named function.

**Wrap in IIFE** wraps selected code in an immediately invoked function expression (IIFE).

## Snippets

JS Refactor supports several common code snippets:

- Anonymous Function (anon)
- Condition Block (cond)
- Export statement -- single variable (export)
- Export statement -- object literal (exportObj)
- Function (fn)
- Immediately Invoked Function Expression (iife)
- Member Function (mfn)
- Prototypal Object Definition (proto)
- Require statement (require)
- Use Strict (strict)

### Usage

Type the abbreviation, such as fn, in your code and hit enter. When the snippet is executed, the appropriate code will be
inserted into your document. Any snippets which require extra information like names or arguments will have named
tab-stops where you can fill in the information unique to your program.

### Explanations

**anon** Inserts a tab-stopped anonymous function snippet into your code

**export** Adds a module.exports single var assignment in your module

**exportObj** Adds a module.exports assignment with an object literal

**fn** Inserts a tab-stopped named function snippet into your code

**iife** Inserts a new, tab-stopped IIFE into your code

**mfn** Inserts a new color-delimited member function to your prototype -- Protip be inside a prototype object when using this.

**require** Inserts a new require statement in your module

**strict** Inserts 'use strict' into your code

## Release Info

### V0.4.0

- Added extract variable behavior.
- Enhanced refactor to named function behavior to work with member functions

### V0.3.0

- Added export function action
- Fixed inconsistent indentation for wrap refactorings