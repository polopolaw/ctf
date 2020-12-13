function isLineEven(y) {
    return y % 2 === 0;
}

export function styleForCell(x, y, isGoodInside = false) {
    const isEven = isLineEven(y);

    let marginLeft = isEven ? 0 : 27;
    let marginTop = -31;

    if (isEven && x === 0) {
        marginLeft = 0;
    }

    if (y === 0) {
        marginTop = 0;
    }

    if (isGoodInside) {
        marginTop = -50;
    }

    return { marginLeft: marginLeft + 'px', marginTop: marginTop + 'px' };
}

export function styleForBunker(x, y, isGoodInside = false) {
    const isEven = isLineEven(y);

    let marginLeft = isEven ? 0 : 27;
    let marginTop = -31;

    if (isEven && x === 0) {
        marginLeft = 0;
    }

    if (isGoodInside) {
        marginTop = -33;
    }

    if (y === 0) {
        marginTop = 0;
    }

    return { marginLeft: marginLeft + 'px', marginTop: marginTop + 'px' };
}

export function styleForParcelInsideBunker(x, y) {
    const isEven = isLineEven(y);
    const marginLeft = isEven ? 7 : 33;

    return {
        position: 'absolute',
        marginTop: '-36px',
        marginLeft: marginLeft + 'px',
    };
}

export function styleForParcelInsideCell(x, y) {
    const isEven = isLineEven(y);
    const marginLeft = isEven ? 7 : 33;

    return { marginLeft: marginLeft + 'px' };
}

export function styleForBunkerName(x, y) {
    const isEven = isLineEven(y);
    const marginLeft = isEven ? 0 : 27;

    return {
        textShadow:
            '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #0073e6, 0 0 20px #0073e6, 0 0 25px #0073e6, 0 0 30px #0073e6, 0 0 35px #0073e6',
        position: 'absolute',
        marginTop: '-43px',
        marginLeft: marginLeft + 'px',
        color: '#f4f7fc',
        fontWeight: 'bold',
        zIndex: 10,
    };
}

export function styleForGoodNameInsideParcel(x, y) {
    const isEven = isLineEven(y);
    const marginLeft = isEven ? 0 : 27;

    return {
        textShadow:
            '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #0073e6, 0 0 20px #0073e6, 0 0 25px #0073e6, 0 0 30px #0073e6, 0 0 35px #0073e6',
        position: 'absolute',
        marginTop: '-18px',
        marginLeft: marginLeft + 'px',
        fontSize: '0.75rem',
        color: '#f4f7fc',
        whiteSpace: 'nowrap',
        zIndex: 10,
    };
}

export const getTokenFromLocalstorage = () => {
    const item = JSON.parse(localStorage.getItem('underpost'));
    const token = item ? item.token : null;

    return token;
};
