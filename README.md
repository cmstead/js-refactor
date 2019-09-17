JS Refactor
===========

JS Refactor is the Javascript automated refactoring tool for Visual Studio Code, built to smooth and streamline your development experience. It provides an extensive list of automated actions including the commonly needed: Extract Method, Extract Variable, Inline Variable, and an alias for the built-in VS Code rename. JS Refactor also supports many common snippets and associated actions for wrapping existing code in common block expressions.

### Supported Language Files ###

- JavaScript/ECMAScript (.js)
- Vue single file components (.vue)
- HTML (.htm, .html)

**Experimental Support**

- JavaScript React (.jsx)
- TypeScript support (.ts)
- TypeScript React (.tsx)

## Installation

#### Extensions Panel:
Click on the extensions icon on the left-hand side of your editor.  In the search bar type "JS Refactor." Find the extension in the list and click the install button.

#### Command Pallette
Open VS Code, press F1 and enter `ext install` to open the extensions panel, follow the instructions above

## Find Me Online

- [ChrisStead.net](http://www.chrisstead.net)
- [Visit me on Twitter](https://twitter.com/cm_stead)
- [Fork and Contribute on Github](https://github.com/cmstead/js-refactor)

## Automated Refactorings

**Basic usage:** Make a selection, right click and select the refactoring you want to perform from the context menu.

**Command Pallette:** You can press F1 then simply type the name of the refactoring and press enter 
if you know the name of the refactoring you need.

**Shortcuts:** Finally, there are hotkey combinations for some of the most common refactorings you might want. Hotkeys are listed in the keybindings section below.

JS Refactor supports the following refactorings (explanations below):

**Common Refactorings:**
- Extract Method
- Extract Variable
- Inline Variable
- Rename Variable (Alias of VS Code internal command)

**Other Utilities:**
- Convert To Arrow Function
- Convert To Function Declaration
- Convert To Function Expression
- Convert To Template Literal
- Export Function
- Introduce Function
- Lift and Name Function Expression
- Negate Expression
- Shift Parameters
- Wrap selection options:
    - Arrow Function
    - Async Function
    - Condition
    - Function
    - Generator
    - IIFE
    - Try/Catch

### Keybindings

- Extract method
    - Windows/Linux: ctrl+shift+j m
    - Mac: cmd+shift+j m
- Extract variable
    - Windows/Linux: ctrl+shift+j v
    - Mac: cmd+shift+j v
- Inline variable
    - Windows/Linux: ctrl+shift+j i
    - Mac: cmd+shift+j i
- Rename variable (VS Code internal) - F2

- Convert to Arrow Function
    - Windows/Linux: ctrl+shift+j a
    - Mac: cmd+shift+j a
- Convert to Function Expression
    - Windows/Linux: ctrl+shift+j f
    - Mac: cmd+shift+j f
- Convert to Template Literal
    - Windows/Linux: ctrl+shift+j l
    - Mac: cmd+shift+j l
- Export function
    - Windows/Linux: ctrl+shift+j x
    - Mac: cmd+shift+j x
- Mark function as async
    - Windows/Linux: ctrl+shift+j s
    - Mac: cmd+shift+j s
- Shift parameters
    - Windows/Linux: ctrl+shift+j p
    - Mac: cmd+shift+j p
- Wrap selection
    - Windows/Linux: ctrl+shift+j w
    - Mac: cmd+shift+j w

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

**Convert To Function Declaration** Converts a function expression, assigned to a variable, to a function declaration.

**Convert To Function Expression** Converts an arrow function to a function expression.

**Convert To Template Literal** Converts a string concatenation expression to a template literal.

**Export Function** creates new export declaration for selected function or function name

**Introduce Function** creates new function from existing function call or variable assignment

**Lift and Name Function Expression** Lifts function expression from current context, replacing it with provided name and adds name to expression

**Shift Parameters** Shifts function parameters to the left or right by the selected number of places

**Wrap In Condition** Wraps selected code in an if statement, adding indentation as necessary

**Wrap in function** takes your selected code, at line-level precision, and wraps all of the lines in a named function.

**Wrap in IIFE** wraps selected code in an immediately invoked function expression (IIFE).

## Snippets

JS Refactor supports several common code snippets:

- Anonymous Function (anon)
- Arrow Function (arrow)
- Async Function (async)
- Class
    - Definition (class)
    - Constructor (ctor)
    - Method (method)
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

JS Refactor is open to pull requests for everything from code to documentation.  As with any project, there are certain
needs which must be addressed.  JS Refactor is, at its core, still in development. Since it was built on an early version
of Visual Studio Code, so there is a fair amount of code that was originally exploratory in nature. In its current state, 
JS Refactor is fully tested and behaviors are vice-tested into place.  Going forward, code will be cleaned and, itself,
refactored, so a style guide is going to be relatively fluid.

Nevertheless, following are the required elements of a good pull request:

- **Code updates must be covered by a test.**
- **Code must follow existing standards as they are available.**
- **All existing behaviors must continue to function as designed.**
- **All tests must continue to pass. Any pull requests with failing tests cannot be accepted.**
- **Pull request must explain changes which are made, referring to an issue number as available.**
- **Pull requests may not be claimed as intellectual property of a company or other external agency.**

## Updates ##

### 2.20.3 ###

- Fixed bug with TypeScript where elements were being incorrectly parsed as JSX

### 2.20.0 ###

- Added experimental support for JS and TS react files

### 2.19.0 ###

- Added experimental support for TypeScript

### 2.18.0 ##

- Added "convert to function declaration"

### 2.17.1 ##

- Added "mark function as async"
- Updated snippets to support common class syntax

### 2.16.0 ##

- Updated extract method to support class extractions

### 2.15.1 ###

- Added basic Vue single file components (consider this a released alpha)

### 2.14.1 ###

- Enabled most refactorings in standard HTML within script tags
    - Known issue: Rename is built into VS Code and does not support HTML

### 2.13.1 ###

- Fixed issue with arrow functions without parameters not converting to function expressions

### 2.13.0 ###

- Cleaned up extract variable within a class method to display method name in selection dropdown
- Fixed quickPick options to display correct selection place holder text

### 2.12.0 ###

- Added convert to function expression from arrow functions; this is especially useful for any time an arrow function is binding a context incorrectly

### 2.11.0 ###

- Introduced fix for Mac user keybindings; keybindings vary on ctrl/cmd for Windows/Linux vs Mac
- Other marketplace listing and document updates

### 2.10.0 ###

- Added lift and name function action
    - Allows developer to select function expression, lift it out of current use and add a name
    - This can be seen as the function equivalent of extract variable

### 2.9.0 ###

- Enhanced extract method to manage unbound variables better and return in acceptable cases

### 2.8.0 ###

- Added introduce function
    - Adds new function declaration to document using name from property assignment, function call or variable declaration
    - Automatically selects name from expression
    - Allows for better code-by-intention development

### 2.7.0 ###

- Added convert to template literal
    - Converts a string concatenation expression to a string template literal
    - Allows user to simply place cursor and run command

### 2.6.0 ###

- Rewrite of shift params left and right to shift params
    - Adds ability to select direction at action invocation
    - Allows user to select number of places shift should move

### 2.5.0 ###

- Rewrite of negate expression
    - Allows negation without selection
    - Fully manages all condition test cases

### 2.4.0 ###

- Rewrite of Convert to Arrow Function
    - Allows conversion without selection
    - Converts to arrow function without block braces if function is single line

### 2.3.0 ###

- Rewite of Export Function to Add Export
    - Allows export without selection
    - Allows for export of functions and variable declarations

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
