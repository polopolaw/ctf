function isLineEven(y) {
    return y % 2 === 0;
}

export function styleForCell(x, y) {
    const isEven = isLineEven(y);

    let marginLeft = isEven ? 0 : 27;
    let marginTop = -31;

    if (isEven && x === 0) {
        marginLeft = 0;
    }

    if (y === 0) {
        marginTop = 0;
    }

    return {
        marginLeft: marginLeft + 'px',
        marginTop: marginTop + 'px',
        position: 'relative',
    };
}

export function styleForBunker(x, y) {
    const isEven = isLineEven(y);

    let marginLeft = isEven ? 0 : 27;
    let marginTop = -31;

    if (isEven && x === 0) {
        marginLeft = 0;
    }

    if (y === 0) {
        marginTop = 0;
    }

    return {
        marginLeft: marginLeft + 'px',
        marginTop: marginTop + 'px',
        position: 'relative',
    };
}

export function styleForMarkInsideCell(x, y) {
    const isEven = isLineEven(y);

    let marginLeft = isEven ? 0 : 27;
    let marginTop = -31;

    if (isEven && x === 0) {
        marginLeft = 0;
    }

    if (y === 0) {
        marginTop = 0;
    }

    return {
        marginLeft: marginLeft + 'px',
        marginTop: marginTop + 'px',
        position: 'absolute',
        color: 'white',
    };
}

export const getTokenFromLocalstorage = () => {
    const item = JSON.parse(localStorage.getItem('s4feMapAuth'));
    const token = item ? item.token : null;

    return token;
};
