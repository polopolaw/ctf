import React from 'react';
import cell from '../../assets/img/better-gray-cell.png';
import selectedcell from '../../assets/img/blue-selected-cell.png';
import Mark from './Mark';
import { styleForCell, styleForMarkInsideCell } from '../../utils/helpers';

function firstOrNull(arr) {
    if (arr == null || arr.length == 0) {
        return null;
    } else {
        return arr[0];
    }
}

function Cell({
    positionX,
    positionY,
    cells,
    cellClickHandler,
    isSelected = false,
}) {
    const getCellData = () => {
        if (cells) {
            const cellData = firstOrNull(
                cells.filter(
                    x => x.cell.x === positionX && x.cell.y === positionY
                )
            );
            return cellData;
        } else {
            return null;
        }
    };

    const data = getCellData();
    const clickHandler = cellClickHandler;

    const onCellClick = () => {
        clickHandler(positionX, positionY);
    };

    const cellStyle = styleForCell(positionX, positionY);

    const markStyle = styleForMarkInsideCell(positionX, positionY);

    return (
        <td
            style={{
                maxHeight: '70px',
                maxWidth: '53px',
                padding: 0,
            }}
        >
            <div style={cellStyle} onClick={onCellClick}>
                {data !== null && <Mark data={data} style={markStyle} />}
                <img
                    src={(isSelected && selectedcell) || cell}
                    alt="cell"
                    style={{
                        maxHeight: '70px',
                        maxWidth: '70px',
                    }}
                />
            </div>
        </td>
    );
}

export default Cell;
