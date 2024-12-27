'use client'

import Image from "next/image"

type Props = {
    userImage: string
}

const ProfilePicture = ({ userImage }: Props) => {
    return (
        <div className="flex flex-col gap-4">
            <p className="text-lg text-white">Profile Picture</p>
            <div className="relative aspect-square w-48 overflow-hidden rounded-lg">
                <Image
                    src={userImage}
                    alt="User_Image"
                    fill
                    className="object-cover"
                />
            </div>
        </div>
    )
}

export default ProfilePicture