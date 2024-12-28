import Navbar from "@/components/global/Navbar"

type Props = { children: React.ReactNode }

const Layout = ({ children }: Props) => {
    return (
        <>
            <Navbar />
            <main className="flex items-center justify-center h-screen w-full">
                {children}
            </main>
        </>
    )
}

export default Layout