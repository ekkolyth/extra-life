'use client'

import Image from 'next/image'
import { createContext, type ReactNode, useContext, useState } from 'react'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { cn } from '@/lib/utils'

interface Photo {
    alt: string
    src: string
}

const OpenPhotoContext = createContext<((src: string) => void) | null>(null)

function PhotoLightbox({
    photos,
    children,
}: {
    photos: readonly Photo[]
    children: ReactNode
}) {
    const [index, setIndex] = useState(-1)

    return (
        <OpenPhotoContext.Provider
            value={(src) =>
                setIndex(photos.findIndex((photo) => photo.src === src))
            }
        >
            {children}
            <Lightbox
                close={() => setIndex(-1)}
                index={index}
                open={index >= 0}
                slides={photos}
            />
        </OpenPhotoContext.Provider>
    )
}

function LightboxPhoto({
    src,
    alt,
    sizes,
    className,
}: Photo & { sizes: string; className?: string }) {
    const openPhoto = useContext(OpenPhotoContext)
    if (!openPhoto) {
        throw new Error('LightboxPhoto must be rendered inside PhotoLightbox')
    }

    return (
        <button
            className={cn(
                'relative block w-full cursor-zoom-in overflow-hidden rounded-lg',
                className
            )}
            onClick={() => openPhoto(src)}
            type='button'
        >
            <Image
                alt={alt}
                className='object-cover'
                fill
                sizes={sizes}
                src={src}
            />
        </button>
    )
}

export type { Photo }
export { LightboxPhoto, PhotoLightbox }
