interface SpinReel {
    items: string[]
    result: string
}

interface SpinPick extends SpinReel {
    second?: SpinReel
}

function pickOne(items: string[], random: () => number) {
    return items[Math.floor(random() * items.length)]
}

function pickSpin(
    items: string[],
    secondItems: string[] | undefined,
    random: () => number
): SpinPick {
    const pick = { items, result: pickOne(items, random) }
    if (!secondItems) return pick
    return {
        ...pick,
        second: { items: secondItems, result: pickOne(secondItems, random) },
    }
}

function splitItems<T extends { list?: 'second' }>(items: T[]) {
    return {
        first: items.filter((item) => item.list !== 'second'),
        second: items.filter((item) => item.list === 'second'),
    }
}

export type { SpinPick, SpinReel }
export { pickSpin, splitItems }
