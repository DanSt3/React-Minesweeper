export default class CellData {
    constructor(mine = false,
        value = 0,
        marked = false,
        revealed = false,
        toBeRevealed = false) {
        this.mine = mine;
        this.marked = marked;
        this.revealed = revealed;
        this.toBeRevealed = toBeRevealed;
        this.value = value;
    }

    isMine() {
        return this.mine;
    }

    setMine(state) {
        this.mine = state;
    }

    isMarked() {
        return this.marked;
    }

    isRevealed() {
        return this.revealed;
    }

    isToBeRevealed() {
        return this.toBeRevealed;
    }

    setToBeRevealed(state) {
        this.toBeRevealed = state;
    }

    getValue() {
        return this.value;
    }

    setValue(value) {
        this.value = value;
    }

    toggleMark() {
        const newMarked = !this.marked;
        this.marked = newMarked;
        return newMarked;
    }

    reveal() {
        // (not a toggle - once it is revealed it can't be "unrevealed")
        this.revealed = true;
        this.toBeRevealed = false;
    }
}
