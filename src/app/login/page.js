'use client';

import React, { useEffect, useRef } from "react";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button, Input, Checkbox, Link, Form, Card, CardBody, addToast } from "@heroui/react";
import { gsap } from "gsap";
import gradientBg from '../../assets/images/default-gradient.webp';
import api from '../../axios/api';

export default function LoginPage() {
  const router = useRouter();
  // 弥散图像数据 
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
        // 登录成功添加提示
        addToast({
          title: "登录成功",
          description: "正在跳转到首页...",
          color: "success",
          timeout: 2000,
        });
        
        // 延迟跳转，确保状态被正确保存
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
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
    // 为每个弥散图像创建更明显的动画效果
    gradientRefs.current.forEach((ref, index) => {
      if (!ref) return;
      
      // 随机选择不同的动画效果
      const animationType = index % 3;
      const duration = 10 + Math.random() * 15; // 10-25秒
      const delay = Math.random() * 2; // 0-2秒延迟
      
      // 移动距离
      const moveX = 70 + Math.random() * 100; // 70-170px
      const moveY = 70 + Math.random() * 100; // 70-170px
      
      const easeTypes = [
        "sine.inOut", 
        "power1.inOut", 
        "circ.inOut"
      ];
      
      const easeType = easeTypes[index % easeTypes.length];
      
      switch (animationType) {
        case 0: // 随机移动
          gsap.to(ref, {
            duration: duration,
            x: (Math.random() > 0.5 ? moveX : -moveX),
            y: (Math.random() > 0.5 ? moveY : -moveY),
            repeat: -1,
            yoyo: true,
            ease: easeType,
            delay: delay
          });
          break;
        
        case 1: // 移动 + 透明度变化
          gsap.to(ref, {
            duration: duration * 0.7,
            x: (Math.random() > 0.5 ? moveX : -moveX) * 0.9,
            y: (Math.random() > 0.5 ? moveY : -moveY) * 0.9,
            opacity: index => Math.max(0.2, parseFloat(ref.style.opacity) * 0.6),
            repeat: -1,
            yoyo: true,
            ease: easeType,
            delay: delay
          });
          break;
        
        case 2: // 移动 + 缩放
          gsap.to(ref, {
            duration: duration * 0.8,
            x: (Math.random() > 0.5 ? moveX : -moveX) * 0.8,
            y: (Math.random() > 0.5 ? moveY : -moveY) * 0.8,
            scale: 1 + (Math.random() * 0.25), // 最多放大25%
            repeat: -1,
            yoyo: true,
            ease: easeType,
            delay: delay
          });
          break;
      }
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
