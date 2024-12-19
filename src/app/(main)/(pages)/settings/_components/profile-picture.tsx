'use client'

import Image from "next/image"


type Props = {
    userImage: string
}

const ProfilePicture = ({ userImage }: Props) => {

    return (
        <div className="flex flex-col">
            <p className="text-lg text-white"> Profile Picture</p>
            <div className="flex h-[30vh] flex-col items-center justify-center">
                <div className="relative h-full w-2/12">
                    <Image
                        src={userImage}
                        alt="User_Image"
                        fill
                    />
                </div>
            </div>
        </div>
    )
}

export default ProfilePicture