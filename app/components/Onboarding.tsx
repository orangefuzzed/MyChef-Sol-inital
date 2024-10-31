'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@radix-ui/react-dialog';
import { Button } from '@radix-ui/themes';
import styles from './Onboarding.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

const Onboarding: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const closeOnboarding = () => setIsOpen(false);
  const openOnboarding = () => setIsOpen(true);

  const slides = [
    { text: 'Welcome to MyChef! Your journey to better cooking starts here.', image: 'https://via.placeholder.com/150' },
    { text: 'Explore personalized recipes and meal plans tailored just for you.', image: 'https://via.placeholder.com/150' },
    { text: 'Easily create shopping lists with one click.', image: 'https://via.placeholder.com/150' },
    { text: 'Cook with step-by-step guidance in Cook Mode.', image: 'https://via.placeholder.com/150' },
    { text: 'Save your favorite recipes and revisit them anytime.', image: 'https://via.placeholder.com/150' },
    { text: 'Let’s get started!', image: 'https://via.placeholder.com/150' },
  ];

  return (
    <>
      <Button onClick={openOnboarding}>Start Onboarding</Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={styles.modalContent}>
          <DialogTitle className={styles.slideText}>Welcome to MyChef</DialogTitle>
          <DialogDescription>Your journey to better cooking starts here. Swipe through to learn more.</DialogDescription>

          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            spaceBetween={30}
            slidesPerView={1}
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className={styles.slideContent}>
                  <img src={slide.image} alt={`Slide ${index + 1}`} className={styles.slideImage} />
                  <div className={styles.slideText}>{slide.text}</div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <Button className={styles.closeButton} onClick={closeOnboarding}>
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Onboarding;
