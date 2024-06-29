import React from 'react';
import { Container, Grid, Typography } from "@mui/material";
import { AppColors } from "../../../util/AppColors";
import comingSoonImage from "../../../assets/images/png/comingsoon.png"; // Correctly import the image

const ComingSoon = () => {
    return (
        <Container
            style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Grid container alignItems="center" justifyContent="center">
                <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
                    <img src={comingSoonImage} alt="Coming Soon" style={{ maxWidth: '100%', height: 'auto' }} />
                </Grid>
            </Grid>
        </Container>
    );
}

export default ComingSoon;
