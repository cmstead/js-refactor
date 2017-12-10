JS Refactorings
===============

JS Refactorings is a Visual Studio Code extension for adding a few useful refactorings to help speed development and 
reduce the time a Javascript developer has to spend performing repeated actions. It may only take a few extra
seconds to do these things by hand, but those seconds add up quite quickly.

JS Refactor has two key components: automated refactorings and code snippets.

## Installation

#### Extensions Panel:
Click on the extensions icon on the left-hand side of your editor.  In the search bar type "JS Refactorings." Find the extension in the list and click the install button.

#### Command Pallette
Open VS Code, press F1 and enter `ext install` to open the extensions panel, follow the instructions above

## Find Me Online

- [ChrisStead.com](http://www.chrisstead.com)
- [Visit me on Twitter](https://twitter.com/cm_stead)
- [Fork and Contribute on Github](https://github.com/cmstead/js-refactor)

## Automated Refactorings

**Basic usage:** Make a selection, right click and select the refactoring you want to perform from the context menu.

**Command Pallette:** You can press F1 then simply type the name of the refactoring and press enter 
if you know the name of the refactoring you need.

**Shortcuts:** Finally, there are hotkey combinations for some of the most common refactorings you might want. Hotkeys are listed in the keybindings section below.

JS Refactor supports the following refactorings (explanations below):

**Core Refactorings:**
- Extract Method
- Extract Variable
- Inline Variable
- Rename Variable (Alias of VS Code internal command)

**Other Utilities:**
- Convert To Arrow Function
- Export Function
- Negate Expression
- Shift Parameters Left
- Shift Parameters Right
- Wrap selection options:
    - Arrow Function
    - Async Function
    - Condition
    - Function
    - Generator
    - IIFE
    - Try/Catch

### Keybindings

- Extract method - ctrl+shift+j m
- Extract variable - ctrl+shift+j v
- Inline variable - ctrl+shift+j i
- Rename variable (VS Code internal) - F2

- Menu of available refactorings - ctrl+shift+j r
- Export function - ctrl+shift+j x
- Wrap selection - ctrl+shift+j w

### Usage

Select the code you wish to refactor and then press the F1 key to open the command pallette.  Begin typing the name of
the refactoring and select the correct refactoring from the list. You will be prompted for any necessary information.

### Explanations

#### Core Refactorings ####

**Extract Method** Creates new function with original selection as the body.

**Extract Variable** Creates new assigned variable declaration and replaces original selection.

**Inline Variable** Replaces all references to variable with variable initialization expression, deletes variable declaration.

#### Other Utilities ####

**Convert To Arrow Function** Converts a function expression to an arrow function.

**Convert To Member Function** Converts a named function to a member function for an object prototype definition.

**Convert To Named Function** Converts selected anonymous function assignment or member function declaration and converts it into a named function declaration.
Convert to named function only searches the first line of your selection and will only convert one function at a time.

**Export Function** creates new export declaration for selected function or function name

**Shift Parameters Left** Shifts all selected parameters to the left

**Shift Parameters Right** Shifts all selected parameters to the right

**Wrap In Condition** Wraps selected code in an if statement, adding indentation as necessary

**Wrap in function** takes your selected code, at line-level precision, and wraps all of the lines in a named function.

**Wrap in IIFE** wraps selected code in an immediately invoked function expression (IIFE).

## Snippets

JS Refactor supports several common code snippets:

- Anonymous Function (anon)
- Arrow Function (arrow)
- Async Function (async)
- Condition Block (cond)
- Console Log (log)
- Export statement -- single variable (export)
- Export statement -- object literal (exportObj)
- Function (fn)
- Generator (generator)
- Lambda function (lfn)
- Immediately Invoked Function Expression (iife)
- Member Function (mfn)
- Prototypal Object Definition (proto)
- Require statement (require)
- Try/Catch Block (tryCatch)
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

**lfn** Inserts a tab-stopped lambda function snippet into your code

**iife** Inserts a new, tab-stopped IIFE into your code

**mfn** Inserts a new color-delimited member function to your prototype -- Protip be inside a prototype object when using this.

**require** Inserts a new require statement in your module

**strict** Inserts 'use strict' into your code

### Contribution Rules and Guidelines

JS Refactorings is open to pull requests for everything from code to documentation.  As with any project, there are certain
needs which must be addressed.  JS Refactorings is, at its core, still in development. Since it was built on an early version
of Visual Studio Code, so there is a fair amount of code that was originally exploratory in nature. In its current state, 
JS Refactorings is fully tested and behaviors are vice-tested into place.  Going forward, code will be cleaned and, itself,
refactored, so a style guide is going to be relatively fluid.

Nevertheless, following are the required elements of a good pull request:

- **Code updates must be covered by a test.**
- **Code must follow existing standards as they are available.**
- **All existing behaviors must continue to function as designed.**
- **All tests must continue to pass. Any pull requests with failing tests cannot be accepted.**
- **Pull request must explain changes which are made, referring to an issue number as available.**
- **Pull requests may not be claimed as intellectual property of a company or other external agency.**

## Updates ##

### 2.2.0 ###

- Rewrite of Inline Variable
    - Improved inlining capabilities
    - Scoped inlining from variable use
    - Click and inline functionality -- no need to select

### v2.1.0 ###

- Rewrote Extract Variable
- Removed legacy refactorings 
    - Convert to member function
    - Convert to named function
    - Wrap in executed function
- Updated hotkey combinations
    - Extract Method: ctrl+shift+j m
    - Extract Variable: ctrl+shift+j v

### v1.6.0 ###

- Added extract method

**Known issue:** Extract method does not support class syntax

### v1.5.0 ###

- Added basic convert to arrow function behavior

### v1.4.0 ###

- Added support for const and let to extract variable
- Fixed extract variable bug where all tokens were not replaced
- Fixed bug where activeEditor was not properly captured on document change

### v0.15.0 ###

- Replaced Esprima with Babylon to support ES Next and JSX features

### v0.14.0

- Added Negate Expression

### v0.13.0

- Added Wrap in Try/Catch Block

### v0.12.0

- Added inline variable

### v0.10.0

- Added hotkey menu of available refactorings
- Updated keybindings to simpler key combinations

### v0.9.0

- Wrap in Generator
- Wrap in Arrow Function
- Wrap in Async Function

### v0.8.1

- Added "Wrap Selection" top-level option for wrapping code in generated code
- Removed Wrap In "Name" actions from context menu

### v0.7.0

- Added refactorings to context (right-click) menu
- Moved to DJect IoC library for dependency management to enhance testing
- Removed potentially buggy indent logic

### v0.6.1

- Added lambda function snippet (lfn)
- Fixed indentation issue in code block wrapping

### V0.5.0

- Shift parameters left
- Shift parameters right
- Added keybindings for common actions

### V0.4.0

- Added extract variable behavior.
- Enhanced refactor to named function behavior to work with member functions

### V0.3.0

- Added export function action
- Fixed inconsistent indentation for wrap refactorings
