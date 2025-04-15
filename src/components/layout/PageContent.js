import { Card, CardHeader, CardBody, Input, Image, CardFooter, Button, Slider } from "@heroui/react";
import { useContext, useEffect, useRef, useState } from 'react';
import { gsap } from "gsap";
import { MenuContext } from '../context/MenuContext';
import TiltedCard from "../TiltedCard/TiltedCard";
import usePlayerStore from "../../store/usePlayerStore";
import { formatDuration } from "@/utils/formatters";
import { playerInstance } from '../../utils/MusicPlayerController';

import playIcon from "@/assets/icons/lights/ci-play-circle.svg";
import play from "@/assets/icons/lights/play.svg";
import pasue from "@/assets/icons/lights/pause.svg";
import skip_back from "@/assets/icons/lights/skip-back.svg";
import skip_forward from "@/assets/icons/lights/skip-forward.svg";


const PageContent = () => {
  const { getCurrentTitle, getCurrentPage, isMiniPlayerActive, activeMenu, resetCustomPage } = useContext(MenuContext);
  const cardRef = useRef(null);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const cardBodyRef = useRef(null);
  const headerRef = useRef(null);
  const miniPlayer = useRef(null);
  const isInitialRender = useRef(true);
  const prevPlayerActive = useRef(isMiniPlayerActive);
  const prevActiveMenu = useRef(activeMenu);

  // 为miniPlayer内部元素添加ref
  const nextPlaylistTitleRef = useRef(null);
  const nextSongsContainerRef = useRef(null);
  const currentPlayingInfoRef = useRef(null);
  const controlButtonsRef = useRef(null);
  const tiltedCardRef = useRef(null);
  const prevPlaylistRef = useRef([]);
  const prevCurrentPlayingRef = useRef(null);

  // 添加搜索状态
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  // 从播放器状态store中获取状态
  const {
    currentPlaying,
    playlist,
    isPlaying,
    initializeState,
    pauseMusic,
    resumeMusic,
    playNext,
    playPrevious,
    playSong,
    getNextTwoSongs
  } = usePlayerStore();

  const [sliderValue, setSliderValue] = useState(usePlayerStore.getState().currentTime || 0);
  const [isDragging, setIsDragging] = useState(false);

  // 处理搜索输入变化
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // 这里可以添加搜索逻辑或者防抖处理
  };

  // 处理搜索提交
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // 执行搜索操作
    console.log("搜索内容:", searchQuery);
  };

  // 初始化播放器状态
  useEffect(() => {
    // 初始加载状态
    initializeState();
  }, []);

  // 播放控制函数
  const handlePlayPause = () => {
    if (isPlaying) {
      pauseMusic();

      // 添加暂停按钮动画
      gsap.to(".play-pause-btn", {
        scale: 0.8,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    } else {
      resumeMusic();

      // 添加播放按钮动画
      gsap.to(".play-pause-btn", {
        scale: 0.8,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    }
  };

  const handlePrevious = () => {
    playPrevious();

    // 添加上一首按钮动画
    gsap.to(".prev-btn", {
      scale: 0.8,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });
  };

  const handleNext = () => {
    playNext();

    // 添加下一首按钮动画
    gsap.to(".next-btn", {
      scale: 0.8,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });
  };

  const handlePlaySong = (musicId, playlistId) => {
    playSong(musicId, playlistId);

    // 添加点击播放歌曲的动画
    gsap.to(`[data-music-id="${musicId}"]`, {
      scale: 0.9,
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });
  };

  // 为接下来播放的歌曲列表添加动画效果
  useEffect(() => {
    // 确保有playlist数据且不是初始渲染
    if (playlist.length === 0 || !isMiniPlayerActive) return;

    const nextSongs = getNextTwoSongs();
    const nextSongsCards = document.querySelectorAll('.next-song-card');

    if (nextSongsCards.length === 0) return;

    // 检查播放列表是否有变化
    const currentPlaylistIds = nextSongs.map(song => song.musicId).join(',');
    const prevPlaylistIds = prevPlaylistRef.current.map(song => song.musicId).join(',');

    if (currentPlaylistIds !== prevPlaylistIds) {
      // 播放列表变化了，添加动画
      gsap.fromTo(nextSongsCards,
        { opacity: 0, y: 20, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          stagger: 0.15,
          duration: 0.5,
          ease: "back.out(1.7)",
          clearProps: "all"
        }
      );

      // 更新前一个播放列表引用
      prevPlaylistRef.current = nextSongs;
    }
  }, [playlist, currentPlaying, isMiniPlayerActive]);

  // 为当前播放歌曲信息添加动画效果
  useEffect(() => {
    if (!currentPlaying || !isMiniPlayerActive) return;

    // 检查当前播放歌曲是否变化
    if (prevCurrentPlayingRef.current?.musicId !== currentPlaying.musicId) {
      // 歌曲信息容器
      const songInfoContainer = document.querySelector('.current-song-info');
      if (songInfoContainer) {
        gsap.fromTo(songInfoContainer,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );
      }

      // 唱片动画
      const tiltedCardContainer = document.querySelector('.tilted-card-container');
      if (tiltedCardContainer) {
        gsap.fromTo(tiltedCardContainer,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: "elastic.out(1, 0.5)"
          }
        );
      }

      // 更新前一个当前播放歌曲引用
      prevCurrentPlayingRef.current = currentPlaying;
    }
  }, [currentPlaying, isMiniPlayerActive]);

  // 播放状态变化动画
  useEffect(() => {
    if (!isMiniPlayerActive) return;

    const playPauseBtn = document.querySelector('.play-pause-btn');
    if (playPauseBtn) {
      gsap.to(playPauseBtn, {
        scale: isPlaying ? 1.1 : 1,
        duration: 0.3,
        ease: "back.out(2)",
      });
    }

    // 如果在播放，添加旋转动画到唱片
    const tiltedCardContainer = document.querySelector('.tilted-card-container');
    if (tiltedCardContainer) {
      if (isPlaying) {
        // 开始播放时添加微小的旋转效果
        gsap.to(tiltedCardContainer, {
          rotation: 5,
          duration: 0.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: 1
        });
      } else {
        // 暂停时的效果
        gsap.to(tiltedCardContainer, {
          rotation: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    }
  }, [isPlaying, isMiniPlayerActive]);

  // 当miniPlayer激活时的初始动画
  useEffect(() => {
    if (!isMiniPlayerActive || !prevPlayerActive.current) return;

    const titleElement = document.querySelector('.mini-player-title');
    const nextSongsContainer = document.querySelector('.next-songs-container');
    const currentPlayingContainer = document.querySelector('.current-playing-container');

    const tl = gsap.timeline({ delay: 0.3 });

    if (titleElement) {
      tl.fromTo(titleElement,
        { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
      );
    }

    if (nextSongsContainer) {
      tl.fromTo(nextSongsContainer,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.3"
      );
    }

    if (currentPlayingContainer) {
      tl.fromTo(currentPlayingContainer,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.3"
      );
    }
  }, [isMiniPlayerActive]);

  // 使用 GSAP 实现动画效果
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      prevPlayerActive.current = isMiniPlayerActive;
      prevActiveMenu.current = activeMenu;
      return;
    }

    if (!cardRef.current || !contentRef.current || !cardBodyRef.current || !miniPlayer.current) return;

    const card = cardRef.current;
    const content = contentRef.current;
    const cardBody = cardBodyRef.current;
    const header = headerRef.current;
    const miniPlayerCard = miniPlayer.current;

    // 始终隐藏横向滚动条

    // 取消所有正在进行的动画
    // gsap.killTweensOf([card, content, header, miniPlayerCard]);

    const originalOverflow = cardBody.style.overflowY;
    cardBody.style.overflowY = "hidden";

    // 从普通状态到播放器状态 (100% -> 50%)
    if (isMiniPlayerActive && !prevPlayerActive.current) {
      // console.log("开始播放器模式动画");

      // 设置变换原点为右侧
      gsap.set(card, { transformOrigin: "right center", width: "100%" });
      gsap.set(miniPlayerCard, { transformOrigin: "right center", width: "0%", opacity: 0, scale: 0.8 }); // 添加初始缩放

      // 使用时间轴实现连贯动画
      const tl = gsap.timeline({
        onComplete: () => {
          // console.log("播放器动画完成");
        }
      });

      // 单阶段动画：主卡片到50%，迷你播放器到30%
      tl.to([card, miniPlayerCard], {
        width: (i) => (i === 0 ? "100%" : "50%"),
        opacity: (i) => (i === 0 ? 1 : 1),
        scale: (i) => (i === 0 ? 1 : 1),
        duration: 1.25,
        ease: "Power3.easeInOut",
        clearProps: "transform"
      });

      // 标题和内容动画同步
      tl.to([header, content], {
        scale: 0.97,
        x: -5,
        opacity: 0.95,
        duration: 0.55,
        ease: "power3.out"
      }, 0);
    }
    // 从播放器状态到普通状态 (50% -> 100%)
    else if (!isMiniPlayerActive && prevPlayerActive.current) {
      // 设置变换原点为右侧
      gsap.set(card, { transformOrigin: "right center", width: "100%" });
      gsap.set(miniPlayerCard, { transformOrigin: "right center", width: "50%", opacity: 1, scale: 1 }); // 添加初始缩放

      // 使用时间轴实现连贯动画
      const tl = gsap.timeline({
        onComplete: () => {
          // console.log("退出播放器模式动画完成");
        }
      });

      // 单阶段动画：主卡片到100%，迷你播放器到0%
      tl.to([card, miniPlayerCard], {
        width: (i) => (i === 0 ? "100%" : "0%"),
        opacity: (i) => (i === 0 ? 1 : 0),
        scale: (i) => (i === 0 ? 1 : 0.8),
        duration: 1.25,
        ease: "Power3.easeInOut",
        clearProps: "transform"
      });

      // 标题和内容动画同步
      tl.to([header, content], {
        scale: 1,
        x: 0,
        opacity: 1,
        duration: 0.65,
        ease: "power3.out"
      }, 0);
    }
    // 页面切换动画
    else if (activeMenu !== prevActiveMenu.current) {

      // 使用时间轴管理页面切换动画
      const tl = gsap.timeline({
        onComplete: () => {
          cardBody.style.overflowY = originalOverflow;
        }
      });

      // 旧内容淡出 - 稍微向上移动并淡出
      tl.to(content, {
        opacity: 0,
        y: -30,
        duration: 0.25,
        ease: "power2.inOut"
      }, 0);

      // 标题动画 - 与内容同步淡出
      tl.to(header, {
        opacity: 0,
        y: -15,
        duration: 0.25,
        ease: "power2.inOut"
      }, 0);

      // 等待旧内容完全淡出
      tl.add("contentChange", "+=0.05");

      // 新标题从底部淡入
      tl.fromTo(header,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          ease: "power2.out"
        },
        "contentChange"
      );

      // 新内容从底部淡入，稍微延迟于标题
      tl.fromTo(content,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out"
        },
        "contentChange+=0.05"
      );
    }

    // 更新前一个状态
    prevPlayerActive.current = isMiniPlayerActive;
    prevActiveMenu.current = activeMenu;

  }, [isMiniPlayerActive, activeMenu]);

  // 判断是否有播放数据
  const hasPlaybackData = currentPlaying && playlist && playlist.length > 0;

  return (
    <div className="w-full h-full flex justify-end overflow-hidden"
      style={{
        paddingTop: "16px",
        paddingRight: "16px",
        paddingBottom: "16px",
        paddingLeft: "0",
        height: "100%",
        display: "flex",
      }}>
      <Card
        ref={miniPlayer}
        className="w-[100px] h-full bg-transparent mini-playlist-text shadow-none rounded-none overflow-hidden flex justify-center items-center"
        style={{
          width: isMiniPlayerActive ? "50%" : "0%",
        }}
      >
        {hasPlaybackData ? (
          <div>
            <h1 className="text-4xl mt-1 mini-playlist-text font-bold whitespace-nowrap mini-player-title" ref={nextPlaylistTitleRef}>
              接下来播放
            </h1>
            <div className="mini-playlist-text font-bold whitespace-nowrap mt-10">
              <div className="w-full justify-center flex flex-col items-center">
                <div className="flex flex-row items-center w-[400px] justify-between select-none next-songs-container" ref={nextSongsContainerRef}>
                  {/* 显示当前播放歌曲之后的两首歌曲 */}
                  {getNextTwoSongs().map((song, index) => (
                    <Card
                      key={song.musicId || `next-${index}`}
                      isFooterBlurred
                      className="border-none bg-transparent next-song-card"
                      radius="lg"
                      data-music-id={song.musicId}
                    >
                      <Image
                        isZoomed
                        isBlurred
                        draggable="false"
                        className="object-cover"
                        height={130}
                        width={190}
                        src={song.imageUrl}
                      />
                      <CardFooter
                        className="before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                        <div className="flex-1 flex flex-col items-start">
                          <div className="relative text-[12px] font-semibold leading-none">
                            <p className="absolute inset-0 text-black drop-shadow-lg z-0 truncate max-w-[100px]">
                              {song.title}
                            </p>
                            <p className="relative text-white z-10 truncate max-w-[100px]">
                              {song.title}
                            </p>
                          </div>
                          <div className="relative text-[12px] leading-none mt-1 truncate max-w-[100px]">
                            <p className="absolute inset-0 text-black drop-shadow-lg z-0 truncate max-w-[100px]">
                              {song.artist}
                            </p>
                            <p className="relative text-white/90 z-10">
                              {song.artist}
                            </p>
                          </div>

                        </div>
                        <Button
                          radius="full"
                          isIconOnly
                          color="transparent"
                          size="sm"
                          aria-label="播放"
                          data-music-id={song.musicId}
                          className="play-button"
                          onPress={() => handlePlaySong(song.musicId, song.playlistId || currentPlaying?.playlistId)}
                        >
                          <Image
                            height={50}
                            width={50}
                            src={playIcon.src}
                            alt="播放"
                          />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                <div className="w-[300px] h-full bg-black/30 select-none mt-10 flex flex-col justify-center items-center rounded-[15px] p-5 current-playing-container" ref={currentPlayingInfoRef}>
                  {/* 在TiltedCard中展示当前播放的歌曲 */}
                  <div className="tilted-card-container" ref={tiltedCardRef}>
                    <TiltedCard
                      className="absolute top-1/2 -translate-y-1/2"
                      imageSrc={currentPlaying?.imageUrl || "http://8.217.105.136:5244/d/NicePlayMusic/library/mylike/1.jpg"}
                      containerHeight="200px"
                      containerWidth="200px"
                      imageHeight="200px"
                      imageWidth="200px"
                      rotateAmplitude={12}
                      scaleOnHover={1.1}
                      showMobileWarning={false}
                      showTooltip={false}
                    />
                  </div>
                  <div className="music-controller mt-10 flex flex-col justify-center items-center" ref={controlButtonsRef}>
                    <div className="flex flex-col items-center justify-center mb-2 current-song-info">
                      <h1 className="text-xl text-white/80 max-w-[200px] text-center font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                        {currentPlaying?.title || "还没有播放歌曲哦~"}
                      </h1>
                      <p className="text-[12px] text-white/80">{currentPlaying?.artist || "还没有播放歌曲哦~"}</p>
                    </div>
                    <div className="flex flex-row items-start  justify-between w-[200px]">
                      <Button
                        radius="full"
                        isIconOnly
                        color="transparent"
                        size="md"
                        className="prev-btn"
                        onPress={handlePrevious}
                      >
                        <Image
                          height={30}
                          width={30}
                          src={skip_back.src}
                        />
                      </Button>
                      <Button
                        radius="full"
                        isIconOnly
                        color="transparent"
                        size="md"

                        className="play-pause-btn"
                        onPress={handlePlayPause}
                      >
                        <Image
                          height={30}
                          width={30}
                          src={isPlaying ? pasue.src : play.src}
                          alt={isPlaying ? "暂停" : "播放"}
                        />
                      </Button>
                      <Button
                        radius="full"
                        isIconOnly
                        color="transparent"
                        size="md"
                        className="next-btn"
                        onPress={handleNext}
                      >
                        <Image
                          height={30}
                          width={30}
                          src={skip_forward.src}
                        />
                      </Button>
                    </div>
                    <div className="w-full flex flex-col items-center mt-4">
                      <Slider
                        aria-label="进度滑块"
                        className="max-w-[200px] w-full"
                        minValue={0}
                        maxValue={usePlayerStore.getState().duration}
                        showTooltip={true}
                        tooltipProps={{
                          content: formatDuration(Math.floor(isDragging ? sliderValue : usePlayerStore.getState().currentTime || 0)),
                        }}
                        value={isDragging ? sliderValue : usePlayerStore.getState().currentTime || 0}
                        onChange={(value) => {
                          setSliderValue(value);
                          setIsDragging(true);
                        }}
                        onChangeEnd={(value) => {
                          setIsDragging(false);
                          usePlayerStore.getState().setCurrentTime(value);
                          playerInstance.seekTo(value);
                        }}
                      />
                      <div className="flex justify-between w-[90%] text-xs text-white mt-1">
                        <span>{formatDuration(usePlayerStore.getState().currentTime)}</span>
                        <span>{formatDuration(usePlayerStore.getState().duration)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full min-w-full">
            <p className="text-gray-500 text-lg">还没有播放歌曲哦~</p>
            <p className="text-gray-400 text-sm mt-2">选择一首歌曲开始播放吧！</p>
          </div>
        )}
      </Card>
      <div
        ref={containerRef}
        className="w-full h-full flex justify-end overflow-hidden"
      >
        <Card
          ref={cardRef}
          className="bg-[#FAFAFA] overflow-hidden shadow-sm h-full"
          style={{
            width: isMiniPlayerActive ? "100%" : "100%",
            transformOrigin: "right center",
            borderRadius: "12px",
          }}
        >
          <CardHeader
            ref={headerRef}
            className="overflow-hidden mt-2 flex flex-row items-center border-none"
            style={{ background: 'transparent' }}
          >
            {/* 返回按钮 - 仅在自定义页面(activeMenu === 'custom')显示 */}
            {activeMenu === 'custom' && (
              <Button
                isIconOnly
                variant="light"
                aria-label="返回"
                className="mr-2"
                onPress={() => resetCustomPage && resetCustomPage()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </Button>
            )}

            <h1 className="text-4xl ml-8 text-common" style={{ fontWeight: 'bold' }}>
              {getCurrentTitle()}
            </h1>

            {/* 搜索框部分*/}
            <form
              onSubmit={handleSearchSubmit}
              className="relative ml-auto mr-4 max-w-[220px]"
            >
              <Input
                ref={searchInputRef}
                type="search"
                variant="bordered"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="搜索音乐、歌手或专辑..."
                className="bg-gray-100 dark:bg-gray-800 rounded-full border-0 w-full"
                isClearable
                size="lg"
                startContent={
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" /><path fill="#000" d="M12 4a8 8 0 1 0 0 16a8 8 0 0 0 0-16M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12" /></g></svg>
                }
                classNames={{
                  inputWrapper: "h-9 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700",
                  input: "text-sm"
                }}
                onClear={() => setSearchQuery('')}
              />
            </form>
          </CardHeader>

          <CardBody
            ref={cardBodyRef}
            className="overflow-y-auto overflow-x-hidden"
            style={{
              WebkitOverflowScrolling: "touch",
              overflowX: "hidden",
              maxWidth: "100%"
            }}
          >
            <div
              ref={contentRef}
              className="no-scrollbar"
              style={{
                width: "100%",
                height: "100%",
                transformOrigin: "center top",
                overflowX: "hidden",
                maxWidth: "100%" // 限制最大宽度
              }}
            >
              {getCurrentPage()}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default PageContent;
