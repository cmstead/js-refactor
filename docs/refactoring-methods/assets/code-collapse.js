(function () {
    'use strict';

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


    function buildCollapseTextUpdater(displayMessage, hideMessage) {
        return function updateCollapseText(linkElement, codeElement) {
            if (hasClassName('hidden', codeElement)) {
                linkElement.innerText = displayMessage;
            } else {
                linkElement.innerText = hideMessage;
            }
        }
    }

    const updateCodeSampleText = buildCollapseTextUpdater('Show Code Sample', 'Hide Code Sample');
    const updateDescribeText = buildCollapseTextUpdater('Show Info', 'Hide Info');

    const codeSampleElements = document.getElementsByClassName('code-sample-wrapper');
    const codeSampleElementArray = Array.prototype.slice.call(codeSampleElements);

    codeSampleElementArray.forEach(function (element) {
        const collapseLink = element
            .getElementsByClassName('code-expand')[0]
            .getElementsByTagName('a')[0];

        const codeContainer = element
            .getElementsByTagName('pre')[0];

        updateView(codeContainer);
        updateCodeSampleText(collapseLink, codeContainer);

        collapseLink.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();

            updateView(codeContainer);
            updateCodeSampleText(collapseLink, codeContainer);
        });
    });

    const describeElements = document.getElementsByClassName('describe-item');
    const describeElementArray = Array.prototype.slice.call(describeElements);

    describeElementArray.forEach(function (element) {
        const collapseLink = element
            .getElementsByClassName('describe-link')[0];

        const contentContainer = element
            .getElementsByClassName('describe-collapsible')[0];

        updateDescribeText(collapseLink, contentContainer);

        collapseLink.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();

            updateView(contentContainer);
            updateDescribeText(collapseLink, contentContainer);
        });
    });

    const collapseAll = document.getElementsByClassName('collapse-all')[0];

    if (typeof collapseAll !== 'undefined') {
        collapseAll.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();

            const openElements = document.getElementsByClassName('shown');
            const openElementArray = Array.prototype.slice.call(openElements);

            openElementArray.forEach(function (element) {
                removeClassName('shown', element);
                addClassName('hidden', element);
            });

            codeSampleElementArray.forEach(function (element) {
                const displayLink = element
                    .getElementsByClassName('code-expand')[0]
                    .getElementsByTagName('a')[0];

                const codeContainer = element
                    .getElementsByTagName('pre')[0];

                updateCodeSampleText(displayLink, codeContainer);
            });

            describeElementArray.forEach(function (element) {
                const describeLink = element
                    .getElementsByClassName('describe-link')[0];

                const contentContainer = element
                    .getElementsByClassName('describe-collapsible')[0];

                updateDescribeText(describeLink, contentContainer);
            });
        });
    }

})();
