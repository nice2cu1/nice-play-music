'use client';

import React, { useEffect, useRef } from "react";
import Image from 'next/image';
import { Button, Input, Checkbox, Link, Form, Card, CardBody, addToast } from "@heroui/react";
import { gsap } from "gsap";
import gradientBg from '../../assets/images/default-gradient.webp';
import api from '../../axios/api';

export default function LoginPage() {
  // 弥散图像数据 - 保留原有背景效果
  const gradientItems = [
    { top: '-20%', left: '-15%', size: 900, rotate: -12, opacity: 0.8 },
    { top: '10%', left: '-18%', size: 800, rotate: 25, opacity: 0.6 },
    { top: '-25%', right: '-20%', size: 950, rotate: 15, opacity: 0.7 },
    { top: '15%', right: '-30%', size: 880, rotate: -20, opacity: 0.65 },
    { top: '30%', left: '20%', size: 1000, rotate: 30, opacity: 0.5 },
    { top: '25%', right: '5%', size: 920, rotate: -35, opacity: 0.55 },
    { bottom: '-30%', left: '0%', size: 950, rotate: 40, opacity: 0.7 },
    { bottom: '-25%', right: '-15%', size: 1050, rotate: -25, opacity: 0.65 },
    { top: '45%', left: '-35%', size: 1150, rotate: 18, opacity: 0.4 },
    { bottom: '15%', right: '25%', size: 1100, rotate: -8, opacity: 0.5 }
  ];
  const gradientRefs = useRef([]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const identifier = formData.get('identifier');
    const password = formData.get('password');

    try {
      const response = await api.user.login(identifier, password);
      if (response.code === 200) {
        // 插入cookie isLogin = 1
        document.cookie = "isLogin=1; path=/";
        // 跳转到首页
        window.location.href = "/";
      } else {
        console.error("登录失败", response);
        addToast({
          title: "登录失败",
          description: "请检查您的用户名和密码",
          color: "danger",
          timeout: 3000,
        });
      }
    } catch (error) {
      console.error("登录请求出错", error);
      addToast({
        title: "登录请求出错",
        description: "请稍后再试",
        color: "danger",
        timeout: 3000,
      });
    }
  };

  useEffect(() => {
    gradientRefs.current.forEach((ref, index) => {
      gsap.to(ref, {
        duration: 10,
        rotate: `+=${Math.random() * 360}`,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut"
      });
    });
  }, []);

  return (
    <div className="relative flex items-center justify-center w-full h-screen overflow-hidden bg-black">
      <div
        className="absolute"
        style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 1)',
          zIndex: -1
        }}
      ></div>

      {gradientItems.map((item, index) => (
        <div
          key={index}
          className="absolute z-0"
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
            bottom: item.bottom,
            userSelect: 'none'
          }}
        >
          <div
            className="relative"
            style={{
              width: `${item.size}px`,
              height: `${item.size}px`,
              transform: `rotate(${item.rotate}deg)`,
              opacity: item.opacity
            }}
            ref={el => gradientRefs.current[index] = el}
          >
            <Image
              src={gradientBg}
              alt="Gradient effect"
              width={item.size}
              height={item.size}
              style={{ objectFit: 'contain', width: 'auto', height: 'auto' }}
              priority
              draggable="false"
            />
          </div>
        </div>
      ))}
      {/* 内容区域 */}
      <div className="relative z-10 flex w-full h-full items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardBody className="flex flex-col gap-4 rounded-large px-8 pb-10 pt-6">
            <p className="pb-4 text-left text-2xl font-semibold">
              登录
              <span aria-label="emoji" className="ml-2" role="img">
                👋
              </span>
            </p>
            <Form className="flex flex-col gap-4" validationBehavior="native" onSubmit={handleSubmit}>
              <Input
                isRequired
                label="用户名 / 邮箱"
                labelPlacement="outside"
                name="identifier"
                placeholder="请输入用户名 / 邮箱"
                variant="bordered"
                className="text-base"
              />

              <Input
                isRequired
                label="密码"
                labelPlacement="outside"
                name="password"
                placeholder="请输入密码"
                variant="bordered"
                className="text-base"
              />

              <div className="flex w-full items-center justify-between px-1 py-2 text-sm">
                <Checkbox defaultSelected name="remember" size="sm">
                  记住我
                </Checkbox>
                <Link className="text-default-500" href="#" size="sm">
                  忘记密码?
                </Link>
              </div>
              <Button className="w-full text-base" color="primary" type="submit">
                登录
              </Button>
            </Form>
            <p className="text-center text-sm">
              <Link href="#" size="sm">
                创建账户
              </Link>
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
