(function () {
    'use strict';

    const elements = document.getElementsByClassName('code-sample-wrapper');
    const elementArray = Array.prototype.slice.call(elements);

    function removeClassName(className, element) {
        return element.className = element
            .className
            .split(' ')
            .filter((token) => token !== className)
            .join(' ');
    }

    function addClassName(className, element) {
        element.className = element.className + ' ' + className;
    }

    function hasClassName(className, element) {
        return element.className.split(' ').indexOf(className) > -1;
    }

    function updateView(element) {
        if (!hasClassName('hidden', element)) {
            addClassName('hidden', element);
            removeClassName('shown', element);
        } else {
            addClassName('shown', element);
            removeClassName('hidden', element);
        }
    }

    function updateCollapseText(linkElement, codeElement) {
        if (hasClassName('hidden', codeElement)) {
            linkElement.innerText = 'Show Code Sample';
        } else {
            linkElement.innerText = 'Hide Code Sample';
        }
    }

    elementArray.forEach(function (element) {
        const collapseLink = element
            .getElementsByClassName('code-expand')[0]
            .getElementsByTagName('a')[0];
        const codeContainer = element
            .getElementsByTagName('pre')[0];

        updateView(codeContainer);
        updateCollapseText(collapseLink, codeContainer);

        collapseLink.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();

            updateView(codeContainer);
            updateCollapseText(collapseLink, codeContainer);
        });
    });
})();