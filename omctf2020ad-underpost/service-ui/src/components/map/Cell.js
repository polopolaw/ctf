import React from 'react';
import cell from '../../assets/img/better-gray-cell.png';
import Parcel from './Parcel';
import { styleForCell, styleForParcelInsideCell } from '../../utils/helpers';

function Cell({ positionX, positionY, orders }) {
    const getOrdersInCell = () => {
        const ordersInCell = [];

        if (orders && orders.length > 0) {
            orders.forEach(order => {
                if (
                    order.positionX === positionX &&
                    order.positionY === positionY
                ) {
                    ordersInCell.push(order);
                }
            });
        }
        return ordersInCell;
    };

    const ordersInCell = getOrdersInCell();

    const imageContainerStyle =
        ordersInCell.length !== 0
            ? {
                  maxHeight: '44px',
                  maxWidth: '70px',
                  position: 'relative',
              }
            : {};

    const styleForCellImage = styleForCell(
        positionX,
        positionY,
        ordersInCell.length !== 0
    );

    return (
        <td
            key={`td_${positionY}_${positionX}`}
            style={{
                maxHeight: '70px',
                maxWidth: '53px',
            }}
        >
            <div style={imageContainerStyle}>
                {ordersInCell.length !== 0 && (
                    <Parcel
                        orders={ordersInCell}
                        style={styleForParcelInsideCell(positionX, positionY)}
                        positionX
                        positionY
                    />
                )}
                <img
                    src={cell}
                    alt="cell"
                    style={{
                        maxHeight: '70px',
                        maxWidth: '70px',
                        ...styleForCellImage,
                    }}
                />
            </div>
        </td>
    );
}

export default Cell;
