export default class CellData {
    constructor(isMine = false,
        value = -1,
        isMarked = false,
        isRevealed = false) {
        this.mine = isMine;
        this.marked = isMarked;
        this.revealed = isRevealed;
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
    }
}
