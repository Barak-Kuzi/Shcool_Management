import Image from "next/image";

const Navbar = () => {
    return (
        <div className="flex items-center justify-between p-4">
            <div className="hidden md:flex items-center gap-2 rounded-full ring-[1.5px] ring-gray-300 px-2">
                <Image src="/search.png" alt="logo" width={14} height={14}/>
                <input type="text" placeholder="Search..." className="w-[200px] p-2 outline-none bg-transparent"/>
            </div>

            <div className="flex items-center gap-6 w-full justify-end">
                <div className="flex justify-center items-center w-7 h-7 bg-white cursor-pointer rounded-full">
                    <Image src="/message.png" alt="message-icon" width={20} height={20}/>
                </div>
                <div className="flex justify-center items-center w-7 h-7 bg-white cursor-pointer rounded-full relative">
                    <Image src="/announcement.png" alt="message-icon" width={20} height={20}/>
                    <div
                        className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs">
                        1
                    </div>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs leading-3 font-medium">Barak Kuzi</span>
                    <span className="text-[10px] text-gray-500 text-right">Admin</span>
                </div>
                <Image src="/avatar.png" alt="avatar" width={36} height={36} className="rounded-full"/>
            </div>
        </div>
    );
}

export default Navbar;