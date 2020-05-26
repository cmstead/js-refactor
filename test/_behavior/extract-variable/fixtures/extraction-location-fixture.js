function topLevel() {
    return {
        secondLevel: () => {
            console.log('this is a test');
            const x = 5;

            if((9 + x) === 14) {
                [1, 2, 3, 4].map((value) => value + (3 * x));
            }
        }
    };
}