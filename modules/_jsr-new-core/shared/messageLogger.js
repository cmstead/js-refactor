function messageLogger (
    types,
    vscodeFactory
) {
    
    function getWindow() {
        return vscodeFactory.get().window;
    }

    function log(message) {
        getWindow().showInformationMessage(message);
    }

    function error(message) {
        getWindow().showErrorMessage(message);
    }

    function info(message) {
        getWindow().showInformationMessage(message);
    }

    return {
        log: types.enforce(
            'message: string => void',
            log
        ),
        error: types.enforce(
            'message: string => void',
            error
        ),
        info: types.enforce(
            'message: string => void',
            info
        ),
    };
}

module.exports = messageLogger;