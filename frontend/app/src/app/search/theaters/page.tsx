'use client'

import { Footer, NavBar } from '@/app/others/components/Home'
import TheatersPage from '@/app/others/components/Search/Theaters/TheatersPage'
import Orb from '@/app/others/Utils/ReactBits/Orb'
import React from 'react'

const page = () => {
    return (
        <div>
            <div className="relative min-h-screen bg-black overflow-hidden">
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <Orb
                        hoverIntensity={0.5}
                        rotateOnHover={true}
                        hue={0}
                        forceHoverState={false}
                    />
                </div>
                <div className="relative z-10">
                    <NavBar />
                    <TheatersPage />
                    <Footer />
                </div>
            </div>
        </div>
    )
}

export default page



