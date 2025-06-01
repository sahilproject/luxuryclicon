"use client"
import React from 'react'
import Hero from './Hero'
import Features from './Components/Features'
import Categories from './Categories'
import Postar from './Components/Postar'
import FeaturedProducts from './Components/FeaturedProducts'
import ComputerAccesories from './Components/ComputerAccesories'
import Banner from './Components/Banner'
import Arrival from './Components/Arrival'
import News from './Components/News'
import Suscribe from './Components/Suscribe'
import BestDeals from './bestdeals/page'


const page = () => {
  return (
    <>
    <Hero/>
    <BestDeals/>
    <Categories/>
    <FeaturedProducts/>
    <Features/>
    <Postar/>
    <ComputerAccesories/>
    <Banner/>
    <Arrival/>
    <News/>
    <Suscribe/>
    </>
  )
}

export default page
