import React, { useState } from 'react';

import anomaly from '../../assets/img/anomaly-blur.png';
import obstacle from '../../assets/img/difficulty-blur.png';
import enemy from '../../assets/img/fight-blur.png';
import loot from '../../assets/img/blur-loot.png';
import sensor from '../../assets/img/sensor-blur.png';
import assistance from '../../assets/img/ladder-blur.png';
import { withStyles } from '@material-ui/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

const theme = createMuiTheme();

const styles = theme => ({
    mark: {
        '&:hover': {
            cursor: 'pointer',
        },
    },
});

function Mark({ data, classes }) {
    const [styleName, setStyle] = useState({ display: 'none' });

    let mark = data.markToShow;
    let icon = anomaly;
    switch (mark.markType) {
        case 'obstacle':
            icon = obstacle;
            break;
        case 'enemy':
            icon = enemy;
            break;
        case 'loot':
            icon = loot;
            break;
        case 'sensor':
            icon = sensor;
            break;
        case 'assistance':
            icon = assistance;
            break;
        default:
            icon = anomaly;
            break;
    }

    return (
        <div
            className={classes.mark}
            onMouseEnter={e => {
                setStyle({ display: 'block' });
            }}
            onMouseLeave={e => {
                setStyle({ display: 'none' });
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    marginLeft: '8px',
                    marginTop: '12px',
                    zIndex: 100,
                    color: 'white',
                    whiteSpace: 'nowrap',
                    textShadow:
                        '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #0073e6, 0 0 20px #0073e6, 0 0 25px #0073e6, 0 0 30px #0073e6, 0 0 35px #0073e6',
                    ...styleName,
                }}
            >
                {mark.name}
            </div>
            <img
                src={icon}
                alt={mark.markType}
                style={{
                    maxHeight: '30px',
                    maxWidth: '30px',
                    position: 'absolute',
                    marginLeft: '12px',
                    marginTop: '15px',
                }}
            />
        </div>
    );
}

export default withStyles(styles(theme))(Mark);
