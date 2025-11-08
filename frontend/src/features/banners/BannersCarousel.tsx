import {Swiper, SwiperSlide} from 'swiper/react';
import {Alert, Box, Button, Typography} from '@mui/material';
import { Navigation } from 'swiper/modules';
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {Link} from 'react-router-dom';
// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/navigation';
import './styles.css';
import {selectBanners, selectBannersError} from "./bannersSlice.ts";
import {useEffect} from "react";
import {fetchBanners} from "./bannersThunks.ts";

const BannersCarousel = () => {
    const dispatch = useAppDispatch();
    const banners = useAppSelector(selectBanners);
    const bannersError = useAppSelector(selectBannersError);

    useEffect(() => {
        dispatch(fetchBanners());
    }, [dispatch]);

    return (
        <>
            {
                bannersError ?
                    <Alert severity="error">{bannersError}</Alert> :
                    <Box sx={{
                        width: '100%',
                        maxWidth: { lg: '1200px', md: '800px', sm: '600px', xs: '350px' },
                        mx: 'auto',
                        my: 8,
                    }}>
                        <Swiper navigation={true} modules={[Navigation]} className="mySwiper">
                            {
                                banners.map((banner) => (
                                    <SwiperSlide key={banner._id}  >
                                        <Box sx={{
                                            width: '100%',
                                            pr: { xs: '0px', md: '100px'},
                                            height: '100%',
                                            gap: '3',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: {md: 'flex-end', xs: 'center'},
                                            justifyContent: 'center',
                                            backgroundRepeat: 'no-repeat',
                                            backgroundPosition: 'center',
                                            backgroundSize: 'contain',
                                            backgroundImage: 'url(' + 'http://localhost:8000' + banner.image + ')',
                                        }}>

                                            <Typography variant="h4">{banner.title}</Typography>

                                            <Typography variant="h6">
                                                {banner.description}
                                            </Typography>

                                            <Link
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                to={banner.link ? banner.link : '#'}
                                            >
                                                <Button variant='contained' sx={{color: 'white', textDecoration: 'none'}}>
                                                    More info
                                                </Button>
                                            </Link>
                                        </Box>
                                    </SwiperSlide>
                                ))
                            }
                        </Swiper>
                    </Box>
            }

        </>
    );
};

export default BannersCarousel;