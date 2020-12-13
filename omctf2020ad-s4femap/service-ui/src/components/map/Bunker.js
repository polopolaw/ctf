import React from 'react';
import bunker from '../../assets/img/better-gray-bunker.png';
import { styleForBunker } from '../../utils/helpers';

function Bunker({ positionX, positionY, name }) {
    const bunkerStyle = styleForBunker(positionX, positionY);

    return (
        <td
            key={'bunker' + positionX + '_' + positionY}
            style={{
                maxHeight: '70px',
                maxWidth: '53px',
                position: 'relative',
            }}
        >
            <div style={bunkerStyle}>
                <img
                    src={bunker}
                    alt="bunker"
                    style={{
                        maxHeight: '70px',
                        maxWidth: '70px',
                        position: 'absolute',
                        marginTop: '-22px',
                        zIndex: 1,
                    }}
                />
                <div
                    style={{
                        zIndex: 100,
                        position: 'absolute',
                        color: 'white',
                        fontWeight: 'bold',
                        textShadow:
                            '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #0073e6, 0 0 20px #0073e6, 0 0 25px #0073e6, 0 0 30px #0073e6, 0 0 35px #0073e6',
                    }}
                >
                    {name}
                </div>
            </div>
        </td>
    );
}

export default Bunker;
