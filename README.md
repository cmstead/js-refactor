JS-Refactor
===========

JS Refactor is a Visual Studio Code extension for adding a few useful refactorings to help speed development and 
reduce the time a Javascript developer has to spend performing repeated actions. It may only take a few extra
seconds to do these things by hand, but those seconds add up quite quickly.

JS Refactor has two key components: automated refactorings and code snippets.

##Automated Refactorings

Currently JS Refactor supports three refactorings (explanations below):

- Wrap in function
- Wrap in IIFE
- Extract to function

###Usage

Select the code you wish to refactor and then press the F1 key to open the command pallette.  Begin typing the name of
the refactoring and select the correct refactoring from the list. You will be prompted for any necessary information.

###Explanations

**Wrap in function** takes your selected code, at line-level precision, and wraps all of the lines in a named function.

**Wrap in IIFE** wraps selected code in an immediately invoked function expression (IIFE).

**Extract to function** is an extra step on top of wrap in function.  Instead of simply wrapping your selected code
in a new function declaration, JS Refactor encloses your code in a named function and immediately executes the
new function on the next line.  This makes the "extract method/function" refactoring trivial to implement since
the only work needed is to move the new function to an appropriate location in the code.

##Snippets

JS Refactor supports five function-related snippets:

- Anonymous Function (anon)
- Export statement -- single variable (export)
- Export statement -- object literal (exportObj)
- Function (fn)
- Immediately Invoked Function Expression (iife)
- Member Function (mfn)
- Require statement (require)
- Use Strict (strict)

###Usage

Type the abbreviation, such as fn, in your code and hit enter. When the snippet is executed, the appropriate code will be
inserted into your document. Any snippets which require extra information like names or arguments will have named
tab-stops where you can fill in the information unique to your program.

###Explanations

**anon** Inserts a tab-stopped anonymous function snippet into your code

**export** Adds a module.exports single var assignment in your module

**exportObj** Adds a module.exports assignment with an object literal

**fn** Inserts a tab-stopped named function snippet into your code

**iife** Inserts a new, tab-stopped IIFE into your code

**mfn** Inserts a new color-delimited member function to your prototype -- Protip be inside a prototype object when using this.

**require** Inserts a new require statement in your module

**strict** Inserts 'use strict' into your code

