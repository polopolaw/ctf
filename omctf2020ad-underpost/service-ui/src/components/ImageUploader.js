import React from 'react';

import Button from '@material-ui/core/Button';
import loadImage from '../assets/img/upload_image.png';

function ImageUploader({ imagePreviewUrl, onChangeImage }) {
    return (
        <React.Fragment>
            <form>
                <Button
                    size="small"
                    color="primary"
                    variant="outlined"
                    component="label"
                >
                    Upload Image
                    <input
                        className="fileInput"
                        type="file"
                        onChange={onChangeImage}
                        style={{ display: 'none' }}
                    />
                </Button>
            </form>
            <img
                src={imagePreviewUrl || loadImage}
                alt="avatar"
                style={{
                    marginTop: '10px',
                    maxHeight: '200px',
                    maxWidth: '200px',
                }}
            />
        </React.Fragment>
    );
}

export default ImageUploader;
