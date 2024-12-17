import InfoBar from "@/components/infobar";
import SideBar from "@/components/sidebar"

type Props = { children: React.ReactNode }

const Layout = (props: Props) => {
    return (
        <div className="flex overflow-hidden h-screen">
            <SideBar />
            <div className="w-full ">
                <InfoBar />
                {props.children}
            </div>
        </div>
    )
}

export default Layout;