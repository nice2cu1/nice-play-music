'use client';

import React from "react";
import { useRouter } from 'next/navigation';
import { Button, Input, Checkbox, Link, Form, Card, CardBody, addToast } from "@heroui/react";
import api from '../../axios/api';
import GradientBackground from '../../components/background/GradientBackground';

export default function LoginPage() {
  const router = useRouter();

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
          router.push("/");
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

  return (
    <div className="relative flex items-center justify-center w-full h-screen overflow-hidden bg-black">
      <GradientBackground />
      
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
