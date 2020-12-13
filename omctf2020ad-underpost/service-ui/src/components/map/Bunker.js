import React from 'react';
import bunker from '../../assets/img/better-gray-bunker.png';
import {
    styleForBunker,
    styleForParcelInsideBunker,
    styleForBunkerName,
} from '../../utils/helpers';
import Parcel from './Parcel';

function Bunker({ bunkerName, positionX, positionY, orders = [] }) {
    const getOrdersInBunker = () => {
        const ordersInBunker = [];

        if (orders && orders.length > 0) {
            orders.forEach(order => {
                if (
                    order.positionX === positionX &&
                    order.positionY === positionY
                ) {
                    ordersInBunker.push(order);
                }
            });
        }
        return ordersInBunker;
    };

    const ordersInBunker = getOrdersInBunker();

    const divStyle =
        ordersInBunker.length !== 0
            ? {
                  maxHeight: '44px',
                  maxWidth: '70px',
              }
            : {};

    const styleForBunkerImage = styleForBunker(
        positionX,
        positionY,
        ordersInBunker.length !== 0
    );

    return (
        <td
            key={`tdbnk_${positionY}_${positionX}`}
            style={{
                maxHeight: '70px',
                maxWidth: '53px',
            }}
        >
            <div style={{ position: 'relative', ...divStyle }}>
                <label style={styleForBunkerName(positionX, positionY)}>
                    {bunkerName}
                </label>
                <img
                    src={bunker}
                    alt="bunker"
                    style={{
                        maxHeight: '70px',
                        maxWidth: '70px',
                        position: 'relative',
                        ...styleForBunkerImage,
                    }}
                />
                {ordersInBunker.length !== 0 && (
                    <Parcel
                        orders={ordersInBunker}
                        style={styleForParcelInsideBunker(positionX, positionY)}
                        positionX
                        positionY
                    />
                )}
            </div>
        </td>
    );
}

export default Bunker;
