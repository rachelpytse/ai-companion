"use client"

import { useEffect, useState } from "react";
import {CldUploadButton} from "next-cloudinary"
import Image from "next/image";

interface ImageUploadProps {
    value: string;
    onChange: (src: string) => void;
    disabled?: boolean;
}

export const ImageUpload = ({
    value,
    onChange,
    disabled
}: ImageUploadProps) => {
    //cloudinary code rendering can cause error between server side rendering and client side rendering
    //so check if we are mounted
    //the useEffect that switch isMounted to true is going to run once we finish the server side rendering and get to client side rendering
    //if not mounted, in server side rendering we are going to return null meaning that none of the code below is going to cause hydration error
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if(!isMounted) {
        return null
    }

    return(
        <div className="space-y-4 w-full flex flex-col justify-center items-center">
            <CldUploadButton
                onSuccess={(result: any) => onChange(result.info.secure_url)}
                options={{
                    maxFiles:1
                }}
                uploadPreset="s9z8csi2"
            >
                <div className="
                    p-4
                    border-4
                    border-dashed
                    border-primary/10
                    rounded-lg
                    hover:opacity-75
                    transition
                    flex
                    flex-col
                    sapce-y-2
                    items-center
                    justify-center
                ">
                    <div className="relative h-40 w-40">
                        <Image
                            fill
                            alt="Uploaded"
                            src={value || "/placeholder.svg"}
                            className="rounded-lg object-cover"
                        />
                    </div>
                </div>
            </CldUploadButton>
        </div>
    )
}