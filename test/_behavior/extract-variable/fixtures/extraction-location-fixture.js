function topLevel() {
    return {
        secondLevel: () => {
            console.log('this is a test');
        }
    };
}