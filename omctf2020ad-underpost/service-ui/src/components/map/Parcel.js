import React from 'react';
import parcel from '../../assets/img/star-parcel.png';

import { styleForGoodNameInsideParcel } from '../../utils/helpers';

function Parcel({ orders, style, positionX, positionY }) {
    const orderNames = orders.map(order => order.good.name).join(',');

    return (
        <div>
            <label style={styleForGoodNameInsideParcel(positionX, positionY)}>
                {orderNames}
            </label>
            <img
                src={parcel}
                alt="cell"
                style={{
                    maxHeight: '20px',
                    maxWidth: '30px',
                    ...style,
                }}
            />
        </div>
    );
}

export default Parcel;
