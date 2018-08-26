// Generates a list of unique random numbers from within the specified range
// Based on the Fisher–Yates (Knuth) shuffle algorithm, but we stop shuffling after we fill the list
function RandomList(min, max, listSize) {
    // Create the array to shuffle, i.e., [min, min + 1, min + 2, min + 3, .. max]
    const arraySize = max - min + 1;
    const array = Array.from(Array(arraySize).keys(), index => index + min);

    // While there remain elements to shuffle…
    let lastItem = arraySize;
    let remainingShuffles = listSize;
    while (remainingShuffles--) {
        // Pick a remaining element…
        const randomIndex = Math.floor(Math.random() * lastItem--);

        // And swap it with the current element.
        const temp = array[lastItem];
        array[lastItem] = array[randomIndex];
        array[randomIndex] = temp;
    }

    // Pull the shuffled items off into a new array
    return array.slice(-listSize);
}

export default RandomList;
