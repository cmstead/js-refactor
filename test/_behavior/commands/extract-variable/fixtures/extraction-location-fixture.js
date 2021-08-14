function topLevel() {
    return {
        secondLevel: () => {
            console.log('this is a test');
            const x = 5;

            if (false) {
                // intentional noop
            } else if ((9 + x) === 14) {
                const test = [1, 2, 3, 4].map((value) => value + (3 * x));

                let test2;

                test2 = '1234';

                [1, 2, 3, 4]
                    .forEach(value => console.log(value + 'testing'));
            }
        }
    };
}
