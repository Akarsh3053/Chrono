import ProfileForm from "@/components/forms/profile-form"
import ProfilePicture from "./_components/profile-picture"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const Settings = async () => {
    const authUser = await currentUser();

    if (!authUser) redirect('/sign-in');

    const user = await db.user.findUnique({ where: { clerkId: authUser.id } })

    const updateUserInfo = async (name: string) => {
        'use server'

        const updateUser = await db.user.update({
            where: {
                clerkId: authUser.id,
            },
            data: {
                name,
            },
        })
        return updateUser
    }

    return (
        <div className="flex flex-col min-h-screen">
            <h1 className="sticky top-0 z-[10] flex items-center justify-between border-b bg-background/50 p-6 text-4xl backdrop-blur-lg">
                <span>Settings</span>
            </h1>

            <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="mb-8 md:mt-10 mt-5">
                    <h2 className="text-2xl font-bold">User Profile</h2>
                    <p className="text-base text-white/50">
                        Add or update your information
                    </p>
                </div>

                {/* Main Content Section */}
                <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
                    {/* Left Column - Profile Picture */}
                    <div className="space-y-4">
                        <div className="bg-card rounded-lg p-4">
                            <ProfilePicture
                                userImage={authUser.imageUrl as string}
                            />
                        </div>
                    </div>

                    {/* Right Column - Profile Form */}
                    <div className="bg-card rounded-lg p-6">
                        <ProfileForm user={user} onUpdate={updateUserInfo} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings