import React from 'react';

const LoaderComponent = () => {
    return (
        <div
            className="row"
            children={
                <div
                    className="col s12"
                    children={
                        <div
                            className="progress"
                            children={
                                <div
                                    className="indeterminate"
                                />
                            }
                        />
                    }
                />
            }
        />
    );
};

export default LoaderComponent;