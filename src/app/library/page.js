import useUserStore from "@/store/useUserStore";
import { Button, Card, CardBody, CardFooter, CardHeader, Image } from "@heroui/react";

import playIcon from "@/assets/icons/lights/ci-play-circle.svg";

export default function LibraryPage() {

    const lyric = "宇宙的有趣我才不在意\n我在意的是你牽我的手而亂跳的心"

    return (
        <div className="py-6 w-full ml-8 pr-8 h-full overflow-auto">
            <div className="w-full mb-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-3xl text-common">{useUserStore.getState().user?.nickname}的音乐库</h2>
                </div>
                <Card className="bg-[#e6ecfe] p-4 rounded-2xl shadow-none h-[260px] w-[530px]">
                    <CardHeader className="whitespace-pre-line banner-lyric-text text-xl font-bold">
                        {lyric}
                    </CardHeader>
                    <CardBody>

                    </CardBody>
                    <CardFooter>
                        <div className="flex items-center justify-between w-full">
                            <div>
                                <p className="banner-lyric-text text-2xl font-bold">我喜欢的音乐</p>
                                <p className="banner-lyric-text text-base font-bold">40 首歌</p>
                            </div>
                            <Button
                                radius="full"
                                isIconOnly
                                color="primary"
                                size="lg"
                            >
                                <Image
                                    height={200}
                                    width={200}
                                    src={playIcon.src}
                                />
                            </Button>

                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}