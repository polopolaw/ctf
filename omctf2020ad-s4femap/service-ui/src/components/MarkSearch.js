import React from 'react';
import { connect } from 'react-redux';

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchIcon from '@material-ui/icons/Search';
import { getSelectedCellMarks } from '../thunks/map';

import anomaly from '../assets/img/anomaly-blur.png';
import obstacle from '../assets/img/difficulty-blur.png';
import enemy from '../assets/img/fight-blur.png';
import loot from '../assets/img/blur-loot.png';
import sensor from '../assets/img/sensor-blur.png';
import assistance from '../assets/img/ladder-blur.png';
import Avatar from '@material-ui/core/Avatar';
import InputAdornment from '@material-ui/core/InputAdornment';

function prepareMarksToAutocomplete(marksArray) {
    const resultMarks = [];
    marksArray.forEach(mark => {
        resultMarks.push(...mark.marks);
    });
    return resultMarks;
}

const icons = {
    obstacle: obstacle,
    enemy: enemy,
    loot: loot,
    sensor: sensor,
    assistance: assistance,
    anomaly: anomaly,
};

function MarkSearch({ marks, token, getSelectedCellMarks }) {
    const marksForAutocomplete = prepareMarksToAutocomplete(marks);

    const onCellClick = (positionX, positionY) => {
        getSelectedCellMarks({
            token,
            x: positionX,
            y: positionY,
        });
    };

    return (
        <Autocomplete
            id="searchMark"
            options={marksForAutocomplete}
            getOptionLabel={itm => itm.name}
            renderOption={itm => (
                <React.Fragment>
                    <span style={{ marginRight: '10px' }}>
                        <Avatar
                            style={{ maxWidth: '20px', maxHeight: '20px' }}
                            src={icons[itm.markType]}
                            alt={itm.markType}
                        />
                    </span>
                    {itm.name}
                </React.Fragment>
            )}
            onChange={(event, newValue) => {
                if (!!newValue) {
                    onCellClick(newValue.x, newValue.y);
                }
            }}
            renderInput={params => <TextField label="Search" {...params} />}
        />
    );
}

function mapStateToProps(state) {
    return {
        token: state.auth.token,
        marks: state.cells.marks,
    };
}

export default connect(mapStateToProps, { getSelectedCellMarks })(MarkSearch);
