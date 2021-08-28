# JS Refactor :: JS CodeFormer #

JS Refactor has been retired. This project is now an extension installer for its replacement, JS CodeFormer. If you install this extension, you will get that one.

You can install JS CodeFormer directly:

https://marketplace.visualstudio.com/items?itemName=cmstead.js-codeformer

## The Good News/Bad News Situation ##

The good news, this project will install JS CodeFormer for you, and you will get nearly the same hotkeys you've developed muscle memory for. The bad news, this is not the old project.

More good news: JS CodeFormer is a significant improvement in a number of ways:

- **It's faster** -- a LOT faster. In just about every way.
- **It has a broader language footprint** -- JSR at its best supported standard JavaScript and some TypeScript if it wasn't too fancy. JS CodeFormer can parse and interpret a large number of languages and framework-specific file formats, including JS/TS embedded in HTML and HTML-like files.
- **It's designed for stability and maintenance** -- The source code is well tested, and designed for quick easy fixes, which has already borne fruit.
- **The old JSR bugs are gone** -- I combed through the old issues and either verified they were gone, or fixed them if they were a design oversight.

## Why (The Life Story) ##

JS Refactor was created at a time when VS Code was new and the refactoring landscape in the editor was limited. It was initially designed to simply be a refactoring extension. As time went along, it grew, and extended beyond being a simple refactoring tool.

Meanwhile the codebase was increasingly difficult to maintain. It was the first extension I authored for VS Code, and, even with significant work to improve the codebase, the problems were built too deeply into the core.

Eventually JS Refactor broke and I didn't have the energy to deal with the fallout anymore. I stopped most work for almost 2 full years. Once I resurfaced, I realized the only way out was to replace the original and build a system around certain principles which would lead to software which would work reliably, and could be maintained at a sustainable pace.

I started work on JS CodeFormer. Now that JS CodeFormer is in a stable initial state, it is time to give JS Refactor an honorable send-off. Instead of leaving a project to languish, it made more sense to send people where they can get something arguably better. This led me to the state of the software you see today.

Thank you to everyone who joined me on the initial journey. I hope you all will come and join me as we build better software together!
